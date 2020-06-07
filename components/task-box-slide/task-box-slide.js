// components/task-box-slide/task-box-slide.js
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
    dealPubTask: function (e) {
      let pubTasks = this.data.pubTasks;
      if (e.detail.index == 1) {
        // 删除该任务
        pubTasks.splice(e.currentTarget.dataset.pubindex, 1);
        this.setData({
          pubTasks: pubTasks
        })
      } else {
        //置顶该任务
        let temp = pubTasks[0];
        pubTasks[0] = pubTasks[e.currentTarget.dataset.pubindex];
        pubTasks[e.currentTarget.dataset.pubindex] = temp;
        this.setData({
          pubTasks: pubTasks
        })
      }
    },
  }
})
