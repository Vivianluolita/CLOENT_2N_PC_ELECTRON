import { ipcMain } from 'electron'
// 实现登录相关的业务逻辑
import {
  initGt,
  codeSend,
  loginRegister,
  accountLogin,
  leigodLogin,
  checkPhoneIsBind,
  autoAccountLogin,
  bindPhoneLogin,
  findPasswordLogin,
  userInfoLogin,
  autoUserInfoLogin,
  advertiseLogin
} from '../api/login'

export default mainWindow => {
  // 级验证
  ipcMain.on('init-gt', (event, params) => {
    initGt()
      .then(res => {
        mainWindow.send('init-gt-res', res)
      })
      .catch(err => {
        mainWindow.send('init-gt-res', err)
      })
  })

  // 获取验证码
  ipcMain.on('code-send', (event, params, cb) => {
    // params.func
    codeSend(params)
      .then(res => {
        mainWindow.send('code-send-res', res, cb)
      })
      .catch(err => {
        console.log('error', err)
        mainWindow.send('code-send-res', err, cb)
      })
  })

  // 提交注册
  ipcMain.on('login-register', (event, params) => {
    loginRegister(params)
      .then(res => {
        mainWindow.send('login-register-res', res)
      })
      .catch(err => {
        mainWindow.send('code-send-res', err)
      })
  })
  // 账号登录
  ipcMain.on('account-login', (event, params) => {
    accountLogin(params)
      .then(res => {
        if (res.data) {
          if (mainWindow) {
            mainWindow.send('account-login-res', res)
          }
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  ipcMain.on('auto-account-login', (event, params) => {
    autoAccountLogin(params)
      .then(res => {
        if (res.data) {
          if (mainWindow) {
            mainWindow.send('auto-account-login-res', res)
          }
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 雷神登录
  ipcMain.on('leigod-login', (event, params) => {
    leigodLogin(params)
      .then(res => {
        if (res.data) {
          mainWindow.send('leigod-login-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 绑定手机
  ipcMain.on('check-phone-is-bind', (event, params) => {
    checkPhoneIsBind(params)
      .then(res => {
        if (res.data) {
          mainWindow.send('check-phone-is-bind-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 绑定手机登录
  ipcMain.on('bind-phone-login', (event, params) => {
    bindPhoneLogin(params)
      .then(res => {
        if (res.data) {
          mainWindow.send('bind-phone-login-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 找回密码
  ipcMain.on('find-password-login', (event, params) => {
    findPasswordLogin(params)
      .then(res => {
        if (res.data) {
          mainWindow.send('find-password-login-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 用户信息
  ipcMain.on('user-info-login', (event, params) => {
    userInfoLogin(params)
      .then(res => {
        if (res.data) {
          mainWindow.send('user-info-login-res', res)
        }
      })
      .catch(err => {
        console.log('error', err)
      })
  })
  // 自动用户信息
  ipcMain.on('auto-user-info-login', (event, params) => {
    console.log('global.USERLOGINTYPE: ', global.USERLOGINTYPE)
    if (!global.USERLOGINTYPE || global.USERLOGINTYPE === 0) {
      mainWindow.send('auto-user-info-login-res', global.LOGININFO)
    } else {
      autoUserInfoLogin()
        .then(res => {
          if (res.data) {
            mainWindow.send('auto-user-info-login-res', res)
          }
        })
        .catch(err => {
          console.log('auto-user-info-login-error', err)
        })
    }
  })
  // 广告位
  ipcMain.on('advertise-login', (event, params) => {
    advertiseLogin()
      .then(res => {
        if (res.data) {
          mainWindow.send('advertise-login-res', res)
        }
      })
      .catch(err => {
        console.log('auto-user-info-login-error', err)
      })
  })
}
