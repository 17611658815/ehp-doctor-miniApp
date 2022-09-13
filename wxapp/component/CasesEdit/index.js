// component/CasesEdi/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		key: '', //字段名称
		title: '', //窗口标题
		type: null, //字段类型
		show: false, //窗口开关
		medicalRecord: {}, //病例对象
		globalConfig: null
	},
	attached: function () {
		// const {
		// 	pastList
		// } = wx.getStorageSync('globalConfig')
		// console.log(pastList,24)
		// this.setData({
		// 	'globalConfig.pastList':pastList
		// })
	},
	ready() {
		const {
			pastList,
			historyFamilyList
		} = wx.getStorageSync('globalConfig')
		console.log(pastList, 24)
		this.setData({
			'globalConfig.pastList': pastList,
			'globalConfig.historyFamilyList': historyFamilyList
		})
		console.log(this.data.globalConfig)
	},
	detached: function () {},
	/**
	 * 组件的方法列表
	 */
	methods: {
		switch () {
			wx.hideKeyboard()
			this.setData({
				show: !this.data.show
			})
		},
		onAreaVal(e) {
			const {
				key
			} = this.data
			console.log(e, 32)
			this.setData({
				[`medicalRecord.${key}`]: e.detail.value
			})
		},
		// 快捷选项
		onTagTap(e) {
			const {
				medicalRecord,
				key
			} = this.data
			const {
				value
			} = e.currentTarget.dataset
			if(value === '无' || medicalRecord[key]==='无'){
				medicalRecord[key] = ''
			}
			this.setData({
				[`medicalRecord.${key}`]: medicalRecord[key] ? `${medicalRecord[key]}、${value}` : value
			})
		},
		// 清空
		handleClearValue() {
			const {
				key
			} = this.data
			this.setData({
				[`medicalRecord.${key}`]: ''
			})
		},
		// 保存
		handleConfirm() {
			const {
				medicalRecord,
				key
			} = this.data
			this.triggerEvent('onConfim', {
				value: medicalRecord[key],
				key: key
			})
			this.switch()
		}
	}
})