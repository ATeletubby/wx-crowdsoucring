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
      // 更新用户登录信息
      wx.cloud.callFunction({
        name: 'addUser',
        data: {
          userInfo: e.detail.rawData,
        }
      }).then(res => {
        console.log(res.result)
        app.globalData.userAppInfo =  res.result[0];
        wx.navigateBack({
          delta: 1
        })
      })
    }
  }
})