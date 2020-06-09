// 删除任务
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
exports.main = async (event, context) => {
  try{
    return await db.collection('task').where({
      _id: event._id
    }).remove()
  } catch(e){
    console.error(e)
  }
}