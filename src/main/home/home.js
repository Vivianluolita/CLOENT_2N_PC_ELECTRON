import { ipcMain, ipc, BrowserWindow } from 'electron'
import axios from 'axios'
// 实现大厅相关的业务逻辑
import {
  categoryList,
  getConfig,
  addChannel,
  channelInfo,
  createChannelNun,
  getMyCollection,
  getMyCollectionList,
  getBannerList,
  searchInfo,
  collectChannel,
  getMyChannel,
  myChannel,
  manageChannel,
  disbandChannel,
  getChannelInfo,
  updateChannelInfo,
  getFootprint
} from '../api/home'

export default mainWindow => {
  // 获取分类列表
  ipcMain.on('category-list', (event, params) => {
    categoryList()
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('category-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('category-list-res', err)
      })
  })
  // 获取全局信息
  ipcMain.on('get-config', (event, params) => {
    getConfig()
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-config-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-config-res', err)
      })
  })
  // 新建频道
  ipcMain.on('add-channel', (event, params) => {
    addChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('add-channel-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('add-channel-res', err)
      })
  })
  // 获取频道列表
  ipcMain.on('channel-info', (event, params) => {
    channelInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('channel-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('channel-info-res', err)
      })
  })
  // 获取可以创建频道个数
  ipcMain.on('create-channel-num', (event, params) => {
    createChannelNun()
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('create-channel-num-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('create-channel-num-res', err)
      })
  })
  // 获取banner位
  ipcMain.on('banner-list', (event, params) => {
    getBannerList(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('banner-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('banner-list-res', err)
      })
  })
  // 首页搜索
  ipcMain.on('search-info', (event, params) => {
    searchInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('search-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('search-info-res', err)
      })
  })
  // 收藏
  ipcMain.on('collect-channel', (event, params, channelNo) => {
    collectChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('collect-channel-res', res, channelNo)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('collect-channel-res', err, channelNo)
      })
  })
  // 获取我的收藏左侧下拉框
  ipcMain.on('get-my-collect', (event, params) => {
    getMyCollection(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-my-collect-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-my-collect-res', err)
      })
  })
  // 获取我的收藏右侧列表
  ipcMain.on('get-my-collect-list', (event, params) => {
    getMyCollectionList(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-my-collect-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-my-collect-list-res', err)
      })
  })
  // 获取我的频道左侧下拉框
  ipcMain.on('get-my-channel', (event, params) => {
    getMyChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-my-channel-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-my-channel-res', err)
      })
  })
  // 获取我创建的频道右侧列表
  ipcMain.on('my-channel-list', (event, params) => {
    myChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('my-channel-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('my-channel-list-res', err)
      })
  })
  // 获取我管理的频道右侧列表
  ipcMain.on('manage-channel-list', (event, params) => {
    manageChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('manage-channel-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('manage-channel-list-res', err)
      })
  })
  // 解散频道
  ipcMain.on('disband-channel', (event, params) => {
    disbandChannel(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('disband-channel-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('disband-channel-res', err)
      })
  })
  // 获取频道信息，用于频道修改 getchannelInfo
  ipcMain.on('get-channel-info', (event, params) => {
    getChannelInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-channel-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-channel-info-res', err)
      })
  })
  // 编辑页面获取频道信息
  ipcMain.on('get-edit-channel-info', (event, params) => {
    getChannelInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-edit-channel-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-edit-channel-info-res', err)
      })
  })
  // 查看页面获取频道信息
  ipcMain.on('get-watch-channel-info', (event, params) => {
    getChannelInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-watch-channel-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-watch-channel-info-res', err)
      })
  })
  // 更新频道
  ipcMain.on('update-channel-info', (event, params) => {
    updateChannelInfo(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('update-channel-info-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('update-channel-info-res', err)
      })
  })
  // 获取足迹列表
  ipcMain.on('get-footprint-list', (event, params) => {
    getFootprint(params)
      .then(res => {
        // mainWindow.send('init-gt-res', res.data)
        mainWindow.send('get-footprint-list-res', res)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-footprint-list-res', err)
      })
  })
}
