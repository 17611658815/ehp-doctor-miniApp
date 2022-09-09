const api = require('../config/api.js')
module.exports = {
  // 获取用户个人信息
  async getBaseInfo() {
    const util = require('./util.js')
    const patientId = wx.getStorageSync('userInfo').userId
    try {
      const {
        data
      } = await util.request(api.getBaseInfo, {
        patientId: patientId
      }, 'POST', 2)
      if (data.code === 0) {
        return data.data
      } else {
        wx.showToast({
          title: data.msg
        })
      }
    } catch (error) {
      throw new Error(error.errMsg)
    }
  },
  // 获取订阅消息模板
  async getTemplate(type) {
    const app = getApp()
    const util = require('./util.js')
    var arry = []
    try {
      const {
        data
      } = await util.request(api.templates + '?type=' + type)
      if (data.code === 0) {
        for (let i = 0; i < data.data.length; i++) {
          arry.push(data.data[i].templateId)
        }
        if (type === 1) {
          app.globalData.templateId = arry
        }
      }
      return arry
    } catch (error) {
      return arry
    }
  },
  // 获取就诊人列表
  async getPeopleList() {
    const util = require('./util.js')
    try {
      const {
        data
      } = await util.request(api.peopleList, {}, 'post')
      if (data.code === 0) {
        return data.data
      } else {
        wx.showToast({
          title: data.msg
        })
      }
    } catch (error) {
      throw new Error(error.errMsg)
    }
  },
  // 图文问诊进入处方/病例/病情/评价页面无新消息 返回聊天页 数据不做刷新
  verifyPageMessageUpdate() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    console.log('prevPage.data.newMessage =', prevPage.data.newMessage, prevPage, prevPage.route === 'pages/consult/chat/chat', '===========68===========')
    if (prevPage.route === 'pages/consult/chat/chat') {
      prevPage.setData({
        preview: !prevPage.data.newMessage
      })
    }
  }
}
