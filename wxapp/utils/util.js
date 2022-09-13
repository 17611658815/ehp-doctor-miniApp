// mqtt连接参数
const ConnectParamsKey = 'CONNECT_KEY'
const api = require('../config/api.js')
// 时间类工具
const date = require('./date')
// 计算类工具
const math = require('./math')
// 常用类工具
const tools = require('./tools')
// 正则校验类工具
const check = require('./check')
// 用户常用方法
const user = require('./user')
// 公共异步方法
const common = require('./common')
// 获取系统信息
const sysInfo = wx.getSystemInfoSync()
// 主题颜色
const THEMECOLOR = '#2893FF'
const headerParams = {
  '_m': sysInfo.model,
  '_o': 1,
  '_w': 1,
  '_p': 1,
  '_v': '1.2.8'
}
// 消息分组常量（两分钟为一个分组）
const LIMIT_GROUP_TIME = 120000

var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null //log日志文件向微信后台发送
const logInfo = {
  debug() {
    if (!log) return
    log.debug.apply(log, arguments)
  },
  info() {
    if (!log) return
    log.info.apply(log, arguments)
  },
  warn() {
    if (!log) return
    log.warn.apply(log, arguments)
  },
  error() {
    if (!log) return
    log.error.apply(log, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  }
}
/**
 * 封封微信的的request
 */
function request(url, data = {}, method = 'GET', headers = 'form', needLogin = true) {
  return new Promise((resolve, reject) => {
    const parmas = {}
    Object.keys(data).forEach(key => {
      if (data[key] !== void 0 && data[key] !== null) {
        parmas[key] = data[key]
      }
    })
    const userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo && userInfo.token) {
      parmas.token = userInfo.token
      parmas.doctorId = userInfo.doctorId
    }
    _request(url, parmas, method, headers, resolve, reject)
  })
}

function _request(url, data, method, headers, resolve, reject) {
  let ContentType = ''
  if (headers === 'form') {
    ContentType = 'application/x-www-form-urlencoded;charset=utf-8'
  } else {
    ContentType = 'application/json'
  }
  const header = {
    'Content-Type': ContentType
  }
  wx.request({
    url: url,
    data: data,
    method: method,
    header: Object.assign(header, headerParams),
    success: response => {
      // 因token异常返回参数为重复字符串无法判断去登陆 只能通过判断返回参数为字符串
      if (typeof response.data === 'string') {
        wx.reLaunch({
          url: '/pages/auth/login/login'
        })
      }
      resolve(response)
    },
    fail: function(err) {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none'
      })
      reject(err)
    }
  })
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function showToast(obj) {
  var data = {}
  data.title = obj.title
  data.icon = obj.icon || 'none'
  if (obj.duration) {
    data.duration = obj.duration
  }
  if (obj.image) {
    data.image = obj.image
  }
  data.mask = obj.mask || false
  if (obj.success) {
    data.success = obj.success
  }
  if (obj.fail) {
    data.fail = obj.fail
  }
  if (obj.complete) {
    data.complete = obj.complete
  }
  wx.showToast(data)
}

function makePhoneCall(phoneNumber) {
  const info = wx.getSystemInfoSync()
  if (info.platform === 'android') {
    // android 需要执行的代码
    wx.showActionSheet({
      itemList: [phoneNumber],
      success(res) {
        wx.makePhoneCall({
          phoneNumber: phoneNumber
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  } else {
    // ios 需要执行的代码
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  }
}
//mqtt消息到达更新
function onMessageArrived() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const page = pages[pages.length - 1]
    if ('onMessageArrived' in page) {
      page.onMessageArrived.apply(page, arguments)
    }
  }
}
// 设置用户聊天数据
function setChatData(key, data) {
  var cdata = getChatData(key)
  if (cdata) {
    const sendTime = cdata[cdata.length - 1].messages[cdata[cdata.length - 1].messages.length - 1].sendTime
    if (data.sendTime - sendTime <= LIMIT_GROUP_TIME) {
      cdata[cdata.length - 1].messages.unshift(data)
      cdata[cdata.length - 1].sendTime = data.sendTime
    } else {
      cdata.push({
        messages: [data],
        timeGroup: data.sendTime,
        sendTime: data.sendTime
      })
    }
  } else {
    cdata = [{
      messages: [data],
      timeGroup: data.sendTime,
      sendTime: data.sendTime
    }]
  }

  if (cdata) {
    //设置缓存数据条数限制
    if (cdata.length >= 100) {
      cdata.shift()
    }
    // wx.getStorageSync(key,[...cdata, data]);
  }
  wx.setStorageSync(key, cdata)

}
// 历史消息分组
function setMessageGroup(time, data) {
  const messarArr = []
  for (var i = 0; i < data.length; i++) {
    if (messarArr.length) {
      if (data[i].sendTime - time <= 2 * 60 * 1000) {
        messarArr[messarArr.length - 1].messages.push(data[i])
      } else {
        messarArr.push({
          messages: [data[i]],
          timeGroup: data[i].sendTime
        })
      }
    } else {
      messarArr.push({
        messages: [data[i]],
        timeGroup: data[i].sendTime
      })
    }
  }
  return messarArr
}
// 首页聊天列表
function setChatList(key, data) {
  var cdata = getChatList('chatList')
  cdata[`${key}`] = data
  wx.setStorageSync('chatList', cdata)
}

// 获取用户聊天数据
function getChatData(key) {
  const data = wx.getStorageSync(key)
  return data || ''
}
// 获取用户聊天列表
function getChatList(key) {
  const data = wx.getStorageSync(key)
  return data || {}
}
/**
 *
 * @returns android ios
 */
function getPlatform() {
  const info = wx.getSystemInfoSync()
  return info.platform
}

function getConnectParams(app) {
  if (!app.globalData.connectParams) {
    app.globalData.connectParams = wx.getStorageSync(ConnectParamsKey)
  }
  return app.globalData.connectParams
}

function setConnectParams(app, params) {
  app.globalData.connectParams = params
  app.globalData.connectParams.clientId = 'c_pt_' + app.globalData.userInfo.doctorId
  app.globalData.connectParams.msgTopicName = app.globalData.connectParams.msgTopicName
  wx.setStorageSync(ConnectParamsKey, app.globalData.connectParams)
}
function setGlobalConfig(app, params) {
  app.globalData.globalConfig = params
  wx.setStorageSync('globalConfig', params)
}

function showModal(object) {
  object.confirmColor = THEMECOLOR
  wx.showModal(object)
}

function showLoading(obj) {
  obj.title = obj.title ? obj.title : '加载中'
  obj.mask = true
  wx.showLoading(obj)
}

function hideLoading() {
  wx.hideLoading()
}

function hideToast() {
  wx.hideToast()
}

module.exports = {
  showErrorToast,
  showToast,
  makePhoneCall,
  onMessageArrived,
  setChatData,
  setChatList,
  getChatData,
  getChatList,
  headerParams,
  getPlatform,
  getConnectParams,
  setConnectParams,
	setGlobalConfig,
  showModal,
  showLoading,
  hideLoading,
  THEMECOLOR,
  logInfo,
  hideToast,
  _request,
  request,
  setMessageGroup,
  ...date,
  ...math,
  ...check,
  ...tools,
  ...user,
  ...common
}
