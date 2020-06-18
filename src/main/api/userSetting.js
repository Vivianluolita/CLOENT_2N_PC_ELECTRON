import BASEURL from './baseURL'
import axios from './axios'

export function userInfo () {
  // 用户信息
  let url = BASEURL.path + '/api/v1/user/info'
  return axios.post(url)
}

export function getCode (data) {
  // 验证码
  let url = BASEURL.path + '/api/v1/sms/send'
  return axios.post(url, data)
}

export function getCode2 (data) {
  // 验证码 更换手机号
  let url = BASEURL.path + '/api/v1/sms/send'
  return axios.post(url, data)
}

export function chackoutMobile (data) {
  // 校验手机号
  let url = BASEURL.path + '/api/v1/passport/mobile/check'
  return axios.post(url, data)
}

export function newPassword (data) {
  // 重设密码
  let url = BASEURL.path + '/api/v1/passport/password/reset'
  return axios.post(url, data)
}

export function getAddresslist () {
  // 获取地区列表
  let url = BASEURL.path + '/api/v1/util/area'
  return axios.get(url)
}

export function updataUesrInfo (data) {
  // 设置用户信息
  let url = BASEURL.path + '/api/v1/user/info/update'
  return axios.post(url, data)
}

export function changPhone (data) {
  // 更改绑定手机号
  let url = BASEURL.path + '/api/v1/passport/mobile/change'
  return axios.post(url, data)
}

export function othersInfo (data) {
  // 获取其他用户信息
  let url = BASEURL.path + '/api/v1/user/public/info'
  return axios.post(url, data)
}

export function uploadImage (data) {
  //   上传图片
  let url = BASEURL.imgPath + '/upload/image'
  return axios.post(url, data)
}

export function bindLeiGod (data) {
  //   绑定雷神账号
  let url = BASEURL.imgPath + '/api/v1/passport/leigod/bind'
  return axios.post(url, data)
}

export function removeLeiGod (data) {
  //   解绑雷神账号
  let url = BASEURL.imgPath + '/api/v1/passport/oauth/unbind'
  return axios.post(url, data)
}

export function checkPhoneHave (data) {
  //   检测手机号注册
  let url = BASEURL.imgPath + '/api/v1/passport/mobile/register/check'
  return axios.post(url, data)
}

export function checkNameHave (data) {
  //   检测昵称是否存在
  let url = BASEURL.imgPath + '/api/v1/passport/nickname/exist'
  return axios.post(url, data)
}
