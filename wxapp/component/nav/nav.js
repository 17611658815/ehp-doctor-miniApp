const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    isWhite: { //默认不是白色自定义返回
      type: Boolean,
      value: false
    },
    backgroundColor: {
      type: String,
      value: 'rgba(0,0,0,0)'
    },
    titleColor: {
      type: String,
      value: 'rgba(0,0,0,1)'
    },
    borderColor: {
      type: String,
      value: 'rgba(0,0,0,1)'
    },
    navTitle: {
      type: String,
      value: ''
    },
    seat: {
      type: Boolean,
      value: true
    },
    isBack: {
      type: Boolean,
      value: true
    },
    home: {
      type: Boolean,
      value: false
    },
    pageNum: {
      type: Number,
      value: 1
    }
  },
  data: {
    capsule: {}
  },
  ready() {
    const {
      statusBarHeight,
      navBarHeight
    } = app.globalData

    this.setData({
      statusBarHeight,
      navBarHeight,
      left: app.globalData.windowWidth - app.globalData.capsule.right, //胶囊据右边距离
      capsule: app.globalData.capsule
    })
    console.log(this.data.capsule, 51)
  },
  methods: {
    back(e) {
      const page = getCurrentPages()
      if (page.length === 1) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        var currentPage = page[page.length - 1]
        var prevPage = page[page.length - 2]
        // 如果从聊天页面跳转 评价，病情详情，电子病历详情，处方详情；返回聊天页面 数据不做刷新 停留在当前滚动位置
        if (['pages/addEval/addEval', 'pages/illnessDetail/illnessDetail', 'pages/recipeDetail/recipeDetail', 'pages/caseDetail/index', 'pages/from/fromList/index', 'pages/follow/schedule/index', 'pages/follow/detail/index'].includes(currentPage.route)) {
          //  prevPage.data.newMessage 新消息标记 如果有新的消息 chat页面onshow更新数据；没有不做更新
          prevPage.data.isFirst = prevPage.data.newMessage ? false : true
        }
        wx.navigateBack({
          delta: e.currentTarget.dataset.num
        })
      }

    },
    toIndex() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
