// 以下是业务服务器API地址
// 本机开发时使用
import { WxApiRoot, ImgUrl, WebViewUrl } from './api-dev'
module.exports = {
  mqttuser: 'miniappuser',
  mqttpass: '201MoCf3Jf3es8123asF2+s',
  webRoot: WxApiRoot,
  ImgUrl: ImgUrl,
  WebViewUrl: WebViewUrl,
  genLoginKey: WxApiRoot + 'ad/login/genLoginKey', //post 获取loginkey
  getPublicKey: WxApiRoot + 'ad/login/getPublicKey', //post 获取加密公钥
  globalConfig: WxApiRoot + 'ad/doctorInfo/globalConfig', //post 全局配置
  login: WxApiRoot + 'ad/login', //post 登陆
  getMyPatient: WxApiRoot + 'ad/patient/my', //post 我的患者
  getBaseInfo: WxApiRoot + 'ad/index/baseInfo', //post 首页基本信息
  getConnectParams: WxApiRoot + 'im/connect/params', //get 获取连接配置
  getInquirerDetail: WxApiRoot + 'ad/patient/inquirer/detail', //post 就诊人信息
  getPatientRemark: WxApiRoot + 'ad/patient/detail/remark', // post 患者信息
  sessionList: WxApiRoot + 'im/session/list', //post 问诊倒计时
  getStatus: WxApiRoot + 'im/session/status', // get 获取系统时间
  chatHistory: WxApiRoot + 'im/session/details', // post 图文问诊记录
  sendMessage: WxApiRoot + 'im/chat/sendMessage', // post 发送消息
  uplodeFile: WxApiRoot + 'im/chat/media/upload', // post 上传资源
  illnessDetail: WxApiRoot + 'emr/patient/disease/detail', //post 病情详情
	uploadImg: WxApiRoot + 'emr/patient/disease/img/upload', //post 上传图片

}
