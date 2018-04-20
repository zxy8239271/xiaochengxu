
var app = getApp();
import util from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowAddMain: false, //默认隐藏扫码添加及发邀请给客户
    currentTab: 0,
    hideHeader: false,
    isShowMore: false,//默认一开始隐藏没有更多数据了
    isShowloading: false,//隐藏加载中
    dataLists: [],//存储请求到的所有的数据
    searchLetter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'], //存储A-Z 循环得到每个字母的开始和结束坐标位置
    isShowLetter: false, //点击字母时给用户展示的选中字母是哪个的方块
    toView: 'A',//点击右侧字母跳转到哪里
    top: 0,
    id: '',
    imgUrl: '',
    openId: '',
    staff_id: '',
    company_id: '',
    user_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.data.id = options.id;
      this.data.openId = options.openId
      this.data.staff_id = options.staff_id;
      this.data.company_id = options.company_id;//这个是转发人的公司
      this.data.user_id = options.user_id;//这个是转发人的头像
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   **/
  onReady: function () {
    if (this.data.openId != undefined && this.data.openId != null || this.data.openId != '') {
      if (this.data.openId != wx.getStorageSync('openId')) {
        if (this.data.id == '2') {
          wx.redirectTo({
            url: '../inviteStaff/inviteStaff?id=' + this.data.id + ' &openId=' + this.data.openId + ' &staff_id=' + this.data.staff_id + '&company_id=' + this.data.company_id + '&user_id=' + this.data.user_id
          })
        }
      }
    }
  },
  onShareAppMessage: function (res) {
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
      title: useData.company_name + '公司诚邀您成为他/她的客户,点击接受邀请？',
      path: '/pages/codePage/codePage?id=2&openId=' + openId + '&staff_id=' + staff_id + '&company_id=' + company_id + '&user_id=' + user_id,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.openId) {

    } else {
      this.getDatas(this.data.currentTab);
    }

    // 进入前台隐藏加号的内容
    this.setData({
      isShowAddMain: false
    });
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
  getDatas: function (currentTab) {
    wx.showLoading({
      title: '加载中'
    });
    var _this = this;
    // 发送请求获取所有的数据
    app.netWork.postJson(app.urlConfig.myInformationMyClientUrl, { "status": currentTab }).then(res => {
      console.log(res);
      if (res.errorNo == 0) {

        if (res.data.length != 0) {
          _this.setData({
            dataLists: res.data
          });
        } else {
          _this.setData({
            dataLists: [],
            isShowMore: true
          });
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
      wx.showToast({
        title: '数据请求失败',
        image: '../../images/warning.png',
        duration: 2000
      });
      wx.hideLoading();
    });

  },
  // 切换tab
  swichNav: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current,
      isShowAddMain: false,
      top: 0
    });
    // 请求最新的数据
    this.getDatas(this.data.currentTab);

  },
  // 手指在字母列触摸
  tapZimu: function (e) {
    console.log(e)
    var that = this;
    const toView = e.currentTarget.dataset.letter;
    this.setData({
      toView: toView,
      isShowLetter: true,
    })
    // // 关闭提示选中字母的方块
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 300)

  },
  // 点击头像跳转到客户详情页页面
  toMyClientDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    util.navTo({
      url: '../myClientDetail/myClientDetail?id=' + id,
    });
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
    var openId = wx.getStorageSync('openId')
    util.navTo({
      url: "../codePage/codePage?id=2&openId=" + openId
    })
  },
  // 点击列表右边的电话或者电话图标调用打电话的功能
  call: function (e) {
    console.log(e.currentTarget.dataset.phonenum);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum
    })
  },
  cusScroll: function (e) {
    var _this = this;
    var scrollTop = e.detail.scrollTop * 2,
      h = 0;
    console.log(e)
  }
})