var app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskType: [],
    taskTypeIndex: 0,
    dtime: "00:00",   // 截止时间
    taskVenue:[],
    sVenueIndex: 0,   //起点
    eVenueIndex: 1,   //终点
    textsize: 0,     //任务详情字数
    taskText: '',
    taskCost: 0,      //任务成本
    taskPay: 0,       //任务报酬
    taskTotalPrice: 0,
    isNoti: false,
    tipShow: false,
    tipContext: '',
    paytipShow: false,
    paybuttons: [{ text: '取消' }, { text: '确认' }],
    buttons: [{ text: '关闭' }],
  },
  onLoad: function(){
    let _this = this;
    // 得到当前时间
    let dtime = util.currentTime();
    _this.setData({
      dtime: dtime
    })

    // 获取任务类型
    wx.cloud.callFunction({
      name: 'queryTaskType',
    }).then(res => {
      _this.setData({
        taskType: res.result.data
      })
    });

    //获取地点
    wx.cloud.callFunction({
      name: 'queryVenue',
    }).then(res => {
      _this.setData({
        taskVenue: res.result.data
      })
    });
  },
  taskTypeChange: function (e) {
    this.setData({
      taskTypeIndex: e.detail.value
    })
  },
  dtimeChange: function(e){
    this.setData({
      dtime: e.detail.value
    })
  },
  taskVenueChange: function(e){
    if(e.currentTarget.dataset.id == "eVenue"){
      this.setData({
        eVenueIndex: e.detail.value
      })
    } else {
      this.setData({
        sVenueIndex: e.detail.value
      })
    }
  },
  taskContextChange:function(e){
    this.setData({
      taskText: e.detail.value,
      textsize: e.detail.value.length
    })
  },
  taskPriceInput:function(e){
    if (e.currentTarget.dataset.id == "taskCost"){
      let taskCost = e.detail.value == '' ? 0 : e.detail.value;
      this.setData({
        taskCost: taskCost,
      })
    } else{
      let taskPay = e.detail.value == '' ? 0 : e.detail.value;
      this.setData({
        taskPay: taskPay,
      })
    }
    let taskTotalPrice = Math.round((parseFloat(this.data.taskCost) + parseFloat(this.data.taskPay)) * 1000) / 1000;   
    this.setData({
      taskTotalPrice: taskTotalPrice,
    })
  },
  notiChange:function(e) {
    this.setData({
      isNoti: e.detail.value,
    })
  },
  openTip: function(e){
    if (e.currentTarget.dataset.id == "tip-noti"){
      this.setData({
        tipShow: true,
        tipContext: "开启后，在任务截止前5分钟，小程序发送提醒"
      })
    } else if(e.currentTarget.dataset.id == "tip-venue"){
      this.setData({
        tipShow: true,
        tipContext: "任务距离为起点到终点的距离，首页任务排序根据用户与起点的距离计算"
      })
    }
  },
  closeTipDialog: function(){
    this.setData({
      tipShow: false,
    })
  },


  checkPay: function(){
    //检验登录(之后写到主函数)
    if (!app.globalData.userAppInfo) {
      wx.navigateTo({
        title: 'goLogin',
        url: '/pages/login/login'
      })
      return;
    }
    // 检验非法字段

    // 检验众包币
    if (app.globalData.userAppInfo.crowdCoin < this.data.taskTotalPrice) {
      this.setData({
        tipShow: true,
        tipContext: "众包币余额不够！还剩 " + app.globalData.userAppInfo.crowdCoin
      })
      return;
    }

    this.setData({
      paytipShow: true,
      paytipContext: "发布任务需支付众包币 " + this.data.taskTotalPrice + " ，确认支付？"
    })
   
  },
  addTask: function(e){
    if (e.detail.index == 0) {
      this.setData({
        paytipShow: false,
      })
      return;
    }
    
    let _this = this;
    let data = this.data;
    // 计算起终点距离
    let slo = data.taskVenue[data.sVenueIndex].location.coordinates;
    let elo = data.taskVenue[data.eVenueIndex].location.coordinates;
    let t_seDistance = util.calDistance(slo[1], slo[0], elo[1], elo[0]);
    console.log(data.dtime);
    wx.cloud.callFunction({
      name: 'addTask',
      data: {
        t_requestor: app.globalData.openid,
        t_type: data.taskType[data.taskTypeIndex]._id,
        t_time: new Date().getTime(),
        t_deadline: data.dtime,
        t_eVenue: data.taskVenue[data.eVenueIndex]._id,
        t_sVenue: data.taskVenue[data.sVenueIndex]._id,
        t_price: data.taskPay,
        t_cost: data.taskCost,
        t_context: data.taskText,
        t_seDistance: t_seDistance,
        t_isNoti: data.isNoti,
        t_taskTotalPrice: data.taskTotalPrice
      }
    }).then(res => {
      console.log(res);
      _this.setData({
        tipShow: true,
        paytipShow: false,
        tipContext: "成功创建任务！"
      })
      // wx.switchTab({
      //   url: '/pages/profile/profile'
      // })
    });
  },
})