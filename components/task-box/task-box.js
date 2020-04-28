// components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    task: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    ready: function () {
    },
  },
  methods: {
    openTaskDetail: function(){
      wx.navigateTo({
        title: 'go',
        url: '/pages/detail/detail?_id='+ this.data.task._id
      })
    }
  }
})
