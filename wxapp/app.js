var util = require('./utils/util.js')
var api = require('./config/api.js')
var Paho = require('./lib/mqtt/paho-mqtt-wx')
var Config = require('./config/index.js')
// 人脸核身
import {
	initEid
} from './mp_ecard_sdk/main'

App({
	onLaunch: function (options) {
		console.log(wx.getMenuButtonBoundingClientRect(), 7)
		wx.setNavigationBarTitle({
			title: Config.company
		})
		wx.getSystemInfo({
			success: (res) => {
				this.globalData.windowWidth = res.windowWidth
				this.globalData.statusBarHeight = res.statusBarHeight
				this.globalData.navBarHeight = 44 + res.statusBarHeight
			}
		})
		this.globalData.capsule = wx.getMenuButtonBoundingClientRect() //获取胶囊宽高及位置
		console.log('app.js', options)
		const updateManager = wx.getUpdateManager()
		wx.getUpdateManager().onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
		/*  wx.loadFontFace({
		  global: true,
		  family: 'DIN-Regular',
		  source: 'url("https://resources.metamedical.cn/yuanhejia/wx-mini/font/DIN-Regular-2.otf")',
		  success(e) {
		    console.log('字体加载成功', e)
		  },
		  fail(e) {
		    console.log('字体加载失败', e)
		  },
		  complete(e) {
		    console.log('字体加载', e)
		  }
		}) */
		// this.getMessageNum()
		initEid()
	},
	// 计算未读消息
	getMessageNum() {
		var pages = getCurrentPages()
		if (['pages/index/index', 'pages/consult/index/index', 'pages/user/user'].includes(pages[pages.length - 1].route)) {
			const messageRecord = util.getChatData('messageRecord') ? util.getChatData('messageRecord') : {}
			var num = 0
			for (var key in messageRecord) {
				num += messageRecord[key]
			}
			this.getCornerMark(num)
		}

	},
	// 角标设置
	getCornerMark(num) {
		const cartNum = num //默认数据
		if (cartNum != 0) {
			//设置角标
			wx.setTabBarBadge({
				index: 1,
				text: cartNum.toString()
			})
		} else {
			//移除角标
			wx.removeTabBarBadge({
				index: 1
			})
		}
	},
	/**
	 * 获取mqtt连接参数
	 */
	getConnectParams(callback) {
		console.log('调用链接参数api')
		const {
			doctorId,
			token
		} = this.globalData.userInfo
		util.request(`${api.getConnectParams}?userId=${doctorId}&token=${token}`, {}, 'get').then(d => {
			const cdata = d.data
			if (cdata.code == 0) {
				console.log(cdata, 91)
				// console.log('请求连接参数数据成功', d, params)
				util.setConnectParams(this, cdata.data)
				// console.log(this.globalData.connectParams, 60)
				// callback && callback();
				this.connectMqtt()
			} else {
				console.log('获取连接参数数据失败', cdata.code)
			}
		})
	},
	/**
	 * 获取全局配置
	 */
	getGlobalConfig() {
		util.request(`${api.globalConfig}`, {}, 'post').then(res => {
			console.log('获取全局配置', res)
			if (res.data.code == 0) {
				const {
					data
				} = res.data
				util.setGlobalConfig(this, data)
			}
		})
	},
	/**
	 * 连接 mqtt
	 */
	connectMqtt() {
		// let t = '异常断线';
		var t = {}
		t.i = this.globalData.connectParams.msgTopicName
		t.c = 0
		t.t = 3
		// console.log(t, 98)
		const message = new Paho.Message(JSON.stringify(t))
		message.destinationName = this.globalData.connectParams.willTopicName // willTopicName
		this.connectOptions = {}
		// connectParams.timeout = this.globalData.connectParams.connectionTimeout; 默认30s
		this.connectOptions.userName = api.mqttuser //连接mqtt用户名
		this.connectOptions.password = api.mqttpass //连接mqtt密码
		this.connectOptions.willMessage = message //遗嘱消息
		this.connectOptions.keepAliveInterval = 10 //this.globalData.connectParams.keepAliveInterval; //心跳保持时间
		this.connectOptions.cleanSession = this.globalData.connectParams.cleanSession //断开连接时是否要清除session
		this.connectOptions.reconnect = false //设置如果连接丢失，客户端是否自动尝试重新连接到服务器
		this.connectOptions.onSuccess = this.onConnect //连接成功回调
		this.connectOptions.onFailure = this.failConnect //连接失败回调

		// this.client = new Paho.Client(Util.getConfig.mqttUrl, "wx_client");
		// this.client = new Paho.Client('ws://' + this.globalData.connectParams.host + ':8083/mqtt', this.globalData.connectParams.clientId)
		this.client = new Paho.Client('wss://' + this.globalData.connectParams.dnHost + '/mqtt', this.globalData.connectParams.clientId)

		// console.log('wss://' + this.globalData.connectParams.host + '/mqtt', this.globalData.connectParams.clientId)
		// this.client = new Paho.Client('emqtt.dabaitest.7lk.cn',443,'wx_client');
		this.client.onConnectionLost = this.onConnectionLost
		this.client.onMessageArrived = this.onMessageArrived
		// this.client.onConnected = this.onConnected;
		this.client.connect(this.connectOptions)
		/*this.client.connect({
			userName:Util.getConfig.mqttuser,
			reconnect:false,
			keepAliveInterval:10,
			// password:Util.getConfig.mqttpass,
			onSuccess:this.onConnect,//连接成功回调
			onFailure:this.failConnect,
			willMessage:message
		})*/
	},
	/**
	 * 当消息到达called
	 */
	onMessageArrived: function (message) {
		console.log('mqtt消息到达 - onMessageArrived:' + message.payloadString, message)
		var message = JSON.parse(message.payloadString)
		console.log('message', message)
		// // console.log(message._getDestinationName(),'_getDestinationName')
		// console.log(message._getDestinationName(),'_getDestinationName')
		// console.log(message._getDuplicate(),'_getDuplicate')
		// console.log(message._getQos(),'_getQos')
		let len = 0
		let chatkey = ''
		//回话结束消息
		if (message.c == 1 && message.t == 4) {

			message.sendTime = message.i.endTime
			// message.sendTime = new Date().getTime()
			const endData = JSON.parse(message.i)
			chatkey = this.globalData.connectParams.msgTopicName + '_' + endData.toId
			len = util.getChatData(chatkey).length
			console.log(util.getChatData(chatkey), 157)
			console.log(message, chatkey, len, '========结束回话===========')
		} else if (message.c == 1 && message.t == 13) {
			console.log('视频聊天消息')
		} else {
			const pages = getCurrentPages()
			if (pages.length > 2) {
				var prevPage = pages[pages.length - 2]
				console.log(pages, 163)
				if (['pages/consult/chat/chat'].includes(prevPage.route)) {
					// 如果有新消息 返回聊天页面 刷新消息
					// prevPage.data.flag = false
					// prevPage.data.newMessage = true 有新消息；
					prevPage.setData({
						newMessage: true,
						preview: false
					})
					console.log(prevPage.data.isFirst, '更新数据')

				}
			}
			if (pages.length > 0) {
				const page = pages[pages.length - 1]
				if ('onMessageArrived' in page && page.data.messageArr) {
					let k = 0
					for (let i = 0; i < page.data.messageArr.length; i++) {
						const messages = page.data.messageArr[i].messages
						for (let j = 0; j < messages.length; j++) {
							if (k === 10) {
								break
							}
							if (message.id === messages[j].id) {
								console.log(message, messages[j], 'return')
								return
							}
							k++
						}
						if (k === 10) {
							break
						}
					}
				}
			}
			chatkey = message.content.specificMessageType ? this.globalData.connectParams.msgTopicName + '_' + message.to.id : this.globalData.connectParams.msgTopicName + '_' + message.from.id
			len = util.getChatData(chatkey).length
			const messageRecord = util.getChatData('messageRecord') ? util.getChatData('messageRecord') : {}
			const kay = message.content.specificMessageType ? message.to.id : message.from.id //发起问诊首次默认推送的病情取 message.to.id
			messageRecord[kay] = messageRecord[kay] ? messageRecord[kay] + 1 : 1 //计算未读消息
			if (!message.content.specificMessageType) { //不计算首次问诊推送的病情消息
				wx.setStorageSync('messageRecord', messageRecord)
				//计算未读消息
				this.getMessageNum()
			}
			// 正则替换标签 添加class样式
			if (message.type === 10004) {
				message.content.text = message.content.text.replace(/<([\/]?)(font)((:?\s*)(:?[^>]*)(:?\s*))>/g, '<span>')
				message.content.text = message.content.text.replace(/\<span/gi, '<span class="rich-text" ')
			}
			if(message.type === 10005){
				chatkey = this.globalData.connectParams.msgTopicName + '_'+ message.to.id 

			}
			util.setChatData(chatkey, message)
			util.setChatList(chatkey, message)
		}

		//设置chat.js不更新数据
		message.update = true

		util.onMessageArrived && util.onMessageArrived(message, len)

	},
	/**
	 * 当客户端连接成功时调用
	 */
	onConnect(e) {
		console.log('mqtt连接成功 - onConnect')
		// over
		this.globalData.isconnect = true
		this.globalData.limit = 0

		console.log(this.globalData.connectParams.msgTopicName, 234)
		// this.client.subscribe(this.globalData.connectParams.msgTopicName)
		const subscribeOptions = {
			qos: 2
		}
		console.log(this.globalData.connectParams, 247)
		// this.client.subscribe(this.globalData.connectParams.msgTopicName,subscribeOptions)
		this.client.subscribe(this.globalData.connectParams.privatePushTopicName, subscribeOptions)
		console.log('订阅成功')
		// var t = '上线';
		var t = {}
		t.i = this.globalData.connectParams.msgTopicName
		t.c = 0
		t.t = 0
		const message = new Paho.Message(JSON.stringify(t))
		message.destinationName = this.globalData.connectParams.statusTopicName // statusTopicName
		//发送上线消息
		this.client.send(message)
	},
	/**
	 * 当客户端失去连接时调用
	 */
	onConnectionLost: function (responseObject) {
		// wx.closeSocket();
		this.globalData.isconnect = false
		console.log('mqtt失去连接 - responseObject:', responseObject, this.client)
		if (responseObject.errorCode !== 0) {
			console.log('onConnectionLost:', responseObject.errorMessage)
			this.reConnect()
		}
	},
	/**
	 * 当客户端连接失败时调用
	 */
	failConnect(e) {
		this.globalData.isconnect = false
		// wx.showToast({
		//   title: '连接失败',
		//   duration: 1500,
		//   icon: 'none'
		// })
		console.log('mqtt - disConnect - 连接失败', e)
		if (e.errorCode == 8) {
			//断开MQTT连接
			setTimeout(() => {
				// wx.closeSocket();
				this.reConnect()
			}, 0)
		}
	},
	/**
	 * mqtt重新连接
	 * @return {[type]} [description]
	 */
	reConnect() {
		console.log('mqtt重新连接')
		if (this.lockReconnect) return
		this.lockReconnect = true
		clearTimeout(this.timer)
		if (this.globalData.limit < 12) {
			this.timer = setTimeout(() => {
				this.connectMqtt()
				this.lockReconnect = false
			}, 3000)
			this.globalData.limit = this.globalData.limit + 1
		}
	},
	onShow: function (options) {
		const {
			referrerInfo,
			scene
		} = options
		/* 判断是否从eID数字身份⼩程序返回 */
		const {
			appId
		} = referrerInfo
		if (scene === 1038 && appId === 'wx0e2cb0b052a91c92') {
			return
		} else {
			// 执⾏接⼊⽅⼩程序原本的逻辑
			util.checkLogin().then(res => {
				this.globalData.hasLogin = true
				util.getTemplate(1)
			}).catch(() => {
				this.globalData.hasLogin = false
			})
			const connectParams = util.getConnectParams(this)
			console.log('onShow--重新连接', this.globalData.connectParams)
			if (connectParams) {
				console.log('onShow----连接mqtt')
				this.lockReconnect = false
				this.connectMqtt()
			}
		}
	},
	/**
	 * 断开MQTT 发送离线消息
	 */
	onHide() {
		console.log('onHide--断开连接')
		// var t = '下线';
		var t = {}
		t.i = this.globalData.connectParams.msgTopicName
		t.c = 0
		t.t = 1
		const message = new Paho.Message(JSON.stringify(t))
		message.destinationName = this.globalData.connectParams.statusTopicName
		//发送离线消息
		this.client.send(message)
		this.lockReconnect = true
		//断开MQTT连接
		setTimeout(() => {
			wx.closeSocket()
		}, 0)
	},
	globalData: {
		statusBarHeight: 0,
		screenHeight: 0,
		hasLogin: false,
		userInfo: wx.getStorageSync('userInfo'),
		baseInfo: {},
		connectParams: null, //连接参数
		isconnect: false, //是否连接mqtt
		limit: 0,
		consultType: 1, //跳转到咨询tabbar页面传递的参数
		doctorName: '',
		templateId: [],
		peopleList: [], //就诊人列表
		loginNum: 0,
		drugIdList:[]
	}
})