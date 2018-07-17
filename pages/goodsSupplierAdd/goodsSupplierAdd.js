var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    id: '',
    code: '',
    name: '',
    price: 1,//价格
    supply_price:1,//门店价格
    standard: 20,//规格说明
    remarks: '',//备注
    supplierIndex: 0,//供应商
    supplierArray: [],
    selSupplierPid: [],
    unitData: [],//所用到的单位的集合
    unitArray: [],//单位选择的数组
    unitIndex: [0, 0],
    selUnitPid: [],
    // systemUnitArray: [],//系统单位
    // systemUnitIndex: [0, 0],
    // sysUnitPid: [],
    // receiptArray: [],//收货单位
    // receiptIndex: [],
    // selReceiptPid: [],
    showMore: false,
    isStorePrice:false

  },
  // 没有供应商数据的时候跳转到邀请供应商页面
  toCodePage: function () {
    var openId = wx.getStorageSync('openId')
    util.navTo({
      url: "../codePage/codePage?id=0&openId=" + openId
    })

  },
  onLoad: function (options) {
    if (app.loginInfoData.company_type=='1'){// 1、连锁公司    0 非连锁
      if (app.loginInfoData.scope == 'store' && app.loginInfoData.scope.store_id >0 ){
        this.setData({
          isStorePrice: false
        })
      }else{
        this.setData({
          isStorePrice: true
        })
      } 
    }
    this.data.id = options.id;
    this.data.code = options.code;
    this.setData({
      name: options.name,
      showMore: false
    })
    this.supplierList();//请求供应商列表
    this.goodsClass();
  },
  priceInput: function (e) {//采购价格
    if (this.data.price.length >= 9) {
      wx.showToast({
        title: '价格长度不能大于8位数',
      })
      return
    }
    this.data.price = e.detail.value;
  },
  supplyPriceInput:function(e){
    if (this.data.supply_price.length >= 9) {
      wx.showToast({
        title: '门店价格长度不能大于8位数',
      })
      return
    }
    this.data.supply_price = e.detail.value;
  },
  supplierList: function () {//供应商列表
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var data = {
      status: 0
    }
    app.netWork.postJson(app.urlConfig.supplierListUrl, data).then(res => {
      if (res.errorNo == '0' && res.data.length != 0) {
        _this.setData({
          supplierArray: res.data,
          selSupplierPid: res.data[0]
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      } else {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    }).catch(res => {
      console.log("供应商列表")

    })
  },
  bindSupplierChange: function (e) {//供应商的选择确认按钮
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selSupplierPid: this.data.supplierArray[e.detail.value]
    })
  },

  goodsClass: function () {//单位
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    app.netWork.postJson(app.urlConfig.getUnitUrl, {}).then(res => {//单位接口的请求
      if (res.errorNo == '0') {
        _this.data.unitData = res.data;
        const urlList = res.data.map((item, index) => ({
          base_id: item.base_id,
          category: item.category,
          id: item.id,
          name: item.name
        }))
        _this.data.unitArray.push(urlList)
        if (res.data[0].son) {
          _this.data.unitArray.push(res.data[0].son)
        } else {

        }
        var arr = []
        arr[0] = _this.data.unitArray[0][0];
        arr[1] = _this.data.unitArray[1][0];
        // console.log(_this.data.selUnitPid)
        _this.setData({
          unitArray: _this.data.unitArray,//已进入页面默认的单位
          selUnitPid: arr,
          systemUnitArray: _this.data.unitArray,//已进入页面默认的单位
          sysUnitPid: arr,
          receiptArray: _this.data.unitArray,
          selReceiptPid: arr
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      } else {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    })
  },
  bindUnitColumnChange: function (e) {//单位修改事件
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      unitArray: this.data.unitArray,
      unitIndex: this.data.unitIndex
    };
    data.unitIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      if (this.data.unitData[e.detail.value].son) {
        data.unitArray[1] = this.data.unitData[e.detail.value].son;
      } else {
        data.unitArray[1] = []
      }
    }

    this.setData(data);

  },
  bindUnitChange: function (e) {//单位修改完成事件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var m = e.detail.value[0],
      n = e.detail.value[1];
    this.data.selUnitPid[0] = this.data.unitArray[0][m];
    if (this.data.unitData[m].son) {
      this.data.selUnitPid[1] = this.data.unitArray[1][n]
    } else {
      this.data.selUnitPid.splice(1, 1)
    }
    this.setData({
      selUnitPid: this.data.selUnitPid
    })
  },
  // systemUnitColumnChange: function (e) {//采购系统修改事件
  //   var data = {
  //     systemUnitArray: this.data.systemUnitArray,
  //     systemUnitIndex: this.data.systemUnitIndex
  //   };
  //   data.systemUnitIndex[e.detail.column] = e.detail.value;
  //   if (e.detail.column == 0) {
  //     data.systemUnitIndex[1] = 0;
  //     if (this.data.unitData[e.detail.value].son) {
  //       data.systemUnitArray[1] = this.data.unitData[e.detail.value].son;
  //     } else {
  //       data.systemUnitArray[1] = []
  //     }
  //   }

  //   this.setData(data);
  // },
  // systemUnitChange: function (e) {//采购系统完成事件
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   var m = e.detail.value[0],
  //     n = e.detail.value[1];
  //   this.data.sysUnitPid[0] = this.data.systemUnitArray[0][m];
  //   if (this.data.unitData[m].son) {
  //     this.data.sysUnitPid[1] = this.data.systemUnitArray[1][n]
  //   } else {
  //     this.data.sysUnitPid.splice(1, 1)
  //   }
  //   this.setData({
  //     sysUnitPid: this.data.sysUnitPid
  //   })
  // },
  // receiptArray: [],//收货单位
  // receiptIndex: [],
  // selReceiptPid: [],
  // receiptUnitColumnChange: function (e) {//采购系统修改事件
  //   var data = {
  //     receiptArray: this.data.receiptArray,
  //     receiptIndex: this.data.receiptIndex
  //   };
  //   data.receiptIndex[e.detail.column] = e.detail.value;
  //   if (e.detail.column == 0) {
  //     data.receiptIndex[1] = 0;
  //     if (this.data.unitData[e.detail.value].son) {
  //       data.receiptArray[1] = this.data.unitData[e.detail.value].son;
  //     } else {
  //       data.receiptArray[1] = []
  //     }
  //   }

  //   this.setData(data);
  // },
  // receiptUnitChange: function (e) {//采购系统完成事件
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   var m = e.detail.value[0],
  //     n = e.detail.value[1];
  //   this.data.selReceiptPid[0] = this.data.receiptArray[0][m];
  //   if (this.data.unitData[m].son) {
  //     this.data.selReceiptPid[1] = this.data.receiptArray[1][n]
  //   } else {
  //     this.data.selReceiptPid.splice(1, 1)
  //   }
  //   this.setData({
  //     selReceiptPid: this.data.selReceiptPid
  //   })
  // },
 
  // standardBlur: function (e) {
  //   this.setData({
  //     standard: e.detail.value
  //   })
  // },
  // remarksBlur: function (e) {
  //   this.setData({
  //     remarks: e.detail.value
  //   })
  // },
  saveBtn: function () {//保存
      if (!this.data.selSupplierPid) {
        wx.showToast({
          title: '请选择供应商',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return
      }
      if (this.data.price <= 0) {
        wx.showToast({
          title: '采购价格应大于0元',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return
      }
      if (this.data.supply_price <= 0) {
        wx.showToast({
          title: '门店价格应大于0元',
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return
      }
    if (app.loginInfoData.company_type == '0') {
      this.data.price = this.data.supply_price;
    }
      var _this = this;
      var data = {
        product_id: this.data.id,
        product_code: this.data.code,
        supplier_id: this.data.selSupplierPid.supplier_id,
        supplier_name: this.data.selSupplierPid.name,
        offer_price: this.data.price,
        supply_price: this.data.supply_price,
        base_unit: this.data.sysUnitPid[1].id,
        offer_unit: this.data.selUnitPid[1].id,
        // receive_unit: this.data.selReceiptPid[1].id,
        // standard: this.data.standard,
        // remarks: this.data.remarks
      }
      wx.showLoading({
        title: '加载中',
      })
      app.netWork.postJson(app.urlConfig.productAddOfferUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {
          wx.hideLoading()
          wx.redirectTo({
            url: '../goodsSupplier/goodsSupplier?id=' + this.data.id + "&code=" + this.data.code + "&name=" + this.data.name,
          });
       } else {

          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        }
      })
  },
})