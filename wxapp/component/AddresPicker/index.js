
const util = require('../../utils/util')
const api = require('../../config/api')
/**
 * index
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // label文案
    label: {
      type: String,
      value: ''
    },
    // 内容对齐方式
    inputAlign: {
      type: String,
      value: 'left'
    },
    placeholder: {
      type: String,
      value: '请选择所在省份、城市、区县'
    },
    // 展示内容
    areaValue: {
      type: String,
      value: '',
      observer: function(val) {
        // 监听解决异步数据传参问题
        this.data.areaValue = val || ''
      }
    }
  },
  lifetimes: {
    attached: function() {
      this.getCityList()
    },
    detached: function() {
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    areaValue: '',
    areaId: '',
    // 选择地址
    rangeIndex: [0, 0, 0], //省市区选中值
    rangeId: [0, 0, 0], //省市区选中值
    rangeData: [], //省市区数据
    columns: [{
      values: '',
      className: 'column1'
    },
    {
      values: '',
      className: 'column2',
      defaultIndex: 0
    },
    {
      values: '',
      className: 'column3',
      defaultIndex: 0
    }
    ],
    showAddresPicker: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showAddresPicker(e) {
      wx.hideKeyboard()
      this.setData({
        showAddresPicker: !this.data.showAddresPicker
      })
    },
    // 选择城市
    bindPickerChange(event) {
      const {
        value
      } = event.detail
      const rangeIndex = this.data.rangeIndex,
        columns = this.data.columns,
        rangeData = this.data.rangeData
      if (event.detail.index === 0) {
        rangeIndex[0] = this.data.rangeData.findIndex(i => i.id == value[0].id)
        columns[1].values = Object.values(rangeData[rangeIndex[0]].childs).map(function(e) {
          return {
            text: e.name,
            id: e.id,
            parentId: e.parentId
          }
        })
        columns[2].values = Object.values(rangeData[rangeIndex[0]].childs[0].childs).map(function(e) {
          return {
            text: e.name,
            id: e.id,
            parentId: e.parentId
          }
        })
        this.setData({
          [`columns[1]`]: columns[1],
          [`columns[2]`]: columns[2],
          rangeIndex
        })
      } else if (event.detail.index === 1) {
        rangeIndex[1] = rangeData[rangeIndex[0]].childs.findIndex(i => i.id == value[1].id)
        columns[2].values = Object.values(rangeData[rangeIndex[0]].childs[rangeIndex[1]].childs).map(function(e) {
          return {
            text: e.name,
            id: e.id,
            parentId: e.parentId
          }
        })
        this.setData({
          rangeIndex,
          [`columns[2]`]: columns[2]
        })
      } else if (event.detail.index === 2) {
        rangeIndex[2] = rangeData[rangeIndex[0]].childs[rangeIndex[1]].childs.findIndex(i => i.id == value[2].id)
        this.setData({
          rangeIndex,
          columns,
          [`rangeId[2]`]: rangeData[rangeIndex[0]].childs[rangeIndex[1]].childs[rangeIndex[2]].id
        })
      }
    },
    bindPickerConfim(event) {
      this.setData({
        showAddresPicker: false,
        areaId: [event.detail.value[0].id, event.detail.value[1].id, event.detail.value[2].id],
        areaValue: `${event.detail.value[0].text}-${event.detail.value[1].text}-${event.detail.value[2].text}`
      })
      this.triggerEvent('onPickerConfim', {
        areaValue: this.data.areaValue,
        areaId: this.data.areaId
      })
      console.log(this.data.areaId, this.data.areaValue, 'triggerEvent')
    },
    bindPickerCancel() {
      this.setData({
        showAddresPicker: false
      })
    },
    // 获取城市列表
    getCityList() {
      util.request(api.getCitys)
        .then(res => {
          if (res.data.code === 0) {
            const columns = res.data.data
            this.data.columns[0].values = Object.values(columns).map(function(e) {
              return {
                text: e.name,
                id: e.id,
                parentId: e.parentId
              }
            })
            this.data.columns[1].values = Object.values(columns[0].childs).map(function(e) {
              return {
                text: e.name,
                id: e.id,
                parentId: e.parentId
              }
            })
            this.data.columns[2].values = Object.values(columns[0].childs[0].childs).map(function(e) {
              return {
                text: e.name,
                id: e.id,
                parentId: e.parentId
              }
            })
            this.setData({
              rangeData: res.data.data,
              columns: this.data.columns
            })
          }
        })
    }
  }
})

