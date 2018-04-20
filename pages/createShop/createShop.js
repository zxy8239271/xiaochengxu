const earaInfo = require("../../utils/earaInfo.js");
const util = require("../../utils/util.js");

var app = getApp();
Page({
  data: {
    // 省市相关
    regionData: earaInfo.earaInfo[0].data, //存储省市县数据
    regionPageArray: [earaInfo.earaInfo[0].data, [], []], //展示在页面的省市县数据
    regionIndex: [0, 0, 0],  //展示省市县各级的下标，相对于regionArray
    regionResultIndex: [0, 0, 0], //最终展示在页面上的省市县的下标
    regionResult: [{ region_id: 2, parent_id: 1, region_name: "北京" }, { region_id: 52, parent_id: 2, region_name: "北京" }, { region_id: 500, parent_id: 52, region_name: "东城区" }],  //初始默认展示的省市县
    shopInfo: {
      company_id: "", //存储店铺company_id
      address: "", //详细地址
      city: "", //市code
      city_name: "",  //市名字
      phone: "", //电话 
      county: "", //县code
      county_name: "", //县
      name: "", //店铺名称
      provinces: "", //省code
      provinces_name: "", //省名字
      phone_bak: "", //备用电话
      logo: "",//店铺logo图片
      license_pic: "../../images/placeholder.png",//营业执照照片
      ID_pic: "../../images/placeholder.png", //法人身份证照片
      license_code: "", //营业执照号
      person: "", //法人姓名
      ID_number: "", //法人身份证号
      type: 0,  //是否连锁0个体1连锁

    },

    disabled: true,  //是否可以点击获取验证码
    count: 60,  //倒计时
    inviteType: "", // 邀请类型，邀请客户或者供应商时有此字段，0 为供应商 2 为客户
    company_id: "", //邀请人的公司id
    user_id: "", //邀请人的用户id
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
      mask: true
    });
    // console.log("进入创建店铺页面")
    //把微信获取到的用户的头像和昵称默认置为店铺的logo和名称
    this.data.shopInfo.logo = app.loginInfoData.photo;
    this.data.shopInfo.name = app.loginInfoData.nick;
    this.setData({
      shopInfo: this.data.shopInfo,
    })

    if (options.status) {
      this.data.inviteType = options.status;
      this.data.company_id = options.company_id;
      this.data.user_id = options.user_id;
    }

    // 如果是从新建进入，把regionPageArray[1]，regionPageArray[2]的数据分别未第一项的子项，第一项子项的子项
    this.data.regionPageArray[1] = this.data.regionData[0].son;
    this.data.regionPageArray[2] = this.data.regionData[0].son[0].son;
    // 更新展示在页面的regionResult数据
    this.data.regionResult[0] = this.data.regionPageArray[0][0];
    this.data.regionResult[1] = this.data.regionPageArray[1][0];
    this.data.regionResult[2] = this.data.regionPageArray[2][0];
    this.setData({
      regionResult: this.data.regionResult,
      regionPageArray: this.data.regionPageArray
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
    // console.log(app);

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
    // console.log("备用手机号输入事件");
  },

  //  备用手机号失去焦点事件
  phoneBakBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
    // console.log("备用手机号失去焦点事件")
  },
  // 用户地址输入事件
  addressInput: function (e) {
    this.data.shopInfo.address = e.detail.value.trim();
    // console.log("用户地址输入事件");
    // console.log(this.data.shopInfo.address)
  },
  // 用户地址失去焦点事件
  addressBlur: function (e) {
    this.setData({
      shopInfo: this.data.shopInfo
    });
    // console.log("用户地址失去焦点事件");
    // console.log(this.data.shopInfo.address);
  },

  // 是否申请连锁公司
  typeChange: function (e) {
    // console.log(e.detail.value);
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
          shopInfo: shopInfo
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
  saveFn: function () {
    var _this = this;
    // 验证店铺名称不能为空
    if (this.data.shopInfo.name.trim() == "") {
      wx.showToast({
        title: '请输入店铺名称',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      });
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

    // 验证手机号是否有问题,要么时验证通过的,要么就是空
    if (this.data.shopInfo.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      });
      return
    }

    // 调用函数验证备用手机号,备用手机号非必填验证，不为空时才验证
    if (this.data.shopInfo.phone_bak != "" && util.isPhoneAvailable(this.data.shopInfo.phone_bak.trim()) == false) {
      wx.showToast({
        title: '备用手机号有误',
        image: "../../images/warning.png",
        duration: 2000,
        mask: true
      });
      return
    }


    // 请求参数
    var data = {};

    var filePath = [];//存储所有要图片
    data.name = this.data.shopInfo.name;
    data.phone = this.data.shopInfo.phone;
    data.phone_bak = this.data.shopInfo.phone_bak;
    data.type = 0;
    data.address = this.data.shopInfo.address;
    data.provinces = this.data.regionResult[0].region_id;
    data.city = this.data.regionResult[1].region_id;
    data.county = this.data.regionResult[2].region_id;
    data.provinces_name = this.data.regionResult[0].region_name;
    data.city_name = this.data.regionResult[1].region_name;
    data.county_name = this.data.regionResult[2].region_name;
    // 邀请客户或者供应商时这两个参数才有值
    data.inviteType = this.data.inviteType; // 邀请类型，邀请客户或者供应商时有此字段，0 为供应商 2 为客户
    data.company_id = this.data.company_id; //邀请人的公司id
    data.user_id = this.data.user_id;
    filePath[0] = this.data.shopInfo.logo;



    // logo图片不发生改变时,不需要上传第一张的临时路径，直接传data
    if (this.data.shopInfo.logo == app.loginInfoData.photo) {
      data.logo = this.data.shopInfo.logo;
      _this.theEnd(data, filePath);
    } else {
      // logo图片发生改变时上传第一张,不用传数据
      app.netWork.upload_file(app.urlConfig.uploadImg, filePath[0], {}, "thumb").then(res => {
        // console.log(res);
        // 第一张成功上传成功之后再判断
        res = JSON.parse(res);
        if (res.errorNo == 0) {
          data.logo = res.data;
          _this.theEnd(data, filePath);
        }
      });
    }
  },
  loginInfo: function () {
    var data = {
      open_id: wx.getStorageSync('openId')
    };
    app.netWork.postJson(app.urlConfig.getLoginInfoUrl, data).then(res_data => {
      if (res_data.errorNo == 0) {
        app.loginInfoData = res_data.data
        wx.setStorageSync('openId', res_data.data.openid_xcx);
        wx.setStorageSync('token', res_data.data.token);
        setTimeout(function () {
          wx.switchTab({
            url: '../myHome/myHome'
          });
        }, 1000);


      }
    }).catch(res_err => {

    })

  },


  // 是否上传过logo都需要走的逻辑部分
  theEnd: function (data, filePath) {
    var _this = this;
    // 当type为0时直接调用
    if (_this.data.shopInfo.type == 0) {

      if (_this.data.flag == false) {
        return
      }
      // 防止再次提交创建店铺
      _this.setData({
        flag: false
      });
      // console.log(this.data.flag);

      app.netWork.postJson(app.urlConfig.openCompany, data).then(res => {
        console.log("个体进来了");
        console.log(res);

        if (res.errorNo == 0) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000,
            mask: true
          });
          if (!app.loginInfoData.staff_id) {
            // console.log("调用_this.logiinInfo")
            _this.loginInfo();
          } else {
            // console.log("跳转页面")

            setTimeout(function () {
              wx.switchTab({
                url: '../myHome/myHome'
              });
            }, 1000);
          }

          // 跳转到单位列表-只可编辑


        } else {
          // 创建失败时开启flag,允许再次提交
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

    // 当type为1连锁时才需要验证营业执照号、营业执照图片、法人姓名、法人身份证号
    if (_this.data.shopInfo.type == 1) {
      // 验证营业执照号是否有误
      if (_this.data.shopInfo.license_code.length > 18 || _this.data.shopInfo.license_code.length < 15) {
        wx.showToast({
          title: '营业执照号有误',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        })
        return
      }

      // 验证法人姓名不能为空
      if (_this.data.shopInfo.person == "") {
        wx.showToast({
          title: '请输入法人姓名',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        })
        return
      }


      // 验证身份证号不能为空
      if (_this.data.shopInfo.ID_number == "") {
        wx.showToast({
          title: '请输入身份证号',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        })
        return
      }

      // 验证身份证号是否有误
      if (util.checkIDCard(_this.data.shopInfo.ID_number) == false) {
        wx.showToast({
          title: '身份证号有误',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        });
        return
      }

      //  验证营业执照图片不能为空
      if (_this.data.shopInfo.license_pic == "../../images/placeholder.png") {
        wx.showToast({
          title: '营业执照图片有误',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        });
        return
      }

      //  验证身份证图片不能为空
      if (_this.data.shopInfo.ID_pic == "../../images/placeholder.png") {
        wx.showToast({
          title: '身份证图片有误',
          image: "../../images/warning.png",
          duration: 2000,
          mask: true
        });
        return
      }

      filePath[1] = _this.data.shopInfo.license_pic;
      filePath[2] = _this.data.shopInfo.ID_pic;

      // 接着上传第二张，第三张图片
      app.netWork.upload_file(app.urlConfig.uploadImg, filePath[1], {}, "thumb").then(res => {
        // console.log(res)
        res = JSON.parse(res);
        if (res.errorNo == 0) {
          // console.log(res);
          data.license_pic = res.data;
          // console.log("第二张上传完毕");

          // 上传第三张图片
          app.netWork.upload_file(app.urlConfig.uploadImg, filePath[2], {}, "thumb").then(res => {
            // console.log(res)
            res = JSON.parse(res);
            if (res.errorNo == 0) {
              data.ID_pic = res.data;
              // console.log("第三张上传完毕");
              data.type = 1;
              data.ID_number = _this.data.shopInfo.ID_number;
              data.license_code = _this.data.shopInfo.license_code;
              data.person = _this.data.shopInfo.person;
              // 三张图片成功后把所有的data发送给后端         

              if (_this.data.flag == false) {
                return
              }

              // 防止再次提交创建店铺
              _this.setData({
                flag: false
              });
              // console.log(this.data.flag);
              app.netWork.postJson(app.urlConfig.openCompany, data).then(res => {
                console.log("连锁进来了");
                console.log(res)
                if (res.errorNo == 0) {
                  wx.showToast({
                    title: '创建成功',
                    icon: 'success',
                    duration: 2000,
                    mask: true
                  });
                  if (!app.loginInfoData.staff_id) {
                    _this.loginInfo();
                  } else {
                    // 跳转到单位列表-只可编辑
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../myHome/myHome'
                      });
                    }, 2000);
                  }

                } else {

                  // 创建店铺失败时开启开关允许再次创建
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
          })
        }
      })
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

      app.netWork.postJson(app.urlConfig.sendCode, data).then(res => {
        console.log("发送验证码");
        console.log(res);
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
        // console.log("floatFlag=false进来一次")
        // console.log(res);
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