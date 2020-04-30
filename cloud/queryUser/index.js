// 用户登录小程序后，根据openid查找user表是否存在该用户
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;
  console.log(openid)
  return await db.collection('user').where({
    openid: openid,
  }).get().then(res => {
    return res.data
  })
}