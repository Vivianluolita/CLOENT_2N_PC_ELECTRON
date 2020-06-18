import { ipcMain, ipc, BrowserWindow } from 'electron'
import { getExtendInfo, updataExtendInfo } from '../api/systemSetting'

export default mainWindow => {
  // 获取用户扩展配置
  ipcMain.on('system-setting-get-extend-info', (event, params) => {
    getExtendInfo()
      .then(res => {
        mainWindow.send('get-extend-info-res', res.data)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('get-extend-info-res', err)
      })
  })

  // 获取用户扩展配置
  ipcMain.on('system-setting-updata-extend-info', (event, params) => {
    updataExtendInfo(params)
      .then(res => {
        mainWindow.send('updata-extend-info-res', res.data)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('updata-extend-info-res', err)
      })
  })
}
