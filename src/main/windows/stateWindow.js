// Modules to control application life and create native browser window
import { electron, BrowserWindow } from 'electron'

let stateWindow
export function createStateWindow () {
  stateWindow = new BrowserWindow({
    width: 120,
    height: 215,
    useContentSize: true,
    resizable: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: true,
    frame: false,
    show: false,
    title: '',
    thickFrame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      devTools: true
    }
  })

  let baseurl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/`
      : `file://${__dirname}/`

  stateWindow.loadURL(`${baseurl}?#/state`)

  stateWindow.on('closed', function () {
    stateWindow = null
  })
  stateWindow.on('blur', function () {
    if (stateWindow.isVisible()) {
      stateWindow.hide()
    }
  })
  return stateWindow
}
