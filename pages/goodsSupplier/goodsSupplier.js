var app = getApp()
import util from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    id: '',
    name: '',
    supplierArray: [],
    isShow: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.id = options.id;
    this.data.code = options.code;
    this.data.name = options.name;
    if (util.authFind('productoffer_index')) { //检验权限
      this.productOffe();
    } else {
      this.setData({
        isShow: false
      })
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  productOffe: function () {
    var _this = this;
    var data = {
      product_id: this.data.id,
      page: 1,
      page_size: 30
    }
    app.netWork.postJson(app.urlConfig.productOfferUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.setData({
          supplierArray: res.data
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
      console.log("供应商列表")
    })
  },
  toAddSupplier: function () {

    if (util.authFind('productoffer_addSupplier')) { //检验权限
      util.navTo({
        url: "../goodsSupplierAdd/goodsSupplierAdd?id=" + this.data.id + '&code=' + this.data.code + '&name=' + this.data.name
      })
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  radioChange: function (e) {//修改默认供应商
    if (util.authFind('productoffer_defaultSupplier')) { //检验权限
      var value = e.detail.value;


      var _this = this;
      var data = {

        product_id: this.data.id,  //产品id
        id: value
      }
      console.log(data);
      app.netWork.postJson(app.urlConfig.changeSupplierUrl, data).then(res => {
        if (res.errorNo == '0') {
          _this.productOffe();
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
            mask: true
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
        console.log("供应商列表")
      })
    } else {
      wx.showToast({
        title: '暂无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  /*删除函数*/
  delFn: function (e) {
    var item = e.target.dataset.item;
    var _this = this;
    var data = {
      id: item.id
    }
    app.netWork.postJson(app.urlConfig.productofferDelUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.productOffe();
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          mask: true
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
      console.log("供应商列表")
    })
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
    wx.switchTab({
      url: '../goods/goods',
    })
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