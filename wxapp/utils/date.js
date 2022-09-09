function getTime(dateStr) {
  var date = new Date(dateStr)
  var Month = date.getMonth() + 1
  var Day = date.getDate()
  var Y = date.getFullYear() + '-'
  var M = Month < 10 ? '0' + Month + '-' : Month + '-'
  var D = Day + 1 < 10 ? '0' + Day : Day
  return Y + M + D
}
function getDate(date) {
  if (!date) {
    return new Date()
  }
  var theDate = ''
  let beforeTime
  if (typeof date === 'number') {
    theDate = new Date(date)
  } else if (date.length === undefined) {
    theDate = date
  } else {
    if (date.length > 10) {
      var dateArr = date.split(/[T\s]/)
      beforeTime = dateArr[0].split('-')
      var afterTime = dateArr[1].split(':')
      afterTime[2] = afterTime[2] ? afterTime[2] : '00'
    } else {
      beforeTime = date.split('-')
    }
    if (afterTime) {
      theDate = new Date(beforeTime[0], beforeTime[1] - 1, beforeTime[2], afterTime[0], afterTime[1], afterTime[2])
    } else {
      theDate = new Date(beforeTime[0], beforeTime[1] - 1, beforeTime[2])
    }
  }
  if (!theDate) {
    theDate = new Date()
  }
  return theDate
}
/**
 * 输入Unix时间戳，返回指定时间格式
 */
function calcTimeHeader(time) {
  // 格式化传入时间
  const date = new Date(parseInt(time)),
    year = date.getUTCFullYear(),
    month = date.getUTCMonth(),
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getUTCMinutes()
  // 获取当前时间
  const currentDate = new Date(),
    currentYear = date.getUTCFullYear(),
    currentMonth = date.getUTCMonth(),
    currentDay = currentDate.getDate()
  // 计算是否是同一天
  if (currentYear == year && currentMonth == month && currentDay == day) { //同一天直接返回
    if (hour > 12) {
      return `下午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
      return `上午 ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
  }
  // 计算是否是昨天
  const yesterday = new Date(currentDate - 24 * 3600 * 1000)
  if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth() && day == yesterday.getDate()) { //昨天
    return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
  } else {
    return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
  }
}
function getDateDiff(dateStr) {
  var publishTime = parseInt(getDate(dateStr).getTime() / 1000),
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    d,
    timeNow = parseInt(new Date().getTime() / 1000)

  d = timeNow - publishTime
  d_days = parseInt(d / 86400)
  d_hours = parseInt(d / 3600)
  d_minutes = parseInt(d / 60)
  d_seconds = parseInt(d)

  if (d_days > 0 && d_days < 30) {
    return d_days + '天前'
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前'
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前'
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚'
    } else {
      return d_seconds + '秒前'
    }
  } else if (d_days >= 30 && d_days < 365) {
    return Math.floor(d_days / 30) + '个月前'
  } else if (d_days >= 365) {
    return Math.floor(d_days / 365) + '年前'
  }
}
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []
  // var date = new Date(number * 1000);//时间戳为10位
  var date = new Date(number) //时间戳为13位
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))
  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

function parseTime(time, cFormat) {
  if (!time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
/**
 * 秒数格式化为 分秒
 *
 * @param num 秒数
 * @return {string} 分秒
 */
function formatSeconds(value) {
  var secondTime = parseInt(value) // 秒
  var minuteTime = 0 // 分
  // let hourTime = 0 // 小时
  if (secondTime > 60) {
    minuteTime = parseInt(secondTime / 60)
    secondTime = parseInt(secondTime % 60)
    if (minuteTime > 60) {
      // hourTime = parseInt(minuteTime / 60)
      minuteTime = parseInt(minuteTime % 60)
    }
  }
  return zeroFill(minuteTime) + ':' + zeroFill(secondTime)
}
/**
 * 数字小于 10 补 0
 */
function zeroFill(num) {
  if (!isFinite(num)) {
    return ''
  }
  return num < 10 ? '0' + num : num
}
/**
 * 判断obj是否为一个整数
 */
function isInteger(obj) {
  return Math.floor(obj) === obj
}

module.exports = {
  getTime,
  getDate,
  calcTimeHeader,
  getDateDiff,
  formatTime,
  formatNumber,
  formatTimeTwo,
  parseTime,
  formatSeconds
}
