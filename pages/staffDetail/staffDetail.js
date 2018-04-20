
var app = getApp();
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkds: [{ checked: true }, { checked: true }, { checked: true }],
    staffId: '',
    staffData: [],
    // isShowRight: false, //设置权限的模块暂时不用把html部分先隐藏
    array: [],
    index: 0,
    aclsData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 获取传入的id
    this.data.staffId = options.id;
    app.netWork.postJson(app.urlConfig.myStaffDetailUrl, { "id": this.data.staffId }).then(res => {
      if (res.errorNo == 0) {
        _this.setData({
          staffData: res.data
        })
        this.getAclsList();
      }
    })
    app.netWork.postJson(app.urlConfig.aclsListUrl, { company_id: app.loginInfoData.company_id, type: 0 }).then(res => {//角色列表
      if (res.errorNo == 0) {
        _this.setData({
          array: res.data
        })
      }
    })
  },
  // 删除员工
  delStaff: function () {
    var _this = this;
    wx.showModal({
      title: '删除员工确认',
      content: '当您删除该员工后，员工将无法继续使用平台进行任何操作',
      cancelText: '取消',
      confirmText: '确认删除',
      success: function (res) {
        if (res.confirm) {
          app.netWork.postJson(app.urlConfig.myStaffDetailDelUrl, { "id": _this.data.staffId, "status": 1 }).then(res => {
            if (res.errorNo == 0) {
              // 弹框提示删除成功
              wx.showToast({
                title: "删除成功",
                icon: "success",
                duration: 20000,
                mask: true
              });
              // 然后跳转到员工列表页面
              setTimeout(function () {
                // 关闭当前页面，返回上一页面或多级页面,1代表返回一级
                wx.navigateBack({
                  delta: 1
                });
              }, 2000);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 设为离职
  setStop: function () {
    var _this = this;
    wx.showModal({
      title: '设为离职',
      content: '当您设置员工未离职时，员工将无法继续使用平台进行任何操作，您也可以在员工恢复工作后撤销',
      cancelText: '取消',
      confirmText: '设为离职',
      success: function (res) {
        if (res.confirm) {
          app.netWork.postJson(app.urlConfig.myStaffDetailStopUrl, { "id": _this.data.staffId, "status": 1 }).then(res => {
            if (res.errorNo == 0) {
              wx.showToast({
                title: "设置成功",
                icon: "success",
                duration: 2000,
                mask: true
              });

              // 然后把删除和设为离职的按钮都隐藏，展示已离职
              _this.data.staffData.is_departure = 1
              setTimeout(function () {
                _this.setData({
                  staffData: _this.data.staffData
                })
              }, 2000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  bindPickerChange: function (e) {
    var _this = this;
    var up = 'staffData.role_name';
    var role_id = 'staffData.role_id';
    this.setData({
      [up]: this.data.array[e.detail.value].role_name,
      [role_id]: this.data.array[e.detail.value].id
    })
    this.editAcls();
  },
  editAcls:function(){
    // 
    var _this = this;
    var data = {
      id: this.data.staffData.role_id,
      s_id: this.data.staffData.id
    }
    app.netWork.postJson(app.urlConfig.editAclsUrl, data).then(res => {
      // console.log(res)
      if (res.errorNo == '0') {      
        _this.getAclsList();    
      }
    })
  },
  getAclsList: function () {
    var _this = this;
    _this.data.aclsData = [];
    var data = {
      role_id: this.data.staffData.role_id,
      staff_id: this.data.staffData.id
    }
    app.netWork.postJson(app.urlConfig.getAclsUrl, data).then(res => {
      console.log(res)
      if (res.errorNo == '0') {
        _this.setData({
          aclsData: res.data.rule
        })
      }
    })
  },
  changeSwitch: function (e) {
    var item = e.currentTarget.dataset.item;
    var _this = this;
    var data = {
      role_id: this.data.staffData.role_id,
      staff_id: this.data.staffData.id,
      acls: JSON.stringify(item)
    }
    app.netWork.postJson(app.urlConfig.serviceAclsUrl, data).then(res => {
      if (res.errorNo == '0') {
        this.getAclsList();
      }
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
})