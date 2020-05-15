var app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskType: [],
    taskTypeIndex: 0,
    dtime: 10,   // 截止时间
    dtimeRange:[],
    taskVenue:[],
    sVenueIndex: 0,   //起点
    eVenueIndex: 1,   //终点
    textsize: 0,     //任务详情字数
    taskText: '',
    taskCost: 0,      //任务成本
    taskPay: 0,       //任务报酬
    taskTotalPrice: 0,
    isNoti: true,
    tipShow: false,
    tipContext: '',
    paytipShow: false,
    paybuttons: [{ text: '取消' }, { text: '确认' }],
    buttons: [{ text: '关闭' }],
    errormsg:'',
    error: false,
    new_id: null,
  },
  onLoad: function(){
    let _this = this;
    this.initForm()
    // 得到当前时间
    // let dtime = util.currentTime();
    // _this.setData({
    //   dtime: dtime
    // });
    // 设置任务时长
    let dtimeRange = [];
    for (let i = 10; i<=120; i+=10){
      dtimeRange.push({
        name: i + '分钟',
        value: i
      })
    }
    this.setData({
      dtimeRange: dtimeRange
    })
    // 获取任务类型
    wx.cloud.callFunction({
      name: 'queryTaskType',
    }).then(res => {
      _this.setData({
        taskType: res.result.data
      })
      console.log(res.result.data)
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
  onShow: function () {
    this.initForm()
  },

  // 初始化表单
  initForm: function(){
    this.setData({
      new_id: null,
      taskCost: 0,
      taskPay: 0,
      taskText: '',
      taskTypeIndex: 0,
      sVenueIndex: 0,
      eVenueIndex: 1,
    })
  },
  taskTypeChange: function (e) {
    this.setData({
      taskTypeIndex: e.detail.value
    })
  },
  dtimeChange: function(e){
    this.setData({
      dtime: (parseInt(e.detail.value) + 1)* 10
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
    } else if (e.currentTarget.dataset.id == "tip-dtime"){
      this.setData({
        tipShow: true,
        tipContext: "任务发布以后根据任务时长进入倒计时，超过任务时长将会自动过期"
      })
    }
  },
  closeTipDialog: function(){
    this.setData({
      tipShow: false,
    })
    if (this.data.new_id){
      wx.navigateTo({
        title: 'goRegist',
        url: '/pages/detail/detail?_id=' + this.data.new_id
      })
    }
  },

  checkPay: util.debounce(function(){
    console.log("1000");
    //检验登录(之后写到主函数)
    if (!app.globalData.userAppInfo) {
      wx.navigateTo({
        title: 'goLogin',
        url: '/pages/login/login'
      })
      return;
    }
    // 检验非法字段
    if (this.data.taskText == ''){
      this.setData({
        error: true,
        errormsg: "任务详情不能为空！"
      })
      return;
    }
    if (this.data.taskText.length < 5) {
      this.setData({
        error: true,
        errormsg: "任务详情不能少于5个字符！"
      })
      return;
    }
    if (isNaN(this.data.taskCost) && isNaN(this.data.taskCost)){
      this.setData({
        error: true,
        errormsg: "任务成本与任务报酬必须为数字！"
      })
      return;
    }

    // 检验众包币
    if (app.globalData.userAppInfo.crowdCoin < this.data.taskTotalPrice) {
      this.setData({
        error: true,
        errormsg: "众包币余额不够！还剩 " + app.globalData.userAppInfo.crowdCoin
      })
      return;
    }

    // 如果用户开启任务提醒，获取用户订阅权限
    if (this.data.isNoti) {
      wx.requestSubscribeMessage({
        tmplIds: ['0lFGbs_LnR2mW6kjo2mSlIiWTuf2AwtbkKuFTd9WpH8'],
        success(res) {
          console.log(res)
        },
        fail(res) {
          console.log(res)
        }
      })
    }

    this.setData({
      paytipShow: true,
      paytipContext: "发布任务需支付众包币 " + this.data.taskTotalPrice + " ，确认支付？"
    })
   
  }, 300),


  addTask: function(e){
    if (e.detail.index == 0) {
      this.setData({
        paytipShow: false,
      })
      return;
    }
    // 防止多次点击确定
    this.setData({
      loading: true,
      'paybuttons[1].text': '发布任务中...',
      'paybuttons[1].extClass': 'disabled',
    })

    let _this = this;
    let data = this.data;
    // 计算起终点距离
    let slo = data.taskVenue[data.sVenueIndex].location.coordinates;
    let elo = data.taskVenue[data.eVenueIndex].location.coordinates;
    let t_seDistance = util.calDistance(slo[1], slo[0], elo[1], elo[0]);
    // 计算当前时间和截止时间戳
    let t_time = new Date().getTime();
    let t_deadline = t_time + data.dtime * 60 * 1000;
    wx.cloud.callFunction({
      name: 'addTask',
      data: {
        t_requestor: app.globalData.openid,
        t_type: data.taskType[data.taskTypeIndex]._id,
        t_time: t_time,
        t_deadline: t_deadline,
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
        tipContext: "成功创建任务！",
        'paybuttons[1].text': '确认',
        'paybuttons[1].extClass': '',
        new_id: res.result._id
      })
    });
  },
})