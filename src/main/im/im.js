import { ipcMain, ipc, BrowserWindow } from 'electron'
import axios from 'axios'
// 实现IM相关的业务逻辑
import {
  searchUser,
  getNewFriendsList,
  getFriendsList,
  getChatList,
  updateFriendRemark,
  getUserDetail,
  getSysEmojis
} from '../api/imApi'

export default mainWindow => {
  // 搜索用户
  ipcMain.on('user-search', (event, params, cb) => {
    searchUser(params)
      .then(res => {
        mainWindow.send('on-user-search', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-user-search', err, cb)
      })
  })
  // 拉取新朋友列表
  ipcMain.on('im-new-friends-list', (event, params, cb) => {
    getNewFriendsList(params)
      .then(res => {
        mainWindow.send('on-new-friends-list', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-new-friends-list', err, cb)
      })
  })
  // 朋友列表
  ipcMain.on('im-friends-list', (event, params, cb) => {
    getFriendsList(params)
      .then(res => {
        mainWindow.send('on-friends-list', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-friends-list', err, cb)
      })
  })
  // 会话列表
  ipcMain.on('im-chat-list', (event, params, cb) => {
    getChatList(params)
      .then(res => {
        mainWindow.send('on-chat-list', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-chat-list', err, cb)
      })
  })
  // 修改好友备注
  ipcMain.on('im-update-friend-remark', (event, params, cb) => {
    updateFriendRemark(params)
      .then(res => {
        mainWindow.send('on-update-friend-remark', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-update-friend-remark', err, cb)
      })
  })
  // 获取用户详情
  ipcMain.on('user-detail', (event, params, cb) => {
    getUserDetail(params)
      .then(res => {
        mainWindow.send('on-get-user-detail', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-get-user-detail', err, cb)
      })
  })
  // 获取系统emoji表情
  ipcMain.on('get-sys-emojis', (event, params, cb) => {
    let windowId = params.id
    getSysEmojis()
      .then(res => {
        let currentWindow = getChatWindowById(windowId)
        if (currentWindow) {
          currentWindow.send('on-get-sys-emojis', res, cb)
        } else {
          console.log('未找到对应的聊天窗口')
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('on-get-sys-emojis', err, cb)
      })
  })
  // 公用方法
  let getChatWindowById = function (id) {
    let currentWindow
    global.windowObject.imWindows.forEach(item => {
      if (item.id === id) {
        currentWindow = item.window
      }
    })
    return currentWindow
  }
}
