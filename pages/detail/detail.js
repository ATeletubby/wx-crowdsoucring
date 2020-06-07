// pages/detail/detail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {},
    mapMarkers:[{
      iconPath: '../../assets/images/mapmarker.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 100,
    },{
      id: 1,
      latitude: 31.29367,
      longitude: 121.554215,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [],
      color: "#F8D34E",
      width: 3,
      dottedLine: true,
      arrowLine: true,
    }],
    mapShow: false,
    rateShow: false,
    mapbuttons:[{ text: '关闭' }],
    dialogShow: false,
    dialogContent: '',
    buttons: [{ text: '取消' }, { text: '确定' }],
    loading: true,
    userAppInfo: app.globalData.userAppInfo,
    markStars: [0,0,0,0,0],
    reputation: {   // 接收者的声誉
      round: 0,
      half: 0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options._id);
    let _this = this;
    wx.cloud.callFunction({
      name: 'queryTask',
      data: {
        _id: options._id
      }
    }).then(res => {
      res.result.t_timeDiff = util.transformTime(res.result.t_time);
      res.result.t_deadline = util.transformDtime(res.result.t_deadline);
      res.result.t_time = util.formatTime(res.result.t_time);
      let mapMarkers= [];
      let points = [];
      mapMarkers[0] = {
        iconPath: '../../assets/images/mapmarker.png',
        id: 0,
        latitude: res.result.sVenue[0].location.coordinates[1],
        longitude: res.result.sVenue[0].location.coordinates[0],
        label: {
          content: '起点',
          bgColor: '#F8D34E',
          color: '#000',
          borderRadius: 6,
          padding: 4,
        }
      };
      mapMarkers[1] = {
        iconPath: '../../assets/images/mapmarker.png',
        id: 1,
        latitude: res.result.eVenue[0].location.coordinates[1],
        longitude: res.result.eVenue[0].location.coordinates[0],
        label: {
          content: '终点',
          bgColor: '#F8D34E',
          color: '#000',
          borderRadius: 6,
          padding: 4,
        }
      };
      points[0] = {
        latitude: res.result.sVenue[0].location.coordinates[1],
        longitude: res.result.sVenue[0].location.coordinates[0],
      }
      points[1] = {
        latitude: res.result.eVenue[0].location.coordinates[1],
        longitude: res.result.eVenue[0].location.coordinates[0],
      }
      points[2] = {
        latitude: res.result.eVenue[0].location.coordinates[1],
        longitude: res.result.eVenue[0].location.coordinates[0],
      }
      // 计算工人的reputation相关
      let round = 0, half = 0
      if (res.result.worker.length != 0){
        round = parseInt(res.result.worker[0].reputation);
        half = res.result.worker[0].reputation - round >= 0.5 ? 1: 0;
      }
      _this.setData({
        task: res.result,
        mapMarkers: mapMarkers,
        'polyline[0].points': points,
        loading: false,
        userAppInfo: app.globalData.userAppInfo,
        'reputation.round':round,
        'reputation.half': half
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showMap:function(){
    this.setData({
      mapShow: true
    });
  },
  showDialog: function (){
    // 判断是否登录
    if (!app.globalData.userAppInfo){
      wx.navigateTo({
        title: 'goLogin',
        url: '/pages/login/login'
      })
      return;
    }
    if (app.globalData.userAppInfo.openid == this.data.task.t_requestor){
      return;
    }
    this.setData({
      dialogShow: true,
      dialogContent: '是否接受任务？未完成任务将影响声誉'
    });
  },
  tapDialogButton: util.debounce(function(e){
    let _this = this;
    if(e.detail.index == 1) {
      // 选择确定，将status变化提交给云服务
      let updateData = { 
        _id: _this.data.task._id
      };
      if (_this.data.task.t_status == 0 && app.globalData.userAppInfo.openid != _this.data.task.t_requestor) {   // 接受任务
        updateData.operation = 1;
        updateData.t_worker = app.globalData.userAppInfo.openid

        wx.cloud.callFunction({
          name: 'notiUser',
          data: {
            worker: app.globalData.userAppInfo,
            task: _this.data.task
          }
        }).then(res =>{
          console.log(res)
        })
      } else if (_this.data.task.t_status == 0 && app.globalData.userAppInfo.openid == _this.data.task.t_requestor) {  // 关闭任务
        updateData.operation = 3
      } else if (_this.data.task.t_status == 1 && app.globalData.userAppInfo.openid == _this.data.task.t_requestor){   // 完成任务
        // 计算新的reputation
        let mark = _this.data.markStars.filter((item) => { return item == 1 }).length;
        let newreputation = Math.round((_this.data.task.worker[0].reputation * _this.data.task.worker[0].par_num + mark) / (_this.data.task.worker[0].par_num + 1) * 10) / 10
        updateData.operation = 2;
        updateData.reputation = newreputation;
        updateData.t_worker = _this.data.task.t_worker;
      }
      wx.cloud.callFunction({
        name: 'updateTask',
        data: updateData,
      }).then(res =>{
        _this.setData({
          'task.t_status': updateData.operation,
        })
        _this.onLoad({_id : _this.data.task._id})
      });
    } 
    _this.setData({
      dialogShow: false,
      rateShow: false
    })
    
  }),
  tapDialogMapButton(e) {
    this.setData({
      mapShow: false
    })
  },
  closeTask(){
    this.setData({
      dialogShow: true,
      dialogContent: '是否关闭任务（任务将终止）？'
    })
  },
  completeTask(){
    this.setData({
      rateShow: true,
    })
  },
  changeMark(e){
    const num = e.currentTarget.dataset.starid;
    let markStars = [0,0,0,0,0];
    for (let i = 0; i <= num; i++){
      markStars[i] = 1;
    }
    this.setData({
      markStars: markStars
    })
  }
})