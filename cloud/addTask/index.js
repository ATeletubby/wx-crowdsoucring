// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    // 发布任务数+1,众包币扣除t_price + t_cost
    db.collection('user').where({
      openid: event.t_requestor
    }).update({
      data: {
        pub_num: _.inc(1),
        crowdCoin: _.inc(-1 * event.t_taskTotalPrice)
      } 
    });
    return await db.collection('task').add({
      data: {
        t_requestor: event.t_requestor,
        t_type: event.t_type,
        t_time: event.t_time,
        t_deadline: event.t_deadline,
        t_eVenue: event.t_eVenue,
        t_sVenue: event.t_sVenue,
        t_price: parseFloat(event.t_price),
        t_cost: parseFloat(event.t_cost),
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

