const netWork = require('./ajaxUtil.js');
const urlConfig = require('./urlConfig.js');
const util = require('./util.js');
var app = getApp();
module.exports = {
    wxLogin: function() { //授权
        return new Promise((resolve, reject) => {
            wx.login({
                success: function(res) {
                    if (res.code) {
                        wx.getUserInfo({
                            withCredentials: true,
                            lang: 'zh_CN',
                            success: function(res_user) {
                                let data = {
                                    code: res.code,
                                    encryptedData: res_user.encryptedData,
                                    iv: res_user.iv
                                }
                                resolve(data)
                                //同意授权 ， 将用户信息写入数据库
                            },
                            fail: function(err) {
                                reject(err)
                            }
                        })
                    }
                }
            })
        })
    },
    login: function(data) {//授权登录 用户信息写入数据库
        return new Promise((resolve, reject) => {
            let dataJson = data;
            var _this = this;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            netWork.postJson(urlConfig.loginUrl, dataJson).then(res_data => {
                if (res_data.errorNo == 0) {
                  wx.hideLoading();
                    wx.setStorageSync('openId', res_data.data.openid_xcx);
                    wx.setStorageSync('token', res_data.data.token);
                    if (wx.getStorageSync('xcxVersionNumber') != res_data.data.xcxVersionNumber) {
                        wx.removeStorageSync('classData');
                        wx.removeStorageSync('unitData')
                    }
                    wx.setStorageSync('xcxVersionNumber', res_data.data.xcxVersionNumber);
                    if (!res_data.data.staff_id) {
                      if (util.getCurrentPageUrl() != 'pages/inviteStaff/inviteStaff' && util.getCurrentPageUrl() != 'pages/testPhone/testPhone' && util.getCurrentPageUrl() != 'pages/createShop/createShop') {
                        wx.showModal({
                            title: '温馨提示',
                            content: '您还没店铺，请先去创建店铺',
                            showCancel: false,
                            confirmText: '创建店铺',
                            mask: true,
                            success: function(res) {
                                if (res.confirm) {
                                    util.navTo({
                                        url: '../createShop/createShop',
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                        // return;
                    }
                    }
                }
                resolve(res_data)

            }).catch(err => {
                reject(err)
            })
        })


    },
    getLoginInfo: function() {//获取信息
        return new Promise((resolve, reject) => {
            var data = {
                open_id: wx.getStorageSync('openId')
            };
            var _this = this;
            console.log('openid' + wx.getStorageSync('openId'))
            netWork.postJson(urlConfig.getLoginInfoUrl, data).then(res_data => {
                if (res_data.errorNo == 0) {
                    wx.setStorageSync('openId', res_data.data.openid_xcx);
                    if (wx.getStorageSync('xcxVersionNumber') != res_data.data.xcxVersionNumber) {
                        wx.removeStorageSync('classData');
                        wx.removeStorageSync('unitData')
                    }
                    wx.setStorageSync('xcxVersionNumber', res_data.data.xcxVersionNumber);
                    wx.setStorageSync('token', res_data.data.token);
                    if (!res_data.data.staff_id) {
                        if (util.getCurrentPageUrl() != 'pages/inviteStaff/inviteStaff' && util.getCurrentPageUrl() != 'pages/testPhone/testPhone' && util.getCurrentPageUrl() != 'pages/createShop/createShop') {
                            wx.showModal({
                                title: '温馨提示',
                                content: '您还没店铺，请先去创建店铺',
                                showCancel: false,
                                confirmText: '创建店铺',
                                mask: true,
                                success: function(res) {
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
                resolve(res_data)
            }).catch(err => {
                reject(err)
            })
        })

    },

}