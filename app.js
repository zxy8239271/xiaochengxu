//app.js
const netWork = require('./utils/ajaxUtil.js');
const urlConfig = require('./utils/urlConfig.js');
const util = require('./utils/util.js');
App({
  data: {
  },
  netWork: netWork,//
  urls: '',
  urlConfig: urlConfig,
  loginInfoData: [],
  isClicked: false,
  onLaunch: function () {//
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 先去校验用户有没有授权  如果有授权则直接

          wx.showLoading({
            title: '加载中',
            mask: true
          })
          _this.getLoginInfo();
        } else {//否则调起授权          
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  lang: 'zh_CN',
                  success: function (res_user) {
                    var data = {
                      code: res.code,
                      encryptedData: res_user.encryptedData,
                      iv: res_user.iv
                    }
                    _this.login(data);//同意授权 ， 将用户信息写入数据库
                  }, fail: function () {
                    wx.showModal({
                      title: '警告通知',
                      content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                      success: function (res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success: (res) => {
                              if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                wx.login({
                                  success: function (res_login) {
                                    if (res_login.code) {
                                      wx.getUserInfo({
                                        withCredentials: true,
                                        lang: 'zh_CN',
                                        success: function (res_user) {
                                          console.log(res_user)
                                          var data = {
                                            code: res.code,
                                            encryptedData: res_user.encryptedData,
                                            iv: res_user.iv
                                          }
                                          _this.login(data);// 将用户信息写入数据库
                                        }
                                      })
                                    }
                                  }
                                });
                              }
                            }, fail: function (res) {

                            }
                          })

                        }
                      }
                    })
                  }, complete: function (res) {

                  }
                })
              }
            }
          })
        }
      }
    })
  },
  login: function (data) {
    var data = data;
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    netWork.postJson(urlConfig.loginUrl, data).then(res_data => {
      console.log(res_data.data)
      console.log(this.urls)

      if (res_data.errorNo == 0) {
        _this.loginInfoData = res_data.data;
        wx.setStorageSync('openId', res_data.data.openid_xcx);
        wx.setStorageSync('token', res_data.data.token);
        if (wx.getStorageSync('xcxVersionNumber') != res_data.data.xcxVersionNumber) {
          wx.removeStorageSync('classData');
          wx.removeStorageSync('unitData')
        }
        wx.setStorageSync('xcxVersionNumber', res_data.data.xcxVersionNumber);
        wx.hideLoading();
        if (!res_data.data.staff_id) {
          if (this.urls != 'pages/inviteStaff/inviteStaff') {
            wx.showModal({
              title: '温馨提示',
              content: '您还没店铺，请先去创建店铺',
              showCancel: false,
              confirmText: '创建店铺',
              mask: true,
              success: function (res) {
                if (res.confirm) {
                  util.navTo({
                    url: '../createShop/createShop',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }

        }
      }
    }).catch(res_err => {

    })
  },
  getLoginInfo: function () {
    var data = {
      open_id: wx.getStorageSync('openId')
    };
    var _this = this;
    netWork.postJson(urlConfig.getLoginInfoUrl, data).then(res_data => {
      if (res_data.errorNo == 0) {
        wx.hideLoading();
        _this.loginInfoData = res_data.data;
        wx.setStorageSync('openId', res_data.data.openid_xcx);
        if (wx.getStorageSync('xcxVersionNumber') != res_data.data.xcxVersionNumber) {
          wx.removeStorageSync('classData');
          wx.removeStorageSync('unitData')
        }
        wx.setStorageSync('xcxVersionNumber', res_data.data.xcxVersionNumber);
        wx.setStorageSync('token', res_data.data.token);
        if (!res_data.data.staff_id) {
          console.log(this.urls)
          if (this.urls != 'pages/inviteStaff/inviteStaff' && this.urls != 'pages/testPhone/testPhone' && this.urls != 'pages/createShop/createShop') {
            wx.showModal({
              title: '温馨提示',
              content: '您还没店铺，请先去创建店铺',
              showCancel: false,
              confirmText: '创建店铺',
              mask: true,
              success: function (res) {
                if (res.confirm) {
                  util.navTo({
                    url: '../createShop/createShop',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }

        }
      } else if (res_data.errorNo == '10010') {
        //否则调起授权
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                lang: 'zh_CN',
                success: function (res_user) {
                  var data = {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  }
                  _this.login(data);//同意授权 ， 将用户信息写入数据库
                }, fail: function () {
                  wx.showModal({
                    title: '警告通知',
                    content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                              wx.login({
                                success: function (res_login) {
                                  if (res_login.code) {
                                    wx.getUserInfo({
                                      withCredentials: true,
                                      lang: 'zh_CN',
                                      success: function (res_user) {
                                        console.log(res_user)
                                        var data = {
                                          code: res.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        }
                                        _this.login(data);// 将用户信息写入数据库
                                      }
                                    })
                                  }
                                }
                              });
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          }
        })

      } else {
        wx.hideLoading();
      }
    }).catch(res_err => {
      console.log(res_err)
    })
  },
  onShow: function () {
    var data = {
      open_id: wx.getStorageSync('openId')
    };
    var _this = this;
    netWork.postJson(urlConfig.getLoginInfoUrl, data).then(res_data => {
      if (res_data.errorNo == 0) {
        wx.hideLoading();
        _this.loginInfoData = res_data.data;
        wx.setStorageSync('openId', res_data.data.openid_xcx);
        if (wx.getStorageSync('xcxVersionNumber') != res_data.data.xcxVersionNumber) {
          wx.removeStorageSync('classData');
          wx.removeStorageSync('unitData')
        }
        wx.setStorageSync('xcxVersionNumber', res_data.data.xcxVersionNumber);
        wx.setStorageSync('token', res_data.data.token);
    
    
      } else if (res_data.errorNo == '10010') {
        //否则调起授权
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                lang: 'zh_CN',
                success: function (res_user) {
                  var data = {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  }
                  _this.login(data);//同意授权 ， 将用户信息写入数据库
                }, fail: function () {
                  wx.showModal({
                    title: '警告通知',
                    content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                              wx.login({
                                success: function (res_login) {
                                  if (res_login.code) {
                                    wx.getUserInfo({
                                      withCredentials: true,
                                      lang: 'zh_CN',
                                      success: function (res_user) {
                                        console.log(res_user)
                                        var data = {
                                          code: res.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        }
                                        _this.login(data);// 将用户信息写入数据库
                                      }
                                    })
                                  }
                                }
                              });
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          }
        })

      } else {
        wx.hideLoading();
      }
    }).catch(res_err => {
      console.log(res_err)
    })
  },
  onHide: function () {

  }

})