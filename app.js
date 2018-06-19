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
                    if (util.getCurrentPageUrl() != 'pages/inviteStaff/inviteStaff') {
                        loginInfo.getLoginInfo().then(res_info => {
                            app.loginInfoData = res_info.data;
                            if (res_data.errorNo == '10010') {
                                loginInfo.wxLogin().then(wx_res => {
                                    console.log(wx_res)
                                    loginInfo.login(wx_res).then(res_login => {
                                        app.loginInfoData = res_login.data;
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