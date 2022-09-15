const util = require('../../../utils/util')
const api = require('../../../config/api')
const app = getApp()
var keyHeight = 0

Page({
  data: {
    userInfo: {},
    focusFlag: false, //控制输入框失去焦点与否
    moreFlag: false, // 更多功能标志
    sendType: 0, //发送消息类型，0 文本 1 语音
    messageArr: [],
    recorderManager: null, // 微信录音管理对象
    recordClicked: false, // 判断手指是否触摸录音按钮
    inputValue: '', //文本框输入内容
    scrollIntoView: '', //滚动条位置
    ishistory: true, //是否历史记录页
    historyPage: 1, //页码
    hasPrev: true, //是否有上一页
    previewList: [], //预览图片
    toastDis: true, //自定义showToast是否显示
    isCanelAudio: false, //是否取消语音发送
    InquirerInfo: null, //医生id
    imgLength: 0, //多张图片发送判断
    chatkey: null, //聊天记录缓存key
    hasauth: false, //校验录音授权
    beginTime: null,
    countdown: null, //倒计时时间
    timeData: {},
    patientId: null, //患者id
    sessionId: null,
    sendMessage: false, //开启聊天开关,
    baseUrl: '',
    isAgain: false,
    firstBinding: false,
    isBack: true,
    backgroundColor: '#fff',
    navTitle: '在线问诊',
    inputBottom: 0,
    firstNum: null,
    isFirst: true,
    preview: false,
    newMessage: false,
    doctorName: '',
    doctorId: '',
    type: null,
    tapTime: '',
    scrollHeight: '70vh',
    dobBoxHeight: 0,
    chatBtnHeight: 0,
    scrollTop: 160,
    static: {
      nomes: api.ImgUrl + 'images/nomes.png',
      bg_follow: api.ImgUrl + 'images/bg_follow.png',
      bg_medical_record: api.ImgUrl + 'images/bg_medical_record.png',
      bg_prescription: api.ImgUrl + 'images/bg_prescription.png',
      ic_follow_visit_01: api.ImgUrl + 'images/ic_follow_visit_01.png',
      ic_follow_questionnaire_02: api.ImgUrl + 'images/ic_follow_questionnaire_02.png'
    },
    avatar: app.globalData.userInfo.avatar, //用户头像
    pageNum: 1,
    sessionid: '',
    sendMessageNav: false,
    patientRemarkInfo: null
  },
  //消息到达更新，执行util中onMessageArrived方法，不可删除
  onMessageArrived() {
    this.updateResult(arguments[0], () => {
      this.setData({
        scrollIntoView: 'chat_' + arguments[0].sendTime
      })
    }, arguments[1])
  },
  onLoad(e) {
    this.init(e)
  },
  async init(e) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      patientId: e.patientid,
      sessionid: e.sessionid,
      chatkey: 'dr_' + userInfo.doctorId + '_' + e.patientid,
      userInfo: userInfo
    }, async() => {
      await this.getInquirerDetail().then(res => {
        if (res) {
          this.initChatData()
        }
      })
    })
    this.initSelectorQuery()
  },
  onHide() {
    this.data.isFirst = false
    this.data.newMessage = false
  },
  touchMove(e) {
    console.log('滑动了')
    this.data.preview = true
  },
  async onShow() {
    this.authToast = this.selectComponent('#authToast') //订阅消息二次弹窗
    const userInfo = wx.getStorageSync('userInfo')
    if (!this.data.isFirst && !this.data.preview) {
      this.setData({
        patientId: this.data.patientId,
        chatkey: 'dr_' + userInfo.doctorId + '_' + this.data.patientId
      }, async() => {
        await this.getInquirerDetail().then(res => {
          if (res) {
            this.initChatData()
          }
        })
      })
    }
  },
  /**
	 * 再次咨询
	 */
  consult() {
    //清空历史数据
    this.setData({
      ishistory: false,
      historyPage: 1,
      previewList: []
    }, () => {
      this.initChatData()
    })
  },
  /**
	 * 初始化聊天历史数据
	 */
  initChatData() {
    const chatData = util.getChatData(this.data.chatkey)
    console.log(this.data.chatkey, '============chatData==============')
    this.data.hasPrev = true
    if (chatData) {
      const preList = []

      chatData.forEach(element => {
        // calcTimeHeader
        element.messages = element.messages.reverse()
        element.timeText = util.calcTimeHeader(element.timeGroup)
        element.messages.forEach(item => {
          if (item.type == 2) {
            preList.push(item.content.path)
          }
        })
      })
      console.log(chatData, 101)
      const scrollIntoView = 'chat_' + chatData[chatData.length - 1].sendTime
      // 暂时不更新视图 防止setData页面抖动
      this.data.messageArr = chatData
      this.setData({
        messageArr: this.data.messageArr,
        previewList: preList,
        scrollIntoView
      }, () => {
        this.setData({
          scrollIntoView
        })
        this.getHistoryData()
      })
    } else {
      this.getHistoryData()
    }
  },
  updateResult(message, callback, _chatLength) {
    if ((message && !message.update)) {
      util.setChatData(this.data.chatkey, message)
    }
    // 更新过后的本地存储聊天记录
    const chatData = util.getChatData(this.data.chatkey)
    const chatLength = chatData ? chatData.length : 0
    if (_chatLength === chatLength && this.data.messageArr.length) {
      //说明是在两分钟内发送的消息 在一个分组内
      this.data.messageArr[this.data.messageArr.length - 1] = chatData[chatData.length - 1]
    } else {
      //不再一个分组 生成了一个新数组 直接push到视图层
      this.data.messageArr.push(chatData[chatData.length - 1])
    }
    const preList = []
    if (message.type === 10006) {
      // 结束回话清空当前医生消息标记
      const messageRecord = util.getChatData('messageRecord')
      delete messageRecord[this.data.doctorId]
      wx.setStorageSync('messageRecord', messageRecord)
      this.setData({
        sendMessage: false
      })
      this.initScrollHeigth()
    }
    chatData.forEach(element => {
      element.messages = element.messages.reverse()
      element.timeText = util.calcTimeHeader(element.timeGroup)
      element.messages.forEach(item => {
        if (item.type == 2) {
          preList.push(item.content.path)
        }
      })
    })
    this.setData({
      messageArr: this.data.messageArr,
      previewList: preList
    }, () => {
      callback && callback()
    })
  },
  /**
	 * 更新数据
	 */
  updateData(message, callback) {
    //app.js 中已经更新过的不再更新，用户发送的更新数据
    // 本地存储的聊天记录
    const _chatData = util.getChatData(this.data.chatkey)
    console.log(_chatData, 146)
    const _chatLength = _chatData ? _chatData.length : 0
    this.updateResult(message, callback, _chatLength)
  },
  /**
	 * 滚动到顶部触发事件
	 */
  loadMore() {
    console.log('滚动到顶部触发事件-scrolltoupper')
    this.getHistoryData(true)
  },
  oninput(e) {
    const text = e.detail.value.replace(/\s+/g, '')
    this.setData({
      inputValue: text
    })
  },
  /**
	 * 发送文本
	 */
  inputSend(e) {
    const text = e.detail.value
    this.sendMessType('text', {
      text: text
    })
    //清空输入框
    this.setData({
      inputValue: ''
    })
  },
  /**
	 * 获取焦点
	 */
  inputFocus(e) {
    keyHeight = e.detail.height
    // 设置文本框顶起消息内容
    const msglength = this.data.messageArr.length - 1
    const scrollIntoView = 'chat_' + this.data.messageArr[msglength].messages[this.data.messageArr[msglength].messages.length - 1].sendTime
    this.setData({
      sendMessageNav: false,
      focusFlag: true,
      inputBottom: e.detail.height,
      scrollHeight: (wx.getSystemInfoSync().windowHeight - keyHeight - 220) + 'px',
      scrollIntoView: scrollIntoView
    }, () => {
      this.setData({
        scrollIntoView: scrollIntoView
      })
    })
  },
  /**
	 * 失去焦点
	 */
  inputBlur() {
    this.setData({
      inputBottom: 0,
      focusFlag: false,
      scrollHeight: wx.getSystemInfoSync().windowHeight - (this.data.dobBoxHeight + this.data.chatBtnHeight + app.globalData.statusBarHeight + 44) / 1 + 'px'

    })
  },
  onkeyboardheightchange(e) {
    this.setData({
      inputBottom: e.detail.height
    })
  },
  /**
	 * 切换发送文本类型
	 */
  switchSendType() {
    this.setData({
      sendMessageNav: false,
      inputBottom: 0,
      sendType: this.data.sendType == 0 ? 1 : 0,
      focusFlag: false
    })
  },
  /**
	 * 手动模拟按钮长按，
	 */
  longPressStart(e) {
    this.checkauth()
    this.touchStartY = e.changedTouches[0].pageY
    this.setData({
      recordClicked: true
    })
    setTimeout(() => {
      if (this.data.recordClicked == true) {
        this.executeRecord()
      }
    }, 350)
  },
  /**
	 * 语音按钮滑动取消
	 */
  pressMove(e) {
    if (this.touchStartY - e.changedTouches[0].pageY >= 50 && !this.data.isCanelAudio) {
      // console.log('取消')
      this.setData({
        isCanelAudio: true
      })
    } else if (this.touchStartY - e.changedTouches[0].pageY < 50 && this.data.isCanelAudio) {
      // console.log('不取消')
      this.setData({
        isCanelAudio: false
      })
    }
  },
  /**
	 * 语音按钮长按结束
	 */
  longPressEnd() {
    this.setData({
      recordClicked: false,
      toastDis: true
    })
    if (this.data.isLongPress) {
      this.setData({
        isLongPress: false
      })
      this.data.recorderManager.stop()
    }
  },
  touchCanel() {
    console.log('touchCanel')
    this.setData({
      isCanelAudio: true
    })
    this.longPressEnd()
  },
  /**
	 * 执行录音逻辑
	 */
  executeRecord() {
    if (!this.data.hasauth) {
      return
    }
    this.setData({
      isLongPress: true
    })
    this.startRecord()
  },
  /**
	 * 录音授权校验
	 */
  checkauth: function() {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: function(res) {
              that.setData({
                hasauth: true
              })
            },
            fail: function(res) {
              that.setData({
                hasauth: false
              })
              util.showModal({
                title: '提示',
                showCancel: false,
                content: '录音功能需要您的授权',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      withSubscriptions: true
                    })
                  }
                }
              })
            }
          })
        } else {
          console.log('授权了')
          that.setData({
            hasauth: true
          })
        }
      },
      fail(err) {
        console.err(err)
      }
    })
  },
  /**
	 * 开始录音
	 */
  startRecord() {
    this.setData({
      // toastTitle: '手指上滑,取消发送',
      toastDis: false
    })
    const recorderManager = this.data.recorderManager || wx.getRecorderManager()
    const options = {
      duration: 60 * 1000,
      format: 'mp3'
    }
    recorderManager.start(options)
    this.setData({
      recorderManager
    })
    // let duration = 60
    // this.timeInterval = setInterval(() => {
    //   duration--
    //   console.log(duration)
    // }, 1000)
    // console.log(duration)
    recorderManager.onStop((res) => {
      console.log('结束了')
      if (this.data.isCanelAudio) {
        console.log('取消发送')
      } else if (res.duration < 1000) {
        util.showToast({
          title: '录音时间太短',
          duration: 1500,
          icon: 'none'
        })
      } else {
        res.timeLength = Math.floor(res.duration / 1000) //转换时长
        this.sendMessType('audio', res)
      }
      this.setData({
        isCanelAudio: false,
        toastDis: true
      })
    })
  },
  /**
	 * 选择相册图片
	 */
  chooseImageToSend() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.sendMessType('image', res)
      }
    })
  },
  /**
	 * 播放音频
	 */
  playAudio(e) {
    console.log('播放音频触发')
    const name = e.currentTarget.dataset.doctorname
    const audio = name ? this.data.baseUrl + e.currentTarget.dataset.audio : e.currentTarget.dataset.audio
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = audio
    audioContext.play()
    audioContext.onPlay(() => {
      util.showToast({
        title: '播放中',
        icon: 'none',
        duration: 45 * 1000,
        mask: true
      })
    })
    audioContext.onEnded(() => {
      console.log('播放音频结束')
      wx.hideToast()
    })
    audioContext.onError((res) => {
      util.showToast({
        title: res.errCode,
        icon: 'none',
        duration: 1500
      })
    })
  },
  sendMessage(params) {
    params.message = JSON.stringify(params.message)
    util.request(api.sendMessage, params, 'post')
      .then(d => {
        var cdata = d.data
        Object.assign(cdata.data, JSON.parse(params.message))
        if (cdata.code === 0) {
          if (this.data.firstBinding) {
            this.setData({
              sessionId: cdata.data.sessionId
            }, () => {
              this.getInquirerDetail()
            })
          }
          this.updateData(cdata.data, () => {
            this.setData({
              scrollIntoView: 'chat_' + cdata.data.sendTime
            })
          })
        } else {
          util.showToast({
            title: '发送消息失败'
          })
        }
        wx.hideLoading()
      }).catch(err => {
        console.log(params, '失败发送')
        util.showToast({
          title: '发送消息失败'
        })
        wx.hideLoading()
      })
  },
  // 格式化参数
  formaParams(obj) {
    return {
      message: {
        from: {
          id: this.data.userInfo.doctorId
        },
        to: {
          id: this.data.patientId
        },
        sendTime: new Date().getTime(),
        relation: 1,
        session: {
          sessionId: this.data.sessionId
        }
      }
    }
  },
  /**
	 * 发送消息 [请求]
	 * @param  {[type]} type 消息类型
	 * @param  {[type]} obj  消息参数
	 */
  sendMessType(type, obj) {
    var params = this.formaParams()
    switch (type) {
      case 'text':
        console.log('发送文本消息', type, obj)
        params.message.content = obj.text
        params.message.type = 1
        this.sendMessage(params)
        break
      case 'image':
        console.log('发送图片消息', type, obj)
        this.setData({
          imgLength: obj.tempFilePaths.length
        })
        if (obj.tempFilePaths.length > 0) {
          for (let i = 0; i < obj.tempFilePaths.length; i++) {
            params.message.type = 2
            params.message.content = {}
            params.message.content.path = obj.tempFilePaths[i]
            params.message.content.self = true
            params.tempFilePath = obj.tempFilePaths[i]
            this.uploadFile(2, params)
          }
        }
        break
      case 'audio':
        console.log('发送语音消息', type, obj)
        params.message.type = 4
        params.message.content = {}
        params.message.content.path = obj.tempFilePath
        params.message.content.timeLength = obj.timeLength
        this.uploadFile(3, params)
        break
    }
  },
  /**
	 * 上传图片语音 type ['image','audio']
	 * @param  {[type]} type ['image','audio']
	 * @param  {[type]} obj  [description]
	 * @return {[type]}      [description]
	 */
  uploadFile(type, params) {
    console.log(params, 585)
    const header = {
      'token': this.data.userInfo.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const formData = {
      type: params.message.type,
      doctorId: this.data.userInfo.doctorId,
      fromId: params.message.from.id,
      toId: params.message.to.id,
      token: this.data.userInfo.token
    }

    console.log(formData, 598)
    wx.uploadFile({
      url: api.uplodeFile,
      filePath: params.message.content.path,
      header: Object.assign(header, util.headerParams),
      name: 'file',
      formData: formData,
      success: (d) => {
        var cdata = JSON.parse(d.data)
        if (cdata.code === 0) {
          params.message.content.path = cdata.data
          this.sendMessage(params)
        } else {
          util.showToast({
            title: '发送消息失败'
          })
        }
      },
      fail: (e) => {
        util.showModal({
          title: '错误信息',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: (e) => {
        util.hideLoading()
      }
    })
  },
  /**
	 * 图片预览
	 */
  previewImage(e) {
    const src = e.currentTarget.dataset.src
    this.data.preview = true
    wx.previewImage({
      current: src,
      urls: this.data.previewList
    })
  },
  /**
	 * 跳转页面
	 */
  async goPage(e) {
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type
    const url = e.currentTarget.dataset.url
    const ctype = e.currentTarget.dataset.ctype
    const followupno = e.currentTarget.dataset.followupno
    if (type == '5') {
      try {
        const {
          data
        } = await util.request(`${api.getFollowupStatus}?id=${id}`)
        console.log(ctype === '1', 'ctype')
        if (ctype == '1') {
          wx.navigateTo({
            url: `/pages/follow/schedule/index?followNo=${followupno}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/follow/detail/index?id=${data.data.followUpId}`
          })
        }

      } catch (error) {
        throw new Error(error)
      }
    } else {
      wx.navigateTo({
        url: url
      })
    }
  },
  /**
	 * 获取聊天历史数据
	 */
  getHistoryData(isScroll) {
    console.log('加载了。。。')
    if (!this.loading && this.data.hasPrev) {
      this.loading = true
      const params = {
        pageNo: this.data.historyPage,
        pageSize: 10,
        sessionId: this.data.sessionId,
        patientId: this.data.patientId
      }
      console.log(this.data.messageArr[0], 685)
      if (this.data.messageArr[0] && this.data.messageArr[0].messages[0]) {
        params.endTime = this.data.messageArr[0].messages[0].sendTime ? this.data.messageArr[0].messages[0].sendTime : ''
      }
      console.log(this.data.messageArr, 682)
      util.showToast({
        title: '加载中..',
        icon: 'loading'
      })
      util.request(api.chatHistory, params, 'post')
        .then(res => {
          console.log('=========701==============', res)
          var dcode = res.data
          if (dcode.code == 0) {
            const messageId = []
            // 消息分组
            var cdata = util.setMessageGroup(params.endTime, dcode.data.result).reverse()
            if (cdata.length > 0) {
              cdata.forEach(element => {
                element.messages = element.messages.reverse()
                element.timeText = util.calcTimeHeader(element.timeGroup)
                element.messages.forEach(item => {
                  messageId.push(item.id)
                  if (item.type == 2) {
                    this.data.previewList.push(dcode.data.baseUrl + item.content.path)
                    item.content.path = dcode.data.baseUrl + item.content.path
                  }
                })
              })
              // 防止历史消息与推送消息重复
              const flag = this.messageFilter(messageId)
              var message = flag ? this.data.messageArr : cdata.concat(this.data.messageArr)
              const _msgs = message[message.length - 1].messages
              let scrollIntoView = ''
              if (!isScroll) {
                scrollIntoView = 'chat_' + _msgs[_msgs.length - 1].sendTime
              } else {
                scrollIntoView = 'chat_' + message[cdata.length].messages[0].sendTime
              }
              this.setData({
                baseUrl: dcode.data.baseUrl,
                messageArr: message,
                previewList: this.data.previewList,
                scrollIntoView: scrollIntoView
              }, () => {
                const platform = util.getPlatform()
                if (platform === 'ios') {
                  this.setData({
                    scrollIntoView
                  })
                } else {
                  if (!isScroll) {
                    this.setData({
                      scrollIntoView
                    })
                  }
                }
                setTimeout(() => {
                  this.loading = false
                }, 500)
                util.hideToast()
              })
              if (dcode.data.totalPage <= dcode.data.pageNo) {
                console.log('没有下一页')
                // this.setData({
                //   hasPrev: false
                // })
              }
            } else {
              console.log('没有数据')
            }
          } else {
            console.log('获取历史数据失败', cdata.code)
          }
        })
        .catch(err => {
          setTimeout(() => {
            util.hideToast()
            this.loading = false
          }, 500)
        })
    }
  },
  /**
	 * 获取医生信息
	 */
  getInquirerDetail() {
    const {
      sessionid,
      patientId
    } = this.data
    const params = {
      sessionId: sessionid,
      patientId: patientId
    }
    return util.request(`${api.getInquirerDetail}`, params, 'post').then(d => {
      var cdata = d.data
      if (cdata.code === 0) {
        console.log(cdata, 773)
        this.setData({
          InquirerInfo: cdata.data,
          sendMessage: cdata.data.sendMessage,
          firstBinding: cdata.data.firstBinding,
          firstNum: cdata.data.firstBinding
        }, () => {
					console.log()
          this.getPatientRemark()
          this.getTiemNumer()
          this.initScrollHeigth()
        })
        return true
      } else {
        util.showToast({
          'title': cdata.msg,
          'icon': 'none'
        })
        return false
      }
    }, c => {
      util.hideLoading()
    })
  },
  /**
	 * 获取问诊倒计时
	 */
  getTiemNumer() {
    const params = {
      patientId: this.data.patientId,
      pageNo: 1,
      pageSize: 1,
      orderBy: 1,
      status: 2
    }
    util.request(api.sessionList, params, 'post').then(d => {
      var cdata = d.data
      if (cdata.code === 0 && cdata.data.result[0]) {
        console.log(cdata, 816)
        this.setData({
          beginTime: cdata.data.result[0].beginTime,
          sessionId: cdata.data.result[0].sessionId
        }, async() => {
          // 计算倒计时时间
          const {
            sysTime
          } = await this.getStatus()
          const {
            sessionTimeout
          } = await this.getConnectParams()
          const countdown = this.data.beginTime - (sysTime - sessionTimeout)
          console.log(this.data.beginTime - (sysTime - sessionTimeout))
          this.setData({
            countdown
          })
          console.log(countdown, 839)
        })
      }
    }, c => {
      util.hideLoading()
    })
  },
  // 获取系统时间
  async getStatus() {
    try {
      const {
        data
      } = await util.request(api.getStatus, {
        patientId: this.data.patientId
      })
      util.hideToast()
      if (data.code === 0) {
        return data.data
      } else {
        util.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  initSelectorQuery() {
    this.query = wx.createSelectorQuery()
    const ele = this.query.select('#recordWrapper')
    ele.boundingClientRect()
    ele.scrollOffset()
  },
  initScrollHeigth() {
    this.query = wx.createSelectorQuery()
    this.query.select('#dobBox').boundingClientRect()
    this.query.select('#chatBtn').boundingClientRect()
    this.query.exec((res) => {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res, app.globalData.statusBarHeight)
      //取高度
      console.log(res[0].height, 69)
      console.log(wx.getSystemInfoSync().windowHeight, 893)
      this.data.dobBoxHeight = res[0].height
      this.data.chatBtnHeight = res[1].height
      this.data.scrollHeight = wx.getSystemInfoSync().windowHeight - (res[0].height + res[1].height + app.globalData.statusBarHeight + 44) / 1 + 'px'
      this.setData({
        scrollHeight: this.data.scrollHeight,
        dobBoxHeight: this.data.dobBoxHeight,
        chatBtnHeight: this.data.chatBtnHeight,
        scrollTop: (res[0].height + app.globalData.statusBarHeight + 44) / 1 + 'px'
      })
    })
  },
  // 获取配置时间
  getConnectParams() {
    return util.getConnectParams(app)
  },
  onChange(e) {
    this.setData({
      timeData: e.detail
    })
  },

  // 完善就诊人信息
  goInquirerDetail(e) {
    const inquirerId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/peopleContent/detail/detail?inquirerId=' + inquirerId + '&model=0' + '&doctorId=' + this.data.doctorId
    })
  },
  onUnload() {
    const messageRecord = util.getChatData('messageRecord')
    delete messageRecord[this.data.doctorId]
    wx.setStorageSync('messageRecord', messageRecord)
    // clearTimeout(this.stime);
  },
  // 防止同时请求接口并推送消息内容重复
  messageFilter(messageId) {
    let k = 0
    let isRep = false
    for (let i = 0; i < this.data.messageArr.length; i++) {
      const messages = this.data.messageArr[i].messages
      for (let j = 0; j < messages.length; j++) {
        if (k === 10) {
          break
        }
        k++
        if (messageId.indexOf(messages[j].id) != -1) {
          isRep = true
          break
        }
      }
      if (k === 10) {
        break
      }
    }
    return isRep
  },
  // 发起问诊
  handleConsult(e) {
    var nowTime = new Date()
    if (nowTime - this.data.tapTime < 2000) {
      console.log('阻断')
      return
    }
    this.setData({
      doctorName: e.currentTarget.dataset.name,
      doctorId: e.currentTarget.dataset.id,
      type: e.currentTarget.dataset.type * 1,
      tapTime: nowTime
    })
    this.authToast.seeDoctor(e)
  },
  onAuthSub() {
    if (!this.authToast.data.isSwatchOff) {
      wx.requestSubscribeMessage({
        tmplIds: app.globalData.templateId,
        success: () => {
          this.authToast.SeeFun(this.data.type, this.data.doctorId)
        },
        fail: (res) => {
          console.log('onAuthSub', 'fail')
          this.authToast.SeeFun(this.data.type, this.data.doctorId)
        }
      })
    } else {
      wx.openSetting({
        success: (res) => {
          this.authToast.setData({
            isSwatchOff: false,
            authShow: false,
            clickFlag: true
          })
        }
      })
    }
  },
  onClose() {
    console.log('执行了')
    console.log(this.authToast, 211)
    this.authToast.setData({
      authShow: false,
      clickFlag: true
    })
    this.authToast.SeeFun(this.data.type, this.data.doctorId)
  },
  fixedScrollItem() {
    const msglength = this.data.messageArr.length - 1
    const scrollIntoView = 'chat_' + this.data.messageArr[msglength].messages[this.data.messageArr[msglength].messages.length - 1].sendTime
    this.setData({
      scrollIntoView: scrollIntoView
    }, () => {
      this.setData({
        scrollIntoView: scrollIntoView
      })
    })
  },
  handleShowNav() {
    this.setData({
      sendMessageNav: !this.data.sendMessageNav
    }, () => {
      this.initScrollHeigth()
      this.fixedScrollItem()
    })
  },
  // "630741f24a2192053a372dbe"
  setMessageStatus() {
    wx.setStorageSync(this.data.chatkey, this.data.messageArr)
    let key
    const messageArr = this.data.messageArr
    const chatData = util.getChatData(this.data.chatkey)
    for (var i = 0; i < messageArr.length; i++) {
      key = messageArr[i].messages.findIndex(item => item.id === '630741f24a2192053a372dbe')
      if (key !== -1) {
        messageArr[i].messages[key].content.auditDesc = '处方未通过审核，请核对处方信息'
        console.log(messageArr[i].messages[key], 1061)
        this.setData({
          messageArr
        })
        break
      }
    }
  },
  // 患者基本信息
  async getPatientRemark() {
    try {
      const {
        data
      } = await util.request(api.getPatientRemark, {
        patientId: this.data.patientId
      }, 'post')
      if (data.code !== 0) {
        util.showToast({
          title: data.msg,
          icon: 'none',
          duration: 3000
        })
      }
      console.log(data, 1039)
      this.setData({
        patientRemarkInfo: data.data.patientRemarkInfo
      })
    } catch (error) {
      throw new Error(error)
    }
  },

	// doctorId=158&inquirerId=425&patientId=290&token=
  handleNavigateTop(e) {
    const {
      patientId,
			InquirerInfo,
			relation
    } = this.data
    const {
      url
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `${url}?patientId=${patientId}&inquirerId=${InquirerInfo.inquirerId}&relation=${InquirerInfo.relation}&consultType=1`
    })
  }
})
