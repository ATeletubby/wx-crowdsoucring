
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isType: false,  // 任务类型下拉菜单
    isFilter: false,
    typeItems:[],
    selectedItems: [],
    tasks:[],
    loading: true
  },
  onLoad:function(){
    let _this = this
    // 获取任务类型
    wx.cloud.callFunction({
      name: 'queryTaskType',
    }).then(res => {
      _this.setData({
        typeItems: res.result.data
      })
    });
   // 获取筛选类型
    wx.cloud.callFunction({
      name: 'querySelectedType',
    }).then(res => {
      _this.setData({
        selectedItems: res.result.data
      })
    });
   // 获取未被分配的任务列表
    // wx.cloud.callFunction({
    //   name: 'queryTaskList',
    //   data: {
    //     t_status: 1,
    //     userLocation: app.globalData.userLocation
    //   }
    // }).then(res => {
    //   console.log(res.result);
    //   _this.setData({
    //     tasks: res.result.list
    //   })
    // });
  },
  onShow:function(){
    let _this = this

    // 获取未被分配的任务列表
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 1,
        userLocation: app.globalData.userLocation
      }
    }).then(res => {
      console.log(res.result);
      _this.setData({
        loading: false,
        tasks: res.result.list
      })
    });
  },
  openTopbarContent:function(event){
    if (event.currentTarget.id == 'type_bar'){
      this.setData({ 
        isType: !this.data.isType,
        isFilter: false
        });
    }
    else if (event.currentTarget.id == 'filter_bar'){
      this.setData({ 
        isFilter: !this.data.isFilter,
        isType: false
        });
    } 
  },
  selectedItems:function(event){
    let id = event.currentTarget.dataset.id;
    let key = 'selectedItems[' + id + '].status';
    this.setData({
      'selectedItems[0].status': false,
      'selectedItems[1].status': false,
      'selectedItems[2].status': false,
      [key]: true
    });
  },
  typeItems: function (event){
    let id = event.currentTarget.dataset.id;
    let key = 'typeItems[' + id + '].status';
    this.setData({
      [key]: !this.data.typeItems[id].status
    });
  },
  // 任务类型选择后
  refreshTaskList: function(){
    let _this = this;
    // 选中的任务类型，将id传给云函数
    let taskType = [];
    for (let i = 0; i < this.data.typeItems.length; i++){
      if (this.data.typeItems[i].status){
        taskType.push(this.data.typeItems[i]._id);
      }
    }
    // 选中的排序类型，将value传给云函数
    let sortWay = 0;
    for (let i = 0; i < this.data.selectedItems.length; i++) {
      if (this.data.selectedItems[i].status) {
        sortWay = this.data.selectedItems[i].value
      }
    }

    this.setData({
      tasks: [],
      isType: false,
      isFilter: false,
      loading: true,
    });
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 1,
        userLocation: app.globalData.userLocation,
        t_type: taskType,
        sortWay: sortWay
      }
    }).then(res => {
      console.log(res.result);
      _this.setData({
        loading: false,
        tasks: res.result.list
      })
    });
  },

  // openTaskDetail: function () {
  //   wx.navigateTo({
  //     title: 'go',
  //     url: '../../pages/category/category'
  //   })
  // }
})