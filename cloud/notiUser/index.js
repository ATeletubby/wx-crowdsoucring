// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 告知发布者任务已被接收
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.task.t_requestor,
      page: '/pages/detail/detail?_id=' + event.task._id,
      lang: 'zh_CN',
      data: {
        name5: {
          value: event.worker.name
        },
        phone_number11: {
          value: event.worker.phone
        },
        time2: {
          value: event.task.t_time
        },
        thing4: {
          value: event.task.t_context
        }
      },
      templateId: '0lFGbs_LnR2mW6kjo2mSlIiWTuf2AwtbkKuFTd9WpH8',
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
      return err
    }
}