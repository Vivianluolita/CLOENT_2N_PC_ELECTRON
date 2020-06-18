const electron = require('electron')
const { app, Tray, nativeImage } = electron
const path = require('path')
// 目录信息
let appFolder = `${path.resolve(__dirname, '../../../')}\\`
let resourcesPath
if (!app.isPackaged) {
  // 开发环境下的资源目录
  appFolder = `${process.cwd()}\\`
  resourcesPath = `${appFolder}static\\`
} else {
  resourcesPath = `${appFolder}`
}

export function createTray () {
  let tray = new Tray(nativeImage.createFromPath(`${resourcesPath}nn-icon.png`))
  // path.resolve(__dirname, '../../../static/nn-icon.png'
  //
  tray.on('click', (event, bounds, position) => {
    // 显示/隐藏主窗口
    if (!app.quitting) {
      global.windowObject.mainWindow.show()
      // if (global.windowObject.trayWindow.isVisible()) {
      //   global.windowObject.trayWindow.hide()
      // }
      // if (global.windowObject.mainWindow.isVisible()) {
      //   global.windowObject.mainWindow.hide()
      // } else {
      //   global.windowObject.mainWindow.show()
      // }
    }
  })
  tray.on('right-click', (event, bounds, position) => {
    // global.windowObject.createHelpWindow.hide()
    if (!app.quitting) {
      // 监听单击做的时
      let { width: screenWidth } = electron.screen.getPrimaryDisplay().size
      const [
        trayMenuWidth,
        trayMenuHeight
      ] = global.windowObject.trayWindow.getSize()
      let { x, y } = electron.screen.getCursorScreenPoint()
      if (x + trayMenuWidth > screenWidth) {
        global.windowObject.trayWindow.setPosition(
          x - trayMenuWidth + 80,
          y - trayMenuHeight
        )
      } else {
        global.windowObject.trayWindow.setPosition(x + 80, y - trayMenuHeight)
      }
      global.windowObject.trayWindow.show()
    }
  })
  return tray
}
