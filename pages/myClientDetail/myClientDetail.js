// pages/myClientDetail/myClientDetail.js
var app = getApp();
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    hezuoNum: false, //先隐藏合作次数html部分
    customerData: [],
  },
  getStatus: function (id) {
    var _this = this;
    app.netWork.postJson(app.urlConfig.myInformationMyClientDetailUrl, { "id": id }).then(res => {
    console.log(res)
      if (res.errorNo == 0) {

        _this.setData({
          customerData: res.data
        });
      }else{
        wx.showToast({
          title: '获取信息失败',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        });
     
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿到列表页带过来的id
    this.data.id = options.id;
    this.getStatus(this.data.id);
    console.log(this.data.id)

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
  // 删除
  delFn: function () {
    var that = this;
    wx.showModal({
      title: '删除提示',
      content: '确认删除客户' + this.data.customerData.name+"吗？",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var data = {
            id: that.data.id,
            status: 1
          }
          console.log(that.data.id);
          app.netWork.postJson(app.urlConfig.myInformationMyClientDetailDelUrl, data).then(res => {

            // console.log(res);
            // console.log(data);
            if (res.errorNo == 0) {
                 wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                title: res.errorMsg,
                image: '../../images/warning.png',
                duration: 2000,
                mask: true
              });
              return

            }
          });


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })






  },
  // 设为优选,此页面中暂时不用这个功能
  setFirstFn: function () {
    console.log("setFirstFn");


  },
  // 暂停合作
  StopFn: function () {
    var that = this;
    wx.showModal({
      title: '暂停合作确认',
      content: " 暂停和该客户合作后，客户下次的订单您将无法收到，请谨慎操作。",
      confirmText: "确定暂停",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 暂停
          app.netWork.postJson(app.urlConfig.supplierEndUrl, { "id": that.data.id, "status": 1 }).then(res => {

            console.log(res);
            if (res.errorNo == 0) {
              that.getStatus(that.data.id);
            }else{
              wx.showToast({
                title: res.errorMsg,
                image: '../../images/warning.png',
                duration: 2000,
                mask: true
              });
              return
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 恢复合作
  recoverFn: function () {
    var that = this;
    wx.showModal({
      title: '恢复合作确认',
      content: " 恢复该客户合作后，客户下次的订单您将收到，请谨慎操作。",
      confirmText: "确定恢复",
      success: function (res) {
        if (res.confirm) {

          app.netWork.postJson(app.urlConfig.supplierEndUrl, { "id": that.data.id, "status": 0 }).then(res => {
            console.log("恢复");        
            console.log(res)
            if (res.errorNo == 0) {
              // 重新请求数据渲染界面
              that.getStatus(that.data.id);
            }else{
              wx.showToast({
                title: res.errorMsg,
                image: '../../images/warning.png',
                duration: 2000,
                mask: true
              });
              return
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
})

