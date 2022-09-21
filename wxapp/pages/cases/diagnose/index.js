const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
		newList: [],
		searchVal: '',
		indexList: [],
		checkedList: [],
		searchData:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getDiagnosisNewList()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},
	onInputVal(e) {
		this.setData({
			searchVal: e.detail
		}, () => {
			this.getSearchDiagnosisList({
				num: 20,
				keyword: e.detail
			})
		})
	},
	// 常用诊断
	async getDiagnosisNewList() {
		try {
			const {
				data
			} = await util.request(api.diagnosisNewList, {}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			const {
				indexList
			} = this.data
			data.data.list.forEach(element => {
				indexList.push(element.key)
			});
			this.setData({
				newList: data.data.list,
				indexList
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	// 搜索诊断
	async getSearchDiagnosisList(params) {
		try {
			const {
				data
			} = await util.request(api.diagnosisSearch, params, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			let searchData = data.data.result.map(function(res){
				return { key: params.keyword,name:res.name}
			})
			this.setData({
				list: data.data.result,
				searchData
			})
			console.log(data, 'search')
		} catch (error) {
			throw new Error(error)
		}
	},
	handleTag(e) {
		const {
			checkedList
		} = this.data
		const {
			name
		} = e.currentTarget.dataset
		checkedList.push(name)
		this.setData({
			list:[],
			checkedList,
		})
	},
	handleClose(e) {
		const {
			checkedList
		} = this.data
		const {
			index
		} = e.currentTarget.dataset
		checkedList.splice(index, 1)
		this.setData({
			checkedList
		})
	},
	handleSave(){
		const page = getCurrentPages()
		const prevPage = page[page.length - 2]
		const {
			checkedList
		} = this.data
		prevPage.setData({
			'diagnosisList': checkedList
		}, () => {
			wx.navigateBack({
				delta: 1
			});
		})
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