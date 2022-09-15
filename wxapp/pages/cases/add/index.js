// pages/cases/add/index.js
const api = require('../../../config/api.js')
const util = require('../../../utils/util')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		relation:0,
		consultType:1,
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
			diagnosisList: '', //诊断列表
		}, //病例对象
		timestamp: '',
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
		console.log(options, 63)
		this.casesEdit = this.selectComponent('#casesEdit')
		this.setData({
			inquirerId: options.inquirerId,
			patientId: options.patientId,
			relation: options.relation,
			timestamp: util.getTime(new Date()),
			consultType:options.consultType
		})
		this.initCases()
		this.initialize()
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
			console.log(data, 73)
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
			console.log(data, 158)
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
				relation
			} = this.data
			const params = {
				consultType,
				inquirerId,
				patientId,
				relation,
				// 年龄
				age: casesInfo.age,
				ageStr: casesInfo.ageStr,
				ageUnit: casesInfo.ageUnit,
				patientGender:casesInfo.gender,
				patientName:casesInfo.name,
				// 月经史
				cycle:medicalRecord.menstrual.cycle,
				dysmenorrhea:medicalRecord.menstrual.dysmenorrhea,
				firstAge:medicalRecord.menstrual.firstAge,
				part:medicalRecord.menstrual.part,
				processDays:medicalRecord.menstrual.processDays,
				status:medicalRecord.menstrual.status,
				diagnosisList:medicalRecord.diagnosisList,
				// 更多检测结果
				diastole:medicalRecord.diastole,
				heartRete:medicalRecord.heartRete,
				moreExamine:medicalRecord.moreExamine,
				systolic:medicalRecord.systolic,
				negativeSigns:medicalRecord.negativeSigns,
				positiveSigns:medicalRecord.positiveSigns,
				temperature:medicalRecord.temperature,
				weight:medicalRecord.weight,
				treatmentOptions:medicalRecord.treatmentOptions,
				// 主诉
				mainComplaint:medicalRecord.mainComplaint,
				// 家庭史
				pastFamily:medicalRecord.pastFamily,
				// 既往史
				pastHistory:medicalRecord.pastHistory,
				// 过敏史
				allergy:medicalRecord.allergy,
				// 现病史
				presentDisease:medicalRecord.presentDisease,
				imgList:medicalRecord.imgList,
			}
			const {
				data
			} = await util.request(api.saveDrCase,params,'post')
			if (data.code !== 0) {
				util.showToast({
					title: data.msg,
					icon: 'none',
					duration: 3000
				})
				return
			}
			console.log(data, 244)
		} catch (error) {
			throw new Error(error)
		}
		console.log(params)
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