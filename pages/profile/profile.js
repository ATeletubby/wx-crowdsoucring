// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reputation: {
      value: 4.5,
      half: false,
      round: 0,
    },
    isPublish: true,
    pubTasks:[{}],
    parTasks:[{}],
    slideButtons: [{
      extClass: 'profile-zd',
      text: '置顶',
      src: '/page/weui/cell/icon_love.svg', // icon的路径
    }, {
      type: 'warn',
      text: '删除',
      extClass: 'test',
      src: '/page/weui/cell/icon_del.svg', // icon的路径
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 得到用户的reputation
    this.setData({
      'reputation.round' : parseInt(this.data.reputation.value)
    });
    if (this.data.reputation.value - this.data.reputation.round >= 0.5){
      this.setData({
        'reputation.half': true
      });
    }
  },
  openConfig: function(){
    wx.navigateTo({
      title: 'goConfig',
      url: '/pages/config/config'
    })
  },
  changePublish: function(){
    this.setData({
      isPublish: true
    })
  },
  changeParticipate: function () {
    this.setData({
      isPublish: false
    })
  }
})