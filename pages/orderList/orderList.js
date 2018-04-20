var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    productPlevelData: [],//左侧的分类
    productListData: [],//右侧的菜品
    shopSelData: [],//添加新数据
    shopData: [],//购物车的数据
    showItem: 0,
    sub: '',
    toView: 'red',
    scrollTop: 100,
    hasMore: false,
    size: 1,
    shopNum: 0,
    allPrice: 0,
    isShowList: true,
    isChan: true,
  },
  onReady: function () {
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '菜品'
    });
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
  onShow: function () {
    var _this = this;
    _this.setData({
      shopNum:0,
      allPrice: 0,
    })
    var data = {
      level: '0',
      type: '0'
    };
    app.netWork.postJson(app.urlConfig.productinfoPlevelUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.setData({
          productPlevelData: res.data
        })
        _this.setData({
          showItem: res.data[0].id,
        })
        if (res.data[0].son) {
          _this.setData({
            sub: res.data[0].son[0].id
          })
        } else {
          _this.setData({
            sub: ''
          })
        }
        _this.data.size = 1;
        _this.data.shopData = [];
        // 左侧列表请求成功，再去请求购物车，然后用购物车的数据和productList列表的数据去渲染页面
        app.netWork.postJson(app.urlConfig.shopCarListUrl, data).then(res => {
          if (res.errorNo == '0') {
            var price = 0;
            res.data.filter(function (item, index) {//遍历json对象的每个key/value对,p为key
              item.son.filter(function (val, i) {
                price = price + val.offer_price * val.nums
                _this.data.shopData.push({
                  id: val.id,
                  code: val.code,
                  num: val.nums
                })
              })
            })
            _this.setData({
              shopNum: _this.data.shopData.length,
              allPrice: price,
              shopData: _this.data.shopData
            })
          }
          _this.productList();           
        }).catch(res => {
          _this.productList();
          
        })


      } else { //产品分类接口报错
        wx.showToast({
          title: res.errorMsg,
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
      }
    }).catch(res => {
      console.log("去采购左侧列表")
    })

  },

  productList: function () {//产品列表
    this.data.productListData = [];
    var _this = this;
    var data = {
      pid: this.data.showItem,
      cid: this.data.sub,
      page: this.data.size,
      page_size: '10',
      // status: '0'
    }
    var arr = [];
    wx.showLoading({
      title: '加载中',
    })
    app.netWork.postJson(app.urlConfig.productinfoListUrl, data).then(res => {
      if (res.errorNo == '0') {
        arr = this.data.productListData.concat(res.data);
        arr.filter(function (item, index) {
          arr[index].car_num=0;
          _this.data.shopData.filter(function (val, m) {
            if (item.id == val.id) {
              arr[index].num = val.num;
              arr[index].car_num = val.num;
            }
          })
        })
        _this.setData({
          productListData: arr
        });
        console.log(_this.data.productListData)
        if (res.total == 0) {
          _this.setData({
            hasMore: false
          });
        }
     
        wx.hideLoading();
      }
    }).catch(res => {
      console.log("去采购产品列表")
    })
  },
  showList: function (e) {//左側的父级点击
    var _this = this;
    this.setData({
      showItem: e.currentTarget.dataset.id
    })
    this.data.size = 1;
    this.data.productPlevelData.filter(function (item, index) {
      if (e.currentTarget.dataset.id == item.id) {
        if (_this.data.productPlevelData[index].son) {
          _this.setData({
            sub: _this.data.productPlevelData[index].son[0].id
          })
        } else {
          _this.setData({
            sub: ''
          })
        }
      }
    })

    this.productList();
  },
  selectItem: function (e) {//左側的子级点击
    this.setData({
      sub: e.currentTarget.dataset.change
    });
    this.data.size = 1;
    this.productList();
  },
  upper: function (e) {
    // console.log(e)
    console.log('上啦')
  },
  lower: function (e) {
    console.log(e)
    this.data.size += 1;
    this.productList();
  },
  jianBtn: function (e) {//减
    var _this = this;
    var arr = this.data.productListData;
    var value = e.currentTarget.dataset.item;
    var newArr = [];
    value.num = parseFloat(value.num) - 1;

    arr.filter(function (item, index) {//渲染页面的选择的数量
      if (e.currentTarget.dataset.item.id == item.id) {
        newArr = arr[index];
        arr[index] = value;
        _this.setData({
          productListData: arr,
        })
      }
    })
    // 数量的减处理  

    newArr.num = value.num - newArr.num;
    if (_this.data.shopSelData.length == '0') {
      _this.data.shopSelData.push(newArr);
      wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
    } else {
      var res = _this.data.shopSelData.findIndex(function (val, i) {
        return e.currentTarget.dataset.item.id == val.id
      })
      if (newArr.num > 0 || newArr.num < 0) {
        if (res == '-1') {
          _this.data.shopSelData.push(newArr);
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        } else {
          _this.data.shopSelData[res].num = _this.data.shopSelData[res].num - 1;
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        }
      } else {
        if (res != '-1') {
          _this.data.shopSelData.splice(i, 1)
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        }
      }
    }
    // 购物车数据的回显
    _this.data.shopData.filter(function (val, i) {
      if (value.num > 0) {
        if (e.currentTarget.dataset.item.id == val.id) {
          _this.data.shopData[i] = value;
        }
      } else {
        console.log(value.num)
        if (val.num == '0') {
          _this.data.shopData.splice(i, 1)
        }
        if (e.currentTarget.dataset.item.id == val.id) {
          _this.data.shopData.splice(i, 1)
        }
      }
    })

    // 购物车中数量
    this.data.shopNum = this.data.shopData.length;
    this.data.allPrice = this.data.allPrice - value.offer_price * 1;
    this.setData({
      shopNum: this.data.shopNum,
      allPrice: this.data.allPrice,
      shopSelData: this.data.shopSelData
    })


  },
  jiaBtn: function (e) {//加号
    var _this = this;
    var arr = this.data.productListData;
    var value = e.currentTarget.dataset.item;
    var newArr = [];
    value.num = parseFloat(value.num) + 1;
    arr.filter(function (item, index) {
      if (e.currentTarget.dataset.item.id == item.id) {//渲染页面的数量展示
        newArr = arr[index]
        arr[index] = value;
        _this.setData({
          productListData: arr
        })
      }
    })

    //加入购物车新数据
    newArr.num = value.num - newArr.num;
    if (this.data.shopSelData.length == 0) {
      this.data.shopSelData.push(newArr);
      wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
    } else {
      var res = _this.data.shopSelData.findIndex(function (val, i) {
        return e.currentTarget.dataset.item.id == val.id
      })
      if (newArr.num > 0 || newArr.num < 0) {
        if (res == '-1') {
          _this.data.shopSelData.push(newArr)
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        } else {
          console.log(_this.data.shopSelData[res].num)
          _this.data.shopSelData[res].num = parseFloat(_this.data.shopSelData[res].num) + 1;
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        }
      } else {
        if (res != '-1') {
          _this.data.shopSelData.splice(i, 1)
          wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData))
        }
      }
    }
    console.log(_this.data.shopSelData)
    // 购物车已经有数据加上新的数据判断
    var m = this.data.shopData.findIndex(function (val, n) {
      return val.id == e.currentTarget.dataset.item.id
    })
    if (m == '-1') {
      this.data.shopData.push({
        id: value.id,
        code: value.code,
        num: value.num
      });
    } else {
      this.data.shopData[m].num = value.num;
    }
    // 购物车中数量
    this.data.shopNum = this.data.shopData.length;
    this.data.allPrice = this.data.allPrice + value.offer_price * 1;
    this.setData({
      shopNum: this.data.shopNum,
      allPrice: this.data.allPrice,
      shopSelData: this.data.shopSelData
    })


  },
  changNum: function (e) {//手动修改数量
    var _this = this;
    var newNum = e.detail.value||0;
    var arr = this.data.productListData;
    var value = e.currentTarget.dataset.item;
    var newArr = [];
    this.data.allPrice = this.data.allPrice + value.offer_price * (util.toFix(newNum) - value.num);// 价钱的计算
    value.num = util.toFix(newNum);//当前页面展示的数据
    arr.filter(function (item, index) {
      if (e.currentTarget.dataset.item.id == item.id) {//渲染页面的数量展示
        newArr = arr[index];
        arr[index] = value;
        _this.setData({
          productListData: arr
        })
      }
    })
    //加入购物车的数据
    if (value.num != newArr.car_num){
      newArr.num = util.toFix(value.num - newArr.car_num) ;
    }
    console.log(newArr)
    if (this.data.shopSelData.length == 0) {
      this.data.shopSelData.push(newArr);
      wx.setStorageSync('shopSelData', JSON.stringify(this.data.shopSelData))
    } else {
      var res = this.data.shopSelData.findIndex(function (item, index) {
        return item.id == e.currentTarget.dataset.item.id
      })
      if (res == '-1') {
        this.data.shopSelData.push(newArr);
        wx.setStorageSync('shopSelData', JSON.stringify(this.data.shopSelData))
      } else {
        this.data.shopSelData[res].num = newArr.num;
        wx.setStorageSync('shopSelData', JSON.stringify(this.data.shopSelData))
      }

    }
    // 这是购物车里数据的页面回显
    var m = this.data.shopData.findIndex(function (val, n) {
      return val.id == e.currentTarget.dataset.item.id
    })
    if (m == '-1') {
      this.data.shopData.push({
        id: value.id,
        code: value.code,
        num: value.num
      });
    } else {
      this.data.shopData[m].num = value.num;
    }
    // 购物车中数量
    this.data.shopNum = this.data.shopData.length;
    this.setData({
      shopNum: this.data.shopNum,
      allPrice: this.data.allPrice,
      shopSelData: this.data.shopSelData
    });
  },
  goShoppingCart: function () {//点好了  提交
    var _this = this;
    var shopArr = JSON.parse(wx.getStorageSync('shopSelData'));
    var shoplist = [];
    shopArr.map(function (item, index) {
      shoplist.push({
        info: {
          code: item.code,
          title: item.title,
          id: item.id,
          thumb: item.thumb,
          pid: item.pid,
          offer_price: item.offer_price,
          offer_name: item.offer_name,
          supplier_name: item.supplier_name,
          is_down: item.is_down,
          supplier_id: item.supplier_id,
          is_supplier: item.is_supplier,
          offer_id: item.offer_id
        },
        num: item.num
      })
    })
    var data = {
      data: JSON.stringify(shoplist)
    }
    app.netWork.postJson(app.urlConfig.shopCarAddUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.data.shopSelData = [];
        _this.data.shopData = [];
        wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData));
        util.navTo({
          url: '../shoppingCart/shoppingCart'
        })
      }
    }).catch(res => {
      console.log("提交订单")
    })
  },
  goShopCart: function () {
    util.navTo({
      url: '../shoppingCart/shoppingCart'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this;
    this.data.productListData = [];
    var shopArr = [];
    if (wx.getStorageSync('shopSelData')) {
      shopArr = JSON.parse(wx.getStorageSync('shopSelData'))
    } else {
      shopArr = []
    }
    var shoplist = [];
    shopArr.map(function (item, index) {
      shoplist.push({
        info: {
          code: item.code,
          title: item.title,
          id: item.id,
          thumb: item.thumb,
          pid: item.pid,
          offer_price: item.offer_price,
          offer_name: item.offer_name,
          supplier_name: item.supplier_name,
          is_down: item.is_down,
          supplier_id: item.supplier_id,
          is_supplier: item.is_supplier,
          offer_id: item.offer_id
        },
        num: item.num
      })
    })
    var data = {
      data: JSON.stringify(shoplist)
    }
    app.netWork.postJson(app.urlConfig.shopCarAddUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.data.shopSelData = [];
        _this.data.shopData = [];
        wx.setStorageSync('shopSelData', JSON.stringify(_this.data.shopSelData));
      }
    }).catch(res => {
      _this.data.shopSelData = [];
      _this.data.shopData = [];
      console.log("提交订单")
    })

  }
})