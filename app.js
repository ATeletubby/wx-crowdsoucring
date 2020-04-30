//app.js
App({
  globalData: {
    userInfo: null,
    userLocation: null
  },
  onLaunch: function () {
    let _this = this;
    // 云开发初始化
    wx.cloud.init({
      env:"wx-debater-ccdoy",
      traceUser: true   //查看用户信息
    });

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 查找用户是否新用户
        wx.cloud.callFunction({
          name: 'queryUser',
        }).then(res => {
          if (res.result && res.result.length > 0)
            _this.globalData.userAppInfo = res.result[0];
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo;
              // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(){
              console.log('sss')
            }
          })
        }
      }
    })
    // 获取openID
    wx.cloud.callFunction({
      name: 'getOpenid',
    }).then(res => {
      this.globalData.openid = res.result.openid;
    });

    // 获取用户位置
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.globalData.userLocation = {
          'latitude': res.latitude,
          'longitude': res.longitude
        }
      }
    })
    wx.getUserInfo({
      success: res =>{
        console.log(res);
      }
    })
    // wx.loadFontFace({
    //   family: 'Bitstream Vera Serif Bold',
    //   source: 'url("https://sungd.github.io/Pacifico.ttf")',
    //   success: console.log
    // })
  },
  onLoad: function(options){
    wx.loadFontFace({
      family: "PingFangSC-Medium",
      source: 'url("https://bwc.waimaimingtang.com/images/config/PingFangSCMedium.ttf")',
      success(res) {
        console.log('2成功')
      },
      fail: function (res) {
        console.log('2失败')
      }});
  },
})