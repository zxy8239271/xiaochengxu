var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    loginData: [],
    qaingdan: 0,
    weijie: 0,
    daipeihuo: 0,
    daiqueren: 0,
    daipingjia: 0,
    bulldaijie: 0,
    bullchongxia: 0,
    bulldaishou: 0,
    bulldaishouhou: 0,
    bulldaipingjia: 0,
    messageData: [],
    isShow: false,
    isShowSellContent: true, //默认展开我是卖家的内容
    isShowBuyContent: true, //默认展开我是买家的内容

  },
  onLoad: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    app.urls = url;
    console.log(app)
    console.log(url)
    // var isShowSellContent = wx.getStorageSync('isShowSellContent');
    // if (isShowSellContent){
    //   console.log(this.data.isShowSellContent)
    // }else{
    //   console.log("无数据")
    // }






  },
  onReady: function () {

  },
  onShow: function () {
  
    // 获取本地数据决定我是卖家和我是买家是否展开
    var isShowSellContent = wx.getStorageSync('isShowSellContent');
    // console.log(isShowSellContent)

    if (isShowSellContent) {
      // console.log("有存储")
      if (isShowSellContent == 0) {
        this.setData({
          isShowSellContent: false
        })
      } else {
        this.setData({
          isShowSellContent: true
        })

      }
    } else {
      // console.log("未存储")
    }



    var isShowBuyContent = wx.getStorageSync('isShowBuyContent');
    if (isShowBuyContent) {
      // console.log(isShowBuyContent)

      if (isShowBuyContent == 0) {
        this.setData({
          isShowBuyContent: false
        });
      } else {
        this.setData({
          isShowBuyContent: true
        });
      }
    } else {
// console.log("未存储买家")
    }

    var _this = this;
    if (app.loginInfoData.length != 0) {
      this.setData({
        loginData: app.loginInfoData
      })
      if (_this.data.loginData.staff_id) {
        // 如果有staff_id=则证明有店铺
        _this.orderNum();
        _this.messageList();
      }
    } else {
      setTimeout(function () {
        _this.setData({
          loginData: app.loginInfoData
        });
        if (_this.data.loginData.staff_id) {
          // 如果有staff_id=则证明有店铺
          _this.orderNum();
          _this.messageList();
          console.log(333)
        }

      }, 1000)
    }
  },
  orderNum: function () {
    var _this = this;
    app.netWork.postJson(app.urlConfig.bullOrderUrl, {}).then(res => {//买家的订单数量接口
      if (res.errorNo == '0') {
        _this.setData({
          bulldaijie: res.data.taking,
          bullchongxia: res.data.purchasing,
          bulldaishou: res.data.receving,
          bulldaipingjia: res.data.judging,
        })
      }
    }).catch(res => {
      console.log('买家的订单数量接口')
    })
    app.netWork.postJson(app.urlConfig.orderinfoUrl, {}).then((res) => {//卖家的订单数量接口
      if (res.errorNo == '0') {
        _this.setData({
          weijie: res.data.untaking,
          daipeihuo: res.data.allocating,
          daiqueren: res.data.confirming,
          daipingjia: res.data.judging,
        })
      }
    }).catch(res => {
      console.log('卖家的订单数量接口')
    })

  },
  goMyOrder: function (e) {//我是买家或卖家---更多
    if (e.currentTarget.dataset.id == 'wapSupplier') {//卖家
      util.navTo({
        url: '../myOrder/myOrder?type=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status
      })
    } else {
      // 买家
      util.navTo({
        url: '../myBullOrder/myBullOrder?type=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status
      })
    }
  },
  goMessage: function (e) {//消息---更多  	0未读1已读 ，不传全部
    util.navTo({
      url: '../message/message?type=' + e.currentTarget.dataset.id,
    })
  },
  changeUnit: function () {
    util.navTo({
      url: '../chooseUnit/chooseUnit?isSelect=0',
    })
  },
  messageList: function () {
    var _this = this;
    var data = {
      page: 1,
      page_size: 5,
      type: 0
    }
    app.netWork.postJson(app.urlConfig.messageListUrl, data).then(res => {//消息列表
      if (res.errorNo == '0') {
        _this.setData({
          messageData: res.data
        })
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
      if (res.errorNo == '0') {
        util.navTo({
          url: '../orderSingleDetail/orderSingleDetail?orderId=' + item.keyword + '&Module=' + item.keywordType,
        })
      }
    }).catch(err => {

    })
  },
  // 切换是否展示我是卖家下方的信息并存到本地存储中
  toggleSellShow: function () {
    this.setData({
      isShowSellContent: !this.data.isShowSellContent
    });
    // 存储到本地
    if (this.data.isShowSellContent) {
      wx.setStorageSync('isShowSellContent', "1")
    } else {
      wx.setStorageSync('isShowSellContent', "0")
    }

  },
  // 切换是否展示我是卖家下方的信息并存到本地存储中
  toggleBuyShow: function () {
    this.setData({
      isShowBuyContent: !this.data.isShowBuyContent
    });

    // 存储到本地
    if (this.data.isShowBuyContent) {
      wx.setStorageSync('isShowBuyContent', "1")
    } else {
      wx.setStorageSync('isShowBuyContent', "0")
    }

  },

})