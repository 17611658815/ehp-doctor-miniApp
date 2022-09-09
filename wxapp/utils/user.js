/**
 * 用户相关服务
 */
const api = require('../config/api.js')
const MAX_LOGIN_NUM = 10
module.exports = {
  getUserInfo() {
    return wx.getStorageSync('userInfo')
  },
  setUserInfo(userInfo) {
    const app = getApp()
    app.globalData.userInfo = userInfo
    return wx.setStorageSync('userInfo', userInfo)
  },
  /**
	 * Promise封装wx.login
	 */
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  },

  /**
	 * 调用微信登录
	 */
  loginByWeixin() {
    const that = this
    const util = require('./util.js')
    return new Promise((resolve, reject) => {
      const app = getApp()
      app.globalData.loginNum++
      if (app.globalData.loginNum >= MAX_LOGIN_NUM) {
        reject('登录异常')
      } else {
        that.login().then((res) => {
          console.log(util, res, 'res')
          //登录远程服务器
          util._request(api.AuthLoginByWeixin + res.code, {}, 'get', 1, resolve, reject)
        }).catch((err) => {
          console.log('出错了')
          reject(err)
        })
      }
    })
  },
  /**
	 * 调用注册
	 */
  registerUser(userInfo) {
    const that = this
    const util = require('./util.js')
    return new Promise((resolve, reject) => {
      //登录远程服务器
      util.request(api.AuthRegister, userInfo, 'POST', 1, false).then(res => {
        if (res.data.code === 0) {
          //存储用户信息
          that.setUserInfo(res.data.data)
          wx.setStorageSync('tokenKey', res.data.data.tokenKey)
          wx.setStorageSync('token', res.data.data.token)
          that.loginSuccess()
          resolve(res)
        } else {
          reject(res)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
	 * Promise封装wx.checkSession
	 */
  checkSession() {
    return new Promise(function(resolve, reject) {
      wx.checkSession({
        success: function() {
          resolve(true)
        },
        fail: function() {
          reject(false)
        }
      })
    })
  },
  /**
	 * 判断用户是否登录
	 */
  checkLogin() {
    const that = this
    return new Promise(function(resolve, reject) {
      if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
        that.checkSession().then(() => {
          resolve(true)
        }).catch(() => {
          reject(false)
        })
      } else {
        reject(false)
      }
    })
  },
  loginSuccess() {
    const util = require('./util.js')
    const app = getApp()
    console.log(util, 121)
    app.globalData.hasLogin = true
    app.getConnectParams()
    // 请求模板ID
    util.getTemplate(1)
  }
}
