var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    task: {
      type: Object,
      value: {}
    },
    // 发布任务、参与任务的数组下标
    index:{   
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
   * 组件的方法列表
   */
  methods: {
    dealTask: function (e) {
      if (e.detail.index == 1) {
        // 数据库中删除该任务
        if (this.properties.task.t_status != 1 && this.properties.task.t_requestor === app.globalData.userAppInfo.openid){
          wx.cloud.callFunction({
            name: 'deleteTask',
            data: {
              _id: this.properties.task._id
            }
          }).then(res => {
          });
        }
        this.triggerEvent('deleteTask', { t_status: this.properties.task.t_status, index: this.properties.index })
      } else {
        //置顶该任务
        this.triggerEvent('stickTask', { index: this.properties.index })
      }
    },
  }
})
