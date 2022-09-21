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
		typeKey: '',
		editType: '',
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
			skuId: options.skuId,
			editType: options.type,
			drugDetail: app.globalData.drugDetail,
			'globalConfig.medicineUnitList': medicineUnitList,
			'globalConfig.usageMethodList': usageMethodList,
			'globalConfig.medicineDosageList': dosageList
		}, () => {
			if (options.type == 'add') {
				this.getDefault()
			} else {
				console.log(app.globalData.drugDetail, 43)
				app.globalData.drugDetail.drugCycle = app.globalData.drugDetail.drugCycle ? app.globalData.drugDetail.drugCycle : 1
				this.setData({
					drug: app.globalData.drugDetail
				})
			}
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
				drug,
				editType
			} = this.data
			console.log(drug, drug.drugCycle, 74)
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
			app.globalData.drugDetail.usage = `${drug.dosageStr}, 每次${drug.eachDosageCount}${drug.eachDoseUnit}`
			const page = getCurrentPages()
			let prevPage = editType == 'add' ? page[page.length - 3] : page[page.length - 2]
			let index = prevPage.data.drugList.findIndex(item => item.skuId === drug.skuId)
			if(index!=-1){
				prevPage.data.drugList[index] = drug
			}else{
				app.globalData.drugIdList.push(drug.skuId)
				prevPage.data.drugList.push(drug)
			}
			prevPage.setData({
				drugList:	prevPage.data.drugList
			},()=>{
				wx.navigateBack({
					delta: editType == 'add' ?  2 : 1
				});
			})
			console.log(prevPage.data.drugList,117)
			
			
		} catch (error) {
			throw new Error(error)
		}
	},
	// 默认用法用量
	async getDefault() {
		try {
			const {
				skuId,
				drugDetail
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
			data.data[0].drugCycle = data.data[0].drugCycle ? data.data[0].drugCycle : 1
			const detail = Object.assign(drugDetail, data.data[0])
			this.setData({
				drug: detail
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	bindPickerShow(e) {
		const {
			list,
			key
		} = e.currentTarget.dataset
		const {
			globalConfig
		} = this.data
		this.setData({
			columns: globalConfig[list],
			typeKey: key
		}, () => {
			this.setData({
				show: true,
			})
		})
		console.log(globalConfig, key, 137)
		console.log(e, 138)
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
			[`drug.${typeKey}`]: value
		}, () => {
			this.bindPickerCancel()
		})
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