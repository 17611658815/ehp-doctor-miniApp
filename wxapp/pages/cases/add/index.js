// pages/cases/add/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		relation: 0,
		consultType: 1,
		inquirerId: '',
		patientId: '',
		casesInfo: '',
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
			treatmentOptions: '', //治疗意见
			imgList: ['https://img-pro.naiterui.com/chat/media/image/158/290/20220913/1663064060114.jpg?view=t'], //图片列表
		}, //病例对象
		diagnosisList: '', //诊断列表
		timestamp: '',
		menstrualColumns: {
			'status': ['未初潮', '已初潮', '已绝经'],
		},
		uniqueId: '',
		recordId: '',
		isSecret: null,
		globalConfig:null
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
			[`medicalRecord.${key}`]: e.detail.value
		})
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
		const {
			eSignConfigVO
		} = wx.getStorageSync('globalConfig')
		this.casesEdit = this.selectComponent('#casesEdit')
		this.caInput = this.selectComponent('#caInput')
		this.setData({
			inquirerId: options.inquirerId,
			patientId: options.patientId,
			relation: options.relation,
			consultType: options.consultType,
			timestamp: util.getTime(new Date()),
			'globalConfig.eSignConfigVO': eSignConfigVO,
		})
		this.initCases()
		this.initialize()
		this.getNoSecret()
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
		} else if (type === '8') {
			// 诊断
			wx.navigateTo({
				url: '/pages/cases/diagnose/index'
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
	async getNoSecret() {
		try {
			const userInfo = wx.getStorageSync('userInfo')
			const {
				data
			} = await util.request(`${api.getNoSecret}?token=${userInfo.token}&doctorId=${userInfo.doctorId}`)
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			this.setData({
				isSecret: data.data.noSecret
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	async initCases() {
		try {
			const {
				patientId,
				inquirerId
			} = this.data
			const {
				data
			} = await util.request(api.initCase, {
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
				casesInfo: data.data
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	async initialize() {
		try {
			const userInfo = wx.getStorageSync('userInfo')
			const {
				inquirerId
			} = this.data
			const {
				data
			} = await util.request(`${api.initialize}?inquirerId=${inquirerId}&doctorId=${userInfo.doctorId}&token=${userInfo.token}`)
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			this.setData({
				'medicalRecord.mainComplaint': data.data.offlineDiagnosis,
				'medicalRecord.presentDisease': data.data.offlineDiagnosis,
				'medicalRecord.pastHistory': data.data.pastHistory,
				'medicalRecord.allergy': data.data.allergy
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	async handleSave() {
		try {
		
			const {
				medicalRecord,
				inquirerId,
				patientId,
				casesInfo,
				consultType,
				relation,
				isSecret,
				globalConfig,
				diagnosisList
			} = this.data
			const params = {
				consultType,
				inquirerId,
				patientId,
				relation,
				hospitalName: casesInfo.hospital,
				// 年龄
				gender: casesInfo.gender,
				age: casesInfo.age,
				ageStr: casesInfo.ageStr,
				ageUnit: casesInfo.ageUnit,
				patientGender: casesInfo.gender,
				patientName: casesInfo.name,
				department: casesInfo.department,
				diagnosisList:diagnosisList,
				// 更多检测结果
				diastole: medicalRecord.diastole,
				heartRete: medicalRecord.heartRete,
				moreExamin: medicalRecord.moreExamine,
				systolic: medicalRecord.systolic,
				negativeSigns: medicalRecord.negativeSigns,
				positiveSigns: medicalRecord.positiveSigns,
				temperature: medicalRecord.temperature,
				weight: medicalRecord.weight,
				treatmentOptions: medicalRecord.treatmentOptions,
				// 主诉
				mainComplaint: medicalRecord.mainComplaint,
				// 家庭史
				pastFamily: medicalRecord.pastFamily,
				// 既往史
				pastHistory: medicalRecord.pastHistory,
				// 过敏史
				allergy: medicalRecord.allergy,
				// 现病史
				presentDisease: medicalRecord.presentDisease,
				imgList: medicalRecord.imgList,
				send: true,
				revisitFalg: '2',
				templateId: '1',
				templateType: '1'
			}
			if (casesInfo.gender === 0) {
				params = Object.assign(params, medicalRecord.menstrual)
			}
			const {
				data
			} = await util.request(api.saveDrCase, params, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			this.setData({
				uniqueId: data.data.uniqueId,
				recordId: data.data.recordId
			},()=>{
				// true 免密
				console.log(isSecret,282)
				if(isSecret){
					this.caseSign()
				} else {
					if (globalConfig.eSignConfigVO.seviceName === '2') {
						// E签宝
					} else {
						this.caInput.showPopup()
						// 四川CA
					}
				}
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	// 医生签名
	async caseSign() {
		try {
			const {
				uniqueId,
				recordId
			} = this.data
			const {
				data
			} = await util.request(api.caseSign, {
				recordId,
				uniqueId
			}, 'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			// 发送病例
			this.caseConfirm()
		} catch (error) {
			throw new Error(error)
		}
	},
	// 确认发送病例
	async caseConfirm() {
		try {
			const {
				consultType,
				recordId
			} = this.data
			util.showLoading({
				title:'loading'
			})
			const {
				data
			} = await util.request(api.caseConfirm, {
				consultType,
				recordId,
				send:1,
			}, 'post')
			util.hideLoading()
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			wx.navigateBack({
				delta: 1
			})
		} catch (error) {
			throw new Error(error)
		}
	},
	// 病历签名成功
	onCaseSigConfim(){
		this.caseConfirm()
		console.log('发送病历')
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