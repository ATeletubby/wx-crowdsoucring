// pages/profile/profile.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userAppInfo: null,
    reputation: {
      value: 0,
      half: false,
      round: 0,
    },
    isPublish: true,
    pubTasks:[{
      't_requestor': {
        name: '任务发布者',
        value: '小明',
        openid: ''
      },
      't_type': {
        name: '任务类型',
        value: '配送任务'
      },
      't_time': {
        name: '发布时间',
        value: '2020.2.20 14:00:00'
      },
      't_deadline': {
        name: '截止时间',
        value: '2020.2.10'
      },
      't_venue': {
        name: '相关地点',
        value: '光电楼、食堂'
      },
      't_cost': {
        name: '任务费用',
        value: '2'
      },
      't_price': {
        name: '任务报酬',
        value: '1'
      },
      't_context': {
        name: '任务详情',
        value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      't_status': 0,
    }, {
        't_requestor': {
          name: '任务发布者',
          value: '小明',
          openid: ''
        },
        't_type': {
          name: '任务类型',
          value: '配送任务'
        },
        't_time': {
          name: '发布时间',
          value: '2020.2.20 14:00:00'
        },
        't_deadline': {
          name: '截止时间',
          value: '2020.2.10'
        },
        't_venue': {
          name: '相关地点',
          value: '光电楼、食堂'
        },
        't_cost': {
          name: '任务费用',
          value: '2'
        },
        't_price': {
          name: '任务报酬',
          value: '1'
        },
        't_context': {
          name: '任务详情',
          value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        },
        't_status': 2,
      }],
    parTasks:[],
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
    this.setData({
      userInfo: app.globalData.userInfo,
      userAppInfo: app.globalData.userAppInfo
    });
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
  onShow: function (){
    // console.log(app.globalData.userAppInfo, this.data.reputation.value)]
    if (app.globalData.userAppInfo || app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        userAppInfo: app.globalData.userAppInfo,
        'reputation.value': app.globalData.userAppInfo.reputation,
        'reputation.round': parseInt(app.globalData.userAppInfo.reputation)
      });
      if (this.data.reputation.value - this.data.reputation.round >= 0.5) {
        this.setData({
          'reputation.half': true
        });
      }
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
  },
  dealPubTask: function(e){
    let pubTasks = this.data.pubTasks;
    if (e.detail.index == 1){
      pubTasks.splice(e.currentTarget.dataset.pubindex, 1);
      this.setData({
        pubTasks: pubTasks
      })
    } else {
      let temp = pubTasks[0];
      pubTasks[0] = pubTasks[e.currentTarget.dataset.pubindex];
      pubTasks[e.currentTarget.dataset.pubindex] = temp;
      this.setData({
        pubTasks: pubTasks
      })
    }

  },
  authorizeUser: function(){
    wx.navigateTo({
      title: 'goLogin',
      url: '/pages/login/login'
    })
  }
})