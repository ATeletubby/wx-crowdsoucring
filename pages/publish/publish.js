var app = getApp()
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
    tasktext: '',
    taskCost: 0,      //任务成本
    taskPay: 0,       //任务报酬
    taskTotalPrice: 0,
    isNoti: false,
    tipShow: false,
    tipContext: '',
    buttons: [{ text: '关闭' }],
  },
  onLoad: function(){
    let _this = this;
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
      tasktext: e.detail.value,
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
    let taskTotalPrice = parseInt(this.data.taskCost) + parseInt(this.data.taskPay);
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
  addTask: function(){
    //没有登录的话跳转登录(之后写到主函数)
    if (!app.globalData.userInfo){
      wx.navigateTo({
        title: 'goLogin',
        url: '/pages/login/login'
      })
      return;
    }


    let _this = this;
    let data = this.data;
    // 计算起终点距离
    let slo = data.taskVenue[data.sVenueIndex].location.coordinates;
    let elo = data.taskVenue[data.eVenueIndex].location.coordinates;
    let t_seDistance = this.calDistance(slo[1], slo[0], elo[1], elo[0]);
    wx.cloud.callFunction({
      name: 'addTask',
      data: {
        t_requestor: app.globalData.openid,
        t_type: data.taskType[data.taskTypeIndex]._id,
        t_time: JSON.stringify(Date()),
        t_deadline: data.t_dtime,
        t_eVenue: data.taskVenue[data.eVenueIndex]._id,
        t_sVenue: data.taskVenue[data.sVenueIndex]._id,
        t_price: data.taskPay,
        t_cost: data.taskCost,
        t_context: data.tasktext,
        t_visited: 1,
        t_status: 0,
        t_worker: '',
        t_seDistance: t_seDistance,
        t_isNoti: data.isNoti
      }
    }).then(res => {
      console.log(res);
      _this.setData({
        tipShow: true,
        tipContext: "成功创建任务！"
      })
      // wx.switchTab({
      //   url: '/pages/home/home'
      // })
    });
  },
  calDistance: function(la1, lo1, la2, lo2) {
    let La1 = la1 * Math.PI / 180.0;
    let La2 = la2 * Math.PI / 180.0;
    let La3 = La1 - La2;
    let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = Math.round(s);
    return s
  }
})