
var app = getApp()
const util = require('../../utils/util.js') 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isType: false,  // 任务类型下拉菜单
    isFilter: 1,
    isTime: false,
    isPrice: false,
    isDistance: false,
    typeItems:[],
    selectedItems: [],
    tasks:[],
    loading: true,
    sloading: false,
    page: 0,
    isBottom: false,
    search_context: '',
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
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        app.globalData.userLocation = {
          'latitude': res.latitude,
          'longitude': res.longitude
        }
        this.onShow() 
      }
    })

   // 获取未被分配的任务列表
    // wx.cloud.callFunction({
    //   name: 'queryTaskList',
    //   data: {
    //     t_status: 0,
    //     userLocation: app.globalData.userLocation,
    //     page: _this.data.page
    //   }
    // }).then(res => {
    //   console.log(res.result);
    //   // 处理返回的数据
    //   let list = res.result.list;
    //   for (let i = 0; i < list.length; i++) {
    //     list[i].t_time = util.transformTime(list[i].t_time)
    //     // 计算用户到起点的距离
    //     if (app.globalData.userLocation) {
    //       let slo = list[i].sVenue[0].location.coordinates;
    //       list[i].t_usDistance = util.calDistance(slo[1], slo[0], app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)
    //     } else {
    //       list[i].t_usDistance = 'xxx';
    //     }
    //   }
    //   _this.setData({
    //     loading: false,
    //     tasks: list
    //   })
    // });
  },
  //每次首页显示都会刷新任务列表
  onShow:function(){
    let _this = this
    _this.setData({
      tasks: [],
      loading: true,
      page: 0,
      isBottom: false,
    })
    // 选中的排序类型
    let sortWay = _this.data.isFilter;
    let isAsc;
    if (sortWay == 1) {
      isAsc = _this.data.isTime
    } else if (sortWay == 2) {
      isAsc = _this.data.isPrice
    } else if (sortWay == 3) {
      isAsc = _this.data.isDistance
    }

    // 获取未被分配的任务列表
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 0,
        page: _this.data.page,
        sortWay: sortWay,
        isAsc: isAsc
      }
    }).then(res => {
      console.log(res.result);
      // 处理返回的数据
      let list = res.result.list;
      for (let i = 0; i < list.length; i++) {
        list[i].t_deadline = util.transformDtime(list[i].t_deadline)
        // 计算用户到起点的距离
        if (app.globalData.userLocation) {
          let slo = list[i].sVenue[0].location.coordinates;
          list[i].t_usDistance = util.calDistance(slo[1], slo[0], app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)
          list[i].t_usDistance = Math.round(list[i].t_usDistance * 100) / 100
        } else {
          list[i].t_usDistance = 'xxx';
        }
      }
      _this.setData({
        loading: false,
        tasks: res.result.list
      })
    });
  },
  // onPullDownRefresh: function(){
  //   console.log('下拉刷新')
  // },
  onReachBottom: function(){
    if (this.data.isBottom){
      return
    }
    let _this = this
    let page = this.data.page + 1;
    this.setData({
      sloading:true,
      page: page
    });
    // 选中的排序类型
    let sortWay = _this.data.isFilter;
    let isAsc;
    if (sortWay == 1) {
      isAsc = _this.data.isTime
    } else if (sortWay == 2) {
      isAsc = _this.data.isPrice
    } else if (sortWay == 3) {
      isAsc = _this.data.isDistance
    }
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 0,
        // userLocation: app.globalData.userLocation,
        page: page,
        sortWay: sortWay,
        isAsc: isAsc,
      }
    }).then(res => {
      // 如果返回的数据小于limit(4)，说明到达最后一页
      if (res.result.list.length < 4){
        _this.setData({
          isBottom: true
        })
      }
      // 处理返回的数据
      let list = res.result.list;
      let tasks = _this.data.tasks;
      for (let i = 0; i < list.length; i++) {
        list[i].t_deadline = util.transformDtime(list[i].t_deadline)
        // 计算用户到起点的距离
        if (app.globalData.userLocation) {
          let slo = list[i].sVenue[0].location.coordinates;
          list[i].t_usDistance = util.calDistance(slo[1], slo[0], app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)
          list[i].t_usDistance = Math.round(list[i].t_usDistance * 100) / 100
        } else {
          list[i].t_usDistance = 'xxx';
        }
        tasks.push(list[i]);
      }
      _this.setData({
        sloading: false,
        tasks: tasks
      })
    });

  },
  openTopbarContent:function(event){
    if (event.currentTarget.id == 'type_bar'){
      this.setData({ 
        isType: !this.data.isType,
        });
    }
    else if (event.currentTarget.id == 'time_bar'){
      this.setData({ 
        isFilter: 1,
        isTime: !this.data.isTime,
        isPrice: false,
        isDistance: false,
        isType: false
        });
      this.refreshTaskList(event)
    } 
    else if (event.currentTarget.id == 'price_bar') {
      this.setData({
        isFilter: 2,
        isPrice: !this.data.isPrice,
        isTime: false,
        isDistance: false,
        isType: false
      });
      this.refreshTaskList(event)
    } 
    else if (event.currentTarget.id == 'distance_bar') {
      this.setData({
        isFilter: 3,
        isDistance: !this.data.isDistance,
        isTime: false,
        isPrice: false,
        isType: false
      });
      this.refreshTaskList(event)
    } 
  },
  // selectedItems:function(event){
  //   let id = event.currentTarget.dataset.id;
  //   let key = 'selectedItems[' + id + '].status';
  //   this.setData({
  //     'selectedItems[0].status': false,
  //     'selectedItems[1].status': false,
  //     'selectedItems[2].status': false,
  //     [key]: true
  //   });
  // },
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
    // 选中的排序类型
    let sortWay = _this.data.isFilter;
    let isAsc;
    if (sortWay == 1){
      isAsc = _this.data.isTime
    } else if (sortWay == 2){
      isAsc = _this.data.isPrice
    } else if (sortWay == 3) {
      isAsc = _this.data.isDistance
    }

    this.setData({
      tasks: [],
      isType: false,
      loading: true,
      page: 0
    });
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 0,
        t_type: taskType,
        sortWay: sortWay,
        isAsc: isAsc,
        page: _this.data.page
      }
    }).then(res => {
      // 处理返回的数据
      let list = res.result.list;
      let tasks = _this.data.tasks;
      for (let i = 0; i < list.length; i++) {
        list[i].t_deadline = util.transformDtime(list[i].t_deadline)
        // 计算用户到起点的距离
        if (app.globalData.userLocation) {
          let slo = list[i].sVenue[0].location.coordinates;
          list[i].t_usDistance = util.calDistance(slo[1], slo[0], app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)
          list[i].t_usDistance = Math.round(list[i].t_usDistance * 100) / 100
        } else {
          list[i].t_usDistance = 'xxx';
        }
        tasks.push(list[i]);
      }
      _this.setData({
        loading: false,
        tasks: res.result.list,
        isBottom: false
      })
    });
  },
  searchbarInput: function(e){
    this.setData({
      search_context: e.detail.value
    })
  },
  selectResult: function(e){
    let _this = this;
    this.setData({
      loading: true,
      tasks: [],
      page: 0
    })
    wx.cloud.callFunction({
      name: 'queryTaskList',
      data: {
        t_status: 0,
        userLocation: app.globalData.userLocation,
        page: _this.data.page,
        t_context: _this.data.search_context
      }
    }).then(res => {
      console.log(res.result);
      // 处理返回的数据
      let list = res.result.list;
      for (let i = 0; i < list.length; i++) {
        list[i].t_deadline = util.transformDtime(list[i].t_deadline)
        // 计算用户到起点的距离
        if (app.globalData.userLocation) {
          let slo = list[i].sVenue[0].location.coordinates;
          list[i].t_usDistance = util.calDistance(slo[1], slo[0], app.globalData.userLocation.latitude, app.globalData.userLocation.longitude)
          list[i].t_usDistance = Math.round(list[i].t_usDistance * 100) / 100
        } else {
          list[i].t_usDistance = 'xxx';
        }
      }
      _this.setData({
        loading: false,
        tasks: list
      })
    });
  }
})