// pages/drug/editor/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		skuId: '',
		drug: {},
		columns: null,
		drugDetail: null,
		globalConfig: null,
		columnsType: '',
		typeKey:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const {
			medicineUnitList,
			usageMethodList,
			medicineDosageList
		} = wx.getStorageSync('globalConfig')
		const dosageList = medicineDosageList.map(item => item.dosageStr)
		this.setData({
			skuId: options.skuIds,
			drugDetail: app.globalData.drugDetail,
			'globalConfig.medicineUnitList': medicineUnitList,
			'globalConfig.usageMethodList': usageMethodList,
			'globalConfig.medicineDosageList': dosageList
		}, () => {
			this.getDefault()
		})
	},
	onStepperChange(e) {
		const {
			key
		} = e.currentTarget.dataset
		// const value = Number(e.detail) 
		this.setData({
			[`drug.${key}`]: e.detail
		})
	},
	onAreaVal(e) {
		const {
			key
		} = this.data
		this.setData({
			[`drug.${key}`]: e.detail.value
		})
	},
	handleSave() {
		try {
			const {
				drug
			} = this.data
			if (!drug.dosageStr) {
				util.showToast({
					'title': '请选择药品用量'
				})
				return
			}
			if (!drug.eachDosageCount) {
				util.showToast({
					'title': '单次剂量不能为空'
				})
				return
			}
			if (!drug.eachDoseUnit) {
				util.showToast({
					'title': '请选择单词计量单位'
				})
				return
			}
			if (!drug.drugCycle) {
				util.showToast({
					'title': '用药周期不能为空'
				})
				return
			}
			if (!drug.quantity) {
				util.showToast({
					'title': '药品数量不能为空'
				})
				return
			}
		} catch (error) {
			throw new Error(error)
		}
	},
	// 药品列表
	async getDefault() {
		try {
			const {
				skuId
			} = this.data
			const {
				data
			} = await util.request(api.getDefaultUsage, {
				skuIds: skuId
			}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
			}
			console.log(data.data, 107)
			data.data[0].eachDosageMin = data.data[0].eachDosageCount
			this.setData({
				drug: data.data[0]
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	bindPickerShow(e) {
		const {
			list,key
		} = e.currentTarget.dataset
		const {
			globalConfig
		} = this.data
		this.setData({
			columns:globalConfig[list],
			typeKey:key
		},()=>{
			this.setData({
				show: true,
			})
		})
		console.log(globalConfig,key,137)
		console.log(e,138)
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
			typeKey
		} = this.data
		this.setData({
			[`drug.${typeKey}`]:value
		}, () => {
			this.bindPickerCancel()
		})
		console.log(this.data.drug,160)
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