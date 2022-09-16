const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		recoreId: null,
		result: {},
		ic_prescription_seal: api.ImgUrl + 'logo/ic_seal.png',
		navTitle: '病历详情',
		isBack: true,
		backgroundColor: '#fff',
		menstrualStatus: ['未初潮', '已初潮', '已绝经'],
		settings: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			recoreId: options.id
		}, () => {
			this.getDetail()
		})
	},
	// 常用诊断
	async getDetail() {
		try {
			const {
				data
			} = await util.request(api.caseDetail, {
				recoreId: this.data.recoreId
			}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			console.log(data, 46)
			this.setData({
				result: data.data.drCaseVO,
				signInfo:data.data.signInfo,
		    settings: data.data.drCaseVO.medicalRecordSettingList,
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	previewImg: function (e) {
		var index = e.currentTarget.dataset.index
		var imgArr = this.data.result.doctorMedicalRecord.imgList
		var imgList = []
		imgArr.forEach(element => {
			imgList.push(element.imgUrl)
		})
		wx.previewImage({
			current: imgList[index], //当前图片地址
			urls: imgList, //所有要预览的图片的地址集合 数组形式
			success: function (res) {},
			fail: function (res) {},
			complete: function (res) {}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	touchMove() {
		util.verifyPageMessageUpdate()
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	}

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function() {

	// }
})