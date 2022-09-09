/**
 * index
 */
var api = require('../../config/api.js')
var util = require('../../utils/util.js')
const app = getApp()
Component({
  /**
	 * 组件的属性列表
	 */
  properties: {
    /**
		 * 列表数据
		 * */
    list: {
      type: Array,
      value: []
    },
    /**
		 * 1.图文咨询
		 * 2.视频复诊
		 * 3.我的医生
		 */
    type: {
      type: Number,
      value: 0
    }
  },

  /**
	 * 组件的初始数据
	 */
  data: {
    doctorName: '',
    doctorId: '',
    tapTime: '',
    imgObject: {
      img_blank_doctor: api.ImgUrl + 'images/img_blank_doctor.png'
    },
    currentType: 0
  },
  attached() {
    this.authToast = this.selectComponent('#authToast') //订阅消息二次弹窗
    console.log(this.authToast, 40)
    // this.histoast = this.selectComponent('#histoast'); //his就诊记录弹窗
  },
  /**
	 * 组件的方法列表
	 */
  methods: {
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
        currentType: e.currentTarget.dataset.type * 1,
        tapTime: nowTime
      })
      this.authToast.seeDoctor(e)

    },
    onAuthSub() {
      console.log('执行了')
      console.log(this.authToast.data, this.authToast.data.isSwatchOff)
      if (!this.authToast.data.isSwatchOff) {
        wx.requestSubscribeMessage({
          tmplIds: app.globalData.templateId,
          success: () => {
            this.authToast.SeeFun(this.data.currentType, this.data.doctorId)
          },
          fail: (res) => {
            console.log('onAuthSub', 'fail')
            this.authToast.SeeFun(this.data.currentType, this.data.doctorId)
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
      this.authToast.setData({
        authShow: false,
        clickFlag: true
      })
      this.authToast.SeeFun(this.data.currentType, this.data.doctorId)
    },
		  // 咨询记录
    counselHistory(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/consult/record/index?doctorId=' + id
      })
    }
  }
})
