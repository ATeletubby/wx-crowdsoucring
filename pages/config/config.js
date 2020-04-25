// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactShow:false,
  },

  showContact: function(){
    this.setData({
      contactShow: true
    });
  },
  closeContact: function(){
    this.setData({
      contactShow: false
    });
  }
})