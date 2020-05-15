// pages/profile/profile.js
var app = getApp()
const util = require('../../utils/util.js') 
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
    pubTasks:[],
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
    loading: true,
    page: 0,
    isBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log(app.globalData.userAppInfo)
    if (app.globalData.userInfo && app.globalData.userAppInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        userAppInfo: app.globalData.userAppInfo
      });
    }
    this.setData({
      loading: false
    })
  },
  onShow: function (){
    let _this = this
    this.setData({
      loading: true
    })
    if (app.globalData.userAppInfo){
      // 更新已登录用户的个人信息（后期可以监听user表数据的变化，如果变化了再更新）
      wx.cloud.callFunction({
        name: 'queryUser',
        data: {
          openid: app.globalData.userAppInfo.openid,
        }
      }).then(res => {
        app.globalData.userAppInfo = res.result[0]
        this.setData({
          userAppInfo: app.globalData.userAppInfo,
          'reputation.value': app.globalData.userAppInfo.reputation,
          'reputation.round': parseInt(app.globalData.userAppInfo.reputation)
        });
        if (this.data.reputation.value - this.data.reputation.round >= 0.5) {
          this.setData({
            'reputation.half': true
          });
        }
      });


      // 得到用户发布任务
      if (app.globalData.userAppInfo) {
        wx.cloud.callFunction({
          name: 'queryTaskList',
          data: {
            t_status: 3,
            t_requestor: app.globalData.userAppInfo.openid,
            page: _this.data.page
          }
        }).then(res => {
          console.log(res.result);
          // 处理返回的数据
          let list = res.result.list;
          for (let i = 0; i < list.length; i++) {
            list[i].t_time = util.transformTime(list[i].t_time)
          }
          _this.setData({
            pubTasks: list
          })
        });
      }
    }


    this.setData({
      loading: false
    })
  },

  // 翻页
  onReachBottom: function () {
    if (this.data.isBottom) {
      return
    }
    let _this = this
    let page = this.data.page + 1;
    this.setData({
      sloading: true,
      page: page
    });
    if (this.data.isPublish){
      wx.cloud.callFunction({
        name: 'queryTaskList',
        data: {
          t_status: 3,
          t_requestor: app.globalData.userAppInfo.openid,
          page: page
        }
      }).then(res => {
        if (res.result.list.length < 4) {
          _this.setData({
            isBottom: true
          })
        }
        // 处理返回的数据
        let list = res.result.list;
        let pubTasks = this.data.pubTasks;
        for (let i = 0; i < list.length; i++) {
          list[i].t_time = util.transformTime(list[i].t_time)
          pubTasks.push(list[i])
        }
        _this.setData({
          pubTasks: pubTasks
        })
      });
    } else {
      wx.cloud.callFunction({
        name: 'queryTaskList',
        data: {
          t_status: 3,
          t_worker: app.globalData.userAppInfo.openid,
          page: page
        }
      }).then(res => {
        if (res.result.list.length < 4) {
          _this.setData({
            isBottom: true
          })
        }
        // 处理返回的数据
        let list = res.result.list;
        let parTasks = this.data.parTasks;
        for (let i = 0; i < list.length; i++) {
          list[i].t_time = util.transformTime(list[i].t_time)
          parTasks.push(list[i])
        }
        _this.setData({
          parTasks: parTasks
        })
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
    let _this = this
    this.setData({
      isPublish: true,
      pubTasks: [],
      page: 0,
      isBottom: false
    })
    // 得到用户发布任务
    if (app.globalData.userAppInfo) {
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'queryTaskList',
        data: {
          t_status: 3,
          t_requestor: app.globalData.userAppInfo.openid,
          page: _this.data.page
        }
      }).then(res => {
        console.log(res.result);
        // 处理返回的数据
        let list = res.result.list;
        for (let i = 0; i < list.length; i++) {
          list[i].t_time = util.transformTime(list[i].t_time)
        }
        _this.setData({
          pubTasks: list,
          loading: false
        })
      });
    }
  },
  changeParticipate: function () {
    let _this = this
    this.setData({
      isPublish: false,
      parTasks:[],
      page: 0,
      isBottom: false
    })
    // 得到用户参与任务
    if (app.globalData.userAppInfo) {
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'queryTaskList',
        data: {
          t_status: 3,
          t_worker: app.globalData.userAppInfo.openid,
          page: _this.data.page
        }
      }).then(res => {
        console.log(res.result);
        // 处理返回的数据
        let list = res.result.list;
        for (let i = 0; i < list.length; i++) {
          list[i].t_time = util.transformTime(list[i].t_time)
        }
        _this.setData({
          parTasks: list,
          loading: false
        })
      });
    }
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
  },
  openTaskDetail: function(e){
      wx.navigateTo({
        title: 'go',
        url: '/pages/detail/detail?_id=' + e.currentTarget.dataset.tid
      })
  },
  editProfile: function(e){
    console.log(e);
    wx.navigateTo({
      title: 'goProfileEdit',
      url: '/pages/editProfile/editProfile',
    })
  }
})