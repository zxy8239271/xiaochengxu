// pages/personal/personal.js

var app = getApp();
import util from '../../utils/util.js';
Page({

  /**
 * 页面的初始数据
 */
  data: {

    address: "", // 地址
    provinces_name: "",//省
    city_name: "",//市
    county_name: "", //县
    name: "",  //姓名
    phone: "", //电话
    phone_bak: "", //备用电话
    photo: "",//头像地址
    qrurl: "" //二维码地址

  },

  toMyAddress: function () {

    util.navTo({
      url: "../myAddress/myAddress?provinces_name=" + this.data.provinces_name + "&city_name=" + this.data.city_name + "&county_name=" + this.data.county_name + "&address=" + this.data.address
    });

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
    app.netWork.postJson(app.urlConfig.myInformationUrl, {}).then(res => {
      if (res.errorNo == 0) {
        this.setData({
          address: res.data.address, // 地址
          provinces_name: res.data.provinces_name,//省
          city_name: res.data.city_name,//市
          county_name: res.data.county_name, //县
          name: res.data.name,  //姓名
          phone: res.data.phone, //电话
          phone_bak: res.data.phone_bak, //备用电话
          photo: res.data.photo,//头像地址
          qrurl: res.data.qrurl //二维码地址
        })
      }
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

})