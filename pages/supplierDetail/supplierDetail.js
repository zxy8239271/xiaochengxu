var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    supplierDetail: [],
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/full_star.png',
    selectedSrc: '../../images/full_star.png',
    halfSrc: '../../images/full_star.png',
    key: 4.5,//评分

  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '供应商详情'
    });
  },
  onLoad: function (options) {
    console.log(options)
    this.supplierInfo(options.id)
  },
  supplierInfo: function (id) {
    var _this = this;
    var dataJson = {
      id: id
    }
    app.netWork.postJson(app.urlConfig.supplierInfoUrl, dataJson).then(res => {//供应商详情
      console.log(res)
      if (res.errorNo == '0') {
        _this.setData({
          supplierDetail: res.data
        })
        console.log(this.data.supplierDetail)
      }
    }).catch(res => {

    })
  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  startRating: function (e) {
    wx.showModal({
      title: '分数',
      content: "" + count,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  delSupplier: function (e) {//删除供应商
    var _this = this;
    if (util.authFind('supplier_delete')) {
      wx.showModal({
        title: '删除确认',
        content: '确认删除"' + this.data.supplierDetail.name + '"供应商吗?删除后您将无法采购该供应商任何产品，请谨慎操作',
        confirmText: '确认删除',
        success: function (res) {
          if (res.confirm) {
            var dataJson = {
              id: e.currentTarget.dataset.item.supplier_id,
              status: 1,   //0正常1删除
            }
            app.netWork.postJson(app.urlConfig.supplierDelUrl, dataJson).then(res => {//供应商详情
              if (res.errorNo == '0') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true,
                  success: function () {
                    wx.switchTab({
                      url: '../supplier/supplier'
                    })
                  }
                })
              } else {

                wx.showToast({
                  title: res.errorMsg,
                  duration: 2000,
                  mask: true,
                })
              }
            }).catch(res => {

            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '暂无权限',
        images: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  selSupplier: function (e) {//设为优选
    var _this = this;
    if (util.authFind('productoffer_defaultSupplier')) {
      var dataJson = {
        id: e.currentTarget.dataset.item.supplier_id
      }
      app.netWork.postJson(app.urlConfig.supplierInfoUrl, dataJson).then(res => {//供应商详情
        console.log(res)
        if (res.errorNo == '0') {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              _this.supplierInfo(e.currentTarget.dataset.item.supplier_id)
            }
          })
        }
      }).catch(res => {

      })
    } else {
      wx.showToast({
        title: '暂无权限',
        images: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  stopSupplier: function (e) {//暂停合作
    var _this = this;
    if (util.authFind('supplier_stop')) {
      if (e.currentTarget.dataset.item.is_black == 0) {
        wx.showModal({
          title: '暂停合作确认',
          content: '暂停和该供应商合作后，您下次下单将不再分配此订单，请谨慎操作。',
          cancelText: '取消',
          confirmText: '确认暂停',
          success: function (res) {
            if (res.confirm) {
              var dataJson = {
                id: e.currentTarget.dataset.item.supplier_id,
                status: 1,  //	状态 0: 正常 1：停止合作
              }
              app.netWork.postJson(app.urlConfig.supplierStopUrl, dataJson).then(res => {//供应商详情
                console.log(res)
                if (res.errorNo == '0') {

                  _this.supplierInfo(e.currentTarget.dataset.item.supplier_id)
                } else {
                  wx.showToast({
                    title: res.errorMsg,
                    duration: 2000,
                    mask: true,
                  })
                }
              }).catch(res => {

              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '恢复合作确认',
          content: '恢复合作后，您下次下单将可以分配订单给该供应商。',
          cancelText: '取消',
          confirmText: '确认恢复',
          success: function (res) {
            if (res.confirm) {
              var dataJson = {
                id: e.currentTarget.dataset.item.supplier_id,
                status: 0,  //	状态 0: 正常 1：停止合作
              }
              app.netWork.postJson(app.urlConfig.supplierStopUrl, dataJson).then(res => {//供应商详情
                console.log(res)
                if (res.errorNo == '0') {
                  _this.supplierInfo(e.currentTarget.dataset.item.supplier_id)
                }
              }).catch(res => {

              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }



    } else {
      wx.showToast({
        title: '暂无权限',
        images: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone   //仅为示例，并非真实的电话号码
    })
  }
})