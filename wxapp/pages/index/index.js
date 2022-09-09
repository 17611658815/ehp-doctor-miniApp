// pages/index/index.js
var api = require('../../config/api.js')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
	 * 页面的初始数据
	 */
  data: {
    list: [],
    doctorInfo: {},
    logoHeight: null,
    statusBarHeight: null
  },

  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad(options) {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      logoHeight: app.globalData.navBarHeight - app.globalData.statusBarHeight
    })
    // this.getMyPatient()
    this.getBaseInfo()
    this.updetaMessage()
  },
  //消息到达更新，执行util中onMessageArrived方法，不可删除
  onMessageArrived() {
    this.updetaMessage()
  },
  updetaMessage() {
    const chatList = util.getChatList('chatList')
    this.setData({
      list: chatList
    })
  },
  // 置顶
  handleTop() {
    console.log('置顶')
  },
  // 免打扰
  handleMute() {
    console.log('免打扰')
  },
  // 删除
  handleDel(event) {
    const {
      index
    } = event.currentTarget.dataset
    const swipeCell = this.selectComponent(`#for-close-${index}`)
    if (swipeCell.offset) {
      this.data.list.splice(index, 1)
      this.setData({
        list: this.data.list
      })
      this.close(index)
    }
  },
  // 关闭
  handleTap(event) {
    const {
      index,
      patientid,
      sessionid
    } = event.currentTarget.dataset
    console.log(event.currentTarget.dataset, 68)
    const swipeCell = this.selectComponent(`#for-close-${index}`)
    if (swipeCell.offset) {
      this.close(index)
    } else {
      wx.navigateTo({
        url: `/pages/consult/chat/chat?patientid=${patientid}&sessionid=${sessionid}`
      })
    }
  },
  close(index) { // 删除数据
    console.log(index)
    const swipeCell = this.selectComponent(`#for-close-${index}`)
    if (swipeCell.offset) {
      swipeCell.close()
    }
  },
  // 医生基本信息
  async getBaseInfo() {
    try {
      const {
        data
      } = await util.request(api.getBaseInfo, {}, 'post')
      if (data.code !== 0) {
        util.showToast({
          title: data.msg,
          icon: 'none',
          duration: 3000
        })
      }
      const userInfo = wx.getStorageSync('userInfo')
      const newUserInfo = Object.assign(userInfo, data.data)
      console.log(newUserInfo, 100)
      util.setUserInfo(newUserInfo)
      this.setData({
        doctorInfo: data.data
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  // 我的患者列表
  async getMyPatient() {
    try {
      const {
        data
      } = await util.request(api.getMyPatient, {}, 'post')
      if (data.code !== 0) {
        util.showToast({
          title: data.msg,
          icon: 'none',
          duration: 3000
        })
      }
      console.log(data, 73)
      this.setData({
        list: data.data.result
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady() {

  },

  /**
	 * 生命周期函数--监听页面显示
	 */
  onShow() {

  },

  /**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide() {

  },

  /**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload() {

  },
  /**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh() {

  },

  /**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom() {

  },

  /**
	 * 用户点击右上角分享
	 */
  onShareAppMessage() {

  }
})
