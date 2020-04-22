// pages/home/home.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isType: false,  // 任务类型下拉菜单
    isFilter: false,
    typeItems:[{
      name:'配送任务',
      value:'0',
      status: true
    },{
      name: '??任务',
      value: '1',
      status: false
    },{
      name: '??任务',
      value: '2',
      status: false
    },{
      name: '??任务',
      value: '2',
      status: false
    },{
      name: '??任务',
      value: '2',
      status: false
    }],
    selectedItems: [{
      name: '按照距离降序',
      value:'0',
      status: true
    },{
        name: '按照价格降序',
        value: '1',
        status: false
    },{
        name: '按照时间降序',
        value: '2',
        status: false
      }],
    tasks:[{
        value : 0
      },{
        value: 1
      },{
        value: 2
      }
    ]
  },
  query:function(){
    db.collection("user").get().then(console.log)
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