// pages/consult/index/index.js
const api = require('../../../config/api')
const util = require('../../../utils/util')
const app = getApp()

Page({

  /**
	 * 页面的初始数据
	 */
  data: {
    ...app.globalData.userInfo,
    type: 1,
    icon: api.ImgUrl + 'images/ic_consult.png',
    listQuery: {
      page: 1 // 页码
    },
    list: [],
    videoConsult: [],
    static: {
      nomes: api.ImgUrl + 'images/nomes.png'
    }

  },
  onMessageArrived() {
    this.setData({
      messageRecord: util.getChatData('messageRecord')
    })
    this.data.listQuery.page = 1
    this.data.type === 1 ? this.getConsultList(1) : this.getConsultVideoList(1)
  },
  tabClick(e) {
    var id = e.currentTarget.dataset.id
    this.data.listQuery.page = 1
    this.data.loadComplete = true
    this.data.list = []
    this.data.videoConsult = []
    this.setData({
      type: id
    }, () => {
      id === '1' ? this.getConsultList(1) : this.getConsultVideoList(1)
    })

  },
  getConsultList(type) {
    util.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    this.data.listQuery.patientId = app.globalData.userInfo.userId
    util.request(api.consultText, this.data.listQuery, 'GET')
      .then(res => {
        util.hideToast()
        if (res.data.code === 0) {
          const result = res.data.data
          result.result.forEach(element => {
            element.consultTime = util.calcTimeHeader(element.consultTimestamp)
          })
          console.log(result, 89)
          ++this.data.listQuery.page
          this.setData({
            list: type === 1 ? result.result : this.data.list.concat(result.result),
            listQuery: this.data.listQuery,
            loadComplete: !result.hasNext ? false : true
          })
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
  },
  getConsultVideoList(type) {
    util.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    this.data.listQuery.patientId = app.globalData.userInfo.userId
    util.request(api.consultVideo, this.data.listQuery, 'GET')
      .then(res => {
        util.hideToast()
        const result = res.data.data
        ++this.data.listQuery.page
        if (res.data.code === 0) {
          this.setData({
            videoConsult: type === 1 ? result.result : this.data.videoConsult.concat(result.result),
            listQuery: this.data.listQuery,
            loadComplete: !result.hasNext ? false : true
          })
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  async onLoad(options) {
  },
  onReachBottom: function() {
    if (this.data.loadComplete) {
      ++this.data.listQuery.page
      this.data.type === 1 ? this.getConsultList(2) : this.getConsultVideoList(2)
    }
  },
  getMsgDetail(e) {
    const id = e.currentTarget.dataset.id
    const messageRecord = util.getChatData('messageRecord') ? util.getChatData('messageRecord') : {}
    delete messageRecord[id]
    wx.setStorageSync('messageRecord', messageRecord)
    this.setData({
      messageRecord
    }, () => {
      wx.navigateTo({
        url: '/pages/consult/chat/chat?doctorId=' + id
      })
    })
    app.getMessageNum()
  },
  goMeeting(e) {
    const videoconsultstatus = e.currentTarget.dataset.videoconsultstatus
    const roomID = e.currentTarget.dataset.roomid
    const videoConsultId = e.currentTarget.dataset.videoconsultid
    if (videoConsultId != null) {
      switch (videoconsultstatus) {
        case 1:
          this.getAppIdAndKey(videoConsultId, roomID)
          break
        case 2:
          this.getAppIdAndKey(videoConsultId, roomID)
          break
        case 3:
          this.getAppIdAndKey(videoConsultId, roomID)
          break
        case 4:
          util.showToast({ title: '当前问诊已取消' })
          break
        case 5:
          util.showToast({ title: '当前问诊已完成' })
          break
        case 6:
          util.showToast({ title: '当前问诊未付款' })
          break
      }
    }
  },
  getAppIdAndKey(videoConsultId, roomID) {
    util.request(api.getAppIdAndKey, {
      videoConsultId: videoConsultId
    })
      .then(res => {
        util.hideToast()
        if (res.data.code === 0) {
          wx.navigateTo({
            url: `/pages/meeting/meeting?roomID=${roomID}&videoConsultId=${videoConsultId}`
          })
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    // })
  },

  /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function() {

  },

  /**
	 * 生命周期函数--监听页面显示
	 */
  async onShow() {
    var that = this
    var type = app.globalData.consultType * 1
    var doctorName = app.globalData.doctorName
    if (type === 2 && doctorName !== '') {
      wx.showModal({
        content: '您的视频申请已发送给' + doctorName + '医生，请您耐心等待医生接诊~',
        showCancel: false,
        confirmText: '知道了',
        success: (result) => {
          if (result.confirm) {
            that.setData({
              ['listQuery.page']: 1
            })
          }
        }
      })
    }
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      await util.loginByWeixin()
    }
    this.setData({
      type: type,
      list: [],
      videoConsult: [],
      ['listQuery.page']: 1
    }, () => {
      type === 1 ? this.getConsultList(1) : this.getConsultVideoList(1)
    })
    this.setData({
      messageRecord: util.getChatData('messageRecord')
    })
    app.getMessageNum()

  },

  /**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function() {
    app.globalData.consultType = 1
    app.globalData.doctorName = ''
    this.flag = false
    this.setData({
      type: 1
    })
  },

  /**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function() {

  },

  /**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function() {

  }

  /**
	 * 用户点击右上角分享
	 */
  // onShareAppMessage: function() {

  // }
})
