// pages/codeWeChat/codeWeChat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var isOne = wx.getStorageSync('isOne')
    if (isOne == '1') {
      wx.switchTab({
        url: '../homePage/homePage'
      })
    }
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
  btnEvent() {//保存图片
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.getImageInfo({
            src: '../../images/erweima.jpg',
            success: function (res_data) {
              if (wx.saveImageToPhotosAlbum) {
                wx.saveImageToPhotosAlbum({
                  filePath: res_data.path,
                  success(result) {
                    wx.showModal({
                      title: '温馨提示',
                      content: "图片已保存成功，去'路上优选采购平台'公众号,以便您的使用",
                      showCancel: false,
                      confirmText: '去关注',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          wx.navigateBack({
                            delta: 0
                          })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  },
                  fail(err) {
                    console.log(err);
                    wx.showModal({
                      title: '温馨提示',
                      content: "图片保存失败，截屏或者去微信添加搜索'路上优选采购平台'公众号,以便您的使用",
                      showCancel: false,
                      confirmText: '关闭弹框',
                      success: function (res) {
                        if (res.confirm) {
                         
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                })
              } else {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                wx.showModal({
                  title: '提示',
                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                })
              }
            },fail:function(){
              wx.showModal({
                title: '温馨提示',
                content: "图片保存失败，截屏或者去微信添加搜索'路上优选采购平台'公众号,以便您的使用",
                showCancel: false,
                confirmText: '关闭弹框',
                success: function (res) {
                  if (res.confirm) {

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.writePhotosAlbum"]) {////如果用户重新同意了授权登录
                wx.getImageInfo({
                  src: '../../images/erweima.jpg',
                  success: function (res_data) {
                    wx.saveImageToPhotosAlbum({
                      filePath: res_data.path,
                      success(result) {
                        wx.showModal({
                          title: '温馨提示',
                          content: "图片已保存成功，去'路上优选采购平台'公众号,以便您的使用",
                          showCancel: false,
                          confirmText: '去关注',
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                              wx.navigateBack({
                                delta: 0
                              })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                      },
                      fail:function(){
                        wx.showModal({
                          title: '温馨提示',
                          content: "图片保存失败，截屏或者去微信添加搜索'路上优选采购平台'公众号,以便您的使用",
                          showCancel: false,
                          confirmText: '关闭弹框',
                          success: function (res) {
                            if (res.confirm) {

                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                      }
                    })
                  },
                  fail:function(){
                    wx.showModal({
                      title: '温馨提示',
                      content: "图片保存失败，截屏或者去微信添加搜索'路上优选采购平台'公众号,以便您的使用",
                      showCancel: false,
                      confirmText: '关闭弹框',
                      success: function (res) {
                        if (res.confirm) {

                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                })
              }
            }, fail: function (res) {

            }
          })
        }
      },
      fail() {

      }
    })
  }
})