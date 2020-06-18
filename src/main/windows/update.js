import { electron, BrowserWindow } from 'electron'

let updateWindow
const createUpdateWindow = function () {
  updateWindow = new BrowserWindow({
    width: 270,
    height: 115,
    useContentSize: true,
    resizable: true,
    transparent: false,
    hasShadow: true,
    alwaysOnTop: true,
    frame: true,
    show: true,
    thickFrame: false,
    webPreferences: {
      webSecurity: false,
      devTools: true
    }
  })

  updateWindow.loadFile('update.html')

  updateWindow.on('closed', function () {
    updateWindow = null
  })

  return updateWindow
}

export default createUpdateWindow
