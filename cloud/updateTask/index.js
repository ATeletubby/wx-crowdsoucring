// 更新任务状态  1. 工人接受任务 operation = 1   2.发布者结束任务  operation = 2   3. 任务自动过期/ 发布者关闭任务   operation = 3
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let updateData = {
    t_status: event.operation
  }
  if (event.operation == 1 && event.t_worker){
    updateData.t_worker = event.t_worker
    // 工人更新par_num
    db.collection('user').where({
      openid: event.t_worker
    }).update({
      data: {
        par_num: _.inc(1)
      }
    })
  }
  if (event.operation == 2 && event.reputation){
    // 更新工人声誉
    db.collection('user').where({
      openid: event.t_worker
    }).update({
      data: {
        reputation: event.reputation
      }
    })
  }
  return await db.collection('task').where({
    _id: event._id
  }).update({
    data: updateData
  })
}