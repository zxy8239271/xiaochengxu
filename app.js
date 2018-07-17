//app.js
const netWork = require('./utils/ajaxUtil.js');
const urlConfig = require('./utils/urlConfig.js');
const util = require('./utils/util.js');
const loginInfo = require('./utils/loginInfo.js');
App({
    data: {},
    netWork: netWork, //
    urls: '',
    urlConfig: urlConfig,
    loginInfoData: [],
    isClicked: false,
    onLaunch: function() { //

    },
    onShow: function() {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) { // 先去校验用户有没有授权  如果有授权则直接
                  console.log(util.getCurrentPageUrl() != 'pages/inviteStaff/inviteStaff' || util.getCurrentPageUrl() != 'pages/homePage/homePage')
                  console.log(util.getCurrentPageUrl() !='pages/homePage/homePage' )
                  if (util.getCurrentPageUrl() != 'pages/inviteStaff/inviteStaff' && util.getCurrentPageUrl() !='pages/homePage/homePage') {
                    console.log('6666')
                        loginInfo.getLoginInfo().then(res_info => {
                            app.loginInfoData = res_info.data;
                            if (res_data.errorNo == '10010') {
                                loginInfo.wxLogin().then(wx_res => {
                                    console.log(wx_res)
                                    loginInfo.login(wx_res).then(res_login => {
                                        app.loginInfoData = res_login.data;
                                         console.log(res_login.data)
                                         console.log(666)
                                    })
                                }).catch(err => {

                                })
                            }

                        }).catch(err => {

                        })
                    }

                }
            }
        })
    },
    onHide: function() {

    },



})