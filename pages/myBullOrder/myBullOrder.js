var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    windowHeight: 0,
    hidden: true,
    hasMore: false,
    tabs: [{ name: "全部", id: '' }, { name: "待接单", id: 'taking' }, { name: "待发货", id: 'preparing' }, { name: "待收货", id: 'receiving' }, { name: "退换/售后", id: 'reject' }],
    activeIndex: '',
    sliderOffset: 0,
    sliderLeft: 0,
    tabWidth: 0,
    sizePage: 1,
    orderData: [],
    rejectData:[],
    clientX: 0,
    clientY: 0,
    startTime: 0,
    startOffsetTop: 0,
    top: 0,
  },
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: '我是买家'
    });
    var that = this;
    this.data.orderType = options.type;
    if (options.status == null) {
      this.setData({
        activeIndex: this.data.activeIndex,
      })
    } else {
      this.setData({
        activeIndex: options.status,
      })
    }

    var i = 0;
    this.data.tabs.filter(function (item, index) {
      if (that.data.activeIndex == item.id) {
        return i = index
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / that.data.tabs.length) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * i,
          tabWidth: res.windowWidth / that.data.tabs.length
        });
      }
    });
  },
  tabClick: function (e) {//切换
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.dataset.id,
      hasMore: true,
      top: 0
    });
    this.data.sizePage = 1;
    if (this.data.activeIndex == 'reject') {
      this.orderReturn();
    } else {
      this.orderList();
    }

  },
  onReady: function () {
    // 
  },
  onShow: function () {
    // 页面显示
    this.data.sizePage = 1;
    if (this.data.activeIndex == 'reject') {
      this.orderReturn();
    } else {
      this.orderList();
    }

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    wx.switchTab({
      url: '../homePage/homePage',
    })
  },
  orderReturn: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      page: this.data.sizePage,
      page_size: 10,
      Module: this.data.orderType
    }
    app.netWork.postJson(app.urlConfig.orderReturnUrl, data).then(res => {
      if (res.errorNo == '0') {
        that.setData({
          rejectData: res.data
        });
        wx.hideLoading();
        if (res.total <= 10 || res.total == 0) {
          that.setData({
            hasMore: false,
          });
        } else {
          that.setData({
            hasMore: true,
          });
        }
      }
    }).catch(res => {
      console.log("订单列表失败")
    })
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {

    this.data.sizePage = 1;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    if (this.data.activeIndex == 'reject') {
      var data = {
        page: this.data.sizePage,
        page_size: 10,
        Module: this.data.orderType
      }
      app.netWork.postJson(app.urlConfig.orderReturnUrl, data).then(res => {
        if (res.errorNo == '0') {
          that.setData({
            rejectData: res.data
          });
          if (res.total <= 10 || res.total == 0) {
            that.setData({
              hasMore: false,
            });
          } else {
            that.setData({
              hasMore: true,
            });
          }

        }
        wx.hideLoading();
        wx.stopPullDownRefresh();

      }).catch(res => {
        // console.log("订单列表失败")
      })
    } else {
      var data = {
        page: this.data.sizePage,
        page_size: 10,
        composite_status: this.data.activeIndex,
        Module: this.data.orderType
      }
      app.netWork.postJson(app.urlConfig.orderinfoListUrl, data).then(res => {
        if (res.errorNo == '0') {
          that.setData({
            orderData: res.data
          });
          if (res.total <= 10 || res.total == 0) {
            that.setData({
              hasMore: false,
            });
          } else {
            that.setData({
              hasMore: true,
            });
          }

        }
        wx.hideLoading();
        wx.stopPullDownRefresh();

      }).catch(res => {
        // console.log("订单列表失败")
      })
    }


  },
  loadMore: function (e) {  //加载更多
    if (!this.data.hasMore) return
    this.data.sizePage++;
    wx.showLoading({
      title: '加载中',
    })
    // 
    var that = this;
    if (this.data.activeIndex == 'reject') {
      var data = {
        page: parseInt(this.data.sizePage),
        page_size: 10,
        Module: this.data.orderType
      }
      var allArr = [];
      app.netWork.postJson(app.urlConfig.orderReturnUrl, data).then(res => {
        if (res.errorNo == '0') {
          wx.hideLoading();
          allArr = that.data.rejectData.concat(res.data);
          that.setData({
            rejectData: allArr
          });
         
          if (that.data.rejectData.length ==res.total) {
            that.setData({
              hasMore: false,
            });
          }
        }
      }).catch(res => {
        wx.hideLoading();
        console.log("订单列表失败")
      })
    }else{
      var data = {
        page: parseInt(this.data.sizePage),
        page_size: 10,
        composite_status: this.data.activeIndex,
        Module: this.data.orderType
      }
      var allArr = [];
      app.netWork.postJson(app.urlConfig.orderinfoListUrl, data).then(res => {
        if (res.errorNo == '0') {
          wx.hideLoading();
          allArr = that.data.orderData.concat(res.data);
          that.setData({
            orderData: allArr
          });
          
          if (that.data.orderData.length ==res.total) {
            that.setData({
              hasMore: false,
            });
          }
        }
      }).catch(res => {
        wx.hideLoading();
        console.log("订单列表失败")
      })
    }
  
  },
  orderList: function () {//订单列表
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      page: this.data.sizePage,
      page_size: 10,
      composite_status: this.data.activeIndex,
      Module: this.data.orderType
    }
    app.netWork.postJson(app.urlConfig.orderinfoListUrl, data).then(res => {
      if (res.errorNo == '0') {
        that.setData({
          orderData: res.data
        });
        wx.hideLoading();
        if (res.total <= 10 || res.total == 0) {
          that.setData({
            hasMore: false,
          });
        } else {
          that.setData({
            hasMore: true,
          });
        }
      }
    }).catch(res => {
      console.log("订单列表失败")
    })
  },
  orderTaking: function (e) {//订单下按钮的状态
    var action = e.currentTarget.dataset.value.act;
    var _this = this;
    var data = {
      order_sn: e.currentTarget.dataset.orderid,
      act: action,
      Module: this.data.orderType,
    }
    if (action == 'confirm') {//买家 待审核
      app.netWork.postJson(app.urlConfig.orderApproveUrl, data).then(res => {
        if (res.errorNo == '0') {
          wx.showToast({
            title: res.errorMsg,
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function () {
              _this.orderList()
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


    } else if (action == 'cancel') {//买家 取消订单
      wx.showModal({
        title: '取消订单确认',
        content: '您确认要取消订单吗？',
        confirmText: '确认取消',
        success: function (res) {
          if (res.confirm) {
            app.netWork.postJson(app.urlConfig.orderCancelUrl, data).then(res => {
              if (res.errorNo == '0') {
                wx.showToast({
                  title: res.errorMsg,
                  icon: 'success',
                  duration: 2000,
                  mask: true,
                  success: function () {
                    _this.orderList()
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


    } else if (action == 'receiveAll') {//买家--确认收货操作
      wx.showModal({
        title: '整单确认',
        content: '整单确认表示您确认收到的货品与卖家发出的数量完全一致，请谨慎操作，如部分产品不一致，请执行单个产品认。',
        confirmText: '整单确认',
        success: function (res) {
          if (res.confirm) {
            data.son_ordersn = e.currentTarget.dataset.orderid;
            app.netWork.postJson(app.urlConfig.orderReceiveAllUrl, data).then(res => {
              // console.log(res)
              if (res.errorNo == '0') {
                wx.showToast({
                  title: res.errorMsg,
                  icon: 'success',
                  duration: 2000,
                  mask: true,
                  success: function () {
                    _this.orderList()
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
    } else if (action == 'receiveSec') {//买家---逐个确认收货

      util.navTo({
        url: '../partGetGoods/partGetGoods?orderId=' + e.currentTarget.dataset.orderid + '&Module=' + this.data.orderType + '&action=' + action,
      })
    } else if (action == 'reject') {//买家--退货
      util.navTo({
        url: '../orderSingleDetail/orderSingleDetail?orderId=' + e.currentTarget.dataset.orderid + '&Module=' + this.data.orderType + '&action=' + action
      })
    } else if (action == 'openagain') {//买家--再次下单    分为 卖家拒绝的 再次下单 和  已完成的再次下单
      data.son_ordersn = e.currentTarget.dataset.orderid;
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
    }
  },
  goInfo: function (e) {
    util.navTo({
      url: '../orderSingleDetail/orderSingleDetail?orderId=' + e.currentTarget.dataset.orderid + '&Module=' + this.data.orderType + '&action=',
    })
  },
  callPhone: function (e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  goReturn: function (e) {//退货详情

    // util.navTo({
    //   url: '../returnGoods/returnGoods?Module=' + this.data.Module + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
    // })

    util.navTo({
      url: '../returnGoods/returnGoods?Module=' + this.data.orderType + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  }
})