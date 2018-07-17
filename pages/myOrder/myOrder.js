var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    windowHeight: 0,
    hidden: true,
    hasMore: false,
    tabs: [{ name: "全部", id: '' }, { name: "待接单", id: 'taking' }, { name: "待配货", id: 'preparing' }, { name: "待收货", id: 'receiving' }, { name: "退换/售后", id: 'reject' }],
    activeIndex: '',
    sliderOffset: 0,
    sliderLeft: 0,
    tabWidth: 0,
    sizePage: 1,
    orderData: [],
    top: 0
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    // this.data.orderType = options.type;
    this.setData({
      orderType: options.type
    });


    if (options.type == 'wapSupplier') {//我是卖家
      this.setData({
        activeIndex: options.status || '',
      })
      wx.setNavigationBarTitle({
        title: '我是卖家'
      });
    }
    this.data.activeIndex = options.status;
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
        if (res.data.length == 0) {
          that.setData({
            hasMore: false,
          });
        }
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
      
    }).catch(res => {
      console.log("订单列表失败")
    })
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    // 
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
          if (res.data.length == 0) {
            that.setData({
              hasMore: false,
            });
          }
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
        wx.hideLoading()
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
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }).catch(res => {
        // console.log("订单列表失败")
      })
    }



  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log(33)
    console.log(e)

  },
  loadMore: function (e) {  //加载更多
    if (!this.data.hasMore) return
    this.data.sizePage++;
    wx.showLoading({
      title: '加载中',
    })
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
          if (res.data.length == 0) {
            that.setData({
              hasMore: false,
            });
          }
         
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
    } else {
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

    }).catch(res => {
      console.log("订单列表失败")
    })
  },
  orderTaking: function (e) {//订单下按钮的状态
    var action = e.currentTarget.dataset.value.act;
    var data = {
      order_sn: e.currentTarget.dataset.orderid,
      act: action,
      Module: this.data.orderType,
    }
    var _this = this;
    if (action == 'takingAll') {//整单接单
      if (util.authFind('orderinfo_taking')) { //检验权限
        wx.showModal({
          title: '整单接单',
          content: '整单接单意味着您承诺为门店配送订单里所有商品，并按照要求的时间送达',
          confirmText: '整单接单',
          success: function (res) {
            if (res.confirm) {
              app.netWork.postJson(app.urlConfig.takingOrderUrl, data).then(res => {
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

        // wx.showModal({
        //   title: '整单拒单确认',
        //   content: '您是否要拒绝客户的订单？请注意，拒绝用户订单可能造成用户流失，请提前和客户沟通后再行操作。',
        //   confirmText: '确认拒绝',
        //   success: function (res) {
        //     if (res.confirm) {
        util.navTo({
          url: '../partGetGoods/partGetGoods?orderId=' + e.currentTarget.dataset.orderid + '&Module=' + this.data.orderType + '&action=' + action
        })
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })

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
      } else {
        wx.showToast({
          title: '暂无权限',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
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
  goInfo: function (e) {
    if (util.authFind('orderinfo_info')) { //检验权限
      util.navTo({
        url: '../orderSingleDetail/orderSingleDetail?orderId=' + e.currentTarget.dataset.orderid + '&Module=' + this.data.orderType,
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
  searchBtn: function () {//搜索

  },
  callPhone: function (e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  goReturn:function(e){
    // console.log(this.data.Module)
    // util.navTo({
    //   url: '../examineReturn/examineReturn?Module=' + this.data.Module + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
    // })

    console.log(this.data.orderType)

    util.navTo({
      url: '../examineReturn/examineReturn?Module=' + this.data.orderType + '&item=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  }
})