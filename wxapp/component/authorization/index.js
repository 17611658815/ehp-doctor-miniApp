// var api = require('../../config/api.js')
var api = require('../../config/api.js')
var util = require('../../utils/util')
const app = getApp()
Component({
  /**
	 * 组件的属性列表
	 */
  properties: {

  },

  /**
	 * 组件的初始数据
	 */
  data: {
    authShow: false,
    clickFlag: true,
    doctorName: '',
    doctorId: '',
    type: '',
    isSwatchOff: false
  },
  attached() {
    this.histoast = this.selectComponent('#histoast') //his就诊记录弹窗
  },
  /**
	 * 组件的方法列表
	 */
  methods: {
    seeDoctor(e) {
      console.log(e)
      const doctorName = e.currentTarget.dataset.name
      const doctorId = e.currentTarget.dataset.id
      const type = e.currentTarget.dataset.type * 1
      if (!this.data.clickFlag) {
        return false
      }
      this.setData({
        clickFlag: false,
        type: type,
        doctorName,
        doctorId
      })
      app.globalData.doctorName = doctorName
      console.log(type, doctorId, doctorName, '参数')
      this.requestSubscribeMessage(type, doctorId)

    },
    async SeeFun(type, doctorId) {
      type == 1 ? await this.ImgChat(doctorId) : await this.VideoChat(doctorId)
      setTimeout(() => {
        this.setData({
          clickFlag: true,
          authShow: false
        })
      }, 300)
    },
    ImgChat(doctorId) {
      util.request(api.chat, {
        'doctorId': doctorId
      }, 'post', 2)
        .then(res => {
          console.log(res, 63)
          if (res.data.code === 0) {
            if (res.data.data === 0) {
              // 有会话
              wx.navigateTo({
                url: '/pages/consult/chat/chat?doctorId=' + doctorId
              })
            } else {
              wx.navigateTo({
                url: '/pages/diseaseDetail/diseaseDetail?source=1&doctorId=' + doctorId + '&type=1'
              })
            }
          } else {
            util.showToast({
              title: res.data.msg
            })
          }
        })
        .catch(res => {
          console.log(res)
        })
    },

    VideoChat(doctorId) {
      util.request(api.chatvideo, {
        'doctorId': doctorId
      }, 'post', 2)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data === 0) {
              // 有会话
              wx.navigateTo({
                url: '/pages/consult/record/index?doctorId=' + doctorId + '&type=2'
              })
            } else {
              wx.navigateTo({
                // url: '/pages/videoDiseaseDetail/videoDiseaseDetail?source=1&doctorId=' + doctorId + '&type=2'
                url: '/pages/diseaseDetail/diseaseDetail?source=1&doctorId=' + doctorId + '&type=2'
              })
            }
          } else {
            util.showToast({
              title: res.data.msg
            })
          }
        })
        .catch(res => {
          console.log(res)
        })
    },

    requestSubscribeMessage(type, doctorId) {
      if (app.globalData.templateId.includes(null)) {
        this.SeeFun(type, doctorId)
        return false
      }
      if (app.globalData.templateId.length) {
        // 推送模板
        wx.requestSubscribeMessage({
          tmplIds: app.globalData.templateId,
          success: (res) => {
            if (res[app.globalData.templateId[0]] === 'reject') {
              this.setData({
                authShow: true,
                clickFlag: true
              })
            } else {
              this.SeeFun(type, doctorId)
            }
          },
          fail: (res) => {
            console.log(res, `fail`)
            if (res.errMsg === 'requestSubscribeMessage:fail cancel') {
              this.setData({
                authShow: true,
                clickFlag: true
              })
            }
            if (res.errCode && res.errCode === 20004) {
              this.setData({
                authShow: true,
                clickFlag: true,
                isSwatchOff: true
              })
            }
            // this.SeeFun(type, doctorId)
          }
        })
      } else {
        this.SeeFun(type, doctorId)
      }

    },
    authSub() {
      this.triggerEvent('authSub')
    },
    noAuthSub() {
      this.SeeFun(this.data.type, this.data.doctorId)
    },
    close() {
      this.triggerEvent('close')
    }
  }
})
