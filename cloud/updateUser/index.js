const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let updateData = {
    t_status: event.operation
  }
  // if (!event.userAppInfo.wxh){
  //   event.userAppInfo.wxh = ''
  // }
  return await db.collection('user').where({
    openid: event.userAppInfo.openid
  }).update({
    data: {
      name: event.userAppInfo.name,
      phone: event.userAppInfo.phone,
      wxh: event.userAppInfo.wxh,
      avatarUrl: event.userAppInfo.avatarUrl
    }
  }).then(res =>{
     return res;
  })
}