var app = getApp()
// 引入省市县数据
import earaInfo from "../../utils/earaInfo.js";
import util from '../../utils/util.js';
Page({
  data: {
    aaa: "",
    // showMore: false, //默认隐藏高级控制下方的内容
    pickerFinishNum: 0, //统计picker(分类、单位、产地)有几个计算完了
    // 商品数据
    goods: {
      id: "",//产品id
      code: "",
      goodsName: "",   //商品名称
      goodsImg: "../../images/placeholder.png",   //商品缩略图
      offer_price: "", //商品的采购价
      offer_name: "", //采购价单位
      is_down: 0, //商品是否下架,默认为上架
      address: "",//商品的具体地址  
      Purchasecycle: "",//购买周期
      province_name: "",//省
      city_name: "", //市
      county_name: "",//县
      Pcategory_name: "", //一级分类名
      Ccategory_name: "", //二级分类名
      description: "", //备注
      unit_name: "" //商品详情单位
    },
    flag: true,  //防止暴力点击重复添加商品的开关

    // tempFilePaths: "", //上传的图片的路径
    //商品详情单位相关
    unitData: [], //存储请求到的单位数据汇总,目前页面中只用到了前两级
    unitPageArray: [], //存储默认展示在页面的picker中的单位数据
    unitIndex: [0, 0],  //页面时时变化的单位下标，相对于unitPageArray
    unitResultIndex: [0, 0], //用户最终确认的单位的下标
    unitResult: [],  // 确认之后展示在页面的单位数据

    // 分类相关
    classData: [],  // 请求到的分类数据汇总
    classPageArray: [], // 时时展示在页面供滚动的的分类数据   
    classIndex: [0, 0],  //用户一滚动就变化的分类数据的各级的下标
    classResult: [],  // 用户点击确认后在页面中展示的分类
    classResultIndex: [0, 0],//用户点击确认后最终展示在页面的分类下标
    // 省市相关
    regionData: earaInfo.earaInfo[0].data,  //请求到的省市县的数据汇总
    regionPageArray: [earaInfo.earaInfo[0].data, [], []], //展示在页面的省市县数据
    regionIndex: [0, 0, 0],  //展示省市县各级的下标，相对于regionArray
    regionResultIndex: [0, 0, 0], //最终展示在页面上的省市县的下标
    regionResult: [],  //初始默认展示的省市县
  },
  onLoad: function (options) {
    console.log(this.data.regionPageArray);
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var _this = this;
    _this.getshengshixian(); //获取省市县列表

    // 去缓存中查找商品分类,如果找到了把结果赋给classData,如果找不到则发送请求,请求到了之后在给classData赋值并缓存
    var classData = wx.getStorageSync('classData');

    if (classData && classData.length > 0) {
      _this.setData({
        classData: classData
      });
      // console.log("缓存分类")

      // 这个一定要放在这里执行
      _this.goodsClass();  //初始化classPageArray和classResult

    }
    else {
      console.log("请求分类");
      app.netWork.postJson(app.urlConfig.productinfoPlevelUrl, { level: 0, type: 0 }).then(res => {
        if (res.errorNo == 0) {
          console.log(res);
          _this.setData({
            classData: res.data
          });

          // 这个一定要放在这里执行
          _this.goodsClass();  //初始化classPageArray和classResult

          // 将请求到的数据存储到本地
          wx.setStorage({
            key: "classData",
            data: res.data
          });
        }
      });
    }
    // 获取商品单位，如果找到了把结果赋给unitData,如果找不到则发送请求,请求到了之后在给unitData赋值并缓存
    var unitData = wx.getStorageSync('unitData');
    if (unitData && unitData.length > 0) {
      _this.setData({
        unitData: unitData
      });
      // 这个一定要放在这里执行
      _this.goodsUnit();  //初始化unitPageArray和unitResult

    } else {
      app.netWork.postJson(app.urlConfig.getUnitUrl, {}).then(res => {
        if (res.errorNo == 0) {
          _this.setData({
            unitData: res.data
          });
          // 这个一定要放在这里执行
          _this.goodsUnit();  //初始化unitPageArray和unitResult
          // 存储到本地
          wx.setStorage({
            key: "unitData",
            data: res.data
          });
        }
      })
    }

    wx.hideLoading();
  },

  goodsUnit: function () {
    // 处理商品的单位得到最初的unitPageArray 和 unitResult;
    this.data.unitPageArray = [this.data.unitData, this.data.unitData[0].son]; //存储默认展示在页面的picker中的单位数据
    this.data.unitResult = [this.data.unitData[0], this.data.unitData[0].son[0]];  // 初始化展示在页面的单位数据
    this.setData({
      unitPageArray: this.data.unitPageArray,
      unitResult: this.data.unitResult
    });
  },

  // 处理商品的分类得到最初的classPageArray 和 classResult
  goodsClass: function () {
    this.data.classPageArray = [this.data.classData, this.data.classData[0].son];  //初始化展示在picker的分类数据
    this.data.classResult = [this.data.classData[0], this.data.classData[0].son[0]]; //初始化展示在页面的分类数据
    this.setData({
      classPageArray: this.data.classPageArray,
      classResult: this.data.classResult
    });
  },

  // switchChange: function (e) {//高级控制（辅助采购）
  //   this.setData({
  //     showMore: e.detail.value
  //   })
  // },
  // switch1Change: function () {

  // },
  bindClassColumnChange: function (e) {//分类修改事件
    // 如果滚动的是第一列
    if (e.detail.column == 0) {
      this.data.classPageArray[1] = this.data.classData[e.detail.value].son;
      this.data.classIndex = [e.detail.value, 0];
    } else if (e.detail.column == 1) {
      this.data.classIndex[1] = e.detail.value;
    }

    this.setData({
      classPageArray: this.data.classPageArray,
      classIndex: this.data.classIndex
    });
  },
  bindClassChange: function (e) {//分类完成事件
    this.data.classResult[0] = this.data.classPageArray[0][this.data.classIndex[0]];
    this.data.classResult[1] = this.data.classPageArray[1][this.data.classIndex[1]];
    this.setData({
      classResultIndex: this.data.classIndex,
      classResult: this.data.classResult

    });
  },
  // 单位在picker中滚动改变触发的
  bindUnitColumnChange: function (e) {//单位修改事件
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // 滚动第一列
    if (e.detail.column == 0) {
      this.data.unitIndex = [e.detail.value, 0];
      this.data.unitPageArray[1] = this.data.unitData[e.detail.value].son
    } else if (e.detail.column == 1) {
      // 滚动第二列
      this.data.unitIndex[1] = e.detail.value;
    }
    // 更新数据
    this.setData({
      unitPageArray: this.data.unitPageArray,
      unitIndex: this.data.unitIndex
    });
  },
  // 用户滚动完毕，点击确认后
  bindUnitChange: function (e) {
    this.data.unitResultIndex = this.data.unitIndex;
    this.data.unitResult[0] = this.data.unitPageArray[0][this.data.unitResultIndex[0]];
    this.data.unitResult[1] = this.data.unitPageArray[1][this.data.unitResultIndex[1]];
    this.setData({
      unitResultIndex: this.data.unitResultIndex,
      unitResult: this.data.unitResult
    });
    console.log(this.data.unitResult);
  },
  // 产地滚动后点击确认
  bindRegionChange: function (e) {//產地修改完成
    this.data.regionResultIndex = this.data.regionIndex;
    // 更新展示在页面上的数据
    this.data.regionResult[0] = this.data.regionPageArray[0][this.data.regionResultIndex[0]]
    this.data.regionResult[1] = this.data.regionPageArray[1][this.data.regionResultIndex[1]]
    this.data.regionResult[2] = this.data.regionPageArray[2][this.data.regionResultIndex[2]]

    this.setData({
      regionResultIndex: this.data.regionResultIndex,
      regionResult: this.data.regionResult
    });
  },

  // 滚动产地picker
  bindRegionColumnChange: function (e) {//產地修改事件
    // console.log(e.detail.column,e.detail.value)
    // 如果滚动的是第0列
    if (e.detail.column == 0) {
      this.data.regionIndex = [e.detail.value, 0, 0];
      this.data.regionPageArray[1] = this.data.regionData[e.detail.value].son;
      this.data.regionPageArray[2] = this.data.regionData[e.detail.value].son[0].son;
    } else if (e.detail.column == 1) {
      this.data.regionIndex[1] = e.detail.value;
      this.data.regionIndex[2] = 0;
      this.data.regionPageArray[2] = this.data.regionData[this.data.regionIndex[0]].son[this.data.regionIndex[1]].son;
    } else if (e.detail.column == 2) {
      this.data.regionIndex[2] = e.detail.value;
    }
    this.setData({
      regionIndex: this.data.regionIndex,
      regionPageArray: this.data.regionPageArray
    });

  },

  // 选logo择图片
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var goods = _this.data.goods;
        // console.log(res.tempFilePaths)  //是一个数组
        goods.goodsImg = res.tempFilePaths[0];
        _this.setData({
          goods: goods
        });
      }
    })
  },

  getshengshixian: function () {
    console.log(this.data.regionPageArray);
    // 初始化regionPageArray
    this.data.regionPageArray[1] = this.data.regionData[0].son;
    this.data.regionPageArray[2] = this.data.regionData[0].son[0].son;

    console.log(this.data.regionPageArray);


    // 初始化结果,让其展示为北京 北京 东城区
    this.data.regionResult = [this.data.regionPageArray[0][0], this.data.regionPageArray[1][0], this.data.regionPageArray[2][0]];
    this.setData({
      regionResult: this.data.regionResult,
      regionPageArray: this.data.regionPageArray
    });
  },
  // 输入、修改商品名称时触发
  changeGoodsName: function (e) {
    this.data.goods.goodsName = e.detail.value.trim();
  },

  // 商品名称失去焦点时触发
  changeGoodsNameBlur: function () {
    this.setData({
      goods: this.data.goods
    })
  },

  // 详细地址编辑时触发
  changeAddress: function (e) {
    this.data.goods.address = e.detail.value;
  },

  //详细地址失去焦点时触发
  sureChangeAddress: function (e) {
    this.data.goods.address = this.data.goods.address.trim();
    this.setData({
      goods: this.data.goods
    });
  },

  // 采购周期输入时
  changePurchasecycle: function (e) {
    this.data.goods.Purchasecycle = e.detail.value.trim();
  },

  // 采购周期失去焦点
  changePurchasecycleBlur: function () {
    this.setData({
      goods: this.data.goods
    })
  },

  // 备注输入时触发
  changeDescription: function (e) {
    this.data.goods.description = e.detail.value.trim();
  },

  // 备注失去焦点
  changeDescriptionBlur: function () {
    this.setData({
      goods: this.data.goods
    });
  },

  // 改变商品上下架的状态
  changeIsDown: function (e) {
    // console.log(e.detail.value);
    var goods = this.data.goods;
    if (e.detail.value) {
      goods.is_down = 0
    } else {
      goods.is_down = 1
    }

    this.setData({
      goods: goods
    })

  },
  saveGoods: function () {


    // 模拟一次地址失去焦点事件，防止更新不到位
    var goods = this.data.goods;
    goods.address = this.data.goods.address.trim();
    this.setData({
      goods: goods
    });


    // 做判断,商品名称 详细地址 
    if (this.data.goods.goodsName == "") {
      wx.showToast({
        title: '请输入商品名称',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      });
      return
    }

    if (this.data.goods.goodsImg == "../../images/placeholder.png") {
      wx.showToast({
        title: '请上传商品图片',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      });
      return
    }

    // 图片单独传
    var data = {
      title: this.data.goods.goodsName,  //商品名称
      address: this.data.goods.address,   // 具体地址
      pid: this.data.classResult[0].id,//一级分类id
      cid: this.data.classResult[1].id,  //二级分类id
      base_unit: this.data.unitResult[1].id, //单位子集id
      description: this.data.goods.description, //商品描述
      status: 1,  //状态默认传1
      type: 1,  //类型默认传1
      provinces: this.data.regionResult[0].region_id, //省id
      cities: this.data.regionResult[1].region_id,  //市id
      county: this.data.regionResult[2].region_id,//县id
      is_down: this.data.goods.is_down,  //是否下架的状态
      Purchasecycle: this.data.goods.Purchasecycle, //采购周期
      Otype: "wap" //给后端的标识固定参数，代表小程序
    }

    var _this = this;

    // 设置图片路径
    var filePath = _this.data.goods.goodsImg;


    // 防止暴力点击重复创建店铺的开关
    if (this.data.flag == false) {
      return
    }

    this.setData({
      flag: false
    });

    wx.showLoading({
      title: '加载中',
      mask: true
    });

    // 添加产品的接口
    app.netWork.upload_file(app.urlConfig.addGoodsUrl, filePath, data, "thumb").then(res => {
      console.log(res)
      var res = JSON.parse(res);

      if (res.errorNo == 0) {
        // 提示新增商品成功

        wx.showToast({
          title: '新增商品成功',
          icon: 'success',
          duration: 2000,
          mask: true
        });

        // 修改或者新增商品成功后都跳转到列表页 
        setTimeout(function () {
          wx.switchTab({
            url: '../goods/goods'
          });
        }, 2000);

      } else {

        this.setData({
          flag: true
        });
        wx.showToast({
          title: '新增商品失败',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        });
      }

      wx.hideLoading();
    }).catch(err => {
      // 创建失败时开启flag,允许再次提交
      _this.setData({
        flag: true
      });

      wx.hideLoading();
    });;


  },
})