var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    isShow: false,
    Module: '',
    goods: [],
    num: 1,
    id:'',
    reason_msg: '多拍',
    reason_key: '0',
    reason_desc: '',
    tempFilePaths: '',
    returnGoods:[],
    imgSrc:'',
    reasonList: [{ reason_key: '0', reason_msg: '多拍' }, { reason_key: '1', reason_msg: '错拍' }, { reason_key: '2', reason_msg: '不想要了' }, { reason_key: '3', reason_msg: '商品损坏' }, { reason_key: '4', reason_msg: '商品过期' }, { reason_key: '5', reason_msg: '其他' }]
  },
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    this.data.Module = options.Module;
    this.setData({
      goods: JSON.parse(options.item),
      num: JSON.parse(options.item).real_num > 0 ? JSON.parse(options.item).real_num : JSON.parse(options.item).num
    })

    console.log("没进if")
    // console.log(options)
    var status = this.data.goods.composite_status || this.data.goods.status 
    if (status == 'reject' || status == 'rejecting'||status == 'rejected') {
      var data = {
        order_sn: this.data.goods.order_sn,
        order_product_id: this.data.goods.order_product_id || this.data.goods.id,
        Module: this.data.Module
      }
      app.netWork.postJson(app.urlConfig.orderreturnUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {

          _this.setData({
            returnGoods:res.data,
            num: res.data.num,
            reason_msg: res.data.reason_msg,
            reason_key: res.data.reason_key,
            reason_desc: res.data.reason_desc,
            tempFilePaths: res.data.img,
            id: res.data.id
          })
        }
      })
    }
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
  numInput:function(e){
    this.data.num = e.detail.value ;  
  },
  numBlur: function (e) {//退货数量的填写
  
    if (e.detail.value > this.data.num) {
      wx.showToast({
        title: '退货量不能大于订购量',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      this.setData({
        num: this.data.num
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
        num: 1
      })
      return;
    } else {
      this.setData({
        num: e.detail.value
      })
    }

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
          tempFilePaths: res.tempFilePaths[0]
        })
        console.log(_this.data.tempFilePaths)
      }
    })
  },
  submitBtn: function () {//提交
    wx.showLoading({
      title: '加载中...',
    })
    var _this = this;
    
    if (this.data.goods.operate_list[0].act == 'reject') {

      var dataJson = {
        order_sn: this.data.goods.order_sn,
        order_product_id: this.data.goods.product_id,
        order_sub_id: this.data.goods.id,
        num: this.data.num,
        Module: this.data.Module,
        reason_key: this.data.reason_key,
        reason_msg: this.data.reason_msg,
        reason_desc: this.data.reason_desc,
      
      }
      if (this.data.tempFilePaths){
        app.netWork.upload_file(app.urlConfig.uploadImg, this.data.tempFilePaths, {}, 'thumb').then(res => {
          // console.log(res.data)
          var res=JSON.parse(res);
          _this.data.imgSrc = res.data;
          dataJson.img = res.data ;
          console.log(dataJson)
          app.netWork.postJson(app.urlConfig.oneGoodsRejectUrl, dataJson).then(res => {
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

            }
          }).catch(res => {
            console.log("订单详情")
          })
          if (res.errorNo == '0') {
          }
        }).catch(res => {
          console.log("上传图片")
        })
      }else{
        dataJson.img = '';
        console.log(dataJson)
        app.netWork.postJson(app.urlConfig.oneGoodsRejectUrl, dataJson).then(res => {
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

          }
        }).catch(res => {
          console.log("订单详情")
        })
      }

      
    } else if (this.data.goods.operate_list[0].act == 'cancelReturn') {
      var data = {
        order_sn: this.data.goods.order_sn,
        order_sub_id: this.data.goods.id,
        num: this.data.num,
        order_return_id: this.data.id,
        Module: this.data.Module
      }

      app.netWork.postJson(app.urlConfig.cancelReturnUrl, data).then(res => {
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

        }
      }).catch(res => {
        console.log("取消退货")
      })
    }

  }
})