var app = getApp();
import util from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nick: "", // 名字
    phone: "", // 电话
    my_job: "",
    client_total: "", // 客户总和
    staff_total: "", // 员工总和
    isShow: false, // 隐藏我的采购模版一列
    photo: "", //如果没有图片就用占位图,
    isShowStaff: true,
  },
  // onTabItemTap: function () {
  //   if (!app.loginInfoData.staff_id) {
  //     wx.showModal({
  //       title: '温馨提示',
  //       content: '您还没店铺，请先去创建店铺',
  //       showCancel: false,
  //       confirmText: '创建店铺',
  //       mask: true,
  //       success: function (res) {
  //         if (res.confirm) {
  //           util.navTo({
  //             url: '../createShop/createShop',
  //           })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },
  toChooseUnit: function () {
    util.navTo({
      url: '../chooseUnit/chooseUnit?isSelect=1'
    });
  },
  //去员工列表页面
  toStaffList: function () {
    util.navTo({
      url: "../staffList/staffList"
    });
  },
  // 去我销售的客户页面
  toMyClient: function () {
    util.navTo({
      url: "../myClient/myClient"
    })
  },
  toYaoQing: function () {
    util.navTo({
      url: "../invitePage/invitePage"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var _this = this;
    _this.setData({
      nick: app.loginInfoData.nick,
      phone: app.loginInfoData.phone,
      photo: app.loginInfoData.photo
    })
    // 页面加载请求数据
    app.netWork.postJson(app.urlConfig.myHomeUrl, {}).then(res => {
      console.log(res)
      if (res.errorNo == '0') {
        _this.setData({
          my_job: res.data.my_job,
          client_total: res.data.client_total,
          staff_total: res.data.staff_total,
        })
      }
    }).catch(err => {

    })


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
  toPersonal: function () {
    util.navTo({
      url: "../personal/personal"
    })
  },
  // 用户手动清除本地缓存
  clearStorage: function () {
    wx.showModal({
      title: '提示',
      content: '确认清除本地所有数据缓存吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // wx.removeStorageSync('classData');
          // wx.removeStorageSync('UnitData');
          wx.clearStorageSync();

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})