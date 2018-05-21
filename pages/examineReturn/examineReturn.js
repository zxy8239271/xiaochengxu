var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    Module: '',
    goods: [],
    returnGoods:[]
  
  },
  onLoad: function (options) {
    var _this=this;
    this.data.Module = options.Module;
    this.setData({
      goods: JSON.parse(options.item)
    })
    console.log(options)
    var data = {
      order_sn: this.data.goods.order_sn,
      // order_product_id: this.data.goods.id,
      // 从退换/售后进入时商品详情有order_product_id字段，而从全部--订单详情位置进入时id对应order_product_id
      order_product_id: this.data.goods.order_product_id || this.data.goods.id ,
      Module:options.Module
    }
    // 请求退货后的操作种类
    app.netWork.postJson(app.urlConfig.orderreturnUrl, data).then(res => {
      if (res.errorNo == '0') {
        var arr=res.data;
        // console.log(arr.status)
        console.log(res.data)
        if (arr.status =='reject'){
          arr.agree_num=arr.num;
        }
        if (arr.status = 'rejecting') {
          arr.true_num = arr.agree_num;
        }
        _this.setData({
          returnGoods:arr
        })
      }
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onReady: function () {

  },
  showReason: function () {//退货原因 的点击
    this.setData({
      isShow: true
    })
  },
  showClose: function () {//关闭
    this.setData({
      isShow: false
    })
  },
  changeReason: function (e) {//选择退货的理由
    console.log(e)
    this.setData({
      reason_msg: e.currentTarget.dataset.item.reason_msg,
      reason_key: e.currentTarget.dataset.item.reason_key,
    })
  },
  numBlur: function (e) {//退货数量的填写
    var up = 'returnGoods.agree_num'
  
    if (e.detail.value > this.data.goods.num) {
      wx.showToast({
        title: '退货量不能大于订购量',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      this.setData({
        [up]: this.data.goods.num
      })
      return;
    } else if (e.detail.value <= 0) {
      wx.showToast({
        title: '退货量不能小于零',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      this.setData({
        [up]: 1
      })
      return;
    }
    this.setData({
      [up]: e.detail.value
    })
  },
  numTrueBlur:function(e){
    var up = 'returnGoods.true_num'
    console.log(this.data.goods)
    if (e.detail.value > this.data.returnGoods.agree_num) {
      wx.showToast({
        title: '退货量不能大于订购量',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      this.setData({
        [up]: this.data.returnGoods.agree_num
      })
      return;
    } else if (e.detail.value <= 0) {
      wx.showToast({
        title: '退货量不能小于零',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      this.setData({
        [up]: 1
      })
      return;
    }
    this.setData({
      [up]: e.detail.value
    })
  },
  reasonDescBlur: function (e) {
    this.setData({
      reason_desc: e.detail.value
    })
  },
  imgUpload: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        console.log(_this.data.tempFilePaths)
      }
    })
  },
  // 退货
  submitBtn: function (e) {//提交
    var action = e.currentTarget.dataset.item.act;
    console.log(action)
    var data = {
      order_sn: this.data.goods.order_sn,
      // order_sub_id: this.data.goods.id,
      order_sub_id: this.data.goods.order_product_id || this.data.goods.id  ,
      Module: this.data.Module,
      order_return_id: this.data.returnGoods.id
    }
    wx.showLoading({
      title: '加载中...',
    })
    var _this = this;
    if (action == 'rejecting') {//同意退货
    console.log("同意退货")
    data.agree_num = this.data.returnGoods.agree_num;
      app.netWork.postJson(app.urlConfig.rejectingUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
         wx.redirectTo({
              url: '../orderSingleDetail/orderSingleDetail?Module=' + _this.data.Module + '&orderId=' + _this.data.goods.order_sn
            })
          }, 2000)
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }).catch(res => {
        console.log("订单详情")
      })
    } else if (action == 'disagree') {//拒绝退货
    console.log("拒绝退货")
      app.netWork.postJson(app.urlConfig.DisagreeUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../orderSingleDetail/orderSingleDetail?Module=' + _this.data.Module + '&orderId=' + _this.data.goods.order_sn
            })
          }, 2000)

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }).catch(res => {
        console.log("订单详情")
      })
    } else if (action == 'rejectinfo') {
      wx.redirectTo({
        url: '../examineReturn/examineReturn?Module=' + _this.data.Module + '&orderId=' + _this.data.goods.order_sn
      })
    } else if (action == 'rejected') {
      data.true_num = this.data.returnGoods.true_num;
      // 退货完成
      app.netWork.postJson(app.urlConfig.rejectedUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'success', 
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../orderSingleDetail/orderSingleDetail?Module=' + _this.data.Module + '&orderId=' + _this.data.goods.order_sn
            })
          }, 2000)

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }).catch(res => {
        console.log("订单详情")
      })
    }
  }
})