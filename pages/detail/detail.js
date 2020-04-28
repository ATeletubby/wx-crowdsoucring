// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {
      't_requestor': {
        name: '任务发布者',
        value: '小明',
        openid: ''
      },
      't_type':{
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
      't_cost':{
        name: '任务费用',
        value: '2'
      },
      't_price':{
        name: '任务报酬',
        value: '1'
      },
      't_context':{
        name: '任务详情',
        value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      },
      't_status':0,
    },
    map:{
      markers:[{
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      },{
        id: 1,
        latitude: 23.099994,
        longitude: 113.323519,
        width: 50,
        height: 50
      }]
    },
    mapShow: false,
    mapbuttons:[{ text: '关闭' }],
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options._id);
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
    this.setData({
      dialogShow: true
    });
  },
  tapDialogButton(e) {
    if(e.detail.index == 1) {
      // 选择确定，将status变化提交给云服务
      this.setData({
        dialogShow: false,
        'task.t_status': 1
      })
    } else {
      this.setData({
        dialogShow: false,
      })
    }
  },
  tapDialogMapButton(e) {
    this.setData({
      mapShow: false
    })
  }
})