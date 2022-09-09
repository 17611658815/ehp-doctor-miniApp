module.exports = {
  // 字符串打码
  stringHidden(str, frontLen, endLen) {
    if (str === '' || str === null || str === 'null') {
      return ''
    }
    var len = str.length - frontLen - endLen
    var xing = ''
    for (var i = 0; i < len; i++) {
      xing += '*'
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
  },
  //根据身份证号识别出生日期 性别 年龄
  IdCard(UUserCard, num) {
    if (num == 1) {
      //获取出生日期
      var birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14)
      return birth
    }
    if (num == 2) {
      //获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        //男
        return 1
      } else {
        //女
        return 0
      }
    }
    if (num == 3) {
      //获取年龄
      var myDate = new Date()
      var month = myDate.getMonth() + 1
      var day = myDate.getDate()
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++
      }
      return age
    }
  },
  rpxTopx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth
  }
}
