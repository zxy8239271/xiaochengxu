// pages/chooseUnit/chooseUnit.js
var app = getApp();
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unitLists: [],
    isSelect: ""  //标记进入此页面后是否可以有切换单位的功能，0可以，1不可以
  },

  /**
  * radio监听事件
  */
  listenerRadioGroup: function (e) {
    var id = e.detail.value
    // console.log(id);切换工作单位
    app.netWork.postJson(app.urlConfig.myInformationChangeUnitUrl, { "id": id }).then(res => {
      if (res.errorNo == 0) {
        wx.setStorageSync('openId', res.data.openid_xcx)
        app.loginInfoData = res.data;
        // wx.setStorageSync('token', res.data.token);
        wx.showToast({
          title: '切换单位成功',
          icon: 'success',
          duration: 2000,
          mask:true
        })
        // 跳转到首页


        setTimeout(function(){
          wx.switchTab({
            url: "../homePage/homePage"
          });
        },2000)
    

      }else{

        wx.showToast({
          title: "切换单位失败",
          image: "../../images/warning.png",
          duration: 1000,
          mask: true
        });
        return

      }
    }).catch(err=>{
      wx.showToast({
        title:"切换单位失败",
        image: "../../images/warning.png",
        duration: 1000,
        mask: true
      });
      return
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入工作单位页面")
    // console.log(options.isSelect)
    this.setData({
      isSelect: options.isSelect
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
    console.log("进入show")
    app.netWork.postJson(app.urlConfig.myInformationChooseUnitUrl, {}).then(res => {
      console.log(res)
      if (res.errorNo == 0) {
        this.setData({
          unitLists: res.data
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log('222333')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    if (this.data.isSelect=='0'){
      wx.switchTab({
        url: '../homePage/homePage',
      })
    }else{
      wx.switchTab({
        url: '../myHome/myHome',
      })
    }
   
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
  // 跳转到创建一个店铺页面,不带信息的创建店铺页面
  toCreateShopNull: function () {
    // isDetail = 0标记只进入一个空的创建店铺页面
    util.navTo({
      url: "../createShop/createShop?isDetail=0"
    });
  },
  //点击编辑进入详情--带信息的创建店铺页面
  toCreateShop: function (e) {
    // console.log(e.target.dataset);
    // 需携带单位的company_id
    util.navTo({
      url: "../reviseShopInfo/reviseShopInfo?company_id=" + e.target.dataset.company_id
    });


  }
})