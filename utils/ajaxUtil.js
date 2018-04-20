// request请求的封装

module.exports = {
  postJson: function (url, data) {
    var params = data;
    var app = getApp();
    params.token = wx.getStorageSync('token');
    //返回一个promise实例
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        method: 'POST',
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.errorNo == '1006') {
            wx.showToast({
              title: res.data.errorMsg||'',
              icon: 'none',
              duration:2000
            })
            return
          }
          resolve(res ? res.data : res)
        },
        fail: function (res) {
          // console.log(res)
          reject(res ? res.data : res);
        },
        complete: function (res) {
          // console.log(res)
        }
      })
    })
  },
  getJson: function (url, data) {
    //返回一个promise实例
    var app = getApp();
    var params = data;
    params.token = wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        method: 'GET',
        success: function (res) {
          if (res.data.errorNo == '1006') {
            wx.showToast({
              title: res.data.errorMsg || '',
              icon: 'none',
              duration: 2000
            })
            return
          }
          resolve(res ? res.data : res)
        },
        fail: function (res) {
          reject(res ? res.data : res);
        },
        complete: function () {
        }
      })
    })
  },
  //上传图片的方法
  upload_file: function (url, filePath, data, name) {
    var app = getApp();
    var params = data;
    params.token = wx.getStorageSync('token');
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url,
        filePath: filePath,
        formData: params, // HTTP 请求中其他额外的 form data        
        name: name, // 图片参数Key
        header: { 'content-type': "application/x-www-form-urlencoded" },
        success: function (res) {
          // console.log(res)
          resolve(res ? res.data : res)

          // if (res.errorNo==0){
          //   resolve(res ? res.data : res)
          // }
          // else {
          //   wx.showToast({
          //     title: res.data.errorMsg,
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   return
          // }
         
        },
        fail: (res) => {
          reject(res ? res.data : res)
          // console.log(res);
        },
        complete: function () {
        }
      })
    })
  },

}