 // 时间戳转换成标准格式
const formatTime = (date) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 得到当前时间
const currentTime = () => {
  let date = new Date()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute].map(formatNumber).join(':')
}



// 当前时间与发布时间的差值
const transformTime = (time)=> {
  let currentTime = new Date();
  let t = currentTime.getTime() - time;
  let hour = parseInt(t / (1000 * 60 * 60))
  let minute = parseInt(t / (1000 * 60))
  let day = parseInt(t / (1000 * 60 * 60 * 24))
  let second = parseInt(t / (1000))
  if (day >= 1) {
    return day + '天'
  } else if (hour >= 1) {
    return hour + '小时'
  } else if (minute >= 1) {
    return minute + '分钟'
  } else {
    return second + '秒'
  }
}

// 当前时间和截止时间的差值
const transformDtime = (time) => {
  let currentTime = new Date();
  let t = time -  currentTime.getTime();
  let hour = parseInt(t / (1000 * 60 * 60))
  let minute = parseInt(t / (1000 * 60))
  let day = parseInt(t / (1000 * 60 * 60 * 24))
  let second = parseInt(t / (1000))
  if (minute > 60){
    hour = parseInt(minute / 60);
    minute = minute - hour * 60
    return hour + '小时' + minute+ '分钟'
  }
  else if (minute <= 60)
    return minute + '分钟'
  else
    return second + '秒'
}

// 计算距离
const calDistance =  (la1, lo1, la2, lo2) => {
  let La1 = la1 * Math.PI / 180.0;
  let La2 = la2 * Math.PI / 180.0;
  let La3 = La1 - La2;
  let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = Math.round(s);
  return s
}

module.exports = {
  formatTime: formatTime,
  currentTime: currentTime,
  transformTime: transformTime,
  transformDtime: transformDtime,
  calDistance: calDistance
}
