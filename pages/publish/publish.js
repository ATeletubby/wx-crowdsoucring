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
    taskTypeIndex: 0
  },

  taskTypeChange: function (e) {
    this.setData({
      taskTypeIndex: e.detail.value
    })
  },
})