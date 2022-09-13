// pages/cases/menstrual/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		type: 'status',
		menstrual: {
			status: '', //月经情况
			firstAge: '', //初潮年龄
			cycle: '', //月经周期
			processDays: '', //行经天数
			dysmenorrhea: 1, //是否痛经
			part: '', //痛经描述
		},
		menstrualColumns: {
			'status': ['未初潮', '已初潮', '已绝经'],
			'firstAge': ['12', '13', '14'], //初潮年龄
			'cycle': ['10', '20', '30'], //月经周期
			'processDays': ['1', '2', '3', '4', '5', '6', '7'], //行经天数
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},
	switch (e) {
		const {
			show
		} = this.data
		const {
			key
		} = e.currentTarget.dataset
		this.setData({
			show: !show,
			type: key
		})
	},
	bindPickerCancel() {
		this.setData({
			show: false
		})
	},
	bindPickerConfim(e) {
		const {
			index,
			value
		} = e.detail
		const {
			type
		} = this.data
		this.setData({
			[`menstrual.${type}`]: type === 'status' ? index : value
		}, () => {
			this.bindPickerCancel()
		})
	},
	onRadioChange(e) {
		this.setData({
			'menstrual.dysmenorrhea': e.detail
		})
	},
	onAreaVal(e) {
		this.setData({
			'menstrual.part': e.detail.value
		})
	},
	handleSave() {
		const page = getCurrentPages()
		const prevPage = page[page.length - 2]
		const {
			menstrual
		} = this.data
		prevPage.setData({
			'medicalRecord.menstrual': menstrual
		}, () => {
			wx.navigateBack({
				delta: 1
			});
		})

		console.log(prevPage, '==============prevPage==============')
		console.log(this.data.menstrual, '===============sava=============')
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