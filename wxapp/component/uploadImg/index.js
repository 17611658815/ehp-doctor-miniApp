// component/uploadImg/index.js
var api = require('../../config/api.js')
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList: Array,
    size: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    ic_upload_add: api.ImgUrl + 'images/ic_upload_add.png',
    ic_upload_delect: api.ImgUrl + 'images/ic_upload_delect.png',
    imgList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgUpload() {
      const size = this.properties.size
      var that = this
      var count = parseInt(that.data.imgList.length)
      if (count >= size) {
        util.showToast({
          title: `最多上传${size}张`,
          duration: 1500
        })
        return false
      }
      wx.chooseImage({
        count: size - count,
        sizeType: ['compressed'],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          var i = 0 //第几个
          var length = res.tempFilePaths.length //总共个数
          var successUp = 0 //成功个数
          var failUp = 0 //失败个数
          that.uploadImg(tempFilePaths, successUp, failUp, i, length, size)
        }
      })
    },
    uploadImg: function(tempFilePaths, successUp, failUp, i, length, size) {
      if (this.data.imgList.length >= size) {
        return false
      }
      var that = this
      var token = wx.getStorageSync('token')
      const sysInfo = wx.getSystemInfoSync()
      util.showLoading({
        title: '上传中~',
        mask: true
      })
      wx.uploadFile({
        url: api.uploadImg,
        filePath: tempFilePaths[i],
        name: 'files',
        header: {
          'content-type': 'multipart/form-data',
          'Authorization': token,
          '_m': sysInfo.model,
          '_o': 0,
          '_w': 1
        },
        success: function(res) {
          util.hideLoading()
          var res = JSON.parse(res.data)
          var srcArr = that.data.imgList
          srcArr.push(res.data[0])
          that.setData({
            imgList: srcArr
          })
          that.triggerEvent('onImgUpload', { srcArr })
        },
        complete: () => {
          i++
          if (i == length) {
            return
          } else {
            if (!that.data.isuploaderror) {
              this.uploadImg(tempFilePaths, successUp, failUp, i, length, size)
            }
          }
        }
      })
    },
    // 删除
    remImg: function(e) {
      var that = this
      var Index = e.currentTarget.dataset.id
      that.data.imgList.splice(Index, 1)
      that.setData({
        imgList: that.data.imgList
      })
      var srcArr = that.data.imgList
      that.triggerEvent('imgArry', { srcArr })
    },
    // 图片预览
    previewImg: function(e) {
      const index = e.currentTarget.dataset.index
      const imgList = this.data.imgList
      wx.previewImage({
        current: imgList[index], //当前图片地址
        urls: imgList, //所有要预览的图片的地址集合 数组形式
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {}
      })
    }
  }
})
