
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isType: false,  // 任务类型下拉菜单
    isFilter: false,
    typeItems:[],
    selectedItems: [],
    tasks:[]
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

   // 获取未被分配的任务列表
    wx.cloud.callFunction({
      name: 'queryUnsignedTasks',
      success: function(res){
        console.log(res.result.tasks);
        _this.setData({
          tasks: res.result.tasks
        })
      },
      fall: function(e){
        console.log(e)
      }
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
  }
  // openTaskDetail: function () {
  //   wx.navigateTo({
  //     title: 'go',
  //     url: '../../pages/category/category'
  //   })
  // }
})