// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('task').add({
      data: {
        t_requestor: event.t_requestor,
        t_type: event.t_type,
        t_time: Date(),
        t_deadline: event.t_deadline,
        t_eVenue: event.t_eVenue,
        t_sVenue: event.t_sVenue,
        t_price: parseInt(event.t_price),
        t_cost: parseInt(event.t_cost),
        t_isNoti: event.t_isNoti,
        t_context: event.t_context,
        t_visited: 1,
        t_status: 0,
        t_worker: '',
        t_seDistance: parseInt(event.t_seDistance),
      }
    })
  }catch (e) {
    console.error(e)
  }
}

