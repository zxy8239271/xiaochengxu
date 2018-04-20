var app = getApp();
import util from '../../utils/util.js';
Page({
  data: {
    currentTab: 0, //tab切换
    isLoading: true, // 是否显示加载中
    dataLists: [], //初始化员工列表,
    isShowAddMain: false, //控制是否显示加号折叠起来的内容
    id: '',
    openId: '',//转发用的
    staff_id: '',
    user_id: '',
    company_id: '',
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  // 右上角添加按钮
  showAddMain: function () {
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
  // 点击扫码添加
  addIcon: function () {
    var openId = wx.getStorageSync('openId');
    util.navTo({
      url: "../codePage/codePage?id=1&openId=" + openId
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    // 切换tab更新currentTab
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        dataLists: []  //每次切换tab都要把数据全部清空   
      })
    }
    this.staffList();
  },
  onLoad: function (options) {
    //  页面加载默认加载正常状态下的员工列表
    if (options) {
      this.data.id = options.id;
      this.data.openId = options.openId
      this.data.staff_id = options.staff_id;
      this.data.company_id = options.company_id;//这个是转发人的公司
      this.data.user_id = options.user_id;//这个是转发人的头像
    }
  },

  onReady: function () {
    if (this.data.openId != undefined && this.data.openId != null || this.data.openId != '') {
      if (this.data.openId != wx.getStorageSync('openId')) {
        if (this.data.id == '1') {
          wx.redirectTo({
            url: '../inviteStaff/inviteStaff?id=' + this.data.id + ' &openId=' + this.data.openId + ' &staff_id=' + this.data.staff_id + '&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id
          })
        }
      }
    }
  },
  // 页面显示
  onShow: function () {
    this.staffList();
  },
  staffList: function () {
    this.data.initPages = 1;
    var _this = this;
    var data = {
      status: this.data.currentTab,
      page: this.data.initPages,
      page_size: 10
    }
    wx.showLoading({
      title: '加载中',
    });
    app.netWork.postJson(app.urlConfig.myStaffListsUrl, data).then(res => {
      if (res.errorNo == 0) {
        console.log(res)

        _this.setData({
          dataLists: res.data,
        })

        if (res.total <= 10 || res.data.length == 0) {
          _this.setData({
            isLoading: false
          })
        }
     
      } else {
        wx.showToast({
          title: '数据加载失败',
          image: '../../images/warning.png',
          duration: 2000
        })
      }

      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: '数据加载失败',
        image: '../../images/warning.png',
        duration: 2000
      });
      wx.hideLoading();
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //点击事件处理
  toStaffDetail: function (e) {
    if (util.authFind('staff_info')) {
      util.navTo({
        url: "../staffDetail/staffDetail?id=" + e.currentTarget.dataset.id
      });
    } else {
      wx.showToast({
        title: '无权限',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      })
    }
  },
  /**
  * 页面相关事件处理函数--监听用户下拉刷新动作
  */
  // onPullDownRefresh: function () {
  //   var _this = this;
  //   this.data.initPages = 1;
  //   var data = {
  //     status: this.data.currentTab,
  //     page: this.data.initPages,
  //     page_size: 10
  //   }
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   app.netWork.postJson(app.urlConfig.myStaffListsUrl, data).then(res => {
  //     if (res.errorNo == 0) {
  //       wx.stopPullDownRefresh();
  //       _this.setData({
  //         dataLists: res.data,
  //       })
  //       if (_this.data.dataLists.length > 0) {
  //         // _this.setData({
  //         //   isShow: true
  //         // })
  //       }
  //       if (res.total <= 10) {
  //         _this.setData({
  //           isLoading: false
  //         })
  //       }
  //       wx, wx.hideLoading()
  //     }
  //   })
  // },

  //下拉加载更多
  loadMore: function (e) {
    // 下一页要请求第几页
    this.data.initPages++;
    if (isLoading) return
    var data = {
      status: this.data.currentTab,
      page: this.data.initPages,
      page_size: 2
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.netWork.postJson(app.urlConfig.myStaffListsUrl, data).then(res => {
      if (res.errorNo == 0) {
        _this.data.dataLists.push(res.data)
        _this.setData({
          dataLists: _this.data.dataLists,
        })
        if (_this.data.dataLists.length > 0) {
          // _this.setData({
          //   isShow: true
          // })
        }
        if (res.total == _this.data.dataLists.length) {
          _this.setData({
            isLoading: false
          })
        } else {
          _this.setData({
            isLoading: true
          })
        }
      } else {

        wx.showToast({
          title: '数据请求失败',
          image: '../../images/warning.png',
          duration: 2000
        });
      }
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '数据请求失败',
        image: '../../images/warning.png',
        duration: 2000
      });
    })
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id     //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function (res) {//分享
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
      title: useData.company_name + '公司诚邀您加入他/她的团队，点击接受邀请？',
      path: '/pages/codePage/codePage?id=1&openId=' + openId + '&staff_id=' + staff_id + '&company_id=' + company_id + '&user_id=' + user_id,
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
})