
/**
 * index
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    call() {
      wx.makePhoneCall({
        phoneNumber: '010-56831840'
      })
    },
    showHisToast() {
      this.setData({
        show: true
      })
    },
    hideHisToast() {
      this.setData({
        show: false
      })
    }
  }
})

