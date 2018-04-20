// pages/invitePage/invitePage.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据c      
   */
  data: {

  },
  /**    
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '邀请列表'
    });
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
  toQRcode: function (e) {
    var openId = wx.getStorageSync('openId')
    var id = e.currentTarget.dataset.id
    util.navTo({
      url: "../codePage/codePage?id="+id+'&openId='+openId
    })
  }
})