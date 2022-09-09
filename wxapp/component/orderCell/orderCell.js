// component/orderCell/orderCell.js
const api = require('../../config/api.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    static: {
      nomes: api.ImgUrl + 'images/nomes.png'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('check', item)
    },
    onPay(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('pay', item)
    },
    onCancel(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('cancel', item)
    },
    onlook(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('look', item)
    }
  }
})
