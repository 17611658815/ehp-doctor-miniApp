Page({

  /**
	 * 页面的初始数据
	 */
  data: {
    miao: 2
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function(options) {
    // wx.hideTabBar()
    this.time = setInterval(() => {
      this.setData({
        miao: this.data.miao - 1
      })
      if (this.data.miao === 0) {
        clearInterval(this.time)
        console.log()
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo.token) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          wx.reLaunch({
            url: '/pages/auth/login/login'
          })
        }
      }
    }, 1000)
  },

  /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function() {

  },

  /**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function() {

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

  },

  /**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function() {

  },

  /**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function() {

  }
})
