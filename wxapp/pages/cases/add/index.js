// pages/cases/add/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: ['遵医嘱服药', '定期复查', '不适随访', '密切监测尿蛋白数值变化'],
    imgList: []
  },
  // 接受子组件图片数据
  onImgUpload(event) {
    // this.setData({
    //   ['info.offlineDiagnosisImgs']: event.detail.srcArr
    // })
  },
  onAreaVal() {

  },
  onInputVal(e) {
    // const val = e.detail.value
    // const { key } = e.currentTarget.dataset
    // this.setData({
    //   [`info.${key}`]: util.filterEmoji(val)
    // })
  },
  onTagTap(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
