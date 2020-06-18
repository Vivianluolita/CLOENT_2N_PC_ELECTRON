// import axios from 'axios'
import BASEURL from './baseURL'
import axios from './axios'

export function initGt () {
  // 级验证接口
  let url = BASEURL.path + '/api/v1/gt/preprocess?t=' + new Date().getTime()
  return axios.get(url)
}
export function codeSend (data) {
  // 获取验证码接口
  let url = BASEURL.path + '/api/v1/sms/send'
  return axios.post(url, data)
}
export function loginRegister (data) {
  let url = BASEURL.path + '/api/v1/passport/register'
  return axios.post(url, data)
}
export function accountLogin (data) {
  // 登录接口
  let url = BASEURL.path + '/api/v1/passport/account/login'
  return axios.post(url, data)
}
export function autoAccountLogin (data) {
  // 登录接口
  let url = BASEURL.path + '/api/v1/passport/account/login'
  return axios.post(url, data)
}
export function leigodLogin (data) {
  // 雷神登录接口
  let url = BASEURL.path + '/api/v1/passport/leigod/login'
  return axios.post(url, data)
}
export function checkPhoneIsBind (data) {
  // 绑定手机号是否注册接口
  let url = BASEURL.path + '/api/v1/passport/mobile/register/check'
  return axios.post(url, data)
}
export function bindPhoneLogin (data) {
  // 绑定手机登录接口
  let url = BASEURL.path + '/api/v1/passport/oauth/mobile/bind'
  return axios.post(url, data)
}
export function findPasswordLogin (data) {
  // 绑定手机登录接口
  let url = BASEURL.path + '/api/v1/passport/password/reset'
  return axios.post(url, data)
}
export function userInfoLogin () {
  // 用户信息
  let url = BASEURL.path + '/api/v1/user/info'
  return axios.post(url)
}
export function autoUserInfoLogin () {
  // 用户信息
  let url = BASEURL.path + '/api/v1/user/info'
  return axios.post(url)
}
export function advertiseLogin () {
  // 广告位
  let url = BASEURL.path + '/api/v1/advertising'
  return axios.post(url)
}
export function guestLogin (data) {
  // 游客登录
  let url = BASEURL.path + '/api/v1/passport/guest/login'
  return axios.post(url, data)
}
