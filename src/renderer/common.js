import { remote } from 'electron'

// 获取当前用户登录类型 0 游客，1普通用户
export function getCurrentLoginType () {
  return remote.getGlobal('USERLOGINTYPE')
}

// 获取当前登录token
export function getCurrentToken () {
  console.group('---------------TOKEN---------------')
  console.log(remote.getGlobal('LOGINTOKEN'))
  console.groupEnd('---------------TOKEN END---------------')
  return remote.getGlobal('LOGINTOKEN')
}

// 获取当前登录用户信息
export function getCurrentUserInfo () {
  return remote.getGlobal('LOGININFO')
}
