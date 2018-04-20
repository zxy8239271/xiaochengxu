// pages/myAddress/myAddress.js


// 引入省市县数据
import earaInfo from "../../utils/earaInfo.js";
import util from '../../utils/util.js';

var app = getApp()

Page({
  data: {
    // 省市相关
    regionData: earaInfo.earaInfo[0].data,  //请求到的省市县的数据汇总
    regionPageArray: [earaInfo.earaInfo[0].data, [], []], //展示在页面的省市县数据
    regionIndex: [0,0,0],  //展示省市县各级的下标，相对于regionArray
    regionResultIndex: [0,0,0], //最终展示在页面上的省市县的下标
    regionResult: [],  //初始默认展示的省市县

    // 详情地址部分
    myAddress: "",
    carryData: {}, //记录携带过来的省市县以及address是什么
    flag: true

  },

  // 未携带省市县时，默认展示北京 北京 东城区
  getInitShengshixian: function () {
    // 更新regionPageArray即可
    this.data.regionPageArray[1] = this.data.regionData[0].son;
    this.data.regionPageArray[2] = this.data.regionData[0].son[0].son;
    // 更新展示在页面的regionResult数据
    this.data.regionResult[0] = this.data.regionPageArray[0][0];
    this.data.regionResult[1] = this.data.regionPageArray[1][0];
    this.data.regionResult[2] = this.data.regionPageArray[2][0];

    this.setData({
      regionResult: this.data.regionResult,
      regionPageArray: this.data.regionPageArray,
    });
  },

  getDuiYingShengshixian: function () {
    // 拿到对应的省市县
    var province_name = this.data.carryData.provinces_name;//省,注意provinces_name有s
    var city_name = this.data.carryData.city_name;//市
    var county_name = this.data.carryData.county_name;//县

    // console.log(province_name, city_name, county_name)
    // 找到对应省份的整条数据
    var linshiRegionData = this.data.regionData.find(function (item, index) {
      return item.region_name == province_name
    });

    // 更新regionIndex regionResultIndex
    this.data.regionIndex[0] = this.data.regionData.findIndex(function (item, index) {
      return item.region_name == province_name
    });

    this.data.regionResultIndex[0] =this.data. regionIndex[0];

    // 把对应省份整条数据的市放到regionPageArray[1]中
    for (var i = 0; i < linshiRegionData.son.length; i++) {
      this.data.regionPageArray[1].push(linshiRegionData.son[i]);
    }

    // 更新regionIndex regionResultIndex
    this.data.regionIndex[1] = this.data.regionPageArray[1].findIndex(function (item) {
      return item.region_name == city_name
    })

    this.data.regionResultIndex[1] = this.data.regionIndex[1];

    // 把对应县级的数据放到regionPageArray[2]中
    for (var i = 0; i < linshiRegionData.son[this.data.regionResultIndex[1]].son.length; i++) {
      this.data.regionPageArray[2].push(linshiRegionData.son[this.data.regionResultIndex[1]].son[i])
    }

    // 更新regionIndex regionResultIndex
    this.data.regionIndex[2] = this.data.regionPageArray[2].findIndex(function (item) {
      return item.region_name == county_name
    })
   this.data. regionResultIndex[2] = this.data.regionIndex[2];
    // 更新要展示在页面的regionResult
    this.data.regionResult[0] =  this.data.regionPageArray[0][ this.data.regionResultIndex[0]];
   this.data. regionResult[1] =  this.data.regionPageArray[1][ this.data.regionResultIndex[1]];
   this.data.regionResult[2] =  this.data.regionPageArray[2][ this.data.regionResultIndex[2]];

    this.setData({
      regionPageArray: this.data.regionPageArray,
      regionIndex:this.data. regionIndex,
      regionResultIndex: this.data.regionResultIndex,
      regionResult: this.data.regionResult
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })


    // 记录携带过来的各项地址数据
    this.setData({
      carryData: options,
      myAddress: options.address,
      // regionPageArray: [this.data.regionData,[],[]]

    });
      // 如果携带过来有省市县数据，那么picker展示对应的省市县
    if (this.data.carryData.provinces_name == "") {
      this.getInitShengshixian(); //获取默认初始的省市县列表
    }

    // 如果没有携带过来省市县数据，那么picker中展示初始的省市县
    if (this.data.carryData.provinces_name != "") {
      this.getDuiYingShengshixian();  //获取对应的省市县列表
    }

    wx.hideLoading();

  },

  bindRegionChange: function (e) {//產地修改完成
    this.data.regionResultIndex = this.data.regionIndex;
    // 更新展示在页面上的数据
    this.data.regionResult[0] = this.data.regionPageArray[0][this.data.regionResultIndex[0]]
    this.data.regionResult[1] = this.data.regionPageArray[1][this.data.regionResultIndex[1]]
    this.data.regionResult[2] = this.data.regionPageArray[2][this.data.regionResultIndex[2]]

    this.setData({
      regionResultIndex: this.data.regionResultIndex,
      regionResult: this.data.regionResult
    });
  },


  // 滚动产地picker
  bindRegionColumnChange: function (e) {//產地修改事件
    // console.log(e.detail.column,e.detail.value)
    // 如果滚动的是第0列
    if (e.detail.column == 0) {
      this.data.regionIndex = [e.detail.value, 0, 0];
      this.data.regionPageArray[1] = this.data.regionData[e.detail.value].son;
      this.data.regionPageArray[2] = this.data.regionData[e.detail.value].son[0].son;
    } else if (e.detail.column == 1) {
      this.data.regionIndex[1] = e.detail.value;
      this.data.regionIndex[2] = 0;
      this.data.regionPageArray[2] = this.data.regionData[this.data.regionIndex[0]].son[this.data.regionIndex[1]].son;
    } else if (e.detail.column == 2) {
      this.data.regionIndex[2] = e.detail.value;
    }
    this.setData({
      regionIndex: this.data.regionIndex,
      regionPageArray: this.data.regionPageArray
    });

  },
  // 用户在详情地址输入框中输入输入内容时更新数据
  addressInput: function (e) {
    this.data.myAddress = e.detail.value;
  },

  addressBlur: function (e) {
    this.setData({
      myAddress: this.data.myAddress
    })
  },
  // 用户保存地址时
  saveAddressFn: function () {

    // 判断用户是否有改动
    if (this.data.carryData.provinces_name == this.data.regionResult[0].region_name && this.data.carryData.city_name == this.data.regionResult[1].region_name && this.data.carryData.county_name == this.data.regionResult[2].region_name && this.data.myAddress == this.data.carryData.address) {
      //  没有修改任何信息

      wx.showToast({
        title: '没有修改地址',
        image: '../../images/warning.png',
        duration: 2000,
        mask: true
      });
      return


    } else {
      console.log("有修改");
      // 发送请求提交更改过的地址

      var data = {
        provinces_name: this.data.regionResult[0].region_name,
        city_name: this.data.regionResult[1].region_name,
        county_name: this.data.regionResult[2].region_name,
        address: this.data.myAddress
      }

      // 防止重复保存地址
      if (this.data.flag == false) {
        return
      }

      this.setData({
        flag: false
      })
      app.netWork.postJson(app.urlConfig.myInformationSaveAddressUrl, data).then(res => {
           if (res.errorNo == 0) {
          wx.showToast({
            title: '地址修改成功',
            icon: 'success',
            duration: 2000,
            mask: true
          });


          // 跳转至我的页面
          setTimeout(function () {
            // 返回上一页面
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        } else {
          // 开启可以保存的开关
          this.setData({
            flag: true
          });

          wx.showToast({
            title: '地址修改失败',
            icon: 'success',
            duration: 2000,
            mask: true
          });

        }

      })



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



})