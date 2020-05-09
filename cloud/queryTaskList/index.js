// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  console.log(event)
  const tasks = []  //所有任务集合
  let limit = 4   //每页显示数量
  let matchRule = {
    t_status: _.lte(event.t_status)
  };
  // 如果客户端传了t_type,筛选t_type字段
  if (event.t_type){
    matchRule.t_type = _.in(event.t_type)
  }
  // 如果客户端传了t_context, 筛选t_context字段（首页搜索功能）
  // if (event.t_context && event.t_context.length != 0 && event.t_context != ''){
  //   matchRule.t_context = event.t_context
  // }

  let sortWay = 't_time';  //默认按发布时间降序
  let isAsc = -1;
  if (event.sortWay == 1){
    sortWay = 't_deadline';
  } else if (event.sortWay == 3){
    sortWay = 't_seDistance';
  } else if (event.sortWay == 2){
    sortWay = 't_price';
  }
  if (event.isAsc){
    isAsc = 1
  }
  if (event.t_requestor){
    matchRule.t_requestor = event.t_requestor
  }
  if (event.t_worker) {
    matchRule.t_worker = event.t_worker
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
      [sortWay]: isAsc
    })
    .skip(limit * event.page)
    .limit(limit)
    .end()
    .then(res => {
      if (res.list.length > 0) {

      }
      return res
    })
    .catch(err => console.error(err))
}