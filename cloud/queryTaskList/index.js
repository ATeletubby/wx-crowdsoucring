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
  return  db.collection('task').aggregate()
    .match({
      t_status: _.lte(event.t_status)
    })
    .lookup({
      from: 'user',
      localField:'t_requestor',
      foreignField:'_id',
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
    .end()
    .then(res => {
      console.log(res.list);
      if (res.list.length > 0) {
        let list = res.list;
        for (let i = 0; i < list.length; i++) {
          // 时间格式
          // list[i].t_time = list[i].t_time.getFullYear() + '-' + list[i].t_time.getMonth() + '-' + list[i].t_time.getDate() + ' ' + list[i].t_time.getHours() + ':' + list[i].t_time.getMinutes();
          
          // 计算起点到终点的距离(后期写在发布任务中)
          let slo = list[i].sVenue[0].location.coordinates;
          let elo = list[i].eVenue[0].location.coordinates;
          list[i].t_seDistance = calDistance(slo[1], slo[0], elo[1], elo[0]);
          // 计算用户到起点的距离
          if (event.userLocation){
            console.log(event.userLocation)
          } else {
            list[i].t_usDistance = 'xxx';
          }     
        }
      }
      return res
    })
    .catch(err => console.error(err))
}

function calDistance(la1,lo1,la2,lo2){
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
