var app = getApp();
import util from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    array: [],
    index: 0,
    company_id: '',
    company_name: '',
    staff_id: '',
    user_id: '',
    logo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '邀请页'
    });
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    app.urls = url;
    var _this = this;    
    var scene = decodeURIComponent(options.scene).split('=');  //扫描二维码进入页面的参数
    console.log(options)
    console.log(scene)
    console.log(scene[0], scene[1], scene[2], scene[3])
    this.setData({
      status: scene[1]||options.id.trim(),
    })
    this.data.company_id = options.company_id || scene[2]
    this.data.staff_id = options.staff_id || scene[0];
    this.data.user_id = options.user_id || scene[3];
    if (_this.data.status == '0' || _this.data.status == '2') {
      _this.supplierList()
    }
    app.netWork.postJson(app.urlConfig.inviteInfoUrl, { company_id: this.data.company_id  }).then(res => {//店铺列表
      // console.log(this.data.company_id +'dahfsgah')
      console.log(res )
      if (res.errorNo == '0') {
        _this.setData({
          company_name: res.data.name,
          logo: res.data.logo
        })
      }else{
        wx.showToast({
          title: res.errorMsg,
          duration: 2000,
        })
      }
    }).catch(res => {

    })
    // 


  },
  cancleBtn: function () { //取消 就退出小程序
    var staff_id = app.loginInfoData.staff_id;
    if (staff_id) {//先判断当前登录人有没有加入到公司
      wx.switchTab({
        url: '../homePage/homePage'
      })
    } else {
      wx.navigateBack({
        delta: 0
      })
    }

  },
  sureBtn: function () {
    var _this = this;
    var staff_id = app.loginInfoData.staff_id;
    console.log(staff_id);
    if (staff_id) {//先判断当前登录人有没有加入到公司
      if (this.data.status == '0') {//被邀请成为供应商
        console.log(this.data.status);
        var data = {
          company_id: this.data.company_id,
          supplier_id: this.data.array[this.data.index].company_id,
          user_id: app.loginInfoData.user_id
        }
        app.netWork.postJson(app.urlConfig.doBindSupplierUrl, data).then(res => {//
          console.log(res)
          if (res.errorNo == '0') {
            wx.showToast({
              title: res.errorMsg,
              icon: 'success',
              duration: 2000,
              mask: true
            })
            wx.switchTab({
              url: '../homePage/homePage'
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
          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        })
      } else if (this.data.status == '1') {//被邀请成为员工
        var dataJson = {
          staff_id: this.data.staff_id,
          user_id: app.loginInfoData.user_id
        }
        app.netWork.postJson(app.urlConfig.doBindStaffUrl, dataJson).then(res => {//
          if (res.errorNo == '0') {
            wx.showToast({
              title: '加入成功',
              icon: 'success',
              duration: 2000,
              mask: true
            })
            wx.switchTab({
              url: '../myHome/myHome'
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
          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        })

      } else if (this.data.status == '2') {//被邀请成为客户
        var jsonData = {
          company_id: this.data.company_id,//邀请人
          supplier_id: this.data.array[this.data.index].company_id,
          user_id: this.data.user_id//	邀请人的用户ID 

        }
        app.netWork.postJson(app.urlConfig.doBindShopUrl, jsonData).then(res => {//
          if (res.errorNo == '0') {
            wx.showToast({
              title: res.errorMsg,
              icon: 'success',
              duration: 2000,
              mask: true
            })
            wx.switchTab({
              url: '../homePage/homePage'
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
          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        })

      } else { //进入方式不对
        wx.showToast({
          title: '非法进入',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
      }
    } else { //如果不存在
      if (this.data.status == '0') {//被邀请成为供应商
        wx.redirectTo({
          url: '../createShop/createShop?status=0&company_id=' + this.data.company_id,
        })
      } else if (this.data.status == '1') {//被邀请成为员工

        var dataJson = {
          staff_id: this.data.staff_id,
          user_id: app.loginInfoData.user_id
        }
        app.netWork.postJson(app.urlConfig.doBindStaffUrl, dataJson).then(res => {//
          if (res.errorNo == '0') {
            wx.showToast({
              title: res.errorMsg,
              icon: 'success',
              duration: 2000,
              mask: true
            })
            wx.redirectTo({
              url: '../testPhone/testPhone?staff_id=' + this.data.staff_id,
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
          wx.showToast({
            title: res.errorMsg,
            image: '../../images/warning.png',
            duration: 2000,
            mask: true
          })
        })

      } else if (this.data.status == '2') {//被邀请成为客户
        wx.redirectTo({
          url: '../createShop/createShop?status=2&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id,
        })
      } else { //进入方式不对
        wx.showToast({
          title: '非法进入',
          image: '../../images/warning.png',
          duration: 2000,
          mask: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  supplierList: function () {
    var _this = this;
    app.netWork.postJson(app.urlConfig.myCompanyUrl, {}).then(res => {//店铺列表
      console.log(res)
      if (res.errorNo == '0') {
        _this.setData({
          array: res.data
        })
      }
    }).catch(res => {

    })
  },
  onShow: function () {

    // console.log(pages)
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
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