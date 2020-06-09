let app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAppInfo: null,
    error: false,
    errormsg: '',
    editsuccess: false,
    editsuccessmsg: '',
    tempAvatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   console.log(app.globalData.userAppInfo)
  //   this.setData({
  //     userAppInfo: app.globalData.userAppInfo
  //   })
  // },
  onShow: function (options) {
    this.setData({
      userAppInfo: app.globalData.userAppInfo
    })
  },
  changeProfile: function(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          "userAppInfo.avatarUrl": tempFilePaths[0],
          tempAvatar: tempFilePaths[0]
        })
      }
    })
  },
  userinfoInput: function(e){
    if (e.currentTarget.dataset.id == 'name'){
        this.setData({
          "userAppInfo.name": e.detail.value
        })
    } else if (e.currentTarget.dataset.id == 'phone'){
      this.setData({
        "userAppInfo.phone": e.detail.value
      })
    } else if (e.currentTarget.dataset.id == 'wxh') {
      this.setData({
        "userAppInfo.wxh": e.detail.value
      })
    }
  },
  /*
    修改个人信息
  */
  saveProfile: util.debounce(function(){
    let _this = this;
    //验证输入
    if (this.data.userAppInfo.name.length == 0) {
      this.setData({
        error: true,
        errormsg: '用户名格式错误!'
      })
      return;
    }
    if (this.data.userAppInfo.phone.length != 11) {
      this.setData({
        error: true,
        errormsg: '手机号格式错误!'
      })
      return;
    }
    if (this.data.userAppInfo.wxs && this.data.userAppInfo.wxs.length > 100) {
      this.setData({
        error: true,
        errormsg: '微信号格式错误!'
      })
      return;
    }
    
    // 将图片保存到云服务器
    if (this.data.tempAvatar != ''){
      wx.cloud.uploadFile({
        cloudPath: _this.data.userAppInfo.openid + '.jpg',
        filePath: _this.data.tempAvatar,
        success(res) {
          console.log(res.fileID)
          _this.setData({
            'userAppInfo.avatarUrl': res.fileID
          })
          // 修改全局中的user信息
          app.userAppInfo = _this.data.userAppInfo;
          // 修改数据库的user信息
          wx.cloud.callFunction({
            name: 'updateUser',
            data: {
              userAppInfo: _this.data.userAppInfo
            }
          }).then(res => {
            if (res.result) {
              _this.setData({
                editsuccess: true,
                editsuccessmsg: '用户信息更新成功'
              })
            } else {
              _this.setData({
                error: true,
                errormsg: '服务器异常，用户信息失败'
              })
            }
          });
        },
        error(res){
          console.log(res)
        }
      })
    } else {
      // 修改全局中的user信息
      app.userAppInfo = _this.data.userAppInfo;
      // 修改数据库的user信息
      wx.cloud.callFunction({
        name: 'updateUser',
        data: {
          userAppInfo: _this.data.userAppInfo
        }
      }).then(res => {
        if (res.result) {
          _this.setData({
            editsuccess: true,
            editsuccessmsg: '用户信息更新成功'
          })
        } else {
          _this.setData({
            error: true,
            errormsg: '服务器异常，用户信息失败'
          })
        }
      });
    }
  },500),
  onShareAppMessage: function () {

  }
})