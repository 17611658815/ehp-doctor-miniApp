// pages/prescription/add/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		drugList: [],
		timestamp: '',
		prescription: null,
		patientId: '',
		inquirerId: '',
		diagnosisList: null,
		totalPrices: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			patientId: options.patientId,
			inquirerId: options.inquirerId,
			totalPrices: this.onDrugPrice()
		}, () => {
			this.init()
		})
	},
	// 编辑用量
	handleEdit(e) {
		const {
			item
		} = e.currentTarget.dataset
		console.log(e)
		app.globalData.drugDetail = item
		console.log(item, 36)
		wx.navigateTo({
			url: `/pages/drug/editor/index?type=edit&skuId=${item.skuId}`
		})
	},
	// 删除药品
	handleDel(e) {
		wx.showModal({
			title: '提示',
			content: '确认删除该药品？',
			success(res) {
				if (res.confirm) {

				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	async init() {
		try {
			const {
				patientId,
				inquirerId
			} = this.data
			const {
				data
			} = await util.request(api.prescriptionInit, {
				patientId,
				inquirerId
			}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			this.setData({
				prescription: data.data,
				timestamp: data.timestamp
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	onDrugPrice() {
		let sum = 0
		const {
			drugList
		} = this.data
		drugList.forEach(item => {
			sum += item.salePrice / 1 * item.quantity
		});
		return this.toFixedThree(sum)
	},
	toFixedThree(num) {
		return (Math.round(num * 1000) / 1000).toFixed(2)
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
		this.setData({
			totalPrices: this.onDrugPrice()
		})
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