// component/medicalHistory/medicalHistory.js
var api = require('../../config/api.js')
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否是详情页面
    isDetail: {
      type: Boolean,
      value: true
    },
    // 过敏史
    allergy: {
      type: Object,
      value: {}
    },
    // 既往史
    always: {
      type: Object,
      value: {}
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    allergy: '',
    always: '',
    showPicker: false,
    imgObject: {
      close: api.ImgUrl + 'images/ic_close_01.png'
    },
    ywgm: ['青霉素过敏', '磺胺过敏', '泛影葡胺过敏', '地卡因过敏', '链霉素过敏'],
    jwjb: ['高血压', '糖尿病', '冠心病', '脑血管病', '肾病', '慢性肝炎', '吸烟', '酗酒', '未初潮', '已绝经', '花粉过敏', '霉菌过敏'],
    textValue: '',
    type: null //1.过敏史 2.既往史
  },
  ready: function() {
    this.setData({
      allergy: this.properties.allergy,
      always: this.properties.always
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 单选按钮选择
    radioChange(e) {
      var type = e.currentTarget.dataset.type
      var flag = e.detail.value == 1 ? false : true
      var model = type == 1 ? 'allergy.checked' : 'always.checked'
      this.setData({
        type: type,
        showPicker: flag,
        [model]: flag,
        textValue: type == 1 ? this.data.allergy.content : this.data.always.content
      })
      var data = {
        allergy: this.data.allergy,
        always: this.data.always
      }
      this.triggerEvent('propContent', { data }, {})
    },
    // 内容简介点击
    addcontent(e) {
      var type = e.currentTarget.dataset.id
      this.setData({
        showPicker: true,
        type: type,
        textValue: type == 1 ? this.data.allergy.content : this.data.always.content
      })
    },
    // 关闭方法
    close() {
    //  var data = this.data.type=='1'?'allergy.content':'always.content'
      this.setData({
        showPicker: false
      })
      if (this.data.allergy.content == '') {
        this.setData({
          ['allergy.checked']: false
        })
      }
      if (this.data.always.content == '') {
        this.setData({
          ['always.checked']: false
        })
      }
      var data = {
        allergy: this.data.allergy,
        always: this.data.always
      }
      this.triggerEvent('propContent', { data }, {})
    },
    textContFun(e) {
      if (e.detail.keyCode === 10 && e.detail.value.length === 1) {
        this.setData({
          textValue: '',
          [model]: ''
        })
        return false
      }
      var model = this.data.type == 1 ? 'allergy.content' : 'always.content'
      console.log(util.filterEmoji(e.detail.value), 110)
      this.setData({
        textValue: util.filterEmoji(e.detail.value) ? util.filterEmoji(e.detail.value) : '',
        [model]: util.filterEmoji(e.detail.value)
      })
    },
    clearValue() {
      this.setData({
        textValue: ''
      })
    },
    confirFun(e) {
      var content = this.data.textValue
      var model = this.data.type == 1 ? 'allergy.content' : 'always.content'
      var modelCheck = this.data.type == 1 ? 'allergy.checked' : 'always.checked'
      if (!content) {
        if (this.data.type == 1) {
          this.setData({
            'allergy.checked': false
          })
          wx.showToast({
            title: '请输入您的过敏史~',
            icon: 'none'
          })
        } else {
          this.setData({
            'always.checked': false
          })
          wx.showToast({
            title: '请输入您的既往史~',
            icon: 'none'
          })
        }
        // return false
      } else {
        this.setData({
          [model]: content,
          [modelCheck]: true,
          showPicker: false
        })
        var data = {
          allergy: this.data.allergy,
          always: this.data.always
        }
        console.log(data, 148)
        this.triggerEvent('propContent', { data }, {})
      }

    },
    tagChoose(e) {
      var value = e.currentTarget.dataset.value
      var textValue = this.data.textValue
      if (textValue.length + value.length < 1000) {
        this.setData({
          textValue: textValue == '' ? value : textValue + ',' + value
        })
      } else {
        util.showToast({ title: '最多输入1000字' })
      }

    }
  }
})
