import { ipcMain, ipc, BrowserWindow } from 'electron'

import { getRoomConfig } from '../api/ws.js'
import baseURL from '../api/baseURL'
const WebSocketServer = require('ws')
let wsTimer
global.wsClient = null
export default mainWindow => {
  // 房间发送申请游客身份的消息
  ipcMain.on('request-tourist-status', (event, params) => {
    console.log('request-tourist-status: ', event, params)
  })
  // 建立websocket连接
  ipcMain.on('establish-ws', (event, token) => {
    if (!global.wsClient) {
      console.log('webscoket -- init', baseURL.ws)
      global.wsClient = new WebSocketServer(baseURL.ws)
      // ws连接成功打开之后
      global.wsClient.on('open', w => {
        console.log('websocket is running')
        // ws 登录信息
        let loginInfo = {
          command_id: 100001,
          data: {}
        }
        loginInfo.data.token = token
        console.log('WS初始化时的token=', token)
        global.wsClient.send(JSON.stringify(loginInfo))
        // ws的心跳发包
        wsTimer = setInterval(() => {
          console.log('心跳包')
          let heartbeat = {
            command_id: 100003
          }
          global.wsClient.send(JSON.stringify(heartbeat))
        }, 10000)
      })
      // ws收到的服务器消息
      global.wsClient.on('message', res => {
        console.group('-----------接收消息-----------')
        console.log(res)
        console.groupEnd()

        let repsonse = JSON.parse(res)
        // 如果回执消息为登录返回信息
        if (repsonse.command_id === 100001 && repsonse.message_type === 1) {
          // mainWindow.send('ws-login-success', repsonse)
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send('ws-login-success', repsonse)
          }
        }
        // 如果返回的是被挤号了
        // if (repsonse.command_id === ) {
        //   global.windowObject.roomWindow.send('user-squeeze', repsonse)
        // }
        // 如果回执消息为进入主频道成功
        if (repsonse.command_id === 200002 && repsonse.message_type === 1) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send('enter-room-success', repsonse)
          }
        }
        // 我进入了子频道的回执
        if (repsonse.command_id === 200004 && repsonse.message_type === 1) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'enter-child-room-success',
              repsonse
            )
          }
        }
        // 修改用户权限
        if (repsonse.command_id === 200011) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'set-others-role-success',
              repsonse
            )
          }
        }
        // 有其他小伙伴进入了频道
        if (repsonse.command_id === 200002 && repsonse.message_type === 2) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'others-enter-room-success',
              repsonse
            )
          }
        }
        // 有其他小伙伴进入了子频道
        if (repsonse.command_id === 200004 && repsonse.message_type === 2) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'others-enter-child-room-success',
              repsonse
            )
          }
        }
        // 有小伙伴退出了频道
        if (repsonse.command_id === 200003 && repsonse.message_type === 2) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'others-leave-room-success',
              repsonse
            )
          }
        }

        if (repsonse.command_id === 200006) {
          // 修改频道公告的回执和广播
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'change-room-notice-success',
              repsonse
            )
          }
        }
        // 新建子频道的回执和广播
        if (repsonse.command_id === 200007) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'room-new-channel-success',
              repsonse
            )
          }
        }
        // 删除子频道的回执和广播
        if (repsonse.command_id === 200008) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'remove-room-channel-success',
              repsonse
            )
          }
        }
        // 踢出频道的回执和广播
        if (repsonse.command_id === 200010) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'be-exit-room-success',
              repsonse
            )
          }
        }
        // 设置接待频道的回执和广播
        if (repsonse.command_id === 200019) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'set-reception-channel-success',
              repsonse
            )
          }
        }
        // 设置子频道全员文字禁言
        if (repsonse.command_id === 200015) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'set-room-type-status-success',
              repsonse
            )
          }
        }
        // 撤销管理员的回执和广播
        if (repsonse.command_id === 200012) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'cancel-manager-success',
              repsonse
            )
          }
        }
        // 广播麦序详情
        if (repsonse.command_id === 210000) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'return-micro-info-success',
              repsonse
            )
          }
        }
        // 切换麦序模式
        if (repsonse.command_id === 210001) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'change-micro-type-success',
              repsonse
            )
          }
        }
        // 上麦
        if (repsonse.command_id === 210002) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'request-to-start-micro-success',
              repsonse
            )
          }
        }
        // 下麦
        if (repsonse.command_id === 210003) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'request-to-end-micro-success',
              repsonse
            )
          }
        }
        // 增加麦序时长
        if (repsonse.command_id === 210008) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'increase-micro-time-success',
              repsonse
            )
          }
        }
        // 控麦 放麦
        if (repsonse.command_id === 210009) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'request-to-control-release-micro-success',
              repsonse
            )
          }
        }
        // 禁麦 开麦
        if (repsonse.command_id === 210010) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'request-to-forbid-open-micro-success',
              repsonse
            )
          }
        }
        // 添加到麦序
        if (repsonse.command_id === 210004) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'add-to-microlist-success',
              repsonse
            )
          }
        }
        // 移出麦序/清空麦序
        if (repsonse.command_id === 210005) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'remove-micro-list-success',
              repsonse
            )
          }
        }
        // 麦序上移/下移
        if (repsonse.command_id === 210006) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'move-micro-list-order-success',
              repsonse
            )
          }
        }
        // 设置用户的打字状态
        if (repsonse.command_id === 200017) {
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send(
              'set-room-user-word-forbid-success',
              repsonse
            )
          }
        }

        //
        // =================================================================//
        // =================================================================//
        // =================================================================//
        if (repsonse.command_id === 200001) {
          // 如果回执消息为发送消息的回执
          if (global.windowObject.roomWindow) {
            global.windowObject.roomWindow.send('send-msg-success', repsonse)
          }
        }
        // ============================================================
        // 打印接收到的消息
        console.group()
        console.log('-----------接收到了一条ws消息(●ﾟωﾟ●)-----------')
        console.log(res)
        console.log('-----------接收到了一条ws消息(●ﾟωﾟ●)-----------')
        console.groupEnd()
        // (●ﾟωﾟ●)
        // 公用方法 根据id获取聊天窗口对象
        let getChatWindowById = function (id) {
          let currentWindow
          global.windowObject.imWindows.forEach(item => {
            if (item.id === id) {
              currentWindow = item.window
            }
          })
          return currentWindow
        }
        if (repsonse.message_type === 1) {
          // 回执
          switch (repsonse.command_id) {
            case 300001:
              // 发送文字图片消息回执
              let windowId = repsonse.data.to_user_id
              if (windowId) {
                let chatWindow = getChatWindowById(windowId)
                if (chatWindow) {
                  chatWindow.send('ws-send-msg-repsonse', repsonse)
                } else {
                  console.log('没有获取到此条回执对应的窗口')
                }
              } else {
                console.log('没有获取到此条回执对应的窗口ID')
              }
              break
            case 300002:
              // 好友关系处理的回执
              mainWindow.send('ws-friends-repsonse', repsonse)
              break
            case 300003:
              // 发送语音通话请求的回执
              console.log('发送语音通话请求的回执')
              global.windowObject.phoneWindow.send(
                'ws-send-call-repsonse',
                repsonse
              )
              break
            case 300005:
              // 删除好友回执
              mainWindow.send('on-del-friends', repsonse)
              break
            case 300006:
              // 删除会话回执
              mainWindow.send('on-del-chat', repsonse)
              break
            default:
              break
          }
        } else if (repsonse.message_type === 2) {
          // 广播 (收取消息)
          console.log('收到一条广播', repsonse)
          switch (repsonse.command_id) {
            case 300001:
              // 图文消息广播
              mainWindow.send('ws-msg-repsonse', repsonse)
              let windowId = repsonse.data.from_user.nn_id
              if (windowId) {
                let chatWindow = getChatWindowById(windowId)
                if (chatWindow) {
                  chatWindow.send('ws-msg-repsonse', repsonse)
                } else {
                  console.log('没有获取到此条消息回执对应的窗口')
                }
              } else {
                console.log('没有获取到此条消息回执对应的窗口ID')
              }
              break
            case 300002:
              // 处理好友关系操作之后的广播
              mainWindow.send('ws-agree-friends-repsonse', repsonse.data)
              break
            case 300003:
              // 发送语音通话处理的广播
              switch (repsonse.data.status) {
                case 1:
                  // 请求语音通话
                  console.log(
                    '发送语音通话处理的广播 repsonse.data=',
                    repsonse.data
                  )
                  mainWindow.send('ws-send-call-broadcast', repsonse.data)
                  break
                case 6:
                  // 收到对方已同意接听语音电话的广播
                  console.log(
                    '收到对方已同意接听语音电话的广播 repsonse.data=',
                    repsonse.data
                  )
                  if (global.windowObject.phoneWindow) {
                    global.windowObject.phoneWindow.send(
                      'ws-send-call-be-agreed',
                      repsonse.data
                    )
                  } else {
                    console.log(
                      '收到对方已同意接听语音电话的广播 但当前语音电话窗口不存在'
                    )
                  }
                  break
                case 9:
                  // 收到对方挂断或拒接语音电话的广播
                  console.log(
                    '接收到语音电话被拒接或者挂断的广播 语音电话窗口被关闭'
                  )
                  if (global.windowObject.phoneWindow) {
                    global.windowObject.phoneWindow.send(
                      'ws-send-call-be-hangup',
                      repsonse.data
                    )
                  } else {
                    console.log(
                      '接收到语音电话被拒接或者挂断的广播 但当前语音电话窗口不存在'
                    )
                  }
                  break

                default:
                  break
              }
              break
            case 300005:
              // 删除好友后发给双方的广播
              // TODO
              break
            default:
              break
          }
        }

        // ============================================================
      })
      // ws被关闭时的回调
      global.wsClient.on('close', () => {
        console.info('WS连接关闭')
      })
      // ws链接发生错误时的回调
      global.wsClient.on('error', () => {
        console.info('WS连接错误')
      })
    }
  })

  ipcMain.on('destroy-ws', (event, params) => {
    if (global.wsClient) {
      clearInterval(wsTimer)
      global.wsClient.close()
    }
    global.wsClient = null
  })

  // 获取全局配置
  ipcMain.on('getRoomConfig', (event, params) => {
    getRoomConfig()
      .then(res => {
        global.windowObject.roomWindow.send('getRoomConfigSuccess', res)
      })
      .catch(err => {
        console.log(err)
      })
  })
  // 进入频道的时候判断ws是否已经连接

  ipcMain.on('ws-is-true', (event, params) => {
    if (global.wsClient) {
      global.windowObject.roomWindow.send('ws-is-true-false', { istrue: 1 })
    } else {
      global.windowObject.roomWindow.send('ws-is-true-false', { istrue: 0 })
    }
  })
  // 进入频道
  ipcMain.on('enter-to-room', (event, params) => {
    console.log('enter-to-room: ', params)
    let enterRoomInfo = {
      command_id: 200002,
      data: {
        channel_no: ''
      }
    }
    enterRoomInfo.data.channel_no = Number(params)
    global.wsClient.send(JSON.stringify(enterRoomInfo))
  })
  // 离开频道
  ipcMain.on('leave-room', (event, params) => {
    console.log('leave-room: ', params)
    let leaveRoomInfo = {
      command_id: 200003,
      data: {}
    }
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(leaveRoomInfo))
    }
  })
  // 进入子频道
  ipcMain.on('enter-child-room', (event, params) => {
    console.log('enter-child-room', params)
    let enterRoomInfo = {
      command_id: 200004,
      data: {
        sub_channel_id: ''
      }
    }
    enterRoomInfo.data.sub_channel_id = Number(params)
    global.wsClient.send(JSON.stringify(enterRoomInfo))
  })
  // *--------------------------------------------------*//
  // 房间内发送消息
  // MessageTypeText      = 1  // 文字
  // MessageTypeImage     = 2  // 图片
  // MessageTypeRecord    = 3  // 录音
  // MessageTypeVoiceCall = 4  // 语音通话
  // MessageTypeSystem    = 5  // 系统消息
  // MessageTypeCustom    = 99 // 自定义消息(形如nn://room/enter?id=639712&title=飞机票)
  ipcMain.on('send-txt-msg', (event, params) => {
    // params.type == 1 我发的公屏消息
    // params.type == 2 我发送的私聊消息

    let msgInfo = {
      command_id: 200001,
      data: {
        message_type: 1,
        content: '',
        sequence_id: 0
      }
    }
    if (params.type === 1) {
      msgInfo.data.content = params.msginfo
    } else if (params.type === 2) {
      msgInfo.data.content = params.msginfo
      msgInfo.data.to_id = Number(params.toUser.nn_id)
    }
    msgInfo.data.sequence_id = new Date().getTime()
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 发送语音消息
  ipcMain.on('send-audio-msg', (event, params) => {
    let msgInfo = {
      command_id: 200001,
      data: {
        message_type: 3,
        content: '',
        sequence_id: 0
      }
    }
    msgInfo.data.voice_duration = Number(params.voice_duration)
    if (params.type === 1) {
      msgInfo.data.content = params.msginfo
    } else if (params.type === 2) {
      msgInfo.data.content = params.msginfo
      msgInfo.data.to_id = Number(params.toUser.nn_id)
    }
    msgInfo.data.sequence_id = new Date().getTime()
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 发送图片消息
  ipcMain.on('send-img-msg', (event, params) => {
    let msgInfo = {
      command_id: 200001,
      data: {
        message_type: 2,
        content: '',
        sequence_id: 0
      }
    }
    if (params.type === 1) {
      msgInfo.data.content = params.msginfo
    } else if (params.type === 2) {
      msgInfo.data.content = params.msginfo
      msgInfo.data.to_id = Number(params.toUser.nn_id)
    }
    msgInfo.data.sequence_id = new Date().getTime()
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 修改用户马甲
  ipcMain.on('set-others-role', (event, params) => {
    console.log('set-others-role', params)
    let msgInfo = {
      command_id: 200011,
      data: {}
    }
    msgInfo.data = params
    console.log(msgInfo)
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 修改房间的公告 公告每个子频道独立
  ipcMain.on('change-room-notice', (event, params) => {
    console.log('change-room-notice', params)
    let msgInfo = {
      command_id: 200006,
      data: {
        notice: ''
      }
    }
    msgInfo.data.notice = params
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 新建子频道
  ipcMain.on('room-new-channel', (event, params) => {
    console.log('room-new-channel', params)
    let msgInfo = {
      command_id: 200007,
      data: {}
    }
    msgInfo.data.pid = params.pid
    msgInfo.data.title = params.name
    msgInfo.data.password = params.join_password
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 删除子频道
  ipcMain.on('remove-room-channel', (event, params) => {
    console.log('remove-room-channel', params)
    let msgInfo = {
      command_id: 200008,
      data: {}
    }
    msgInfo.data.sub_channel_id = params.id
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 设置/取消接待频道
  ipcMain.on('set-reception-channel', (event, params) => {
    console.log('set-reception-channel', params)

    let msgInfo = {
      command_id: 200019,
      data: {}
    }
    msgInfo.data.sub_channel_id = params.id
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 设置子频道的打字状态
  ipcMain.on('set-room-type-status', (event, params) => {
    console.log('set-room-type-status', params)
    let msgInfo = {
      command_id: 200015,
      data: {}
    }
    msgInfo.data.word_forbid = params.word_forbid
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 撤销管理员
  ipcMain.on('cancel-manager', (event, params) => {
    console.log('cancel-manager', params)
    let msgInfo = {
      command_id: 200012,
      data: {}
    }
    msgInfo.data.user_id = params.nn_id
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 切换麦序
  ipcMain.on('change-micro-type', (event, params) => {
    console.log('change-micro-type', params)
    let msgInfo = {
      command_id: 210001,
      data: {
        mode: params
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 上麦
  ipcMain.on('request-to-start-micro', (event, params) => {
    console.log('request-to-start-micro', params)
    let msgInfo = {
      command_id: 210002,
      data: null
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 下麦
  ipcMain.on('request-to-end-micro', (event, params) => {
    console.log('request-to-end-micro', params)
    let msgInfo = {
      command_id: 210003,
      data: null
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 控麦
  ipcMain.on('request-to-control-micro', (event, params) => {
    console.log('request-to-control-micro', params)
    let msgInfo = {
      command_id: 210009,
      data: {
        status: params
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 放麦
  ipcMain.on('request-to-release-micro', (event, params) => {
    console.log('request-to-release-micro', params)
    let msgInfo = {
      command_id: 210009,
      data: {
        status: params
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 禁麦
  ipcMain.on('request-to-forbid-micro', (event, params) => {
    console.log('request-to-forbid-micro', params)
    let msgInfo = {
      command_id: 210010,
      data: {
        status: params
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 开麦
  ipcMain.on('request-to-open-micro', (event, params) => {
    console.log('request-to-open-micro', params)
    let msgInfo = {
      command_id: 210010,
      data: {
        status: params
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 踢出频道
  ipcMain.on('be-exit-room', (event, params) => {
    console.log('be-exit-room', params)
    let msgInfo = {
      command_id: 200010,
      data: {}
    }
    msgInfo.data = params
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 添加到麦序
  ipcMain.on('add-to-microlist', (event, params) => {
    console.log('add-to-microlist', params)
    let msgInfo = {
      command_id: 210004,
      data: { user_id: params.nn_id }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 设置用户的打字状态
  ipcMain.on('room-set-user-word-forbid', (event, params) => {
    console.log('room-set-user-word-forbid', params)
    let msgInfo = {
      command_id: 200017,
      data: {
        user_id: params.nn_id,
        forbid: !params.word_forbid
      }
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 增加一倍麦序时长
  ipcMain.on('increase-micro-time', (event, params) => {
    console.log('increase-micro-time', params)
    let msgInfo = {
      command_id: 210008,
      data: {}
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 移出排序/清空麦序
  ipcMain.on('remove-micro-list', (event, params) => {
    console.log('remove-micro-list', params)
    let msgInfo = {
      command_id: 210005,
      data: {
        user_id: ''
      }
    }
    if (params) {
      msgInfo.data.user_id = params.nn_id
    } else {
      msgInfo.data.user_id = 0
    }
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // 麦序上移/下移
  ipcMain.on('move-micro-list-order', (event, params) => {
    console.log('move-micro-list-order', params)
    let msgInfo = {
      command_id: 210006,
      data: {
        user_id: '',
        status: ''
      }
    }
    msgInfo.data.user_id = params.userInfo.nn_id
    msgInfo.data.status = params.status
    global.wsClient.send(JSON.stringify(msgInfo))
  })
  // ----------------------------------------------------------------------//

  // IM模块 =======================================================
  // 发送添加好友请求
  ipcMain.on('im-send-add-friend-msg', (event, params) => {
    let wsInfo = {
      command_id: 300002,
      data: {
        friend_id: params.nn_id,
        status: 1,
        validation_msg: '',
        friend_from: 1
      }
    }
    console.log('发送添加好友请求WS参数：', JSON.stringify(wsInfo))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(wsInfo))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 同意添加好友
  ipcMain.on('im-agree-add-friend', (event, params) => {
    let wsInfo = {
      command_id: 300002,
      data: {
        friend_id: params.nn_id,
        status: 2
      }
    }
    console.log('同意添加好友WS参数：', JSON.stringify(wsInfo))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(wsInfo))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 忽略添加好友
  ipcMain.on('im-ignore-add-friend', (event, params) => {
    let wsInfo = {
      command_id: 300002,
      data: {
        friend_id: params.nn_id,
        status: 4
      }
    }
    console.log('忽略添加好友WS参数：', JSON.stringify(wsInfo))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(wsInfo))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 删除好友
  ipcMain.on('im-del-friend', (event, params) => {
    let wsInfo = {
      command_id: 300005,
      data: {
        friend_id: params.nn_id
      }
    }
    console.log('删除好友WS参数：', JSON.stringify(wsInfo))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(wsInfo))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 删除会话
  ipcMain.on('im-del-chat', (event, params) => {
    let wsInfo = {
      command_id: 300006,
      data: {
        contact_id: params.nn_id
      }
    }
    console.log('删除会话WS参数：', JSON.stringify(wsInfo))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(wsInfo))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 发文字图片消息
  ipcMain.on('im-send-msg', (event, params) => {
    console.log('发文字图片消息参数', JSON.stringify(params))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(params))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 发送语音通话请求
  ipcMain.on('im-send-call', (event, params) => {
    console.log('发送语音通话请求', JSON.stringify(params))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(params))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 发送同意接听语音通话请求
  ipcMain.on('im-send-agree-call', (event, params) => {
    console.log('发送同意接听语音通话请求', JSON.stringify(params))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(params))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // 发送挂断/拒接通话请求
  ipcMain.on('im-send-hang-up', (event, params) => {
    console.log('发送挂断/拒接通话请求', JSON.stringify(params))
    if (global.wsClient) {
      global.wsClient.send(JSON.stringify(params))
    } else {
      console.log('ws不存在，无法发送ws消息')
    }
  })
  // IM模块 =======================================================
}
