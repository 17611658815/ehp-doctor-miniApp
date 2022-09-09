// miniprogram/pages/meeting.js
var api = require('../../config/api')
var util = require('../../utils/util')
var Config = require('../../config/index.js')
const app = getApp()
Page({

  /**
	 * 页面的初始数据
	 */
  data: {
    roomID: '', //房间号
    userID: '', //用户标识
    template: 'grid', //通话类型
    localVideo: true, //本地视频
    localAudio: true, //本地音频
    enableEarMonitor: false, //开启耳返
    enableAutoFocus: true, //自动对焦
    localMirror: 'auto', //本地镜像
    enableAgc: true, //自动增益
    enableAns: true, //噪声消除
    frontCamera: 'front', //选择摄像头 front前置 back后置
    audioVolumeType: 'auto', //音量类型
    resolution: 'SD', //视频分辨率
    debugMode: false, //联调模式
    audioQuality: 'high',
    // 用于自定义输入视频分辨率和默认值
    videoWidth: 360,
    videoHeight: 640,
    minBitrate: 600,
    maxBitrate: 900,
    // pusher URL 参数
    scene: 'rtc',
    encsmall: false,
    cloudenv: 'PRO',
    enableBlackStream: 0,
    streamID: '',
    userDefineRecordID: '',
    privateMapKey: '',
    pureAudioMode: '', // 默认不填，值为1或者2
    recvMode: '',
    // player 参数
    enableRecvMessage: false,

    audioQualityArray: [{
      value: 'high',
      title: '48K'
    },
    {
      value: 'low',
      title: '16K'
    }
    ],
    cloudenvArray: [{
      value: 'PRO',
      title: 'PRO'
    },
    {
      value: 'CCC',
      title: 'CCC'
    },
    {
      value: 'DEV',
      title: 'DEV'
    },
    {
      value: 'UAT',
      title: 'UAT'
    }
    ],
    sceneArray: [{
      value: 'rtc',
      title: '通话'
    },
    {
      value: 'live',
      title: '直播'
    }
    ],
    audioVolumeTypeArray: [{
      value: 'auto',
      title: '自动'
    },
    {
      value: 'media',
      title: '媒体'
    },
    {
      value: 'voicecall',
      title: '通话'
    }
    ],
    localMirrorArray: [{
      value: 'auto',
      title: '自动'
    },
    {
      value: 'enable',
      title: '开启'
    },
    {
      value: 'disable',
      title: '关闭'
    }
    ],
    resolutionArray: [{
      value: 'FHD',
      title: 'FHD'
    },
    {
      value: 'HD',
      title: 'HD'
    },
    {
      value: 'SD',
      title: 'SD'
    }
    ],
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    sdkAppID: '',
    userSig: '',
    videoConsultId: '', //视频问诊id
    company: Config.company,
    static: {
      login_logo: api.ImgUrl + 'logo/ic_company.png'
    }
  },

  enterHandler: function(event) {
    const key = event.currentTarget.dataset.key
    const data = {}
    data[key] = event.detail.value
    if (key === 'roomID') {
      data[key] = data[key].replace(/[^A-Za-z0-9]/g, '')
    }
    this.setData(data, () => {
      console.log(`set ${key}:`, data[key])
    })
  },

  switchHandler: function(event) {
    const key = event.currentTarget.dataset.key
    const data = {}
    data[key] = event.detail.value
    if (key === 'enableBlackStream') {
      data[key] = data[key] === false ? 0 : 1
    }
    this.setData(data, () => {
      console.log(`set ${key}:`, data[key])
    })
  },

  selectHandler: function(event) {
    const key = event.currentTarget.dataset.key
    const data = {}
    data[key] = event.detail.value
    this.setData(data, () => {
      console.log(`set ${key}:`, data[key])
      if (key === 'resolution') {
        switch (this.data.resolution) {
          case 'FHD':
            this.setData({
              videoWidth: 720,
              videoHeight: 1280,
              minBitrate: 1500,
              maxBitrate: 2000
            })
            break
          case 'SD':
            this.setData({
              videoWidth: 360,
              videoHeight: 640,
              minBitrate: 600,
              maxBitrate: 900
            })
            break
          case 'HD':
            this.setData({
              videoWidth: 540,
              videoHeight: 960,
              minBitrate: 1000,
              maxBitrate: 1500
            })
            break
          default:
            break
        }
      }
    })
  },

  enterRoom() {
    const nowTime = new Date()
    if (nowTime - this.tapTime < 1200) {
      return
    }

    const url = `../room/room?roomID=${this.data.roomID}` +
			`&template=${this.data.template}` +
			`&debugMode=${this.data.debugMode}` +
			`&localVideo=${this.data.localVideo}` +
			`&localAudio=${this.data.localAudio}` +
			`&enableEarMonitor=${this.data.enableEarMonitor}` +
			`&enableAutoFocus=${this.data.enableAutoFocus}` +
			`&localMirror=${this.data.localMirror}` +
			`&enableAgc=${this.data.enableAgc}` +
			`&enableAns=${this.data.enableAns}` +
			`&frontCamera=${this.data.frontCamera}` +
			`&audioVolumeType=${this.data.audioVolumeType}` +
			`&audioQuality=${this.data.audioQuality}` +
			`&videoWidth=${this.data.videoWidth}` +
			`&videoHeight=${this.data.videoHeight}` +
			`&userID=${this.data.userID}` +
			`&minBitrate=${this.data.minBitrate}` +
			`&maxBitrate=${this.data.maxBitrate}` +
			// pusher URL 参数
			`&encsmall=${this.data.encsmall}` +
			`&scene=${this.data.scene}` +
			`&cloudenv=${this.data.cloudenv}` +
			`&enableBlackStream=${this.data.enableBlackStream}` +
			`&streamID=${this.data.streamID}` +
			`&userDefineRecordID=${this.data.userDefineRecordID}` +
			`&privateMapKey=${this.data.privateMapKey}` +
			`&pureAudioMode=${this.data.pureAudioMode}` +
			`&recvMode=${this.data.recvMode}` +
			// player参数
			`&enableRecvMessage=${this.data.enableRecvMessage}` +
			`&sdkAppID=${this.data.sdkAppID}` +
			`&userSig=${this.data.userSig}` +
			`&videoConsultId=${this.data.videoConsultId}`
    if (!this.data.roomID) {
      util.showToast({
        title: '请输入房间号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log(this.data.userID)
    if (!this.data.userID) {
      util.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    const reg = /^[0-9a-zA-Z]*$/
    this.tapTime = nowTime
    this.checkDeviceAuthorize().then((result) => {
      console.log('授权成功', result)
      console.log('navigateTo', url)
      wx.navigateTo({
        url: url
      })
    }).catch((error) => {
      console.log('没有授权', error)
    })
  },
  checkDeviceAuthorize: function() {
    this.hasOpenDeviceAuthorizeModal = false
    return new Promise((resolve, reject) => {
      if (!wx.getSetting || !wx.getSetting()) {
        // 微信测试版 获取授权API异常，目前只能即使没授权也可以通过
        resolve()
      }
      wx.getSetting().then((result) => {
        console.log('getSetting', result)
        this.authorizeMic = result.authSetting['scope.record']
        this.authorizeCamera = result.authSetting['scope.camera']
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          // 没有授权，弹出授权窗口
          // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record'
          }).then((res) => {
            console.log('authorize mic', res)
            this.authorizeMic = true
            if (this.authorizeCamera) {
              resolve()
            }
          }).catch((error) => {
            console.log('authorize mic error', error)
            this.authorizeMic = false
          })
          wx.authorize({
            scope: 'scope.camera'
          }).then((res) => {
            console.log('authorize camera', res)
            this.authorizeCamera = true
            if (this.authorizeMic) {
              resolve()
            } else {
              this.openConfirm()
              reject(new Error('authorize fail'))
            }
          }).catch((error) => {
            console.log('authorize camera error', error)
            this.authorizeCamera = false
            this.openConfirm()
            reject(new Error('authorize fail'))
          })
        }
      })
    })
  },
  openConfirm: function() {
    if (this.hasOpenDeviceAuthorizeModal) {
      return
    }
    this.hasOpenDeviceAuthorizeModal = true
    return util.showModal({
      content: '您没有打开麦克风和摄像头的权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        this.hasOpenDeviceAuthorizeModal = false
        console.log(res)
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          wx.openSetting({
            success: (res) => {}
          })
          console.log('用户点击取消')
        }
      }
    })
  },
  onBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  randomUserID: function() {
    this.setData({
      // roomID: parseInt(10000 * Math.random()),
      userID: util.getUserInfo().userId
    })
  },
  async getAppIdAndKey() {
    util.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    try {
      const { data } = await util.request(api.getAppIdAndKey, { videoConsultId: this.data.videoConsultId })
      util.hideToast()
      if (data.code === 0) {
        return data.data
      } else {
        util.showToast({
          icon: 'none',
          title: data.msg,
          success() {
            setTimeout(function() {
              app.globalData.consultType = 2
              app.globalData.doctorName = ''
              wx.switchTab({
                url: '/pages/consult/index/index'
              })
            }, 2000)
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  /**
	 * 生命周期函数--监听页面加载
	 * @param {Object} options 参数
	 */
  onLoad: function(options) {
    this.setData({
      roomID: options.roomID,
      videoConsultId: options.videoConsultId
    })
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function() {

  },

  /**
	 * 生命周期函数--监听页面显示
	 */
  async onShow() {
    const res = await this.getAppIdAndKey()
    this.setData({
      sdkAppID: res.appId,
      userSig: res.userSig,
      userID: res.userId
    }, () => {
      this.enterRoom()
    })
  },

  /**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function() {

  },

  /**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function() {

  },

  /**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function() {

  },

  /**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function() {

  }

  /**
	 * 用户点击右上角分享
	 */
  // onShareAppMessage: function() {

  // }
})
