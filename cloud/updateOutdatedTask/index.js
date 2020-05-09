// 任务过期
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('task').where({
    _id: event._id
  }).update({
    data: {
      t_status: 3
    }
  })
}