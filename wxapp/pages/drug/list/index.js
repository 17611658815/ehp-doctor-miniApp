// pages/drug/list/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		currentTab: 0,
		tabLits: [{
			title: '全部药品',
			status: 0
		}, {
			title: '常用药品',
			status: 1
		}, {
			title: '常用处方',
			status: 2
		}, {
			title: '历史处方',
			status: 3
		}],
		list: [],
		statusBarHeight: 0,
		listQuery: {
			page: 1, // 页码
			num: 20
		},
		checkedList: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			statusBarHeight: app.globalData.statusBarHeight,
		}, () => {
			this.getList()
		})
	},
	handleSwitech(event) {
		const {
			index
		} = event.currentTarget.dataset
		this.setData({
			currentTab: index
		})
	},
	// 药品列表
	async getList() {
		try {
			const {
				listQuery,
			} = this.data
			const {
				data
			} = await util.request(api.productSearch, listQuery, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
			}
			let result = data.data.result
			let drugIdList = app.globalData.drugIdList
			for (let i = 0; i < result.length; i++) {
				for (let k = 0; k < drugIdList.length; k++) {
					if (result[i].skuId == drugIdList[k]) {
						result[i].checked = true
					}
				}
			}
			this.setData({
				list: result
			})
			
		} catch (error) {
			throw new Error(error)
		}
	},
	handledel(event) {
		const {
			item,
			index
		} = event.currentTarget.dataset
		const page = getCurrentPages()
		const prevPage = page[page.length - 2]
		const findindex = prevPage.data.drugList.findIndex(i => i.skuId === item.skuId)
		app.globalData.drugIdList.splice(findindex, 1)
		prevPage.data.drugList.splice(findindex, 1)
		prevPage.setData({
			drugList: prevPage.data.drugList
		})
		this.setData({
			[`list[${index}].checked`]: false
		})
	},
	handleAdd(e) {
		const {
			item
		} = e.currentTarget.dataset
		app.globalData.drugDetail = item
		wx.navigateTo({
			url: `/pages/drug/editor/index?type=add&skuId=${item.skuId}`
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