var app = getApp();
import util from '../../utils/util.js';
// var sliderWidth = 66; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    // tab切换  
    tabs: ["有效商品", "已下架"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    goodsData: [], //存储所有的列表数据
    goodClassData: [], //存储分类
    checkAllClass: true, //默认选中全部
    linshiPidObj: "", //临时记录用户选择的是哪个一级分类的数据
    linshiCidObj: "", //临时记录用户选择的是哪个二级分类的数据
    resultPidObj: "", //最终用户选择的是哪个一级分类的数据
    resultCidObj: "", //最终用户选择的是哪个二级分类的数据
    is_checked: false, //记录用户是否有过选择
    showClass: false,
    isScroll: true,
    pageNum: 1,  //请求第几页的内容
    pageSize: 15, //每一页要请求的数据长度
    loadMore: true, //默认显示玩命加载中
    notMore: false, //默认隐藏没有更多数据
    total: "",  //存储当前共有多少条数据可供请求,
    // 判断左滑还是右滑的数据
    startX: "",
    startY: "",
    endX: "",
    endY: "",
    startTime: "",
    endTime: "",
    touchStartId: "",// 记录开始滑动的模块id；
    animationData: {}, //存储自动的那部分动画
    animationDataDefault: {}, //存储默认的那部分动画,
    isShow: true,
    tabWidth: 0,
  },
  // 动画
  myAnimation: function (dir) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    })
    this.animation = animation
    if (dir == "left") {
      animation.left("-300rpx").step();
    } else if (dir == "right") {
      animation.left("0rpx").step();
    }

    this.setData({
      animationData: animation.export()
    })

  },
  onReady: function () {

  },
  onLoad: function () { 
    var that = this;
   


    // 自动加载右滑的动画,为了让用户排斥掉其他的列，不让其同时有左滑的效果
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    })
    this.animation = animation
    animation.left("0rpx").step();
    this.setData({
      animationDataDefault: animation.export()
    })
    if (util.authFind('productinfo_getPlevel')) { //检验权限
      this.goodsClass();
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true,
      
      })
    }
  },
  // onTabItemTap: function () {
  //   if (!app.loginInfoData.staff_id) {
  //     wx.showModal({
  //       title: '温馨提示',
  //       content: '您还没店铺，请先去创建店铺',
  //       showCancel: false,
  //       confirmText: '创建店铺',
  //       mask: true,
  //       success: function (res) {
  //         if (res.confirm) {
  //           util.navTo({
  //             url: '../createShop/createShop',
  //           })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },
  // 切换tab栏
  tabClick: function (e) {
    // console.log("切换")
    this.setData({
      notMore: false, //切换时隐藏没有更多内容
      touchStartId: "", //防止滑动动画触发后切换标签-再次切换标签回到滑动过的页签中时动画的结果还存在，清空需要做动画的目标id
      goodsData: [], //每次切换tab都要清空原有的数据
      pageNum: 1,//请求的页面总要重置为1
      total: "", //每次都重置可请求数量为空
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (util.authFind('productinfo_index')) { //检验权限
      this.goodsListData();
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  //  
  toGoodsAdd: function () {
    if (util.authFind('productinfo_add')) { //检验权限
      util.navTo({
        url: '../goodsAdd/goodsAdd'
      });
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  // 跳转至编辑商品详情页面
  toGoodsEdit: function (e) {
    if (util.authFind('productinfo_update')) { //检验权限
      var resultObjToStr; //用来存储需要转到下一个页面的数据
      if (e.currentTarget.dataset.id == "addIn") {
        resultObjToStr = "addIn"
      } else {
        var resultObj = this.data.goodsData.find(function (item) {
          return item.id == e.currentTarget.dataset.id
        });
        resultObjToStr = JSON.stringify(resultObj);
      }
      util.navTo({
        url: '../goodsEdit/goodsEdit?item=' + resultObjToStr  //把整个对象带过去
      });
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  // 请求商品分类数据
  goodsClass: function () {
    var data = {
      level: 0,
      type: 0,
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.productinfoPlevelUrl, data).then(res => {
      if (res.errorNo == '0') {
   
        _this.setData({
          goodClassData: res.data
        });
      }
    })
  },
  // 请求数据
  goodsListData: function () {
    var data = {};
    //如果选中的是全部分类，数据的pid和cid都传值为“”
    if (this.data.resultPidObj == "" && this.data.resultCidObj == "") {
      // console.log("选中的是全部分类");
      data.pid = "";
      data.cid = "";
    }
    //如果resultPidObj！=“”，resultCidObj==“”，pid传resultPidObj的id,cid传“”，
    if (this.data.resultPidObj != "" && this.data.resultCidObj == "") {
      console.log("选中的是一级分类");
      data.pid = this.data.resultPidObj.id;
      data.cid = "";
    }
    // 如果resultPidObj和resultCidObj和都有，则分别传resultPidObj和resultCidObj的id
    if (this.data.resultPidObj != "" && this.data.resultCidObj != "") {
      console.log("选中了一级分类和二级分类");
      data.pid = this.data.resultPidObj.id;
      data.cid = this.data.resultCidObj.id;
    }
    data.page_size = this.data.pageSize;  //每一页的请求数量
    data.is_down = this.data.activeIndex;  //请求的是有效商品还是已下架商品
    // 如果total=“”说明页面刚加载或者刚切换tab栏或者刚切换分类，还没有请求过数据，那么每次都请求第一页的数据
    if (this.data.total == "") {
      data.page = 1; //第1页
    }
    //  还有数据可请求的情况,可请求数量大于现有数据
    if (this.data.total > this.data.goodsData.length) {
      this.setData({
        pageNum: this.data.pageNum + 1    //下一次要请求的是下一页
      });
      data.page = this.data.pageNum;
    }
    // 所有数据都请求完了的情况,
    if (this.data.total != "" && this.data.goodsData.length == this.data.total) {
      this.setData({
        loadMore: false, //隐藏玩命加载中
        notMore: true, //显示没有更多数据
      });
      return // 不往下走
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.productinfoListUrl, data).then(res => {
      // console.log(res.data)
      if (res.errorNo == '0') {
        console.log(res.data)
        // 如果请求到的数据长度是0
        if (res.data.length == 0) {
          _this.setData({
            loadMore: false, //隐藏玩命加载中
            notMore: true, //显示没有更多数据
            total: res.total, //更新总数据条数
          })
        } else {
          _this.setData({
            goodsData: this.data.goodsData.concat(res.data),
            total: res.total, //更新总数据条数
          });
        }
        // 如果此次请求完成后发现没有数据可以请求了
        if (_this.data.total == _this.data.goodsData.length) {
          _this.setData({
            loadMore: false, //隐藏玩命加载中
            notMore: true, //显示没有更多数据
          })
        }
      }
    });
  },
  // 用户选中了某一个分类
  selClass: function (e) {
    this.setData({
      selLinShi: e.currentTarget.dataset.item.id
    })
  },
  // 判断是否显示全部分类的内容
  changeClass: function () {
    if (this.data.showClass) {
      this.setData({
        showClass: false,
        isScroll: true
      })
    } else {
      this.setData({
        showClass: true,
        isScroll: false
      })
    }

    // 不管显示还是隐藏，都让linshiPidObj=resultPidObj，linshiCidObj=resultCidObj,页面显示总等于上一次确认的结果
    if (this.data.resultPidObj == "" && this.data.resultCidObj == "") {
      this.setData({
        linshiPidObj: "",
        linshiCidObj: "",
        checkAllClass: true
      })
    } else {
      this.setData({
        linshiPidObj: this.data.resultPidObj,
        linshiCidObj: this.data.resultCidObj,
        checkAllClass: false
      })
    }
  },

  // 上拉触发的事件
  upper: function (e) {

  },
  // 下拉请求拼接数据
  lower: function (e) {
    this.setData({
      loadMore: true     //显示玩命加载中
    })
    this.goodsListData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面进入前台都要重置
    var _this=this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          activeIndex: 0,
          sliderLeft: (res.windowWidth * 0.6 / 2 - res.windowWidth * 0.6 / 2) / 2,
          sliderOffset: res.windowWidth * 0.6 / 2 * 0,
          tabWidth: res.windowWidth * 0.6 / 2,
        });
      }
    });
    this.setData({
      loadMore: true, //显示玩命加载中
      showClass: false, //隐藏全部分类
      touchStartId: "", //防止滑动动画触发后切换标签-再次切换标签回到滑动过的页签中时动画的结果还存在，清空需要做动画的目标id
      goodsData: [], //每次切换tab都要清空原有的数据
      pageNum: 1,//请求的页面总要重置为1
      total: "", //每次都重置可请求数量为空
    });
    this.goodsListData();
  },
  // 手指碰触屏幕
  touchStart: function (e) {
    // 记录用户滑动模块的id;
    var touchStartId = e.currentTarget.dataset.id;
    // 判断手指个数
    if (e.touches.length > 1) {
      return;
    }
    // 记录手指按下的坐标
    var startX = e.touches[0].clientX;
    var startY = e.touches[0].clientY;
    // 手指按下时间  毫秒
    var startTime = Date.now();
    this.setData({
      startX: startX,
      startY: startY,
      startTime: startTime,
      touchStartId: touchStartId
    });
  },

  // 手指移动
  touchMove: function (e) {
    // console.log("touchMove")
  },
  touchhEnd: function (e) {
    // 判断改变手指的个数
    if (e.changedTouches.length > 1) {
      return;
    }
    // 记录手指离开的坐标
    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    // 手指松开时间  毫秒
    var endTime = Date.now();
    this.setData({
      endX: endX,
      endY: endY,
      endTime: endTime,
    });
    // // 记录滑动方向
    var direction;
    // 判断移动的距离 判断滑动的方向 
    if (Math.abs(this.data.endX - this.data.startX) > 30) {
      // 判断方向  大于0 右 小于 左
      direction = this.data.endX > this.data.startX ? "right" : "left";
    } else if (Math.abs(this.data.endY - this.data.startY) > 30) {
      // 判断方向  大 下滑 小 上滑动
      direction = this.data.endY > this.data.startY ? "down" : "up";
    } else {
      // 水平和垂直都没有发生位移 返回
      return;
    }
    // 判断时间
    if (this.data.endTime - this.data.startTime > 800) {
      return;
    }
    if (direction == "left") {
      // 如果左滑调用左滑函数
      this.myAnimation("left");
    }
    if (direction == "right") {
      // 如果左滑调用左滑函数
      this.myAnimation("right");
    }
  },
  isDownFn: function (e) {
    if (util.authFind('productinfo_setDown')) { //检验权限
      var _this = this;
      var id = e.currentTarget.dataset.id; //当前产品id
      var toIsDown = e.currentTarget.dataset.is_down; //最终要变成的状态
      var messageInfo;
      if (toIsDown == 0) {
        messageInfo = "上架成功"
      } else if (toIsDown == 1) {
        messageInfo = "下架成功"
      }
      app.netWork.postJson(app.urlConfig.goodsIsDownChange, { id: id, is_down: toIsDown }).then(res => {
        console.log(res);
        if (res.errorNo == 0) {
          wx.showToast({
            title: messageInfo,
            icon: 'success',
            duration: 2000,
            mask: true
          });
          // 重新调用一次页面显示调取列表数据
          _this.onShow();
        }
      })
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  toEditSupplier: function (e) {  // 去管理供应商的页面
    if (util.authFind('productoffer_index')) { //检验权限
      // 获取对应商品的id,code,goodsName 
      var id = e.currentTarget.dataset.id;
      // goodsname在自定义属性中name的首字母不能大写，否则取不到数据
      var goodsName = e.currentTarget.dataset.goodsname;
      var code = e.currentTarget.dataset.code;
      //跳转至管理供应商页面 
      util.navTo({
        url: '../goodsSupplier/goodsSupplier?id=' + id + "&code=" + code + "&name=" + goodsName,
      });
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  // 当选择全部时,应该把选择全部的勾显示出来，让一级分类和二级分类的所有对钩都取消，因为他们是互斥的
  checkAll: function () {
    this.setData({
      linshiPidObj: "",
      linshiCidObj: "",
      checkAllClass: true  //让选择全部去掉勾
    })
  },

  // 选择一级分类时,先获取被点击的一级分类是哪个，把其他的一级分类的checked属性都改为false,自己的checked属性改为true,把所有的一级分类的checked属性都改为false 
  checkPic: function (e) {
    // linshiPidObj: "", //临时记录用户选择的是哪个一级分类的数据
    // linshiCidObj: "", //临时记录用户选择的是哪个二级分类的数据
    // resultPidObj: "", //最终用户选择的是哪个一级分类的数据
    // resultCidObj: "", //最终用户选择的是哪个二级分类的数据

    console.log(e.currentTarget.dataset.item);

    this.setData({
      linshiPidObj: e.currentTarget.dataset.item,
      linshiCidObj: "",
      checkAllClass: false  //让选择全部去掉勾

    })

  },

  checkCid: function (e) {

    // linshiPidObj: "", //临时记录用户选择的是哪个一级分类的数据
    // linshiCidObj: "", //临时记录用户选择的是哪个二级分类的数据
    // resultPidObj: "", //最终用户选择的是哪个一级分类的数据
    // resultCidObj: "", //最终用户选择的是哪个二级分类的数据

    console.log(e.currentTarget.dataset.item);

    this.setData({
      linshiCidObj: e.currentTarget.dataset.item,
      checkAllClass: false  //让选择全部去掉勾
    })





  },

  // 点击确认把临时存储的一级分类数据和二级分类数据更新给resultPidObj和resultCidObj，然后根据这两组数据中的数据请求列表数据
  supClassSure: function () {
    console.log("点击了确认");

    // linshiPidObj: "", //临时记录用户选择的是哪个一级分类的数据
    // linshiCidObj: "", //临时记录用户选择的是哪个二级分类的数据
    // resultPidObj: "", //最终用户选择的是哪个一级分类的数据
    // resultCidObj: "", //最终用户选择的是哪个二级分类的数据

    this.setData({
      resultPidObj: this.data.linshiPidObj,
      resultCidObj: this.data.linshiCidObj,
      pageNum: 1,//把请求页数重置为1；
      total: "", // 把total重置为“”
      goodsData: [] //清空列表页现有的数据
    });



    // 如果用户没有点击过确认，直接清空临时的和最终的
    if (this.data.resultPidObj == "" && this.data.resultCidObj == "") {
      this.setData({
        linshiPidObj: "",
        linshiCidObj: "",
        resultPidObj: "",
        resultCidObj: "",
        checkAllClass: true,  //让选择全部打上勾
        showClass: false  //隐藏整个分类面板
      });
    }

    // 如果用户点击过，只有一级分类，没有二级分类，那么清空二级分类
    if (this.data.resultPidObj != "" && this.data.resultCidObj == "") {
      this.setData({
        resultCidObj: "",
        checkAllClass: false,  //让选择全部去掉勾
        showClass: false  //隐藏整个分类面板

      })
    }

    // 如果用户点击过，一级分类和二级分类都有的情况,把最终的resultPidObj和resultCidObj都等于linshiPidObj、linshiCidObj
    if (this.data.resultPidObj != "" && this.data.resultCidObj != "") {
      this.setData({
        resultPidObj: this.data.linshiPidObj,
        resultCidObj: this.data.linshiCidObj,
        checkAllClass: false,  //让选择全部去掉勾
        showClass: false  //隐藏整个分类面板
      })
    }
    this.goodsListData();
  },

  // 点击取消隐藏分类列表,把临时存储的分类数据清空，让其等于上一次用户点击确认后的一二级分类数据
  supClassCancle: function () {
    this.setData({
      showClass: false  //隐藏整个分类面板
    })
  }
})