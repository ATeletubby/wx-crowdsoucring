// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskType: [{
      name: '配送任务',
      value: '0'
    },{
      name: 'xx任务',
      value: '1'
    },{
      name: 'xx任务',
      value: '2'
    }],
    taskTypeIndex: 0,
    dtime: "00:00",   // 截止时间
    taskVenue:[{
      name: '食堂',
      value: '0'
    },{
      name: '教学楼',
      value: '1'
    },{
      name: '宿舍',
      value: '2'
    },{
      name: '无',
      value: '3'
    }],
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
  }
})