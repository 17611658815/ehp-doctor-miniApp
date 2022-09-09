
// pages/consult/record/index.js
var api = require('../../../config/api')
var util = require('../../../utils/util')
var windowHeight = wx.getSystemInfoSync().windowHeight
const app = getApp()
Page({

  /**
	 * 页面的初始数据
	 */
  data: {
    doctorId: null,
    videoConsult: [],
    videoPage: 1, //视频列表
    currentTab: 0,
    messageArr: [], //聊天消息列表
    baseUrl: '',
    loadComplete: true,
    tapTime: '',
    mbottom: 190 + 16, //scroll-view  底部距离(rpx)
    messageRecord: null,
    historyPage: 1, //页码
    hasPrev: true, //是否有上一页
    previewList: [], //预览图片
    isAgain: true, //展示再次咨询按钮
    scrollIntoView: '', //滚动条位置
    isBack: true,
    backgroundColor: '#fff',
    navTitle: '咨询记录',
    statusBarHeight: null,
    scrollHeight: '70vh',
    scrollTop: 160,
    dobBoxHeight: 0,
    chatBtnHeight: 0,
    static: {
      nomes: api.ImgUrl + 'images/nomes.png',
      bg_follow: api.ImgUrl + 'images/bg_follow.png',
      bg_medical_record: api.ImgUrl + 'images/bg_medical_record.png',
      bg_prescription: api.ImgUrl + 'images/bg_prescription.png',
      ic_follow_visit_01: api.ImgUrl + 'images/ic_follow_visit_01.png',
      ic_follow_questionnaire_02: api.ImgUrl + 'images/ic_follow_questionnaire_02.png'
    },
    avatar: app.globalData.userInfo.avatar//用户头像
  },
  // 上拉加载更多视频问诊记录
  lower: function() {
    if (!this.data.loadComplete) {
      return
    }
    this.getVideoConsult()
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function(options) {
    this.setData({
      currentTab: options.type ? 1 : 0,
      doctorId: options.doctorId,
      statusBarHeight: app.globalData.statusBarHeight,
      avatar: app.globalData.userInfo.avatar//用户头像
    }, () => {
      options.type ? this.getVideoConsult() : this.getTextRecordList()
      this.initScrollHeigth()
    })
  },
  goMeeting(e) {
    console.log(e, 56)
    const {
      videoconsultstatus,
      roomid,
      videoconsultid
    } = e.currentTarget.dataset
    if (videoconsultid != null) {
      switch (videoconsultstatus) {
        case 1:
          this.getAppIdAndKey(videoconsultid, roomid)
          break
        case 2:
          this.getAppIdAndKey(videoconsultid, roomid)
          break
        case 3:
          this.getAppIdAndKey(videoconsultid, roomid)
          break
        case 4:
          util.showToast({
            title: '当前问诊已取消'
          })
          break
        case 5:
          util.showToast({
            title: '当前问诊已完成'
          })
          break
        case 6:
          util.showToast({
            title: '当前问诊未付款'
          })
          break
      }
    }
  },
  getAppIdAndKey(videoConsultId, roomID) {
    util.request(api.getAppIdAndKey, {
      videoConsultId: videoConsultId
    })
      .then(res => {
        wx.hideToast()
        if (res.data.code === 0) {
          wx.navigateTo({
            url: `/pages/meeting/meeting?roomID=${roomID}&videoConsultId=${videoConsultId}`
          })
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  switchTab(e) {
    const current = e.currentTarget.dataset.current
    this.data.loadComplete = true
    this.data.videoPage = 1
    this.data.videoConsult = []
    this.setData({
      currentTab: current
    }, () => {
      current == 0 ? this.getTextRecordList() : this.getVideoConsult()
      this.initScrollHeigth()
    })

  },
  getVideoConsult() {
    util.showToast({
      title: '加载中..',
      icon: 'loading'
    })
    util.request(api.videoConsult, {
      page: this.data.videoPage,
      doctorId: this.data.doctorId
    }, 'GET')
      .then(res => {
        wx.hideToast()
        const result = res.data.data
        if (res.data.code === 0) {
          ++this.data.videoPage
          this.setData({
            videoConsult: this.data.videoConsult.concat(result.result),
            videoPage: this.data.videoPage
          })
          if (!result.hasNext) {
            this.setData({
              loadComplete: false
            })
          }
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  getTextRecordList(isScroll) {
    if (!this.loading && this.data.hasPrev) {
      this.loading = true
      const params = {
        toId: this.data.doctorId,
        patientId: app.globalData.userInfo.userId,
        page: this.data.historyPage,
        ordeby: 1,
        num: 10
      }
      util.showToast({
        title: '加载中..',
        icon: 'loading'
      })
      util.request(api.chatHistory, params, 'POST', 2)
        .then(res => {
          var dcode = res.data
          if (dcode.code == 0) {
            // console.log('请求历史数据成功', d, params)
            var cdata = dcode.data.result.reverse()
            if (cdata.length > 0) {
              cdata.forEach(element => {
                element.messages.reverse()
                element.timeText = util.calcTimeHeader(element.timeGroup)
                element.messages.forEach(item => {
                  if (item.type == 2) {
                    this.data.previewList.push(dcode.data.baseUrl + item.content.path)
                  }
                })
              })
              var message = cdata.concat(this.data.messageArr)
              const _msgs = message[message.length - 1].messages
              console.log(message, '============sendTime=============', 'chat_' + _msgs[_msgs.length - 1].sendTime)
              let scrollIntoView = ''
              if (!isScroll) {
                scrollIntoView = 'chat_' + _msgs[_msgs.length - 1].sendTime
              } else {
                scrollIntoView = 'chat_' + message[cdata.length].messages[0].sendTime
              }
              this.setData({
                baseUrl: dcode.data.baseUrl,
                messageArr: message,
                historyPage: ++this.data.historyPage,
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
                console.log(this.data.messageArr, 719)
                wx.hideToast()
              })

              if (dcode.data[0].totalPage <= dcode.data[0].pageNo) {
                console.log('没有下一页')
                this.setData({
                  hasPrev: false
                })
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
            wx.hideToast()
            this.loading = false
          }, 500)
        })
    }

  },
  loadMore() {
    this.getTextRecordList(true)
  },
  /**
	 * 播放音频
	 */
  playAudio(e) {
    console.log('播放音频触发')
    util.showToast({
      title: '播放中',
      icon: 'none',
      duration: 45 * 1000,
      mask: true
    })
    const audio = this.data.baseUrl + e.currentTarget.dataset.audio
    console.log(audio, 167)
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = audio
    audioContext.play()
    audioContext.onPlay(() => {})
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
  previewImage(e) {
    console.log(this.data.previewList, 185)
    const src = e.currentTarget.dataset.src
    console.log(e)
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
    if (type === '5') {
      try {
        const { data } = await util.request(`${api.getFollowupStatus}?id=${id}`)
        if (data.data.status === 0) {
          util.showToast({
            title: '该任务暂未开始'
          })
        }
        if (ctype === '1') {
          wx.navigateTo({
            url: `/pages/follow/schedule/index?followNo=${data.data.followUpId}`
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
  againConsulVideo() {
    util.request(api.chatvideo, { 'doctorId': this.data.doctorId }, 'post', 2)
      .then(res => {
        if (res.data.code == 0) {
          if (res.data.data == 0) {
          // 有会话
            util.showToast({ 'title': '当前有会话~' })
          } else {
            app.globalData.doctorName = this.data.videoConsult[0].name
            wx.navigateTo({
              url: '/pages/videoDiseaseDetail/videoDiseaseDetail?source=1&doctorId=' + this.data.doctorId + '&type=2'
            })
          }
        } else {
          util.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
  },
  initScrollHeigth() {
    this.query = wx.createSelectorQuery()
    this.query.select('#tabber').boundingClientRect()
    this.query.select('#fixedButton').boundingClientRect()
    this.query.exec((res) => {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res)
      //取高度
      console.log(wx.getSystemInfoSync().windowHeight, 69)
      this.data.dobBoxHeight = res[0].height
      this.data.chatBtnHeight = res[1].height
      this.data.scrollHeight = wx.getSystemInfoSync().windowHeight - (res[0].height + res[1].height + app.globalData.statusBarHeight + 44) / 1 + 'px'
      this.setData({
        scrollHeight: this.data.scrollHeight,
        scrollTop: (res[0].height + app.globalData.statusBarHeight + 44 / 1) + 'px'
      })
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
  onShow: function() {

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
