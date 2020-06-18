// import axios from 'axios'
import BASEURL from './baseURL'
import axios from './axios'
// 注册用户

export function categoryList () {
  // 获取分类列表
  let url = BASEURL.path + '/api/v1/category/list'
  return axios.post(url)
}
export function getConfig () {
  // 获取分类列表
  let url = BASEURL.path + '/api/v1/config'
  return axios.post(url)
}

export function addChannel (data) {
  // 新建频道
  let url = BASEURL.path + '/api/v1/channel/add'
  return axios.post(url, data)
}

export function channelInfo (data) {
  // 获取频道列表
  let url = BASEURL.path + '/api/v1/channel/list'
  return axios.post(url, data)
}

export function createChannelNun () {
  // 获取可以创建频道个数
  let url = BASEURL.path + '/api/v1/user/channel/create/info'
  return axios.post(url)
}
export function getMyCollection (data) {
  // 获取我的收藏左侧下拉列表
  let url = BASEURL.path + '/api/v1/user/channel/hall_collect'
  return axios.post(url, data)
}
export function getMyCollectionList (data) {
  // 获取我的收藏右侧列表
  let url = BASEURL.path + '/api/v1/user/channel/collect/list'
  return axios.post(url, data)
}
export function getMyChannel (data) {
  // 获取我的频道
  let url = BASEURL.path + '/api/v1/user/channel/hall_channel'
  return axios.post(url, data)
}
export function getBannerList (data) {
  // 获取可以创建频道个数
  let url = BASEURL.path + '/api/v1/banner/list'
  return axios.post(url, data)
}
export function searchInfo (data) {
  // 首页搜索功能
  let url = BASEURL.path + '/api/v1/channel/search'
  return axios.post(url, data)
}
export function collectChannel (data) {
  // 首页收藏功能
  let url = BASEURL.path + '/api/v1/user/channel/collect_cancel'
  return axios.post(url, data)
}
// /api/v1/user/my_channel
export function myChannel (data) {
  // 我创建的频道
  let url = BASEURL.path + '/api/v1/user/my_channel'
  return axios.post(url, data)
}
export function manageChannel (data) {
  // 我管理的频道
  let url = BASEURL.path + '/api/v1/user/manage_channel'
  return axios.post(url, data)
}
export function disbandChannel (data) {
  // 解散频道
  let url = BASEURL.path + '/api/v1/channel/dismiss'
  return axios.post(url, data)
}
export function getChannelInfo (data) {
  // 获取频道信息
  let url = BASEURL.path + '/api/v1/channel/info'
  return axios.post(url, data)
}
export function updateChannelInfo (data) {
  // 更新频道
  let url = BASEURL.path + '/api/v1/channel/info/update'
  return axios.post(url, data)
}
export function getFootprint (data) {
  // 获取足迹列表
  let url = BASEURL.path + '/api/v1/user/channel/my_footprint'
  return axios.post(url, data)
}
