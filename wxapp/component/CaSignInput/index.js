// component/CaSignInput/index.js
var api = require('../../config/api.js')
var util = require('../../utils/util')
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 签名类型 1病历 2处方
		signType: {
			type: Number,
			value: 1,
			observer: function (val) {}
		},
		// 认证标识
		uniqueId: {
			type: String,
			value: '',
			observer: function (val) {
				this.data.uniqueId = val
			}
		},
		// 病历id
		recordId: {
			type: String,
			value: '',
			observer: function (val) {
				this.data.recordId = val
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		show: false,
		password: '',
		uniqueId: '',
		recordId: ''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		showPopup() {
			this.setData({
				show: true
			});
		},
		bindCancel() {
			this.setData({
				show: false
			})
		},
		onInputVal(e) {
			this.setData({
				password: e.detail
			})
		},
		handleConfirm() {
			const {
				password,
				signType
			} = this.data
			if (!password) {
				util.showToast({
					title: '请输入签名密码'
				})
				return
			}
			if (signType === 1) {
				this.caseSign()
			} else {
				this.prescriptionSign()
			}
		},
		// 病历签名
		async caseSign() {
			try {
				const {
					uniqueId,
					recordId,
					password
				} = this.data
				const {
					data
				} = await util.request(api.caseSign, {
					recordId,
					uniqueId,
					pin: password
				}, 'post')
				if (data.code !== 0) {
					util.showToast({
						title: data.msg,
						icon: 'none',
						duration: 3000
					})
					return
				}
				this.triggerEvent('onCaseSigConfim')
			} catch (error) {
				throw new Error(error)
			}
		},
	},
	// 病历签名
	async prescriptionSign() {
		try {
			const {
				uniqueId,
				recordId,
				password
			} = this.data
			const {
				data
			} = await util.request(api.caseSign, {
				recordId,
				uniqueId,
				pin: password
			}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			this.triggerEvent('onCaseSigConfim')
		} catch (error) {
			throw new Error(error)
		}
	}
})