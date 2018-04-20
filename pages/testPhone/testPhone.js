// pages/testPhone/testPhone.js
import util from '../../utils/util.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    phone: '',
    code: '',
    name: '',
    btnText: '获取验证码',
    time: 60,
    times: '',
  },
  phoneInput: function (e) {
    this.data.phone = e.detail.value;
  },
  phoneBlur: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeBlur: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  nameBlur: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getCode: function (e) {
    var _this = this;
    if (util.isPhoneAvailable(this.data.phone)) {
      var data = {
        phone: this.data.phone
      }
      app.netWork.postJson(app.urlConfig.sendCode, data).then(res => {
        console.log(res)
        if (res.errorNo == 0) {
          _this.setData({
            disabled: !_this.data.disabled
          })
          _this.data.times = setInterval(() => {
            _this.timeInterval();
          }, 1000)
        }
      }).catch(res_err => {
      })
    } else {
      wx.showToast({
        title: '手机号有误',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  timeInterval: function () {
    if (this.data.time == 0) {
      this.setData({
        btnText: '获取验证码',
        disabled: false
      })
      this.data.time = 60;
      clearInterval(this.data.times);

    } else {
      this.setData({
        btnText: this.data.time + 's',
        disabled: true
      })
      this.data.time--;
      console.log(this.data.time)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  submit: function () {
    var data = {
      realName: this.data.name,
      phone: this.data.phone,
      code: this.data.code
    }
    app.netWork.postJson(app.urlConfig.userSaveUrl, data).then(res => {//
      console.log(res)
      if (res.errorNo == '0') {
        wx.showToast({
          title: res.errorMsg,
          icon: 'success',
          duration: 2000,
          mask: true
        })
        _this.loginInfo()
        wx.switchTab({
          url: '../myHome/myHome'
        })
        return
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
  loginInfo: function () {
    var data = {
      open_id: wx.getStorageSync('openId')
    };
    app.netWork.postJson(app.urlConfig.getLoginInfoUrl, data).then(res_data => {
      if (res_data.errorNo == 0) {
        app.loginInfoData = res_data.data
        wx.setStorageSync('openId', res_data.data.openid_xcx);
        wx.setStorageSync('token', res_data.data.token);
      }
    }).catch(res_err => {

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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})