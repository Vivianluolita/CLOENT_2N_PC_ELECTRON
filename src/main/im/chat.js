import { ipcMain, ipc, BrowserWindow } from 'electron'
import axios from 'axios'
// 实现IM相关的业务逻辑
import { getChatRecords } from '../api/imApi'
export default chatWindow => {
  // 拉取联系人的聊天记录
  ipcMain.on('get-chat-records', (event, params, cb) => {
    getChatRecords(params)
      .then(res => {
        chatWindow.send('on-chat-records', res, cb)
        console.log("chatWindow.send('on-chat-records', res, cb)")
      })
      .catch(err => {
        console.log('error', err)
        chatWindow.send('on-chat-records', err, cb)
      })
  })
}
