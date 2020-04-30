// 请求单个任务
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //更新游览量
  db.collection('task').where({
    _id: event._id
  }).update({
    data:{
      t_visited: _.inc(1)
    }
  })

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
      from: 'user',
      localField: 't_worker',
      foreignField: 'openid',
      as: 'worker',
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
    .end()
    .then(res => {
      return res.list[0]
    })
    .catch(err => console.error(err))
}