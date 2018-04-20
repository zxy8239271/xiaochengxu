const earaInfo = require("../../utils/earaInfo.js");
const util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    // 省市相关
    regionData: earaInfo.earaInfo[0].data, //存储省市县数据
    regionPageArray: [], //展示在页面的省市县数据
    regionIndex: [],  //展示省市县各级的下标，相对于regionArray
    regionResultIndex: [], //最终展示在页面上的省市县的下标
    regionResult: [],  //初始默认展示的省市县
    initPhone: "", //一开始的手机号，标记手机号有没有更改过
    shopInfo: {
      company_id: "", //存储店铺company_id
      address: "", //详细地址   
      city_name: "",  //市名字
      phone: "", //电话
      county_name: "", //县
      logo: "",//店铺logo图片
      name: "", //店铺名称
      phone_bak: "", //备用电话
      provinces_name: "", //省名字
    },

    disabled: true,  //是否可以点击获取验证码
    count: 60,  //倒计时
    changeLogo: false, //标记logo图片是否有更改过
    flag: true,//标记是否可以点击创建店铺
    floatFlag: true, //标记是否可以点击验证码确认按钮
    floatSend: true, //控制发送验证码的开关
    msg: "", //装载验证手机号时的提示信息
    isShowFloatBox: false, //控制是否显示手机号验证的盒子
    floatPhone: "", //记录手机号验证中的电话是多少
    code: "",//手机验证码
    timer: null //定时器

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中',
      mask:true
    });
    console.log(options.company_id);

    var regionPageArray = [[], [], []];
    var regionResult = [];
    var regionIndex = [];
    var regionResultIndex = [];

    // 不管从新建进入还是编辑进入picker的省份都是一样的regionPageArray[0]的数据一样
    for (var i = 0; i < this.data.regionData.length; i++) {
      var regionDataI = this.data.regionData[i];
      regionPageArray[0].push({ region_id: regionDataI.region_id, parent_id: regionDataI.parent_id, region_name: regionDataI.region_name })
    }

    // 根据传递过来的company_id发送请求拿店铺的各项数据
    var data = {
      company_id: options.company_id
    }

    app.netWork.postJson(app.urlConfig.getShopDetail, data).then(res => {
      console.log(res);
      if (res.errorNo == 0) {

        var shopInfo = this.data.shopInfo;
        shopInfo.company_id = options.company_id; //这个company_id是从另外一个页面带过来的

        shopInfo.address = res.data.address;//详细地址   
        shopInfo.city_name = res.data.city_name; //市名字
        shopInfo.phone = res.data.contacts_info; //电话
        shopInfo.county_name = res.data.county_name;//县
        shopInfo.logo = res.data.logo;//店铺logo图片
        shopInfo.name = res.data.name; //店铺名称
        shopInfo.phone_bak = res.data.phone_bak;//备用电话
        shopInfo.provinces_name = res.data.provinces_name; //省名字


        this.setData({
          shopInfo: shopInfo,
          initPhone: res.data.contacts_info,  //默认初始的手机号就是通过验证的
        });
        // 在拿到数据之后处理对应的省市县
        var province_name = this.data.shopInfo.provinces_name;//省
        var city_name = this.data.shopInfo.city_name;//市
        var county_name = this.data.shopInfo.county_name;//县

        // console.log(province_name);
        // console.log(city_name);
        // console.log(county_name);
        // 找到对应省份的整条数据
        var linshiRegionData = this.data.regionData.find(function (item, index) {
          return item.region_name == province_name
        });

        // 更新regionIndex regionResultIndex
        regionIndex[0] = this.data.regionData.findIndex(function (item, index) {
          return item.region_name == province_name
        });

        regionResultIndex[0] = regionIndex[0];
        // 把对应省份整条数据的市放到regionPageArray[1]中
        for (var i = 0; i < linshiRegionData.son.length; i++) {
          var sonI = linshiRegionData.son[i];
          regionPageArray[1].push({
            parent_id: sonI.parent_id,
            region_id: sonI.region_id,
            region_name: sonI.region_name
          });
        }

        // 更新regionIndex regionResultIndex的第2项
        regionIndex[1] = regionPageArray[1].findIndex(function (item) {
          return item.region_name == city_name
        })

        regionResultIndex[1] = regionIndex[1];

        // 把对应县级的数据放到regionPageArray[2]中
        // console.log(linshiRegionData.son[regionResultIndex[1]].son) //所有的县
        for (var i = 0; i < linshiRegionData.son[regionResultIndex[1]].son.length; i++) {
          var grandSon = linshiRegionData.son[regionResultIndex[1]].son[i]
          regionPageArray[2].push({
            region_id: grandSon.region_id,
            region_id: grandSon.region_id,
            region_name: grandSon.region_name
          })
        }

        // 更新regionIndex regionResultIndex
        regionIndex[2] = regionPageArray[2].findIndex(function (item) {
          return item.region_name == county_name
        })
        // console.log(regionIndex)
        regionResultIndex[2] = regionIndex[2];
        // 更新要展示在页面的regionResult
        regionResult[0] = regionPageArray[0][regionResultIndex[0]];
        regionResult[1] = regionPageArray[1][regionResultIndex[1]];
        regionResult[2] = regionPageArray[2][regionResultIndex[2]];

        this.setData({
          regionPageArray: regionPageArray,
          regionIndex: regionIndex,
          regionResultIndex: regionResultIndex,
          regionResult: regionResult

        });
      }
    });

    wx.hideLoading();
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

  // 产地滚动后点击确认
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

  // 输入店铺名称
  nameInput: function (e) {
    this.data.shopInfo.name = e.detail.value.trim();
  },

  // 店铺名称失去焦点事件
  nameBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    })
  },

  // 备用手机号输入事件
  phoneBakInput: function (e) {
    this.data.shopInfo.phone_bak = e.detail.value.trim();
    console.log("备用手机号输入事件");
  },

  //  备用手机号失去焦点事件
  phoneBakBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
    console.log("备用手机号失去焦点事件")
  },
  // 用户地址输入事件
  addressInput: function (e) {
    this.data.shopInfo.address = e.detail.value.trim();
    console.log("用户地址输入事件");
    console.log(this.data.shopInfo.address)
  },
  // 用户地址失去焦点事件
  addressBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
    console.log("用户地址失去焦点事件");
    console.log(this.data.shopInfo.address);
  },
  // 是否申请连锁公司
  typeChange: function (e) {
    var shopInfo = this.data.shopInfo;

    if (shopInfo.type == 0) {
      shopInfo.type = 1
    } else if (shopInfo.type == 1) {
      shopInfo.type = 0
    }

    this.setData({
      shopInfo: shopInfo
    });

  },

  // 营业执照号输入事件
  licenseCodeInput: function (e) {
    this.data.shopInfo.license_code = e.detail.value.trim();

  },

  // 营业执照号失去焦点事件
  licenseCodeBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
  },

  // 法人姓名输入事件
  personInput: function (e) {
    this.data.shopInfo.person = e.detail.value.trim();
  },

  // 法人姓名失去焦点事件
  personBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
  },
  // 法人身份证号输入事件
  IdNumberInput: function (e) {
    this.data.shopInfo.ID_number = e.detail.value.trim();
  },
  // 法人身份证号失去焦点事件
  IdNumberBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
  },

  // 店铺logo选择图片
  chooseLogoImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePath = res.tempFilePaths[0];

        var shopInfo = _this.data.shopInfo;
        shopInfo.logo = res.tempFilePaths[0];

        _this.setData({
          shopInfo: shopInfo,
          changeLogo: true  //标记logo图片被更改过了
        });



      }
    })
  },
  // licenseImg:"",//营业执照照片
  chooseLicenseImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePath = res.tempFilePaths[0];

        var shopInfo = _this.data.shopInfo;
        shopInfo.license_pic = res.tempFilePaths[0];

        _this.setData({
          shopInfo: shopInfo
        });
      }
    })
  },
  // idCardImg: "" //法人身份证照片
  chooseIdCardImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // var tempFilePath = res.tempFilePaths[0];

        var shopInfo = _this.data.shopInfo;
        shopInfo.ID_pic = res.tempFilePaths[0];
        _this.setData({
          shopInfo: shopInfo
        });
      }
    })
  },


  // 保存事件
  saveChange: function () {
    var _this = this;
    // 验证店铺名称不能为空
    if (this.data.shopInfo.name.trim() == "") {
      wx.showToast({
        title: '请输入店铺名称',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      })
      return
    }

    // 限制公司名30字
    if (this.data.shopInfo.name.trim().length > 30) {
      wx.showToast({
        title: '限制公司名30字',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      });
      return
    }


    // 手机号不需要验证,肯定会有

    // 调用函数验证备用手机号,备用手机号非必填验证，不为空时才验证
    if (this.data.shopInfo.phone_bak != "" && util.isPhoneAvailable(this.data.shopInfo.phone_bak.trim()) == false) {
      wx.showToast({
        title: '备用手机号有误',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      })
      return
    }
    // 请求参数
    var data = {};

    var filePath = [];//存储所有要图片

    data.company_id = this.data.shopInfo.company_id;
    data.name = this.data.shopInfo.name;
    data.phone = this.data.shopInfo.phone;
    data.phone_bak = this.data.shopInfo.phone_bak;
    data.address = this.data.shopInfo.address;
    data.provinces = this.data.regionResult[0].region_id;
    data.city = this.data.regionResult[1].region_id;
    data.county = this.data.regionResult[2].region_id;
    data.provinces_name = this.data.regionResult[0].region_name;
    data.city_name = this.data.regionResult[1].region_name;
    data.county_name = this.data.regionResult[2].region_name;


    // 如果图片没有更改过直接传数据
    if (this.data.changeLogo == false) {
      data.logo = this.data.shopInfo.logo;
      // 防止快速重复暴力点击保存
      if (this.data.flag == false) {
        return
      }

      this.setData({
        flag: false
      });

      app.netWork.postJson(app.urlConfig.changeShopInfo, data).then(res => {//修改时，图片没有修改
        if (res.errorNo == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            mask: true
          });
          if (app.loginInfoData.company_id == this.data.shopInfo.company_id) {
            app.loginInfoData.company_name = _this.data.shopInfo.name;
          }
          // 跳转到列表
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
        } else {
          // 失败时恢复可以点击保存
          _this.setData({
            flag: true
          });

          wx.showToast({
            title: res.errorMsg,
            image: "../../images/warning.png",
            duration: 2000,
            mask: true
          });
        }
      }).catch(err => {
        // 创建失败时开启flag,允许再次提交
        _this.setData({
          flag: true
        });
      });

    }

    // 如果图片更改过先传图片，拿到图片的解析路径再发送data数据
    if (this.data.changeLogo == true) {
      filePath[0] = this.data.shopInfo.logo;
      console.log(filePath)
      // 上传第一张,不用传数据
      console.log(data)
    
      app.netWork.upload_file(app.urlConfig.uploadImg, filePath[0], {}, "thumb").then(res => {
        console.log(res)
         res = JSON.parse(res);
        if (res.errorNo == 0) {
          data.logo = res.data;
          // 防止快速重复暴力点击保存
          if (this.data.flag == false) {
            return
          }

          this.setData({
            flag: false
          });
          // console.log("更改过图片");
          app.netWork.postJson(app.urlConfig.changeShopInfo, data).then(res => {
            console.log(this.data.flag);
            // console.log(res);
            if (res.errorNo == 0) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000,
                mask: true
              });
              if (app.loginInfoData.company_id == this.data.shopInfo.company_id) {
                app.loginInfoData.company_name = _this.data.shopInfo.name;

              }

              // 跳转到单位列表-只可编辑
              setTimeout(function () {
                wx.switchTab({
                  url: '../myHome/myHome'
                });
              }, 2000);
            }
            else {
              _this.setData({
                flag: true
              });
              wx.showToast({
                title: res.errorMsg,
                image: "../../images/warning.png",
                duration: 2000,
                mask: true
              });
            }
          });
        }
      }).catch(err=>{
        console.log(1)
        console.log(err)
      });
    }
  },
  // 点击手机号显示浮动的盒子
  showFloatBox: function () {
    clearInterval(this.data.timer);
    this.setData({
      count: 60,
      isShowFloatBox: true,
      floatFlag: true,
      floatPhone: "", //清空弹框中的数据
      code: "",
      disabled: true
    })
  },

  // 关闭浮动的盒子
  closeFloatBox: function () {
    clearInterval(this.data.timer); //清除定时器
    this.setData({
      isShowFloatBox: false,
      count: 60,

    })
  },
  // 浮动盒子手机号输入事件
  floatPhoneInput: function (e) {
    this.data.floatPhone = e.detail.value.trim();
  },

  // 浮动盒子手机号失去焦点事件
  floatPhoneBlur: function () {
    this.setData({
      floatPhone: this.data.floatPhone
    });
  },

  // 输入验证码事件

  codeInput: function (e) {
    this.data.code = e.detail.value.trim();
  },

  // 验证码失去焦点
  codeBlur: function () {
    this.setData({
      code: this.data.code
    });
  },

  //点击获取验证码按钮
  getCode: function () {
    var _this = this;
    // 如果手机号没写
    if (this.data.floatPhone == "") {
      this.setData({
        msg: "请输入手机号"
      })

      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }

    // 如果手机号没有动过不需要校验
    if (this.data.floatPhone == this.data.shopInfo.phone) {
      this.setData({
        msg: "手机号已验证过"
      });
      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }


    // 验证手机号是否格式正确,如果正确则发送短信

    if (util.isPhoneAvailable(_this.data.floatPhone)) {
      // console.log("tongguo");
      _this.setData({
        disabled: false,
      });

      clearInterval(_this.data.timer); //清除定时器
      // 开启定时器
      _this.data.timer = setInterval(function () {
        // 从第60秒开始就不允许点击获取验证码按钮
        var count = _this.data.count;
        count--;
        _this.setData({
          count: count
        });

        // 清除定时器
        if (count <= 0) {
          clearInterval(_this.data.timer); //清除定时器
          _this.setData({
            disabled: true,   //让按钮可以再次点击
            count: 60,
          })
        }
      }, 1000);

      // 请求发送验证码短信
      var data = {
        phone: this.data.floatPhone
      }

      if (this.data.floatSend == false) {
        return
      }

      this.setData({
        floatSend: false
      });

      console.log("准备发送")
      app.netWork.postJson(app.urlConfig.sendCode, data).then(res => {
        console.log("发送验证码")
        if (res.errorNo == 0) {
          // 把返回的电话存起来做个标记
        }

        _this.setData({
          floatSend: true
        });
      });

    } else {
      _this.setData({
        msg: "请输入正确的11位手机号"
      });

      setTimeout(function () {
        _this.setData({
          msg: ""
        });
      }, 2000);
    }
  },

  // 发送请求验证验证码是否正确
  testCode: function () {

    var _this = this;

    // 验证手机号不能为空
    if (this.data.floatPhone == "") {
      _this.setData({
        msg: "请输入手机号"
      });
      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }

    // 验证手机号是否错误
    if (util.isPhoneAvailable(_this.data.floatPhone) == false) {
      _this.setData({
        msg: "请输入正确的11位手机号"
      });
      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }

    // 如果验证码为空
    if (this.data.code == "") {
      _this.setData({
        msg: "请输入验证码"
      });
      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }

    // 如果验证码位数或者不全是数字
    var re = new RegExp(/^[0-9]{6}$/);     // ^表示开始  $表示结束  
    if (re.test(this.data.code) == false) {
      _this.setData({
        msg: "请输入正确的验证码"
      });
      setTimeout(function () {
        _this.setData({
          msg: ""
        })
      }, 2000);
      return
    }

    // 校验通过可以发送验证验证码的请求
    if (re.test(this.data.code)) {
      var data = {
        phone: this.data.floatPhone,
        code: this.data.code
      }

      if (this.data.floatFlag == false) {
        return
      }

      this.setData({
        floatFlag: false
      })

      app.netWork.postJson(app.urlConfig.checkCode, data).then(res => {
        console.log("floatFlag=false进来一次")
        console.log(res);
        if (res.errorNo == 0) {

          _this.data.shopInfo.phone = _this.data.floatPhone;

          clearInterval(_this.data.timer); //清除定时器
          _this.setData({
            shopInfo: _this.data.shopInfo,
            isShowFloatBox: false, //关闭弹框
            disabled: true,   //让按钮可以再次点击
            count: 60,
          });

          console.log("验证通过");

        } else {
          _this.setData({
            msg: res.errorMsg,
            floatFlag: true
          });

          setTimeout(function () {
            _this.setData({
              msg: ""
            })
          }, 2000);
        }
      })
    }
  },

})