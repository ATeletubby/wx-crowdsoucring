// pages/regist/regist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: false,
    errormsg: '手机号格式错误',
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  phoneInput: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  submitForm: function(){
    let _this = this
    //验证表单
    if (_this.data.phone.length != 11){
      _this.setData({
        error: true,
        errormsg: '手机号格式错误！'
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'addUser',
      data: {
        userInfo: app.globalData.userInfo,
        phone: _this.data.phone
      }
    }).then(res => {
      if (res.result._id){
        wx.cloud.callFunction({
          name: 'queryUser',
        }).then(res => {
          app.globalData.userAppInfo = res.result[0];
          wx.navigateBack({
            delta: 2
          })
        })
      } else{
        _this.setData({
          error: true,
          errormsg: '注册失败，请联系管理员！'
        })
      }
    })
  }
})