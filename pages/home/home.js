// pages/home/home.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isType: false
  },
  query:function(){
    db.collection("user").get().then(console.log)
  },
  openTopbarContent:function(event){
    console.log(event);
    this.setData({ isType: !this.data.isType });
  }
})