var api = require('../../../config/api.js')
var util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [{
			name:'李嘉豪',
			patientid:290,
			content:'你好大夫',
			sessionid:'158_290_1662606790462',
			photo:'https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep3AjedYcXJbxpRvR070h5icX4DAqJJKhzxVrQiaJlQic8xfHia6YPRukgOwCpVoubicsMyhpibDC18sN5g/132'
		}],
		indexList:['A','B','C','#'],
		logoHeight: '',
		statusBarHeight: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			statusBarHeight: app.globalData.statusBarHeight,
			logoHeight: app.globalData.navBarHeight - app.globalData.statusBarHeight
		})
	},
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