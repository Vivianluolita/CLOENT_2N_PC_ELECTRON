import BASEURL from './baseURL'
import axios from './axios'

export function getExtendInfo () {
  // 获取用户扩展配置
  let url = BASEURL.path + '/api/v1/user/extend/info'
  return axios.post(url)
}

export function updataExtendInfo (data) {
  // 更新用户扩展配置
  let url = BASEURL.path + '/api/v1/user/extend/update'
  return axios.post(url, data)
}
