// components/my-cpn/my-cpn.js
Component({
  /**
   * 组件的属性列表
   */
  lifetimes: {
    created: function () {
      console.log('组件出现')
    },
    attached: function () {
      console.log('组件出现')
    }
  },
  properties: {
    title: {
      type: String,
      value: '1'
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
  pageLifetimes: {
    show() {
      console.log('监听组件出来')
    },
    hide() {
      console.log('隐藏')
    }
  }

})
