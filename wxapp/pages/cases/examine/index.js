// pages/cases/examine/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		unit: '', //单位
		type: 'status',
		title: '', //标题
		examine: {
			temperature: 37, //体温
			weight: 60,//体重
			heartRete: 80,//心率
			systolic: 120,//收缩压
			diastole: 80,//舒张压
			positiveSigns:'',//阳性体征
			negativeSigns:'',//必要阳性体征
			moreExamine:'',//更多检测结果
		},
		maxVal: {
			temperature: {
				max: 45,
				min: 30,
			}
		}
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
			key,
			unit,
			title
		} = e.currentTarget.dataset
		this.setData({
			show: !show,
			type: key,
			title,
			unit
		})
	},
	bindPickerCancel() {
		this.setData({
			show: false
		})
	},
	bindPickerConfim(e) {
		this.bindPickerCancel()
	},
	onStepperChange(e) {
		const {
			key
		} = e.currentTarget.dataset
		const value = e.detail
		this.setData({
			[`examine.${key}`]: Number(value) 
		})
	},
	onAreaVal(e) {
		const {
			key
		} = e.currentTarget.dataset
		this.setData({
			[`examine.${key}`]:  e.detail.value
		})
	},
	handleSave(){
		const page = getCurrentPages()
		const prevPage = page[page.length - 2]
		const {
			examine
		} = this.data
		const medicalRecord = Object.assign(prevPage.data.medicalRecord, examine) 
		prevPage.setData({
			medicalRecord
		}, () => {
			wx.navigateBack({
				delta: 1
			});
		})
		console.log(this.data.examine ,'===============examine==============')
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