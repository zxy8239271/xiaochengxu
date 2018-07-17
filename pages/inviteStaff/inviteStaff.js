var app = getApp();
import util from '../../utils/util.js';
const loginInfo = require('../../utils/loginInfo.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        status: '',
        array: [],
        index: 0,
        company_id: '',
        company_name: '',
        staff_id: '',
        user_id: '',
        logo: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        if (options.id && options.company_id) {
            // console.log(options)
            _this.data.company_id = options.company_id;
            _this.data.staff_id = options.staff_id;
            _this.data.user_id = options.user_id;
            _this.setData({
                status: options.id.trim(),
            })
        } else if (options.scene) {
            var scene = decodeURIComponent(options.scene).split('='); //扫描二维码进入页面的参      
            // console.log(scene)
            // console.log(333)
            _this.setData({
                status: scene[1]
            })
            _this.data.staff_id = scene[0];
            _this.data.company_id = scene[2];
            _this.data.user_id = scene[3];
        } else {

        }
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) { // 先去校验用户有没有授权  如果有授权则直接
                  if (wx.getStorageSync('openId')){
                    loginInfo.getLoginInfo().then(res_info => {
                      console.log(555)
                      console.log(res_info)

                      app.loginInfoData = res_info.data;
                      _this.inviteInfo();
                      if (_this.data.status == '0' || _this.data.status == '2') {
                        _this.supplierList();
                      }
                    })
                  }else{
                    loginInfo.wxLogin().then(wx_res => {
                      // console.log(wx_res)
                      loginInfo.login(wx_res).then(res_login => {
                        app.loginInfoData = res_login.data;
                        _this.inviteInfo();
                        if (_this.data.status == '0' || _this.data.status == '2') {
                          _this.supplierList();
                        }

                      }).catch(err => {

                      })
                    }).catch(err => {
                      wx.showModal({
                        title: '警告通知',
                        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                        success: function (res) {
                          if (res.confirm) {
                            wx.openSetting({
                              success: (set_res) => {
                                if (set_res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                                  loginInfo.wxLogin().then(wx2_res => {
                                    loginInfo.login(wx2_res).then(res_login2 => {
                                      app.loginInfoData = res_login2.data;
                                      _this.inviteInfo();
                                      if (_this.data.status == '0' || _this.data.status == '2') {
                                        _this.supplierList();
                                      }
                                    })
                                  })

                                }
                              },
                              fail: function (res) {

                              }
                            })

                          }
                        }
                      })
                    })
                  }
              
                } else { //否则调起授权 
                    loginInfo.wxLogin().then(wx_res => {
                        // console.log(wx_res)
                        loginInfo.login(wx_res).then(res_login => {
                            app.loginInfoData = res_login.data;
                            _this.inviteInfo();
                            if (_this.data.status == '0' || _this.data.status == '2') {
                                _this.supplierList();
                            }

                        }).catch(err => {

                        })
                    }).catch(err => {
                        wx.showModal({
                            title: '警告通知',
                            content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: (set_res) => {
                                            if (set_res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                                                loginInfo.wxLogin().then(wx2_res => {
                                                    loginInfo.login(wx2_res).then(res_login2 => {
                                                        app.loginInfoData = res_login2.data;
                                                        _this.inviteInfo();
                                                        if (_this.data.status == '0' || _this.data.status == '2') {
                                                            _this.supplierList();
                                                        }
                                                    })
                                                })

                                            }
                                        },
                                        fail: function(res) {

                                        }
                                    })

                                }
                            }
                        })
                    })
                }
            }
        })
    },
    supplierList: function() {
        var _this = this;
        app.netWork.postJson(app.urlConfig.myCompanyUrl, {}).then(res => { //店铺列表
            // console.log(res)
            if (res.errorNo == '0') {
                _this.setData({
                    array: res.data
                })
            } else {

            }
        }).catch(res => {

        })
    },
    inviteInfo: function() {
        // console.log( this.data.company_id)
        var _this=this;
        app.netWork.postJson(app.urlConfig.inviteInfoUrl, { company_id: this.data.company_id }).then(res => { //店铺列表
            // console.log(res)
            if (res.errorNo == '0') {
                _this.setData({
                    company_name: res.data.name,
                    logo: res.data.logo
                })
            } else {
                wx.showToast({
                    title: res.errorMsg,
                    duration: 2000,
                })
            }
        }).catch(res => {

        })
    },
    cancleBtn: function() { //取消 就退出小程序
        var staff_id = app.loginInfoData.staff_id;
        if (staff_id) { //先判断当前登录人有没有加入到公司
            wx.switchTab({
                url: '../homePage/homePage'
            })
        } else {
            wx.switchTab({
                url: '../homePage/homePage'
            })
            // wx.navigateBack({
            //   delta: 1
            // })
        }
    },
    sureBtn: function() {
        var _this = this;
        var staff_id = app.loginInfoData.staff_id;
        // console.log(staff_id);
        if (staff_id) { //先判断当前登录人有没有加入到公司
            if (this.data.status == '0') { //被邀请成为供应商
                // console.log(this.data.status);
                let data = {
                    company_id: this.data.company_id,
                    supplier_id: this.data.array[this.data.index].company_id,
                    user_id: app.loginInfoData.user_id
                }
                app.netWork.postJson(app.urlConfig.doBindSupplierUrl, data).then(res => { //
                    // console.log(res)
                    if (res.errorNo == '0') {
                        wx.showToast({
                            title: res.errorMsg,
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        })
                        wx.switchTab({
                            url: '../homePage/homePage'
                        })
                    } else {
                        wx.showToast({
                            title: res.errorMsg,
                            image: '../../images/warning.png',
                            duration: 2000,
                            mask: true
                        })
                    }
                }).catch(res => {
                    wx.showToast({
                        title: res.errorMsg,
                        image: '../../images/warning.png',
                        duration: 2000,
                        mask: true
                    })
                })
            } else if (this.data.status == '1') { //被邀请成为员工
                let dataJson = {
                    staff_id: this.data.staff_id,
                    user_id: app.loginInfoData.user_id
                }
                app.netWork.postJson(app.urlConfig.doBindStaffUrl, dataJson).then(res => { //
                    if (res.errorNo == '0') {
                        wx.showToast({
                            title: '加入成功',
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        })
                        wx.switchTab({
                            url: '../myHome/myHome'
                        })
                    } else {
                        wx.showToast({
                            title: res.errorMsg,
                            image: '../../images/warning.png',
                            duration: 2000,
                            mask: true
                        })
                    }
                }).catch(res => {
                    wx.showToast({
                        title: res.errorMsg,
                        image: '../../images/warning.png',
                        duration: 2000,
                        mask: true
                    })
                })
            } else if (this.data.status == '2') { //被邀请成为客户
                let jsonData = {
                    company_id: this.data.company_id, //邀请人
                    supplier_id: this.data.array[this.data.index].company_id,
                    user_id: this.data.user_id // 邀请人的用户ID 

                }
                app.netWork.postJson(app.urlConfig.doBindShopUrl, jsonData).then(res => { //
                    if (res.errorNo == '0') {
                        wx.showToast({
                            title: res.errorMsg,
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        })
                        wx.switchTab({
                            url: '../homePage/homePage'
                        })
                    } else {
                        wx.showToast({
                            title: res.errorMsg,
                            image: '../../images/warning.png',
                            duration: 2000,
                            mask: true
                        })
                    }
                }).catch(res => {
                    wx.showToast({
                        title: res.errorMsg,
                        image: '../../images/warning.png',
                        duration: 2000,
                        mask: true
                    })
                })

            } else { //进入方式不对
                wx.showToast({
                    title: '非法进入',
                    image: '../../images/warning.png',
                    duration: 2000,
                    mask: true
                })
            }
        } else { //如果不存在
            if (this.data.status == '0') { //被邀请成为供应商
                wx.redirectTo({
                    url: '../createShop/createShop?status=0&company_id=' + this.data.company_id,
                })
            } else if (this.data.status == '1') { //被邀请成为员工

                let dataJson = {
                    staff_id: this.data.staff_id,
                    user_id: app.loginInfoData.user_id
                }
                app.netWork.postJson(app.urlConfig.doBindStaffUrl, dataJson).then(res => { //
                    if (res.errorNo == '0') {
                        wx.showToast({
                            title: res.errorMsg,
                            icon: 'success',
                            duration: 2000,
                            mask: true
                        })
                        wx.redirectTo({
                            url: '../testPhone/testPhone?staff_id=' + this.data.staff_id,
                        })
                    } else {
                        wx.showToast({
                            title: res.errorMsg,
                            image: '../../images/warning.png',
                            duration: 2000,
                            mask: true
                        })
                    }
                }).catch(res => {
                    wx.showToast({
                        title: res.errorMsg,
                        image: '../../images/warning.png',
                        duration: 2000,
                        mask: true
                    })
                })

            } else if (this.data.status == '2') { //被邀请成为客户
                wx.redirectTo({
                    url: '../createShop/createShop?status=2&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id,
                })
            } else { //进入方式不对
                wx.showToast({
                    title: '非法进入',
                    image: '../../images/warning.png',
                    duration: 2000,
                    mask: true
                })
            }
        }
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
})