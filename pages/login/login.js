// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getUserInfo: function(e){
    if(e.detail.rawData){
      console.log(e.detail.rawData);
      app.globalData.userInfo = e.detail.rawData;
     
      wx.cloud.callFunction({
        name: 'queryUser',
      }).then(res => {
        console.log(res.result)
        // 如果用户已注册，存在user集合中,跳转上一页
        if (res.result && res.result.length > 0){
          app.globalData.userAppInfo = res.result[0];
          wx.navigateBack({
            delta: 1
          })
        } else {
          // 跳转注册绑定页
          wx.navigateTo({
            title: 'goRegist',
            url: '/pages/regist/regist'
          })
        }
      })
    }
  }
})