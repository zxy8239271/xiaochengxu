var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    lists: [],
    changeData: [],
    orderId: '',
    Module: '',
    textBtn: '确认',
    action: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.orderId;
    this.setData({
      Module: options.Module
    })
    // this.data.Module = options.Module;
    this.data.action = options.action;
    var action = options.action;//区分是receiveSec部分收货 还是部分接单TakingSec
    if (action == 'receiveSec') {
      wx.setNavigationBarTitle({
        title: '部分收货'
      });
      this.setData({
        textBtn: '确认部分收货',
        Module: options.Module
      })
    } else if (action == 'TakingSec') {
      wx.setNavigationBarTitle({
        title: '部分接单'
      });
      this.setData({
        textBtn: '确认部分接单',
        Module: options.Module
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      order_sn: this.data.orderId,
      Module: this.data.Module
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.orderDetailUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.setData({
          lists: res.data
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    }).catch(res => {
      console.log("订单详情")
    })
  },
  sureNumFn: function (e) {  // 点击确认数量后加号减号同时隐藏
    // console.log(e)
    var targetId = e.currentTarget.dataset.id;   // 找到对应的id，并更改对应数据中的is_sure的值为true
    var lists = this.data.lists;
    var listData = lists.data
    var resultId = listData.findIndex(function (item) {
      return item.id == targetId;
    })
    listData[resultId].composite_status ='received' ;
    lists.data = listData;
    this.setData({
      lists: lists
    })
    if (this.data.Module == 'wapUser') {//如果是买家的时候，逐个收货调接口
      var data = {
        order_sn: this.data.orderId,
        sub_order_id: targetId,
        Module: this.data.Module,
        act: this.data.action,
        realnum: listData[resultId].real_num,
        num: listData[resultId].num,
        price: listData[resultId].price
      }
      var _this = this;
      app.netWork.postJson(app.urlConfig.orderReceiveSec, data).then(res => {
        if (res.errorNo == '0') {

        }
      }).catch(res => {
        console.log('逐个确认')
      })
    } else {

    }
  },
  addNumFn: function (e) {  // 点击增加
    var targetId = e.currentTarget.dataset.id;
    var lists = this.data.lists;
    var listData = lists.data;
    var resultId = listData.findIndex(function (item) {
      return item.id == targetId;
    })
    if (listData[resultId].real_num == listData[resultId].num) {
      var i = this.data.changeData.findIndex(function (item) {
        return item.id == targetId;
      });
      if (i == '-1') {
        console.log('接收商品的数量和订购量相等的情况下')
      } else {
        this.data.changeData.splice(i, 1);
      }
    } else if (listData[resultId].real_num < listData[resultId].num) {
      listData[resultId].real_num = parseFloat(listData[resultId].real_num) + 1;
      lists.price = lists.price + listData[resultId].real_price * 1;
      lists.data = listData;
      this.setData({
        lists: lists
      });
      var i = this.data.changeData.findIndex(function (item) {
        return item.id == targetId;
      });
      if (i == '-1') {
        this.data.changeData.push(listData[resultId])
        this.data.changeData[this.data.changeData.length - 1].real_num = listData[resultId].num - listData[resultId].real_num;
      } else {
        if (listData[resultId].num - listData[resultId].real_num == 0) {
          this.data.changeData.splice(i, 1);
        } else {
          this.data.changeData[i].real_num = listData[resultId].num - listData[resultId].real_num;
        }

      }
    } else {
      console.log('大于订单量')
    }
  },
  delNumFn: function (e) {//减号
    var targetId = e.currentTarget.dataset.id;
    var lists = this.data.lists;
    var listData = lists.data;
    var resultId = listData.findIndex(function (item) {
      return item.id == targetId;
    })
    if (listData[resultId].real_num <= 0) {
      listData[resultId].real_num = 0;
      return
    }
    listData[resultId].real_num = parseFloat(listData[resultId].real_num) - 1;
    lists.price = lists.price - listData[resultId].real_price * 1;
    lists.data = listData;
    this.setData({
      lists: lists
    })
    // 存储变动的数量
    var i = this.data.changeData.findIndex(function (item) {
      return item.id == targetId;
    });
    if (i == '-1') {
      this.data.changeData.push(listData[resultId])
      this.data.changeData[this.data.changeData.length - 1].real_num = listData[resultId].num - listData[resultId].real_num;
    } else {
      this.data.changeData[i].real_num = listData[resultId].num - listData[resultId].real_num;
    }
  },
  valueChangeFn: function (e) {// input直接更改结果时
    // console.log(e);
    var targetId = e.currentTarget.dataset.id;
    var targetValue = e.detail.value;
    var lists = this.data.lists;
    var listData = lists.data;
    var resultId = listData.findIndex(function (item) {
      return item.id == targetId;
    })
    // 去掉用户输的左边的0;
    var result = targetValue.replace(/^0+/, "");
    if (result == "") {
      result = 0;
    }
    if (result <= 0) {
      result = 0;
    }
    lists.price = lists.price - (listData[resultId].real_num - listData[resultId].num) * real_price;
    listData[resultId].real_num = result;
    lists.data = listData;
    this.setData({
      lists: lists
    })
    // 存储更改的数量
    var i = this.data.changeData.findIndex(function (item) {
      return item.id == targetId;
    });
    if (i == '-1') {
      this.data.changeData.push(listData[resultId])
      this.data.changeData[this.data.changeData.length - 1].real_num = listData[resultId].num - listData[resultId].real_num;
    } else {
      this.data.changeData[i].real_num = listData[resultId].num - listData[resultId].real_num;
    }
    console.log(this.data.changeData)
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

  sureGoodsTake: function () {
    var takeData = [];
    this.data.lists.data.filter(function (item, index) {
      if (item.real_num != '0') {
        takeData.push(item)
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    var data = {
      order_sn: this.data.orderId,
      taking: JSON.stringify(takeData),
      reject: JSON.stringify(this.data.changeData),
      Module: this.data.Module
    }
    if (this.data.Module == 'wapSupplier') {
      app.netWork.postJson(app.urlConfig.orderPartTakingUrl, data).then(res => {
        if (res.errorNo == '0') {
          wx.hideLoading()
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../myOrder/myOrder?type=' + this.data.Module + '&status='
          })
        }else{
          wx.showToast({
            title: res.message,
            duration: 2000
          })
        }
      }).catch(res => {
        console.log("订单详情")
      })
    } else {
      // app.netWork.postJson(app.urlConfig.orderReceiveSec, data).then(res => {
      //   if (res.errorNo == '0') {
      //     wx.hideLoading()
      //     wx.showToast({
      //       title: '成功',
      //       icon: 'success',
      //       duration: 2000
      //     })
      //     util.navTo({
      //       url: '../myBullOrder/myBullOrder?type=' + this.data.Module + '&status='
      //     })
      //   }
      // }).catch(res => {
      //   console.log("订单详情")
      // })
    }


  }
})