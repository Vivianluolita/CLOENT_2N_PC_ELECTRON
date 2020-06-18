import { ipcMain, ipc, BrowserWindow } from 'electron'
import {
  userInfo,
  getCode,
  chackoutMobile,
  newPassword,
  getAddresslist,
  updataUesrInfo,
  changPhone,
  othersInfo,
  uploadImage,
  bindLeiGod,
  removeLeiGod,
  getCode2,
  checkPhoneHave,
  checkNameHave
} from '../api/userSetting'

export default mainWindow => {
  // 获取当前用户信息
  ipcMain.on('user-setting-user-info', (event, params) => {
    userInfo()
      .then(res => {
        if (mainWindow) {
          mainWindow.send('user-info-res', res.data)
        }
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('user-info-res', res.data)
        }
      })
      .catch(err => {
        if (mainWindow) {
          mainWindow.send('user-info-res', err)
        }
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('user-info-res', err)
        }
      })
  })

  // 获取手机验证码
  ipcMain.on('user-setting-get-code', (event, params, name) => {
    getCode(params)
      .then(res => {
        mainWindow.send('user-setting-get-code-res', res.data, name)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-get-code-res',
            res.data
          )
        }
      })
      .catch(err => {
        mainWindow.send('user-setting-get-code-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-get-code-res',
            err,
            name
          )
        }
      })
  })

  // 获取手机验证码 更换手机
  ipcMain.on('user-setting-get-code2', (event, params) => {
    getCode2(params)
      .then(res => {
        mainWindow.send('user-setting-get-code2-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-get-code2-res',
            res.data
          )
        }
      })
      .catch(err => {
        mainWindow.send('user-setting-get-code2-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('user-setting-get-code2-res', err)
        }
      })
  })

  // 校验手机号
  ipcMain.on('user-setting-chackout-mobile', (event, params) => {
    chackoutMobile(params)
      .then(res => {
        mainWindow.send('user-setting-chackout-mobile-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-chackout-mobile-res',
            res.data
          )
        }
      })
      .catch(err => {
        mainWindow.send('user-setting-chackout-mobile-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-chackout-mobile-res',
            err
          )
        }
      })
  })

  // 重设密码
  ipcMain.on('user-setting-new-password', (event, params) => {
    newPassword(params)
      .then(res => {
        mainWindow.send('user-setting-new-password-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-new-password-res',
            res.data
          )
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('user-setting-new-password-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-new-password-res',
            err
          )
        }
      })
  })

  // 获取地区列表
  ipcMain.on('user-setting-get-address-list', (event, params) => {
    getAddresslist()
      .then(res => {
        mainWindow.send('user-setting-get-address-list-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-get-address-list-res',
            res.data
          )
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('user-setting-get-address-list-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send(
            'user-setting-get-address-list-res',
            err
          )
        }
      })
  })

  // 设置用户信息
  ipcMain.on('user-setting-updata-uesr-info', (event, params) => {
    updataUesrInfo(params)
      .then(res => {
        mainWindow.send('updata-uesr-info-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('updata-uesr-info-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('updata-uesr-info-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('updata-uesr-info-res', err)
        }
      })
  })

  // 更改手机号
  ipcMain.on('user-setting-updata-change-phone', (event, params) => {
    changPhone(params)
      .then(res => {
        mainWindow.send('change-phone-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('change-phone-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('change-phone-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('change-phone-res', err)
        }
      })
  })

  // 查看他人信息
  ipcMain.on('user-setting-others-info', (event, params) => {
    othersInfo(params)
      .then(res => {
        mainWindow.send('others-info-res', res)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('others-info-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('others-info-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('others-info-res', err)
        }
      })
  })

  // 上传图片
  ipcMain.on('user-setting-upload-image', (event, params) => {
    uploadImage(params)
      .then(res => {
        mainWindow.send('upload-image-res', res)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('upload-image-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('upload-image-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('upload-image-res', err)
        }
      })
  })

  // 雷神账号绑定
  ipcMain.on('user-setting-bind-lei-god', (event, params) => {
    bindLeiGod(params)
      .then(res => {
        mainWindow.send('bind-lei-god-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('bind-lei-god-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('bind-lei-god-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('bind-lei-god-res', err)
        }
      })
  })

  // 雷神账号解绑
  ipcMain.on('user-setting-remove-lei-god', (event, params) => {
    removeLeiGod(params)
      .then(res => {
        mainWindow.send('remove-lei-god-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('remove-lei-god-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('remove-lei-god-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('remove-lei-god-res', err)
        }
      })
  })

  // 检测手机号是否注册
  ipcMain.on('user-setting-check-phone-have', (event, params) => {
    checkPhoneHave(params)
      .then(res => {
        mainWindow.send('check-phone-have-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('check-phone-have-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('check-phone-have-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('check-phone-have-res', err)
        }
      })
  })

  // 检测昵称是否存在
  ipcMain.on('user-setting-check-name-have', (event, params) => {
    checkNameHave(params)
      .then(res => {
        mainWindow.send('check-name-have-res', res.data)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('check-name-have-res', res.data)
        }
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('check-name-have-res', err)
        if (global.windowObject.roomWindow) {
          global.windowObject.roomWindow.send('check-name-have-res', err)
        }
      })
  })
}
