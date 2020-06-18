// Modules to control application life and create native browser window
import { BrowserWindow } from 'electron'
const path = require('path')

let mainWindow
export function createTrayWindow () {
  mainWindow = new BrowserWindow({
    width: 305,
    height: 285,
    useContentSize: true,
    resizable: false,
    transparent: true,
    hasShadow: true,
    frame: false,
    show: false,
    alwaysOnTop: true,
    title: '',
    thickFrame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      devTools: false
    }
  })
  let baseurl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/`
      : `file://${__dirname}/index.html`

  mainWindow.loadURL(`${baseurl}?#/tray`)
  // mainWindow.loadURL(`file://${__static}/tray.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('blur', function () {
    if (
      mainWindow.isVisible() &&
      !global.windowObject.stateWindow.isVisible()
    ) {
      mainWindow.hide()
    }
  })
  return mainWindow
}
