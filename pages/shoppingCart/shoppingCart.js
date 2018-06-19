import util from '../../utils/util.js'
var app = getApp();

Page({
  data: {
    showtList: '0',
    showSupplier: false,
    shopData: [],
    orderShopList: [],
    oneData: [],
    supplierData: [],
    showdel: false,
    shopAllNum: 0,
    allPrice: 0,
    disabled: false,
  },
  onLoad: function () {
    this.setData({
      showdel: false
    })
  },
  onReady: function () {

  },
  showList: function (e) {//展开或折叠起来某个分类的菜品
    var i = e.currentTarget.dataset.id;
    var up = "shopData[" + i + "].showList"
    this.setData({
      [up]: !this.data.shopData[i].showList
    })
  },
  onShow: function () {
    this.shopCart();
  },
  onPullDownRefresh: function () {
    var _this = this;
    app.netWork.postJson(app.urlConfig.shopCarListUrl, {}).then(res => {
      if (res.errorNo == '0') {
        this.data.shopData = res.data;
        var num = 0;
        var price = 0;
        _this.data.shopData.filter(function (item, index) {//遍历json对象的每个key/value对,p为key
          item.price = 0;
          item.showList = true;
          item.son.filter(function (val, i) {
            num = parseInt(num) + 1;
            price = price + val.offer_price * val.nums;
            item.price += val.offer_price * val.nums;
          })
        })
        _this.setData({
          shopData: _this.data.shopData
        })
        this.setData({
          shopAllNum: num,
          allPrice: price
        })
      }
      wx.stopPullDownRefresh();
    }).catch(res => {
      wx.stopPullDownRefresh();
    })
  },
  shopCart: function () {//购物车列表
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    app.netWork.postJson(app.urlConfig.shopCarListUrl, {}).then(res => {
      if (res.errorNo == '0') {
        _this.data.shopData = res.data;
        var num = 0;
        var price = 0;
        _this.data.shopData.filter(function (item, index) {//遍历json对象的每个key/value对,p为key
          item.price = 0;
          item.showList = true;
          item.son.filter(function (val, i) {
            num = parseInt(num) + 1;
            price = price + val.offer_price * val.nums;
            item.price += val.offer_price * val.nums;
          })
        })
        _this.setData({
          shopData: _this.data.shopData
        })
        this.setData({
          shopAllNum: num,
          allPrice: price
        })
      }
      wx.hideLoading()
    }).catch(res => {
    })
  },

  shopDel: function (e) {//删除某个菜品
    var _this = this;
    var data = {
      keys: JSON.stringify([e.currentTarget.dataset.code]),
      isAll: 0,
    }
    app.netWork.postJson(app.urlConfig.shopCarDelUrl, data).then(res => {
      if (res.errorNo == '0') {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: function () {
            _this.shopCart();
            _this.setData({
              showSupplier: false,
              oneData: [],
              showdel: false,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.errorMsg,
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
      }
    }).catch(res => {
    })


  },
  allShopDel: function () {//删除购物车所有菜品
    var _this = this;
    var data = {
      isAll: 1,
    }
    app.netWork.postJson(app.urlConfig.shopCarDelUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.shopCart();
        wx.showToast({
          title: '清空成功',
          icon: 'success',
          duration: 2000,
          mask: true
        })
      } else {
        wx.showToast({
          title: res.errorMsg,
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
      }
    }).catch(res => {
    })


  },
  shopJian: function (e) {//减号
    var arr = this.data.shopData;
    var flg = e.currentTarget.dataset.flg;
    var i = 0;//子级的索引
    var index = 0;//父级的索引
    var value = e.currentTarget.dataset.item;
    this.data.shopData.filter(function (item, m) {
      if (value.pid == item.pid) {
        item.son.filter(function (val, n) {
          if (val.code == value.code) {
            return index = m, i = n;
          }
        })
      }
    })
    if (value.nums == 1) {
      return
    }
    arr[index].price = arr[index].price - 1 * value.offer_price
    value.nums = parseFloat(value.nums) - 1;
    var up = "shopData[" + index + "].son[" + i + "].nums"; //先用一个变量，把(info[0].gMoney)用字符串拼接起来
    var pirce = "shopData[" + index + "].price";
    this.setData({
      [up]: value.nums,
      [pirce]: arr[index].price
    })
    if (flg == 1) {
      this.setData({
        oneData: value
      })
    }
    // 数量的减处理
    if (value.nums < 0 || value.nums == 0) {
      this.data.shopAllNum = this.data.shopAllNum - 1;
    }
    this.data.allPrice = this.data.allPrice - 1 * value.offer_price
    this.setData({
      shopAllNum: this.data.shopAllNum,
      allPrice: this.data.allPrice
    })
  },
  shopJia: function (e) {//加号
    if (util.authFind('shopcar_update')) { //检验权限
      var arr = this.data.shopData;
      var flg = e.currentTarget.dataset.flg;
      var i = 0;//子级的索引
      var index = 0;//父级的索引
      var value = e.currentTarget.dataset.item;
      this.data.shopData.filter(function (item, m) {
        if (value.pid == item.pid) {
          item.son.filter(function (val, n) {
            if (val.code == value.code) {
              return index = m, i = n;
            }
          })
        }
      })
      if (value.nums < 0 || value.nums == 0) {
        this.data.shopAllNum = this.data.shopAllNum + 1;
      }
      value.nums = parseFloat(value.nums) + 1;
      arr[index].price = arr[index].price + 1 * value.offer_price;
      var up = "shopData[" + index + "].son[" + i + "].nums"; //先用一个变量，把(shopData[0].son[0].nums)用字符串拼接起来
      var pirce = "shopData[" + index + "].price";
      this.setData({
        [up]: value.nums,
        [pirce]: arr[index].price,
        shopAllNum: this.data.shopAllNum
      })
      if (flg == 1) {
        this.setData({
          oneData: value
        })
      }
      this.data.allPrice = this.data.allPrice + value.offer_price * 1
      // 数量的加处理
      this.setData({
        allPrice: this.data.allPrice
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
  changeShop: function (e) {//手动修改数量
      var arr = this.data.shopData;
      var flg = e.currentTarget.dataset.flg;
      var newNum = e.detail.value;
      var i = 0;//子级的索引
      var index = 0;//父级的索引
      var value = e.currentTarget.dataset.item;
      this.data.shopData.filter(function (item, m) {
        if (value.pid == item.pid) {
          item.son.filter(function (val, n) {
            if (val.code == value.code) {
              return index = m, i = n;
            }
          })
        }
      })
      this.data.allPrice = this.data.allPrice + value.offer_price * parseFloat(util.toFix(newNum)  - value.nums)
      value.nums = util.toFix(newNum);
      arr[index].price = arr[index].price + value.offer_price * parseFloat(util.toFix(newNum)  - value.nums);
      var up = "shopData[" + index + "].son[" + i + "].nums"; //先用一个变量，把(shopData[0].son[0].nums)用字符串拼接起来
      var pirce = "shopData[" + index + "].price";
      this.setData({
        [up]: value.nums,
        [pirce]: arr[index].price
      })
      // 数量的加处理
      this.setData({
        allPrice: this.data.allPrice
      })
      if (flg == 1) {
        this.setData({
          oneData: value
        })
      }
  },
  cartUpdateNum: function (item) {//修改购物车的数量接口
    wx.showLoading({
      title: '加载中',
    })
    var arr = [];
    arr.push({
      num: item.nums,
      code: item.code
    })
    var data = {
      info: JSON.stringify(arr)
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.shopCarUpdateUrl, data).then(res => {
      if (res.errorNo == '0') {
        setTimeout(function () {
          wx.hideLoading()
        }, 100)
        _this.shopCart();
      }
    }).catch(res => {
    })
  },
  submitOrder: function () {//提交订单
    if (util.authFind('orderproduct_create')) { //检验权限
      var listData = this.data.shopData;
      var arrList = [];//所有产品
      var arrSupplier = [];//所有产品的所有供应商的id
      var arrClass = []; //分类的
      var arr1 = [];//最终的数据
      listData.filter(function (item, index) {
        arrClass.push({ name: item.name, pid: item.pid })
        item.son.filter(function (val, i) {
          arrSupplier.push(val.supplier_id);
          arrList.push(val);
        })
      })
      var supData = util.unique(arrSupplier); //供应商id数据去重
      supData.filter(function (val, i) {
        arr1.push({
          supplier_id: val,
          supplier_name: '',
          allNum: 0,
          allPrice: 0,
          remarks: '',
          children: [],
          classifly: []
        })
      })
      arrList.filter(function (value, index) {//所有产品去分一下供应商
        arr1.filter(function (item, m) {
          if (value.supplier_id == item.supplier_id) {
            arr1[m].supplier_name = value.supplier_name;
            arr1[m].children.push(value);
            arr1[m].allPrice += value.offer_price * value.nums - 0;
            arr1[m].allNum += 1;
          }
        })
      })
      var res = 0;
      arr1.filter(function (item, index) {
        item.children.filter(function (value, m) {
          arrClass.filter(function (val, n) { //所有供应商下的产品去做分类
            if (val.pid == value.pid) {
              if (item.classifly.length > 0) {
                res = item.classifly.findIndex(function (v, i) {
                  return v.pid = value.pid
                })
                if (res == '-1') {
                  item.classifly.push({
                    name: val.name,
                    pid: val.pid,
                    kindNum: 0,
                    kindPrice: 0,
                    carDetailIsShow: false,
                    children: []
                  })
                  item.classifly[m].kindPrice = item.classifly[m].kindPrice + value.offer_price * value.nums;
                  item.classifly[m].kindNum += 1;
                  item.classifly[m].children.push(value);
                } else {
                  item.classifly[res].kindPrice = item.classifly[res].kindPrice + value.offer_price * value.nums;
                  item.classifly[res].kindNum += 1;
                  item.classifly[res].children.push(value);
                }
              } else {
                item.classifly.push({
                  name: val.name,
                  pid: val.pid,
                  kindNum: 0,
                  kindPrice: 0,
                  carDetailIsShow: false,
                  children: []
                })
                item.classifly[m].kindPrice = item.classifly[m].kindPrice + value.offer_price * value.nums;
                item.classifly[m].kindNum += 1;
                item.classifly[m].children.push(value);
              }
            }
          })
        })

      })
      wx.setStorageSync('shoplist', JSON.stringify(arr1), )
      wx.setStorage({
        key: "shoplist",
        data: JSON.stringify(arr1),
        success: function (res) {
          wx.redirectTo({
            url: '../confirmShoppingCart/confirmShoppingCart'
          })
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
  goOrderList: function () {//去采购
    wx.switchTab({
      url: '../orderList/orderList'
    })
  },
  editBtn: function () {//完成
    app.netWork.postJson(app.urlConfig.shopCarUpdateSupplierUrl, this.data.oneData).then(res => {
      console.log(res)
      if (res.errorNo == '0') {

      }
    }).catch(res => {
    })
    this.setData({
      showSupplier: false,
      oneData: [],
      showdel: false,
    });
    console.log(this.data.oneData)
    // var data = {

    // }

  },
  changeSupplier: function (e) {
      var _this = this;
      var item = e.currentTarget.dataset.item;
      var data = {
        product_id: item.id,
        page: '1',
        page_size: '10',
      }
      // console.log(item)
      app.netWork.postJson(app.urlConfig.productOfferUrl, data).then(res => {
        if (res.errorNo == '0') {
          _this.setData({
            showSupplier: true,
            oneData: item,
            showdel: true,
            supplierData: res.data
          })
          // console.log('购物车供应商列表')
          // console.log(res.data)
        }else{
          _this.setData({
            oneData: item,
          })
        }
      }).catch(res => {
      })
   


  },
  changeSelect: function (e) {//更改供应商
    var _this = this;
    var dataOne = e.currentTarget.dataset.item;
    var oneprice = e.currentTarget.dataset.item.offer_price;
    this.data.supplierData.filter(function (item, i) {
      if (dataOne.id == item.id) {
        _this.data.supplierData[i].is_default = 1;
        _this.data.oneData.supplier_id = item.supplier_id;
        _this.data.oneData.supplier_name = item.supplier_name;
        _this.data.oneData.offer_name = item.offer_name;
        _this.data.oneData.offer_id = item.id;
      } else {
        _this.data.supplierData[i].is_default = 0;
      }
    })
    var j = 0;//父级索引
    var n = 0;//子级索引
    this.data.shopData.filter(function (val, i) {
      val.son.filter(function (value, m) {
        if (_this.data.oneData.id == value.id) {
          return j = i, n = m;
        }
      })
    })
    this.data.shopData[j].price = this.data.shopData[j].price + (oneprice - this.data.oneData.offer_price) * this.data.oneData.nums;
    this.data.allPrice = this.data.allPrice + (oneprice - this.data.oneData.offer_price) * this.data.oneData.nums
    _this.data.oneData.offer_price = oneprice;
    var up = "shopData[" + j + "].son[" + n + "]"; //先用一个变量，把(shopData
    var pirce = "shopData[" + j + "].price";
    this.setData({
      supplierData: this.data.supplierData,
      oneData: this.data.oneData,
      [up]: this.data.oneData,
      [pirce]: this.data.shopData[j].price,
      allPrice: this.data.allPrice
    })
  }


})