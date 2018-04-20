var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    // tab切换  
    isShowAddMain: false, //默认隐藏扫码添加及发邀请给客户
    currentTab: 0,
    supplierData: [],
    auth: true,
    id: '',
    imgUrl: '',
    openId: '',
    staff_id: '',
    user_id: '',
    company_id: '',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '供应商'
    });
    if (options) {
      this.data.id = options.id;
      this.data.openId = options.openId
      this.data.staff_id = options.staff_id;
      this.data.company_id = options.company_id;//这个是转发人的公司
      this.data.user_id = options.user_id;//
    }
  },
  onReady: function () {
    if (this.data.openId != undefined && this.data.openId != null || this.data.openId != '') {
      if (this.data.openId != wx.getStorageSync('openId')) {
        if (this.data.id == '0') {
          wx.redirectTo({
            url: '../inviteStaff/inviteStaff?id=' + this.data.id + ' &openId=' + this.data.openId + ' &staff_id=' + this.data.staff_id + '&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id
          })
        }
      }
    }
  },
  onShow: function () {
    if (this.data.openId) {

    } else {
      this.supplierList();
    }
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    this.supplierList();
  },
  goSupplierDetail: function (e) {
    if (util.authFind('supplier_info')) {//先去查看用户是否有权限查看
      util.navTo({
        url: '../supplierDetail/supplierDetail?id=' + e.currentTarget.dataset.id
      })
    } else {
      wx.showToast({
        title: '无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }

  },
  onShareAppMessage: function (res) {//邀请
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
      title: useData.company_name + '公司诚邀您成为他/她的供应商,为他提供产品？',
      path: '/pages/codePage/codePage?id=0&openId=' + openId + '&staff_id=' + staff_id + '&company_id=' + company_id + '&user_id=' + user_id,
      imageUrl: '../../images/yaoqing.jpg',
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  supplierAdd: function () {
    var _this = this;
    if (this.data.isShowAddMain == false) {
      this.setData({
        isShowAddMain: true
      });
      setTimeout(function () {
        _this.setData({
          isShowAddMain: false
        });
      }, 2000);
    } else {
      this.setData({
        isShowAddMain: false
      });
    }
  },
  addIcon: function () {
    var openId = wx.getStorageSync('openId')
    util.navTo({
      url: "../codePage/codePage?id=0&openId=" + openId
    })
  },
  supplierList: function () {
    var data = {
      status: this.data.currentTab
    }
    var _this = this;
    app.netWork.postJson(app.urlConfig.supplierListUrl, data).then(res => {
      if (res.errorNo == '0') {
        _this.setData({
          supplierData: res.data
        })
      }
    }).catch(res => {
      console.log("部分接单")
    })
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  // onTabItemTap: function (item) {
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
})