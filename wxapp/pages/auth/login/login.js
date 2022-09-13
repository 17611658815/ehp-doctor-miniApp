var api = require('../../../config/api.js')
var util = require('../../../utils/util.js')
const Encrypt = require('../../../lib/jsencrypt_la-main/jsencrypt')//路径看个人的放哪里哈
var app = getApp()
Page({
  data: {
    computeTime: 0, // 计时的时间
    formData: {
      phone: '',
      code: '',
      password: ''
    },
    sms: {
      intervalId: 0,
      countDown: 0,
      message: '发送验证码'
    },
    pwsIcon: 'closed-eye',
    isPassword: true,
    isShowPassword: true
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  onInputVal(e) {
    const val = e.detail
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${key}`]: val
    })
  },
  // 获取短信验证码
  async sendCode() {
    const {
      sms,
      formData
    } = this.data
    var reg = /^[1][0-9]{10}$/
    // if (!reg.test(formData.phone) || !formData.phone) {
    //   this.$toast('请填写正确号码！')
    //   return
    // }
    if (sms.countDown > 0) {
      return false
    }

    // let params = {
    //   phone: this.formData.phone
    // }
    // let encrypt = baizeCoder(params)

    // let res = await verificationCode(encrypt)

    sms.countDown = 60
    sms.message = `剩余${sms.countDown}秒`
    sms.intervalId = setInterval(() => {
      --sms.countDown
      sms.message =
				sms.countDown === 0
				  ? '发送验证码'
				  : `剩余${sms.countDown}秒`
      if (sms.countDown === 0) {
        clearInterval(sms.intervalId)
      }
      this.setData({
        sms
      })
    }, 1000)
  },
  async handleLogin() {
    try {
      const { formData } = this.data
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(formData.phone) || !formData.phone) {
        util.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      if (!formData.password) {
        util.showToast({
          title: '请输入登录密码',
          icon: 'none'
        })
        return
      }
      const loginKey = await util.request(api.genLoginKey, {
        phoneNum: formData.phone
      }, 'post')
      const PublicKey = await util.request(api.getPublicKey, {}, 'post')

      const cryptFirst = new Encrypt.JSEncrypt()
      cryptFirst.setPublicKey(PublicKey.data.data.publicKey)
      const password = cryptFirst.encrypt(formData.password) // 对内容进行加密

      const params = {
        deviceSN: '4452F60A-36D0-4908-9667-E881BE3C7842',
        loginId: loginKey.data.data.loginId,
        loginKey: loginKey.data.data.loginKey,
        password: password
      }
      util.showLoading({
        title: '登陆中～'
      })
      const { data } = await util.request(api.login, params, 'post')
      util.hideLoading
      if (data.code !== 0) {
        util.showToast({
          title: data.msg,
          icon: 'none',
          duration: 3000
        })
      }
      wx.switchTab({
        url: '/pages/index/index'
      })
      util.setUserInfo(data.data)
      app.getConnectParams()
      app.getGlobalConfig()
    } catch (error) {
      throw new Error(error)
    }
  },
  handleShowPassword() {
    this.setData({
      isShowPassword: !this.data.isShowPassword
    })
  }
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  //   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '授权微信信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res, 35)
  //       this.setData({
  //         userInfo: res
  //       }, () => {
  //         this.checkLoginFunc()
  //       })
  //       console.log(this.data.userInfo, 65)
  //       // 获取信息成功后
  //     }
  //   })
  // },
  // wxLogin: function(e) {
  //   console.log('wxLogin')
  //   console.log(e.detail)
  //   if (e.detail.userInfo == undefined) {
  //     app.globalData.hasLogin = false
  //     util.showToast({ title: '登录失败' })
  //     return
  //   }
  //   this.setData({
  //     userInfo: e.detail
  //   }, () => {
  //     this.checkLoginFunc()
  //   })
  //   console.log(this.data.userInfo, 65)
  // },
  // checkLoginFunc() {
  //   util.checkLogin().then(() => {
  //     this.startRegister(util.getUserInfo())
  //   }).catch(() => {
  //     util.loginByWeixin().then(res => {
  //       if (res.data.code == 0 && res.data.data.loginStatus == 1) {
  //         this.startRegister(util.getUserInfo())
  //       } else {
  //         util.showToast({ title: '登录成功' })
  //         app.globalData.hasLogin = true
  //         this.getUserInfo()
  //         wx.navigateBack({
  //           delta: 1
  //         })
  //       }
  //     }).catch((err) => {
  //       console.log(err, '============')
  //       app.globalData.hasLogin = false
  //       util.showToast({ title: '登录失败' })
  //     })

  //   })
  // },
  // startRegister: function(userInfo) {
  //   // 允许授权获取用户信息
  //   this.data.userInfo.openId = userInfo.openId
  //   this.data.userInfo.unionId = userInfo.unionId
  //   this.requestRegister(this.data.userInfo)
  // },
  // requestRegister: function(params) {
  //   console.log(params, 93)
  //   const that = this
  //   util.registerUser(params).then(res => {
  //     if (res.data.code == 0) {
  //       util.showToast({ title: '登录成功' })
  //       wx.navigateBack({
  //         delta: 1
  //       })
  //     } else {
  //       util.showModal({
  //         title: '错误信息',
  //         content: res.msg,
  //         showCancel: false
  //       })
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //     app.globalData.hasLogin = false
  //     util.showToast({ title: '登录失败' })
  //   })
  // },
  // accountLogin: function() {
  //   wx.navigateTo({
  //     url: '/pages/auth/register/register'
  //   })
  // },
  // getUserInfo() {
  //   util.request(api.userInfo).then(res => {
  //     if (res.data.code == 0) {
  //       console.log(126, res.data.data)
  //       const result = res.data.data
  // 	    util.setUserInfo(res.data.data)
  //       wx.setStorageSync('baseInfo', res.data.data)
  //       console.log('login.js -> getUserInfo', res.data.data)
  //     } else {
  //       util.showToast({ title: res.msg })
  //     }
  //   }).catch((err) => {
  //     console.log(err)
  //   })
  // }
})
