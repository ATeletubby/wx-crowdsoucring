// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const tasks = []  //所有任务集合
  let matchRule = {
    t_status: _.lte(event.t_status)
  };
  // 如果客户端传了t_type,筛选t_type字段
  if (event.t_type){
    matchRule.t_type = _.in(event.t_type)
  }
  let sortWay = 't_time';
  if (event.sortWay == 0){
    sortWay = 't_seDistance';
  } else if (event.sortWay == 1){
    sortWay = 't_price';
  }

  return db.collection('task').aggregate()
    .match(matchRule)
    .lookup({
      from: 'user',
      localField:'t_requestor',
      foreignField:'openid',
      as: 'requestor',
    })
    .lookup({
      from: 'taskType',
      localField:'t_type',
      foreignField:'_id',
      as: 'taskType',
    })
    .lookup({
      from: 'venue',
      localField: 't_sVenue',
      foreignField: '_id',
      as: 'sVenue',
    })
    .lookup({
      from: 'venue',
      localField: 't_eVenue',
      foreignField: '_id',
      as: 'eVenue',
    })
    .sort({
      [sortWay]: -1 
    })
    .end()
    .then(res => {
      console.log(res.list);
      if (res.list.length > 0) {
        let list = res.list;
        for (let i = 0; i < list.length; i++) {
          list[i].t_time = formatDate(list[i].t_time)
          // 计算起点到终点的距离(后期写在发布任务中)
          // let slo = list[i].sVenue[0].location.coordinates;
          // let elo = list[i].eVenue[0].location.coordinates;
          // list[i].t_seDistance = calDistance(slo[1], slo[0], elo[1], elo[0]);
          
          // 计算用户到起点的距离
          if (event.userLocation){
            let slo = list[i].sVenue[0].location.coordinates;
            list[i].t_usDistance = calDistance(slo[1], slo[0], event.userLocation.latitude, event.userLocation.longitude)
          } else {
            list[i].t_usDistance = 'xxx';
          }     
        }
      }
      return res
    })
    .catch(err => console.error(err))
}

var formatDate = function (date) {
  var date = new Date(date);  
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
};
var calDistance = function(la1, lo1, la2, lo2) {
  let La1 = la1 * Math.PI / 180.0;
  let La2 = la2 * Math.PI / 180.0;
  let La3 = La1 - La2;
  let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = Math.round(s);
  return s
}