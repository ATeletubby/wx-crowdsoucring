// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = wx.cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const tasks = []  //所有任务集合

  await db.collection('task').where({
    t_status: 0
  }).get().then(res => {

    for (let i = 0; i < res.data.length; i++) {
      const t = {}  // 每个筛选出的任务
      db.collection('user').where({
        _id: res.data[i].t_requestor
      }).get().then(item => {
        t.id = res.data[i]._id;
        t.t_requestor = item.data[0].name;
      })
      tasks.push(t)
    }

  });
  return (await Promise.all(tasks))
}