/* eslint-disable semi */
'use strict'

import {
  ipcMain,
  app,
  BrowserWindow,
  ipcRenderer,
  session,
  Menu
} from 'electron'
import { Registry } from 'rage-edit'
import util from '../../src/renderer/utils/util'
import { Storage } from './db/dbStore'
import store from '../renderer/store/index'
import path from 'path'
import { createTray } from './windows/tray'
import { createTrayWindow } from './windows/trayWindow'
import { createStateWindow } from './windows/stateWindow'

import os from 'os'
import { param } from 'change-case'

const electron = require('electron')

/* 开机自启动 */
const appFolder = path.dirname(process.execPath)

ipcMain.on('change_login_token', (event, data) => {
  global.LOGINTOKEN = data
})

ipcMain.on('change_user_login_type', (event, data) => {
  global.USERLOGINTYPE = data
})

ipcMain.on('changeAutoStart-open', () => {
  Registry.set(
    'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', // 注册表开机启动应用路径
    'NN', // 随意写
    app.getPath('exe'), // 当前应用路径，也是自动启动的应用路径
    'REG_SZ' // 固定的
  )
    .then(() => {
      app.setLoginItemSettings({
        openAtLogin: true,
        // path: updateExe,
        args: []
      })
    })
    .catch(() => {})
})

ipcMain.on('changeAutoStart-closed', () => {
  Registry.has('HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'NN')
    .then(res => {
      if (res) {
        Registry.delete(
          'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
          'NN'
        )
          .then(() => {
            app.setLoginItemSettings({
              openAtLogin: false,
              args: []
            })
          })
          .catch(() => {})
      }
    })
    .catch(() => {
      console.log('没有找到程序')
    })
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
let roomWindow // 频道窗口
let helpWindow // 帮助中心窗口
let serviceWindow // 在线客服窗口
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
let helpUrl = `${winURL}?#/helpCenter`
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'NN-主页',
    height: 800,
    minHeight: 800,
    useContentSize: true,
    frame: true,
    // frame: false,
    minWidth: 1100,
    width: 1300,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)
  // 第一次打开窗口
  Storage.set('first', 'first')
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 引入登录业务
  require('./login/login').default(mainWindow)

  // 引入websocket
  require('./ws/ws').default(mainWindow)

  // 引入大厅业务
  require('./home/home').default(mainWindow)

  // 引入IM业务
  require('./im/im').default(mainWindow)
  require('./userSetting/userSetting').default(mainWindow)
  require('./systemSetting/systemSetting').default(mainWindow)

  // 引入自动更新
  require('./autoupdate').default(mainWindow)

  global.windowObject = {}
  // 声明im聊天窗口数组容器 用于挂载im聊天窗口实例
  global.windowObject.imWindows = []
  // 声明im语音电话窗口容器 用于挂载im语音电话窗口实例
  global.windowObject.phoneWindow = null
  // 挂载到global上面
  global.windowObject.mainWindow = mainWindow
  // 模拟系统托盘
  global.windowObject.tray = createTray()
  // 系统托盘菜单
  global.windowObject.trayWindow = createTrayWindow()
  // 状态窗口
  global.windowObject.stateWindow = createStateWindow()
  // 帮助窗口
  global.windowObject.createHelpWindow = createHelpWindow
  // 在线客服窗口
  global.windowObject.createServiceWindow = createServiceWindow
}

// 多个窗口自动登录控制
if (app.requestSingleInstanceLock()) {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    global.isAutoLogin = false
  })
}

// 创建 mainWindow, 加载应用的其余部分, etc...
app.on('ready', () => {
  // 是否首次打开程序，可以进行自动登录的标记
  global.isAutoLogin = true
  // websocket客户端
  global.webSocketClient = null
  // 用户登录类型 0 为游客，1为普通用户
  global.USERLOGINTYPE = 0
  // 用来存储登录后的token
  global.LOGINTOKEN = ''
  // 游客登录后，保存的游客登录信息
  global.LOGININFO = {}
  createWindow()
})

app.on('window-all-closed', () => {
  // todo 所有窗口都关闭了，不一定程序全部退出了
})

app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})

ipcMain.on('guest_login_info_set', (event, params) => {
  global.LOGININFO = params
})

// 主进程订阅事件，接收渲染进程的消息
ipcMain.on('home_change_title', (event, params) => {
  mainWindow.webContents.send('change_latest', '已收到消息')
})

// 退出登录
ipcMain.on('quit-login', (event, params) => {
  global.windowObject.trayWindow.send('quit-login-success')
})
// 最大化
ipcMain.on('show-full-window', (event, params) => {
  // console.log('最大化')
  mainWindow.maximize()
})
// 最小化
ipcMain.on('hide-window', () => {
  mainWindow.minimize()
})
// 关闭窗口
ipcMain.on('window-all-closed', () => {
  // console.log(store)
  // store.dispatch('ShowSearchHistory', false)
  // todo 此处逻辑有问题
  app.quit()
})

ipcMain.on('room_window_close', () => {
  if (global.windowObject.roomWindow) {
    global.windowObject.roomWindow.close()
    global.windowObject.roomWindow = null
  }
})
ipcMain.on('is-room-window', (event, params) => {
  mainWindow.send('is-room-window-res', params)
})
// 还原
ipcMain.on('orignal-window', () => {
  mainWindow.unmaximize()
})
// 打开主窗口
ipcMain.on('openMainWindow', () => {
  if (!app.quitting) {
    if (global.windowObject.mainWindow) {
      global.windowObject.mainWindow.show()
    }
  }
})
// 1安全中心/2帮助中心/3关于NN/4切换账号
ipcMain.on('changeMenu', (sys, msg) => {
  switch (msg) {
    case 1:
      console.log('安全中心', msg)
      global.windowObject.mainWindow.show()
      global.windowObject.mainWindow.send('tray-request-safety')
      break
    case 2:
      console.log('帮助中心', msg)
      global.windowObject.createHelpWindow().loadURL(helpUrl)
      global.windowObject.createHelpWindow().show()
      break
    case 3:
      console.log('关于NN', msg)
      console.log('hwin: ', createHelpWindow())
      global.windowObject.createHelpWindow().show()
      global.windowObject.createHelpWindow().loadURL(`${helpUrl}?guide=4`)
      break
    case 5:
      console.log('切换账号', msg)
      global.windowObject.mainWindow.show()
      global.windowObject.mainWindow.send('tray-request-login')
  }
  if (global.windowObject.trayWindow.isVisible()) {
    global.windowObject.trayWindow.hide()
  }
})
// 修改状态
ipcMain.on('openState', (sys, msg) => {
  // showStateWindow()
})

// 退出程序
ipcMain.on('appquit', () => {
  // 程序退出之前做清理操作

  app.exit()
})
// 1登陆/2注册/3帮助/4关于nn
ipcMain.on('changeMenuQuit', (sys, msg) => {
  switch (msg) {
    case 1:
      global.windowObject.mainWindow.show()
      global.windowObject.mainWindow.send('tray-request-login')
      break
    case 2:
      global.windowObject.mainWindow.show()
      global.windowObject.mainWindow.send('tray-request-register')
      break
    case 3:
      global.windowObject.createHelpWindow().loadURL(helpUrl)
      global.windowObject.createHelpWindow().show()
      break
    case 4:
      global.windowObject.createHelpWindow().show()
      global.windowObject.createHelpWindow().loadURL(`${helpUrl}?guide=4`)
  }
  if (global.windowObject.trayWindow.isVisible()) {
    global.windowObject.trayWindow.hide()
  }
})
// 1NN官网/2帮助中心/3在线客服
ipcMain.on('changeMenuList', (sys, msg) => {
  if (msg === 2) {
    global.windowObject.createHelpWindow().loadURL(helpUrl)
    global.windowObject.createHelpWindow().show()
  } else if (msg === 3) {
    global.windowObject.createServiceWindow().show()
  }
  if (global.windowObject.trayWindow.isVisible()) {
    global.windowObject.trayWindow.hide()
  }
})
// ============================================================================
// IM模块的语音电话窗口 begin =======================================================
// 打开窗口
ipcMain.on('show-voice-call-window', (event, params) => {
  if (global.windowObject.phoneWindow != null) {
    // 电话窗口已存在 打开已存在的窗口
    global.windowObject.phoneWindow.show()
  } else {
    // 电话窗口不存在 重新实例化一个新的电话窗口
    global.windowObject.phoneWindow = new BrowserWindow({
      title: `NN-语音电话-${params.remark}`,
      // height: 1062,
      height: 450,
      useContentSize: true,
      frame: true,
      // width: 800,
      width: 300,
      // width: 607,
      resizable: false,
      titleBarStyle: 'default',
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        // devTools: true
        devTools: false
      },
      show: false
    })

    global.windowObject.phoneWindow.loadURL(params.url)
    // 关闭事件
    global.windowObject.phoneWindow.on('closed', () => {
      console.log('phoneWindow被关闭')
      setTimeout(() => {
        if (global.windowObject.phoneWindow) {
          global.windowObject.phoneWindow.destroy()
          global.windowObject.phoneWindow = null
        }
      }, 1000)
    })
    // 最小化事件
    global.windowObject.phoneWindow.on('minimize', () => {
      console.log('phoneWindow被最小化')
    })

    global.windowObject.phoneWindow.show()
    console.log('语音电话Window被打开')
  }
  //
  // require('./im/phone').default(global.windowObject.phoneWindow)
  // require('./im/chat').default(chatWindow)
})
// 关闭语音电话窗口
ipcMain.on('im-close-phone-window', (e, params) => {
  global.windowObject.phoneWindow.destroy()
  // global.windowObject.phoneWindow = null
  console.log('语音电话窗口被关闭')
})
// IM模块的语音电话窗口 end ======================================================
// ============================================================================

// ============================================================================
// IM模块的聊天窗口 begin =======================================================
// 打开
ipcMain.on('show-chat-window', (event, params) => {
  //  判断对应的聊天窗口是否存在
  let currentWindow = getChatWindowById(params.id)
  if (currentWindow) {
    // 存在此窗口 将其打开
    currentWindow.show()
    console.group('一个已存在的chatWindow被打开,id=', params.id)
  } else {
    // 不存在此窗口 重新实例化
    // ---------------------------------------------------
    let chatWindow = new BrowserWindow({
      title: `NN - ${params.remark}`,
      // height: 1062,
      height: 562,
      useContentSize: true,
      frame: false,
      // width: 1207,
      width: 607,
      resizable: false,
      // titleBarStyle: 'default',
      // titleBarStyle`: 'hidden',
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        devTools: false
        // devTools: true
      },
      show: false
    })
    require('./im/chat').default(chatWindow)
    chatWindow.loadURL(params.url)
    // 以数组元素的形式挂载到global.windowObject.imWindows上面
    global.windowObject.imWindows.push({
      id: params.id,
      window: chatWindow
    })
    console.group('-----------IM模块日志-----------')
    console.log('global.windowObject.imWindows=', global.windowObject.imWindows)
    console.groupEnd()
    chatWindow.on('closed', () => {
      chatWindow = null
    })
    chatWindow.show()
    console.group('一个重新实例化的chatWindow被打开,id=', params.id)
    // ---------------------------------------------------
  }
})
// 关闭聊天窗口
ipcMain.on('close-chat-window', (e, params) => {
  let currentWindow = getChatWindowById(params.id)
  if (currentWindow) {
    currentWindow.close()
    // 删除global.windowObject.imWindows中挂载的对应的窗口对象
    let arr = global.windowObject.imWindows.filter(function (item) {
      return item.id !== params.id
    })
    global.windowObject.imWindows = arr
    console.group(
      'global.windowObject.imWindows=',
      global.windowObject.imWindows
    )
    console.group('一个chatWindow被最关闭,id=', params.id)
  } else {
    console.log('未找到对应的window')
  }
})
// 关闭所有聊天窗口
ipcMain.on('im-close-all-chat-winodw', (e, params) => {
  if (global.windowObject.imWindows.length > 0) {
    global.windowObject.imWindows.forEach(item => {
      item.window.close()
    })
    global.windowObject.imWindows = []
    console.group('所有的chatWindow均被最关闭')
  } else {
    console.group('当前没有正在运行的聊天窗口，无需关闭')
  }
})
// 最小化聊天窗口
ipcMain.on('hide-chat-window', (e, params) => {
  let currentWindow = getChatWindowById(params.id)
  if (currentWindow) {
    currentWindow.minimize()
    console.group('一个chatWindow被最小化,id=', params.id)
  } else {
    console.log('未找到对应的window')
  }
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
// IM模块的聊天窗口 end ======================================================
// ============================================================================
// 建立新窗口
ipcMain.on('request-new-win', (e, params) => {
  if (!roomWindow) {
    roomWindow = new BrowserWindow({
      width: 1300,
      height: 800,
      minWidth: 1200,
      minHeight: 750,
      frame: false,
      webPreferences: {
        webSecurity: true,
        nodeIntegration: true,
        devTools: true
      }
    })
    roomWindow.loadURL(params)
    roomWindow.on('closed', () => {
      roomWindow = null
    })
    // 给global建立一个窗口对象,管理全部的window
    global.windowObject.roomWindow = roomWindow
    // 最大化
    ipcMain.on('show-full-window', (event, params) => {
      // console.log('最大化')
      global.windowObject.roomWindow.maximize()
    })
    // 最小化
    ipcMain.on('hide-window', () => {
      global.windowObject.roomWindow.minimize()
    })
  }

  // 引入websocket
  // require('./ws/ws').default(mainWindow, roomWindow)
})

// 创建帮助窗口
function createHelpWindow () {
  if (helpWindow) {
    return helpWindow
  }

  helpWindow = new BrowserWindow({
    title: 'NN-帮助中心',
    height: 800,
    width: 1300,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      devTools: false
    }
  })
  Menu.setApplicationMenu(null) // 隐藏菜单栏
  helpWindow.on('closed', function () {
    helpWindow = null
  })
  helpWindow.hide()

  return helpWindow
}
// 创建在线客服窗口
function createServiceWindow () {
  if (serviceWindow) {
    return serviceWindow
  }
  serviceWindow = new BrowserWindow({
    title: '在线客服',
    width: 362,
    height: 582,
    show: false,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      devTools: false
    }
  })
  Menu.setApplicationMenu(null) // 隐藏菜单栏
  serviceWindow.loadURL(
    'http://uchat.im-cc.com/webchat_new/static/html/index.html?isstatic=true'
  )
  // serviceWindow.loadURL(`${winURL}?#/service`)
  serviceWindow.on('close', function () {
    // serviceWindow = null
    serviceWindow.hide()
  })
  serviceWindow.hide()
  // 计算弹框位置
  let { width: screenWidth } = electron.screen.getPrimaryDisplay().size
  const [
    seviceMenuWidth,
    seviceMenuHeight
  ] = global.windowObject.createServiceWindow().getSize()
  let { x, y } = electron.screen.getCursorScreenPoint()
  if (x + seviceMenuWidth > screenWidth) {
    global.windowObject
      .createServiceWindow()
      .setPosition(x - seviceMenuWidth, y - seviceMenuHeight)
  } else {
    global.windowObject
      .createServiceWindow()
      .setPosition(x, y - seviceMenuHeight)
  }
  return serviceWindow
}
