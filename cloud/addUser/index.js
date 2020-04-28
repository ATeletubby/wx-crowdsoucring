// 用户第一次授权后，将用户信息记录在user集合
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('user').where({
      openid: wxContext.OPENID,
    }).get().then(res => {
      // 如果是新用户
      let userInfo = JSON.parse(event.userInfo);    // 字符串转对象
      if (res.data.length == 0) {
        db.collection('user').add({
          data: {
            name: userInfo.nickName,
            openid: wxContext.OPENID,
            last_login_time: Date(),
            regist_time: Date(),
            par_num: 0,
            pub_num: 0,
            reputation: 0,
            avatarUrl: userInfo.avatarUrl
          }
        })
      } else {
        db.collection('user').where({
          openid: wxContext.OPENID
        }).update({
          data: {
            last_login_time: Date(),
          }
        })
      }
      return res.data;
    })
  } catch (e){
    console.error(e)
  }
}

