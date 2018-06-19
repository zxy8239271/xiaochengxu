var app = getApp()

// 引入省市县数据
import earaInfo from "../../utils/earaInfo.js";
import util from '../../utils/util.js';
// console.log(earaInfo.earaInfo[0].data);
Page({
  data: {

    loadNum: 0, //计算有几个picker已经加载完毕，如果3个全部加载完毕才允许用户操作
    // showMore: true, //默认隐藏高级控制下方的内容
    goodsInfo: "",  //存储所有拿过来的商品数据
    thumbIsChange: false,//标记图片被修改过
    isAction: false,  //标记表被动过防止详情没有被修改重复提交

    //商品详情单位相关
    unitData: [], //存储请求到的单位数据汇总,目前页面中只用到了前两级
    unitPageArray: [], //存储默认展示在页面的picker中的单位数据
    unitIndex: [0, 0],  //页面时时变化的单位下标，相对于unitPageArray
    unitResultIndex: [0, 0], //用户最终确认的单位的下标
    unitResult: [],  // 确认之后展示在页面的单位数据


    // 分类相关
    classData: [],  // 请求到的分类数据汇总
    classPageArray: [], // 时时展示在页面供滚动的的分类数据   
    classIndex: [],  //用户一滚动就变化的分类数据的各级的下标
    classResult: [],  // 用户点击确认后在页面中展示的分类
    classResultIndex: [],//用户点击确认后最终展示在页面的分类下标


    // 省市相关
    regionData: earaInfo.earaInfo[0].data,  //省市县的数据汇总
    regionPageArray: [earaInfo.earaInfo[0].data, [], []], //展示在页面的省市县数据
    regionIndex: [0, 0, 0],  //展示省市县各级的下标，相对于regionArray
    regionResultIndex: [0, 0, 0], //最终展示在页面上的省市县的下标
    regionResult: [],  //初始默认展示的省市县

    flag: true //防止重复保存、删除的开关

  },


  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    console.log(options.item)
    var _this = this;

    this.setData({
      goodsInfo: JSON.parse(options.item),
    });

    // 这个位置不能动，不然无法获取到商品的数据
    this.getshengshixian(); //获取省市县列表


    // 去缓存中查找商品分类,如果找到了把结果赋给classData,如果找不到则发送请求,请求到了之后在给classData赋值并缓存
    var classData = wx.getStorageSync('classData');
    if (classData && classData.length > 0) {
      this.setData({
        classData: classData
      });
      _this.goodsClass();
    }
    else {
      app.netWork.postJson(app.urlConfig.productinfoPlevelUrl, { level: 0, type: 0 }).then(res => {
        console.log("发请求拿classData");
        _this.setData({
          classData: res.data
        });

        _this.goodsClass();
        // 存储到本地
        wx.setStorage({
          key: "classData",
          data: res.data
        });
      });
    }


    // 获取商品单位，如果找到了把结果赋给unitData,如果找不到则发送请求,请求到了之后在给unitData赋值并缓存


    var unitData = wx.getStorageSync('unitData');
    if (unitData && unitData.length > 0) {

      this.setData({
        unitData: unitData
      });
      _this.goodsUnit();

    } else {
      app.netWork.postJson(app.urlConfig.getUnitUrl, {}).then(res => {
        if (res.errorNo == 0) {
          console.log("发请求拿unitData");
          _this.setData({
            unitData: res.data
          });
          _this.goodsUnit(); //初始化
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
  // 初始化单位
  goodsUnit: function () {
    this.data.unitPageArray = [this.data.unitData, []];
    console.log(this.data.unitPageArray)
    // 获取现有产品的单位name
    var unit_name = this.data.goodsInfo.unit_name;
    var linshiUnitData;
    for (var i = 0; i < this.data.unitData.length; i++) {
      var unitFatherI = this.data.unitData[i];
      // 循环子项，从内部查找和该商品详情单位一致的那一项
      for (var j = 0; j < unitFatherI.son.length; j++) {
        var unitSonJ = unitFatherI.son[j];
        if (unitSonJ.name == unit_name) {
          linshiUnitData = unitFatherI;
          // 顺带得到对应的下标
          this.data.unitIndex = [i, j];
          this.data.unitResultIndex = [i, j];
        }
      }
    }

    // 遍历得到的目标linshiUnitData的子项更新unitPageArray[1];
    for (var i = 0; i < linshiUnitData.son.length; i++) {
      this.data.unitPageArray[1].push(linshiUnitData.son[i])
    }

    // 根据unitPageArray和unitResultIndex得到unitResult;
    this.data.unitResult[0] = this.data.unitPageArray[0][this.data.unitResultIndex[0]];
    this.data.unitResult[1] = this.data.unitPageArray[1][this.data.unitResultIndex[1]];

    this.setData({
      unitPageArray: this.data.unitPageArray,
      unitIndex: this.data.unitIndex,
      unitResultIndex: this.data.unitResultIndex,
      unitResult: this.data.unitResult
    });
  },

  // 初始化分类
  goodsClass: function () {
    console.log(this.data.goodsInfo);
    this.data.classPageArray = [this.data.classData, []];

    var Pcategory_name = this.data.goodsInfo.Pcategory_name;  //获取分类的一级标题
    var Ccategory_name = this.data.goodsInfo.Ccategory_name;  //获取分类的二级标题


    // 拿到分类包含此商品的的一级分类从而获取对应的二级分类
    console.log(Pcategory_name, Ccategory_name);
    console.log(this.data.classData);
    console.log(this.data.classPageArray);


    var linshiClassData = this.data.classData.find(function (item) {
      return item.name == Pcategory_name
    });

    console.log(linshiClassData)
    //  更新classPageArray的二级分类
    this.data.classPageArray[1] = linshiClassData.son;

    // 更新classIndex的一级索引
    this.data.classIndex[0] = this.data.classData.findIndex(function (item) {
      return item.name == Pcategory_name
    });

    // 更新classIndex的二级索引
    this.data.classIndex[1] = linshiClassData.son.findIndex(function (item) {
      return item.name == Ccategory_name
    });


    // 更新classResultIndex
    this.data.classResultIndex[0] = this.data.classIndex[0];
    this.data.classResultIndex[1] = this.data.classIndex[1];
    this.data.classResult[0] = this.data.classPageArray[0][this.data.classResultIndex[0]];
    this.data.classResult[1] = this.data.classPageArray[1][this.data.classResultIndex[1]];

    this.setData({
      classPageArray: this.data.classPageArray,
      classIndex: this.data.classIndex,
      classResult: this.data.classResult,
      classResultIndex: this.data.classResultIndex
    });
  },

  // switchChange: function (e) {//高级控制（辅助采购）
  //   this.setData({
  //     showMore: e.detail.value
  //   })
  // },
  // switch1Change: function () {

  // },
  goEditSupplier: function () {
    util.navTo({

      url: '../goodsSupplier/goodsSupplier?id=' + this.data.goodsInfo.id + "&code=" + this.data.goodsInfo.code + "&name=" + this.data.goodsInfo.title,
    });
  },

  bindClassColumnChange: function (e) {//分类修改事件

    // 如果滚动的是第一列
    if (e.detail.column == 0) {
      this.data.classIndex[0] = e.detail.value;
      this.data.classPageArray[1] = this.data.classData[e.detail.value].son;
      this.data.classIndex[1] = 0; //默认选中子集的弟0个

    } else if (e.detail.column == 1) {
      this.data.classIndex[1] = e.detail.value;
    }

    this.setData({
      classPageArray: this.data.classPageArray,
      classIndex: this.data.classIndex
    });
  },
  bindClassChange: function (e) {//分类完成事件
    var classResult = [];
    this.data.classResult[0] = this.data.classPageArray[0][this.data.classIndex[0]];
    this.data.classResult[1] = this.data.classPageArray[1][this.data.classIndex[1]];
    this.setData({
      classResultIndex: this.data.classIndex,
      classResult: this.data.classResult,
      isAction: true //标记表被动过防止详情没有被修改重复提交

    })



  },
  // 单位在picker中滚动改变触发的
  bindUnitColumnChange: function (e) {//单位修改事件
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // 滚动第一列
    if (e.detail.column == 0) {
      this.data.unitIndex = [e.detail.value, 0];

    } else if (e.detail.column == 1) {
      // 滚动第二列
      this.data.unitIndex[1] = e.detail.value;
    }

    this.data.unitPageArray[1] = [];
    // 重新装载unitPageArray[1];

    for (var i = 0; i < this.data.unitData[this.data.unitIndex[0]].son.length; i++) {
      var unitDataSonI = this.data.unitData[this.data.unitIndex[0]].son[i];
      // console.log(unitDataSonI);
      this.data.unitPageArray[1].push(unitDataSonI);
    }


    // 更新数据
    this.setData({
      unitPageArray: this.data.unitPageArray,
      unitIndex: this.data.unitIndex
    })
  },
  // 用户滚动完毕，点击确认后
  bindUnitChange: function (e) {

    this.data.unitResultIndex = this.data.unitIndex;

    // 更新unitResult
    this.data.unitResult[0] = this.data.unitPageArray[0][this.data.unitResultIndex[0]];
    this.data.unitResult[1] = this.data.unitPageArray[1][this.data.unitResultIndex[1]];

    this.setData({
      unitResultIndex: this.data.unitResultIndex,
      unitResult: this.data.unitResult,
      isAction: true //标记表被动过防止详情没有被修改重复提交

    })

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

  bindRegionChange: function (e) {//產地修改完成
    this.data.regionResultIndex = this.data.regionIndex;
    // 更新展示在页面上的数据
    this.data.regionResult[0] = this.data.regionPageArray[0][this.data.regionResultIndex[0]]
    this.data.regionResult[1] = this.data.regionPageArray[1][this.data.regionResultIndex[1]]
    this.data.regionResult[2] = this.data.regionPageArray[2][this.data.regionResultIndex[2]]

    this.setData({
      regionResultIndex: this.data.regionResultIndex,
      regionResult: this.data.regionResult,
      isAction: true //标记表被动过防止详情没有被修改重复提交

    });
  },
  // 选择图片
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var goodsInfo = _this.data.goodsInfo;
        // console.log(res.tempFilePaths)  //是一个数组
        goodsInfo.thumb = res.tempFilePaths[0];
        _this.setData({
          goodsInfo: goodsInfo,
          thumbIsChange: true, //标记图片被修改过
          isAction: true //标记表被动过防止详情没有被修改重复提交
        });
      }
    })
  },

  getshengshixian: function () {

    // 拿到商品的省市县
    var province_name = this.data.goodsInfo.province_name;//省
    var city_name = this.data.goodsInfo.city_name;//市
    var county_name = this.data.goodsInfo.county_name;//县

    console.log(province_name, city_name, county_name)

    // 找到对应省份的整条数据
    var linshiRegionData = this.data.regionData.find(function (item, index) {
      return item.region_name == province_name
    });
    this.data.regionIndex[0] = this.data.regionData.findIndex(function (item, index) {
      return item.region_name == province_name
    });

    this.data.regionResultIndex[0] = this.data.regionIndex[0];
    this.data.regionPageArray[1] = [];
    this.data.regionPageArray[2] = [];

    // 把对应省份整条数据的市放到regionPageArray[1]中
    for (var i = 0; i < linshiRegionData.son.length; i++) {
      this.data.regionPageArray[1].push(linshiRegionData.son[i]);
    }

    // 更新regionIndex regionResultIndex
    this.data.regionIndex[1] = this.data.regionPageArray[1].findIndex(function (item) {
      return item.region_name == city_name
    })

    this.data.regionResultIndex[1] = this.data.regionIndex[1];

    // 把对应县级的数据放到regionPageArray[2]中
    for (var i = 0; i < linshiRegionData.son[this.data.regionResultIndex[1]].son.length; i++) {
      this.data.regionPageArray[2].push(linshiRegionData.son[this.data.regionResultIndex[1]].son[i])
    }

    // 更新regionIndex regionResultIndex
    this.data.regionIndex[2] = this.data.regionPageArray[2].findIndex(function (item) {
      return item.region_name == county_name
    })

    this.data.regionResultIndex[2] = this.data.regionIndex[2];
    // 更新要展示在页面的regionResult
    this.data.regionResult[0] = this.data.regionPageArray[0][this.data.regionResultIndex[0]];
    this.data.regionResult[1] = this.data.regionPageArray[1][this.data.regionResultIndex[1]];
    this.data.regionResult[2] = this.data.regionPageArray[2][this.data.regionResultIndex[2]];

    this.setData({
      regionPageArray: this.data.regionPageArray,
      regionIndex: this.data.regionIndex,
      regionResultIndex: this.data.regionResultIndex,
      regionResult: this.data.regionResult
    })


  },

  // 输入、修改商品名称时触发
  changeGoodsName: function (e) {
    this.data.goodsInfo.title = e.detail.value.trim();
    this.data.isAction = true;
  },

  // 商品名称失去焦点时触发
  changeGoodsNameBlur: function () {
    this.setData({
      goodsInfo: this.data.goodsInfo,
      isAction: true   //标记表被动过
    });
  },



  // 详细地址编辑时触发
  changeAddress: function (e) {
    this.data.goodsInfo.address = e.detail.value;
    this.data.isAction = true; //标记表被动过防止详情没有被修改重复提交
  },

  // 详细地址失去焦点时触发
  sureChangeAddress: function (e) {
    this.data.goodsInfo.address = this.data.goodsInfo.address.trim();
    this.setData({
      goodsInfo: this.data.goodsInfo,
      isAction: true //标记表被动过防止详情没有被修改重复提交

    });
  },


  // 采购周期输入时
  changePurchasecycle: function (e) {
    this.data.goodsInfo.Purchasecycle = e.detail.value.trim();
    this.data.isAction = true; //标记改动过了
  },

  // 采购周期失去焦点
  changePurchasecycleBlur: function () {
    this.setData({
      goodsInfo: this.data.goodsInfo,
      isAction: true //标记表被动过防止详情没有被修改重复提交

    })
  },

  // 备注输入时触发
  changeDescription: function (e) {
    this.data.goodsInfo.description = e.detail.value.trim();
    this.data.isAction = true;
  },

  // 备注失去焦点
  changeDescriptionBlur: function () {
    this.setData({
      goodsInfo: this.data.goodsInfo,
      isAction: true
    });
  },

  // 改变商品上下架的状态
  changeIsDown: function (e) {
    // console.log(e.detail.value);
    var goodsInfo = this.data.goodsInfo;
    if (e.detail.value) {
      goodsInfo.is_down = 0
    } else {
      goodsInfo.is_down = 1
    }

    this.setData({
      goodsInfo: goodsInfo,
      isAction: true  //标记表被动过防止详情没有被修改重复提交
    })

  },

  saveGoods: function (e) {
    if (util.authFind('productinfo_update')) { //检验权限
      // 模拟一次地址失去焦点事件，防止更新不到位
      var goodsInfo = this.data.goodsInfo;
      goodsInfo.address = this.data.goodsInfo.address.trim();
      this.setData({
        goodsInfo: goodsInfo
      });
      // 做判断,商品名称 详细地址 
      if (this.data.goodsInfo.title == "") {
        wx.showToast({
          title: '请输入商品名称',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        });
        return
      }
      // 图片单独传
      var data = {
        title: this.data.goodsInfo.title,  //商品名称
        address: this.data.goodsInfo.address,   // 具体地址
        pid: this.data.classResult[0].id,//一级分类id
        cid: this.data.classResult[1].id,  //二级分类id
        base_unit: this.data.unitResult[1].id, //单位子集id
        description: this.data.goodsInfo.description, //商品描述
        status: 1,  //状态默认传1
        type: 1,  //类型默认传1
        provinces: this.data.regionResult[0].region_id, //省id
        cities: this.data.regionResult[1].region_id,  //市id
        county: this.data.regionResult[2].region_id,//县id
        is_down: this.data.goodsInfo.is_down,  //是否下架的状态
        Purchasecycle: this.data.goodsInfo.Purchasecycle, //采购周期
        Otype: "wap" //给后端的标识固定参数，代表小程序
      }
      // 设置图片路径
      var filePath = this.data.goodsInfo.thumb;
      data.id = this.data.goodsInfo.id;
      // 如果用户没有更改过任何信息,不允许请求接口
      if (this.data.isAction) {
        // 第1种,未更改过产品图片
        if (this.data.thumbIsChange == false) {
          // 防止暴力点击
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
          app.netWork.postJson(app.urlConfig.changeGoodsUrl, data).then(res => {
            console.log("没更改过图片");
            console.log(res);
            console.log(this.data.flag);
            if (res.errorNo == 0) {
              // 提示商品修改成功
              wx.showToast({
                title: '商品修改成功',
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

              // 让开关打开，可以再次保存
              this.setData({
                flag: true
              });
              wx.showToast({
                title: '保存失败',
                image: '../../images/warning.png',
                duration: 2000,
                mask: true
              });
            }
            wx.hideLoading();


          }).catch(err => {

            // 让开关打开，可以再次保存
            this.setData({
              flag: true
            });
            wx.hideLoading();


          });
        } else {
          // 第2种更改过（重新上传过）产品图片，通过this.data.goodsInfo.thumb的路径和filePath对比（即this.data.goods.goodsImg）

          // 防止暴力点击
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

          app.netWork.upload_file(app.urlConfig.changeGoodsUrl, filePath, data, "thumb").then(res => {
            var res = JSON.parse(res);
            console.log("更改过图片");
            console.log(res);
            console.log(this.data.flag);
            // console.log(res);
            if (res.errorNo == 0) {
              // 提示商品修改成功
              wx.showToast({
                title: '商品修改成功',
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
              // 让开关打开，可以再次保存
              this.setData({
                flag: true
              });
              wx.showToast({
                title: res.errorMsg,
                image: '../../images/warning.png',
                duration: 2000,
                mask: true
              });
            }
            wx.hideLoading();
          }).catch(err => {

            // 让开关打开，可以再次保存
            this.setData({
              flag: true
            });
            wx.hideLoading();


          });
        }
      } else {
        wx.showToast({
          title: '没有任何修改',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        });
        return
      }
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  // 显示是否确认删除
  sureDelGoods: function () {

    if (util.authFind('productinfo_delete')) { //检验权限
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '确认删除此商品吗？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            _this.delGoods();

          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
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
  // 点击确认删除商品
  delGoods: function () {
    // 防止暴力点击删除
    if (this.data.flag == false) {
      return
    }

    this.setData({
      flag: false
    });

    app.netWork.postJson(app.urlConfig.delGoodsUrl, { id: this.data.goodsInfo.id }).then(res => {
      // console.log("执行删除")
      // console.log(res);
      // console.log(this.data.flag);

      if (res.errorNo == 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          mask: true
        });
        // 跳转至商品列表页面
        setTimeout(function () {
          wx.switchTab({
            url: '../goods/goods'
          })
        }, 2000);
      } else {
        // 删除失败
        this.setData({
          flag: true
        });

        wx.showToast({
          title: '删除商品失败',
          image: '../../images/warning.png',
          duration: 1000,
          mask: true
        });
        return
      }
    }).catch(err => {
      // 创建失败时开启flag,允许再次提交
      _this.setData({
        flag: true
      });
    });
  }
})