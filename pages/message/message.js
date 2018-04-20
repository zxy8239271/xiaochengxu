var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    tabs: [{ name: "全部", id: 'quanbu' }, { name: "未读", id: 0 }],
    currentTab: '',//tab切换
    sliderOffset: 0,
    sliderLeft: 0,
    hasMore: false,
    sizePage: 1,
    windowHeight: 0
  },
  tabClick: function (e) {//tab切换
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      currentTab: e.currentTarget.dataset.id,
      hasMore: true
    });
    this.data.sizePage = 1;
    this.messageList();
  },
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: '消息'
    });
    this.data.currentTab = options.type;
    var i = 0;
    this.data.tabs.filter(function (item, index) {
      if (_this.data.currentTab == item.id) {
        return i = index
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight,
          sliderLeft: (res.windowWidth * 0.6 / _this.data.tabs.length - res.windowWidth * 0.6 / _this.data.tabs.length) / 2,
          sliderOffset: res.windowWidth * 0.6 / _this.data.tabs.length * i,
          tabWidth: res.windowWidth * 0.6 / _this.data.tabs.length,
          currentTab: _this.data.currentTab
        });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.messageList()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //点击事件处理
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset.title);
  },
  //加载更多
  loadMore: function (e) {
    var _this = this;
    _this.data.sizePage++;
    if (!_this.data.hasMore) return
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      page: _this.data.sizePage,
      page_size: 10,
    }
    if (this.data.currentTab != 'quanbu') {
      data.type = this.data.currentTab
    }
    var arr = []
    app.netWork.postJson(app.urlConfig.messageListUrl, data).then(res => {//卖家的订单数量接口
      if (res.errorNo == '0') {
        wx.hideLoading();
        _this.data.messageData.rows = _this.data.messageData.rows.concat(res.data.rows);
        _this.data.messageData.total = res.data.total;
        _this.data.messageData.unreadTotal = res.data.unreadTotal

        _this.setData({
          messageData: _this.data.messageData,
        })
        setTimeout(function () {
          _this.setData({
            hasMore: false,
          });
        }, 2000)
        if (res.data.total == _this.data.messageData.rows.length || res.data.rows.length == 0) {
          _this.setData({
            hasMore: false
          })
        }
      } else {

      }
    }).catch(res => {

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
    var _this = this;
    var data = {
      page: this.data.sizePage,
      page_size: 10,
    }
    if (this.data.currentTab != 'quanbu') {
      data.type = this.data.currentTab
    }
    app.netWork.postJson(app.urlConfig.messageListUrl, data).then(res => {//接口
      if (res.errorNo == '0') {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        _this.setData({
          messageData: res.data,
        })
        if (res.data.total <= 10) {
          _this.setData({
            hasMore: false
          })
        } else {
          _this.setData({
            hasMore: true
          })
        }
      } else {
        wx.stopPullDownRefresh();
      }
    }).catch(res => {
      wx.stopPullDownRefresh();
    })
  },
  messageList: function () {
    var _this = this;
    var data = {
      page: this.data.sizePage,
      page_size: 10,
    }
    if (this.data.currentTab != 'quanbu') {
      data.type = this.data.currentTab
    }
    app.netWork.postJson(app.urlConfig.messageListUrl, data).then(res => {//接口
      if (res.errorNo == '0') {
        _this.setData({
          messageData: res.data,
          hasRefesh: false,
        })
        if (res.data.total <= 10) {
          _this.setData({
            hasMore: false
          })
        } else {
          _this.setData({
            hasMore: true
          })
        }
      } else {

      }
    }).catch(res => {

    })
  },
  readMessage: function (e) {
    var item = e.currentTarget.dataset.item;
    var _this = this;
    var data = {
      id: item.id
    }
    app.netWork.postJson(app.urlConfig.messageReadUrl, data).then(res => {
      console.log(res)
      if (res.errorNo == '0') {
        // _this.messageList();
        // util.navTo({
        //   url: '../message/message?orderId=' + item.keyword + '&Module=' + item.keywordType,
        // })
      }
    }).catch(err => {

    })
    util.navTo({
      url: '../orderSingleDetail/orderSingleDetail?orderId=' + item.keyword + '&Module=' + item.keywordType,
    })
  }
})