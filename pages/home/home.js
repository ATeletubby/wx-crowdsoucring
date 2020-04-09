// pages/home/home.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  query:function(){
    db.collection("user").get().then(console.log)
  }
})