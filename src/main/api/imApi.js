import BASEURL from './baseURL'
import axios from './axios'

// 根据关键字搜索用户
export function searchUser (data) {
  let url = BASEURL.path + '/api/v1/user/search'
  return axios.post(url, data)
}
// 获取新的好友列表
export function getNewFriendsList (data) {
  let url = BASEURL.path + '/api/v1/user/system/message/list'
  return axios.post(url, data)
}
// 获取好友列表
export function getFriendsList (data) {
  let url = BASEURL.path + '/api/v1/user/friend/list'
  return axios.post(url, data)
}
// 获取会话列表
export function getChatList (data) {
  let url = BASEURL.path + '/api/v1/user/recently/contact'
  return axios.post(url, data)
}
// 修改好友备注名
export function updateFriendRemark (data) {
  let url = BASEURL.path + '/api/v1/user/friend/remark/update'
  return axios.post(url, data)
}
// 获取聊天记录
export function getChatRecords (data) {
  let url = BASEURL.path + '/api/v1/user/message/list'
  return axios.post(url, data)
}
// 获取用户详情
export function getUserDetail (data) {
  let url = BASEURL.path + '/api/v1/user/public/info'
  return axios.post(url, data)
}
// 获取系统emoji表情
export function getSysEmojis () {
  let url = BASEURL.path + '/api/v1/config'
  return axios.post(url)
}
