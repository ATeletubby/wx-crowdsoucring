// 请求单个任务
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('task').aggregate()
    .match({
      _id: event._id
    })
    .lookup({
      from: 'user',
      localField: 't_requestor',
      foreignField: 'openid',
      as: 'requestor',
    })
    .lookup({
      from: 'taskType',
      localField: 't_type',
      foreignField: '_id',
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
}