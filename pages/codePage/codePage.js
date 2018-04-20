var app = getApp();
import util from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imgUrl: '',
    openId: '',
    staff_id: '',
    company_name: '',
    titleText: '',
    user_id:'',
    company_id:'',
    isShow:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '扫码邀请页'
    });
    this.setData({
      id: options.id,
      openId: options.openId
    })
    this.data.staff_id = options.staff_id;
    this.data.user_id = options. user_id
    this.data.company_id = options.company_id;//这个是转发人的公司
    // this.data.logo = options.logo;//这个是转发人的头像
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面加载完成 判断是不是同一个人转发并进入  
    console.log(this.data.openId, wx.getStorageSync('openId'))
    if (this.data.openId != undefined && this.data.openId != null || this.data.openId != '') {
      if (this.data.openId != wx.getStorageSync('openId')) {
        if (this.data.id == '1' || this.data.id == '0' || this.data.id == '2') {
          wx.redirectTo({
            url: '../inviteStaff/inviteStaff?id=' + this.data.id + ' &openId=' + this.data.openId + ' &staff_id=' + this.data.staff_id + '&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id
          })
        }
      }
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.openId != wx.getStorageSync('openId')) {
      if (this.data.id == '1' || this.data.id == '0' || this.data.id == '2') {
      }
    } else {
      this.setData({
        isShow:true
      })
      // 这个已进入页面就取当前人所在的公司，为转发做准备
      var company_name = app.loginInfoData.company_name;
      if (this.data.id == '0') {
        this.data.titleText = company_name + '公司诚邀您成为他/她的供应商,点击接受邀请？'
      } else if (this.data.id == '1') {
        this.data.titleText = company_name + '公司诚邀您加入他/她的团队，点击接受邀请？'
      } else if (this.data.id == '2') {
        this.data.titleText = company_name + '公司诚邀您成为他/她的客户,点击接受邀请？'
      }
      var _this = this;
      var data = {
        type: this.data.id
      };
      app.netWork.postJson(app.urlConfig.myqrCodeUrl, data).then(res => {
        console.log(res)
        if (res.errorNo == '0') {
          _this.setData({
            imgUrl: res.data
          })
        }
      }).catch(err => {

      })

    }

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
  onShareAppMessage: function (res) {
    var openId = wx.getStorageSync('openId');
    var useData = app.loginInfoData;
    var staff_id = useData.staff_id;
    var company_id = useData.company_id;
    var user_id = useData.user_id;
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.titleText,
      path: '/pages/codePage/codePage?id=' + this.data.id + '&openId=' + openId + '&staff_id=' + staff_id + '&company_id=' + company_id + '&user_id=' + user_id ,
      imageUrl: '../../images/yaoqing.jpg',
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})