var app = getApp();
import util from '../../utils/util.js'
Page({
  data: {
    date: '2018-09-01',
    listData: [],
    allnum: 0,
    allprice: 0,
    addressData:[]
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

  
    var date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate()
    if (M<10){
      M='0'+M;
    }
    if (D<10){
      D = '0' + D ;
    }
    console.log(Y+'-'+M+'-'+D)
    
    this.data.listData = JSON.parse(wx.getStorageSync('shoplist'))
    var sureData = this.data.listData;
    var price = 0;
    var num = 0;
    this.data.listData.filter(function (item, index) {
      price += item.allPrice
      num += item.allNum;
    })
    this.setData({
      listData: JSON.parse(wx.getStorageSync('shoplist')),
      allnum: num,
      allprice: util.toFix(price),
      date: Y + '-' + M + '-' + D
    });
  },
  changeShow: function (e) {// 点击蔬菜切换显示
    var fatherid = e.currentTarget.dataset.fatherid;
    var selfid = e.currentTarget.dataset.selfid - 0;
    var arr = this.data.listData[fatherid].classifly;
    var isShow = this.data.listData[fatherid].classifly[selfid].carDetailIsShow;
    var up = "listData[" + fatherid + "].classifly[" + selfid + "].carDetailIsShow"; //先用一个变量，把(listData[0].son[0].carDetailIsShow)用字符串拼接起来
    if (isShow) {
      this.setData({
        [up]: false
      })
    } else {
      this.setData({
        [up]: true
      })
    }

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  changeRemarks: function (e) {
    var index = e.currentTarget.dataset.id;
    var up = "listData[" + index + "].remarks"; //先用一个变量，把(listData[0].son[0].carDetailIsShow)用字符串拼接起来
    this.setData({
      [up]: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this=this;
    app.netWork.postJson(app.urlConfig.getAddressUrl, {}).then(res => {
      if (res.errorNo=='0'){
        _this.setData({
          addressData:res.data
        })
      }
console.log(res)
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
    // wx.redirectTo({
    //   url: '../shoppingCart/shoppingCart'
    // })
  },

  sureConfirmBtn: function () {//确认订单

    if (util.authFind('orderproduct_create')) { //检验权限
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      var sureData = this.data.listData;
      var arr = [];
      sureData.filter(function (item, index) {
        arr.push({
          supplier_name: item.supplier_name,
          supplier_id: item.supplier_id,
          remarks: item.remarks,
          children: item.children
        })
      })
      var _this = this;
      var data = {
        info: JSON.stringify(arr),
        allprice: this.data.allprice,
        time: this.data.date,
      }
      app.netWork.postJson(app.urlConfig.createOrderUrl, data).then(res => {
        console.log(res);
        if (res.errorNo == '0') {
          wx.hideLoading()

          wx.showModal({
            title: '温馨提示',
            content: '订单提交成功',
            cancelText: '继续采购',
            confirmText: '查看订单',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "../myBullOrder/myBullOrder?type=wapUser"
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../orderList/orderList'
                })
              }
            }
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        }
      }).catch(res => {

        console.log(res)
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
  goReviseShopInfo:function(){
     util.navTo({
       url: '../reviseShopInfo/reviseShopInfo?company_id=' + app.loginInfoData.company_id,//
     })
  }
})