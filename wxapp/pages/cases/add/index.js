// pages/cases/add/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		medicalRecord: {
			mainComplaint: '', //主诉
			presentDisease: '', //现病史
			pastHistory: '', //既往史
			allergy: '', //过敏史
			pastFamily: '', //家庭史
			menstrual: {
				status: '', //月经情况
				firstAge: '', //初潮年龄
				cycle: '', //月经周期
				processDays: '', //行经天数
				dysmenorrhea: 1, //是否痛经
				part: '', //痛经描述
			},
			treatmentOptions:'',//治疗意见
			imgList: [],
		}, //病例对象
		tagList: ['遵医嘱服药', '定期复查', '不适随访', '密切监测尿蛋白数值变化'],
		menstrualColumns: {
			'status': ['未初潮', '已初潮', '已绝经'],
		},
	},
	// 接受子组件图片数据
	onImgUpload(event) {
		this.setData({
		  ['medicalRecord.imgList']: event.detail.uploadImgList
		})
	},
	onAreaVal(e) {
		const {
			key
		} = e.currentTarget.dataset
		this.setData({
			[`medicalRecord.${key}`]:  e.detail.value
		})
	},
	onInputVal(e) {
		// const val = e.detail.value
		// const { key } = e.currentTarget.dataset
		// this.setData({
		//   [`info.${key}`]: util.filterEmoji(val)
		// })
	},
	onTagTap(e) {
		const {
			medicalRecord
		} = this.data
		const {
			value,
			key
		} = e.currentTarget.dataset
		this.setData({
			[`medicalRecord.${key}`]: medicalRecord[key] ? `${medicalRecord[key]}、${value}` : value
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.casesEdit = this.selectComponent('#casesEdit')
	},
	handleEdit(e) {
		const {
			type,
			key,
			title,
		} = e.currentTarget.dataset
		const {
			medicalRecord
		} = this.data
		if (type === '6') {
			// 月经
			wx.navigateTo({
				url: '/pages/cases/menstrual/index'
			})
		} else if (type === '7') {
			// 检查
			wx.navigateTo({
				url: '/pages/cases/examine/index'
			})
		} else {
			this.casesEdit.switch()
			this.casesEdit.setData({
				type,
				key,
				title,
				[`medicalRecord.${key}`]: medicalRecord[key]
			})
		}
	},
	onConfimVal(e) {
		const {
			key,
			value
		} = e.detail
		this.setData({
			[`medicalRecord.${key}`]: value
		})
		console.log(this.data.medicalRecord, '==========medicalRecord============')
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