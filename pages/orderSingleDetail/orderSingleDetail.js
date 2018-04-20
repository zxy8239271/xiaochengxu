var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    orderNo: '',
    Module: '',
    orderSigleData: [],
    action: ''
 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.action) {
      this.setData({
        action: options.action
      })
    }
    this.setData({
      orderNo: options.orderId,
      Module: options.Module
    })
    // console.log(this.data.orderNo)
    this.orderListData();
  },
  orderListData: function () {//订单详情
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      order_sn: this.data.orderNo,
      Module: this.data.Module
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.orderDetailUrl, data).then(res => {
      console.log(res)
      if (res.errorNo == '0') {
        _this.setData({
          orderSigleData: res.data,
        })
        wx.hideLoading()
      }
    }).catch(res => {
      console.log("订单详情")
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(111)

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {//

  },
  singleBtn: function (e) {
    var _this = this;
    var action = e.currentTarget.dataset.val.act;
    var data = {
      order_sn: this.data.orderNo,
      Module: this.data.Module,
      act: action
    }
    if (this.data.Module == 'wapSupplier') {//我是卖家
      if (action == 'takingAll') {//整单接单
        if (util.authFind('orderinfo_taking')) { //检验权限
          wx.showModal({
            title: '整单接单',
            content: '整单接单意味着您承诺为门店配送订单里所有商品，并按照要求的时间送达',
            confirmText: '确认接单',
            success: function (res) {
              if (res.confirm) {
                app.netWork.postJson(app.urlConfig.takingOrderUrl, data).then(res => {
                  console.log(res)
                  if (res.errorNo == '0') {
                    wx.showToast({
                      title: res.errorMsg,
                      icon: 'success',
                      duration: 2000,
                      mask: true,
                      success: function () {
                        _this.orderListData()
                      }
                    })
                  } else {
                    wx.showToast({
                      title: res.errorMsg,
                      icon: 'none',
                      duration: 2000,
                      mask: true
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
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

      } else if (action == 'unTaking') {//整单拒单
        if (util.authFind('orderinfo_taking')) { //检验权限
          wx.showModal({
            title: '整单拒单确认',
            content: '您是否要拒绝客户的订单？请注意，拒绝用户订单可能造成用户流失，请提前和客户沟通后再行操作。',
            confirmText: '确认拒绝',
            success: function (res) {
              if (res.confirm) {
                app.netWork.postJson(app.urlConfig.takingOrderUrl, data).then(res => {
                  console.log(res)
                  if (res.errorNo == '0') {
                    wx.showToast({
                      title: res.errorMsg,
                      icon: 'success',
                      duration: 2000,
                      mask: true,
                      success: function () {
                        _this.orderListData()
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
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
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
      } else if (action == 'TakingSec') {//部分接单
        if (util.authFind('orderinfo_partTaking')) { //检验权限
          util.navTo({
            url: '../partGetGoods/partGetGoods?orderId=' + this.data.orderNo + '&Module=' + this.data.Module + '&action=' + action
          })
        } else {
          wx.showToast({
            title: '暂无权限',
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        }
      } else if (action = 'prepare') {//发货操作
        if (util.authFind('orderinfo_prepare')) { //检验权限


          app.netWork.postJson(app.urlConfig.orderPrepareUrl, data).then(res => {
            console.log(res)
            if (res.errorNo == '0') {
              wx.showToast({
                title: res.errorMsg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: function () {
                  _this.orderListData()
                }
              })
            } else {
              wx.showToast({
                title: res.errorMsg,
                icon: 'none',
                duration: 2000,
                mask: true
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

      } else {

      }
    } else if (this.data.Module == 'wapUser') {//我是买家
      if (action == 'confirm') {//买家 待审核
        if (util.authFind('shopcar_approve')) { //检验权限
          app.netWork.postJson(app.urlConfig.orderApproveUrl, data).then(res => {
            console.log(res)
            if (res.errorNo == '0') {
              wx.showToast({
                title: res.errorMsg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: function () {
                  _this.orderListData()
                }
              })
            } else {
              wx.showToast({
                title: res.errorMsg,
                icon: 'none',
                duration: 2000,
                mask: true
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

      } else if (action == 'cancel') {//买家 取消订单
        if (util.authFind('shopcar_cancel')) { //检验权限

          wx.showModal({
            title: '取消订单确认',
            content: '您确认要取消订单吗？',
            confirmText: '确认取消',
            success: function (res) {
              if (res.confirm) {
                app.netWork.postJson(app.urlConfig.orderCancelUrl, data).then(res => {
                  console.log(res)
                  if (res.errorNo == '0') {
                      wx.showToast({
                        title: res.errorMsg,
                        icon: 'success',
                        duration: 2000,
                        mask: true,
                        success: function () {
                          _this.orderListData()
                        }
                      })
                  } else {
                    wx.showToast({
                      title: res.errorMsg,
                      icon: 'none',
                      duration: 2000,
                      mask: true
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
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
      } else if (action == 'receiveAll') {//买家--确认收货操作
        if (util.authFind('orderinfo_receiveAll')) { //检验权限
          data.son_ordersn = e.currentTarget.dataset.orderid;
          app.netWork.postJson(app.urlConfig.orderReceiveAllUrl, data).then(res => {
            console.log(res)
            if (res.errorNo == '0') {
              wx.showToast({
                title: res.errorMsg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: function () {
                  _this.orderListData()
                }
              })
            } else {
              wx.showToast({
                title: res.errorMsg,
                icon: 'none',
                duration: 2000,
                mask: true
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

      } else if (action == 'receiveSec') {//买家---逐个确认收货
        if (util.authFind('orderinfo_receiveSec')) { //检验权限
          util.navTo({
            url: '../partGetGoods/partGetGoods?orderId=' + this.data.orderNo + '&Module=' + this.data.Module + '&action=' + action
          })
        } else {
          wx.showToast({
            title: '暂无权限',
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        }
      } else if (action == 'reject') {//买家--退货
        if (util.authFind('orderinfo_reject')) { //检验权限
          util.navTo({
            url: '../orderSingleDetail/orderSingleDetail?orderId=' + this.data.orderNo + '&Module=' + this.data.Module + '&action=' + action
          })
        } else {
          wx.showToast({
            title: '暂无权限',
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        }

      } else if (action == 'openagain') {//买家--再次下单    分为 卖家拒绝的 再次下单 和  已完成的再次下单
        if (util.authFind('orderinfo_openagain')) { //检验权限
          data.son_ordersn = this.data.orderNo;
          app.netWork.postJson(app.urlConfig.orderAgainUrl, data).then(res => {
            if (res.errorNo == '0') {
              wx.showToast({
                title: res.errorMsg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: function () {
                  util.navTo({
                    url: '../shoppingCart/shoppingCart'
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.errorMsg,
                icon: 'none',
                duration: 2000,
                mask: true
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
      }
    } else {//既不是卖家也不是买家  进入路径非法
      wx.showToast({
        title: '进入路径非法',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
 
  tuiHuoBtn: function (e) {//单个商品退货按钮
    if (this.data.Module == "wapUser") {//买家
      util.navTo({
        url: '../returnGoods/returnGoods?Module=' + this.data.Module + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
      })
    } else if (this.data.Module == "wapSupplier") {
      util.navTo({
        url: '../examineReturn/examineReturn?Module=' + this.data.Module + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
      })
    }
  },
  call: function () {//拨打电话
    wx.makePhoneCall({
      phoneNumber: this.data.orderSigleData.phone
    })
  }
})