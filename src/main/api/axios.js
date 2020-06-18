/* eslint-disable handle-callback-err */
// import Vue from 'vue'
// import {  session } from 'electron'
import axios from 'axios'
import { DB, Storage } from '../db/dbStore'
import store from '../../renderer/store'
import util from '../../renderer/utils/util'
const { session, ipcMain } = require('electron')
const service = axios.create({
  timeout: 6000 // 请求超时时间
})
let token

// 还需要加token过期的判断
service.interceptors.request.use(config => {
  if (global.LOGINTOKEN) {
    token = global.LOGINTOKEN
  }
  console.log('axios token: ', token)
  if (global.windowObject && global.windowObject.trayWindow) {
    global.windowObject.trayWindow.send('get-token', token)
  }

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})
// 还需要加token过期的判断
service.interceptors.response.use(response => {
  let code = response.data.code
  if (code === 11001) {
    token = ''
    if (
      global.windowObject &&
      global.windowObject.trayWindow &&
      global.windowObject.roomWindow &&
      global.windowObject.mainWindow
    ) {
      // global.windowObject.mainWindow.send('token-expired')
      // global.windowObject.roomWindow.send('token-expired')
      // global.windowObject.trayWindow.send('token-expired')
    }
  }
  return response
})

export default service
