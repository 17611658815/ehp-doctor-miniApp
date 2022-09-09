// pages/illnessDetail/illnessDetail.js
const api = require('../../config/api')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    navTitle: '病情详情',
    backgroundColor: util.THEMECOLOR
  },
  // 图片预览
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index
    var imgArr = this.data.info.offlineDiagnosisImgs
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  illnessDetail(id) {
    util.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    util.request(api.illnessDetail, {
      'diseaseId': id
    }, 'post')
      .then(res => {
        util.hideToast()
        const result = res.data.data
        if (res.data.code == 0) {
          this.setData({
            info: result
          })
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.illnessDetail(options.diseaseId)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  touchMove() {
    util.verifyPageMessageUpdate()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
