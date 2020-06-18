/* eslint-disable no-unused-vars */
let { ipcMain: ipc, dialog, app } = require('electron')
// 自动更新相关
let { autoUpdater } = require('electron-updater')

export default mainWindow => {
  // eslint-disable-next-line space-before-function-paren
  function setprogressbar(i) {
    i /= 100
    if (i >= 1) i = -1
    // mainWindow.webContents.send("setProgressBar", i);
    // mainWindow.setProgressBar(i);
  }
  // 通过main进程发送事件给renderer进程，提示更新信息
  // function sendUpdateMessage(obj) {
  //   mainWindow.webContents.send("updateMessage", obj);
  // }
  // 当更新出现错误时触发
  autoUpdater.on('error', err => {
    console.log('error', err)
    mainWindow.webContents.send('update-err', err)
    // sendUpdateMessage({ action: "error", errorInfo: err });
  })

  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    // sendUpdateMessage({ action: "checking" });
  })

  // 当发现一个可用更新的时候触发
  autoUpdater.autoDownload = false
  autoUpdater.on('update-available', info => {
    // 触发更新提示框
    setTimeout(function () {
      mainWindow.webContents.send('download-update')
    }, 5000)
  })

  // 更新下载包会自动开始
  ipc.on('download-update-start', () => {
    console.log('开始下载')
    autoUpdater.downloadUpdate()
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    console.log('更新进度条', progressObj)
    setprogressbar((progressObj && progressObj.percent) || 0)
    mainWindow.webContents.send('download-progress', progressObj)
  })
  // 当没有可用更新的时候触发
  autoUpdater.on('update-not-available', info => {
    console.log('没有可用更新', info)
    // sendUpdateMessage({ action: "updateNotAva", updateInfo: info });
  })
  /**
   * event Event
   * releaseNotes String - 新版本更新公告
   * releaseName String - 新的版本号
   * releaseDate Date - 新版本发布的日期
   * updateUrl String - 更新地址
   */

  autoUpdater.on('update-downloaded', info => {
    // 下载太快可能无法触发downloadProgress事件，所以手动通知一下
    console.log('更新提示', info)
    setprogressbar(100)
    mainWindow.webContents.send('download-progress', { percent: 100 })
    global.canExit = true
    autoUpdater.quitAndInstall()
    // mainWindow.webContents.send('download-end')
    console.log('安装结束')
  })
  ipc.on('checkForUpdate', () => {
    console.log('check--update')
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })

  if (app.isPackaged) {
    autoUpdater.checkForUpdates()
  }
}
