<template>
  <!-- 频道房间 -->
  <div class="room-wrap">
    <RoomHeader class="room-header" />
    <div class="room-content">
      <RoomAsideLeft :roomInfo="roomInfo" />
      <RoomSectionCenter @beExitRoomFromMsgInfo="beExitRoomFromCenter" ref="room_section_center" />
      <RoomAsideRight
        :roomInfo="roomInfo"
        @myVoiceStatus="myVoiceStatus"
        @sendToOneFromUser="sendToOneFromAsideRight"
        ref="room_aside_right"
      />
    </div>
    <RoomFooter
      @change_voice="change_voice"
      @start_accompany="start_stop_accompany"
      class="room-footer"
    />
    <agora ref="start_agora" />
  </div>
</template>

<script>
import RoomHeader from '../components/room/RoomHeader/RoomHeader'
import RoomAsideLeft from '../components/room/RoomAsideLeft/RoomAsideLeft'
import RoomSectionCenter from '../components/room/RoomSectionCenter/RoomSectionCenter'
import RoomAsideRight from '../components/room/RoomAsideRight/RoomAsideRight'
import RoomFooter from '../components/room/RoomFooter/RoomFooter'
import agora from '../components/agora/agora'

import { ipcRenderer, remote, session } from 'electron'
import { getCurrentToken, getCurrentUserInfo } from '../common'

import { Storage } from '../../main/db/dbStore'
import md5 from 'js-md5'
import { Store } from 'vuex'

export default {
  name: 'room',
  data () {
    return {
      roomInfo: {},
      delay: null
    }
  },
  components: {
    RoomHeader,
    RoomAsideLeft,
    RoomSectionCenter,
    RoomAsideRight,
    RoomFooter,
    agora
  },
  methods: {
    sendToOneFromAsideRight (data) {
      this.$refs.room_section_center.$refs.room_section_center_toolbar.addSendToOneList(
        data
      )
    },
    beExitRoomFromCenter (data) {
      this.$refs.room_aside_right.$refs.room_all_user.$refs.RoomBombExitRoom.open(
        data
      )
    },
    // 打开关闭伴奏
    start_stop_accompany (data) {
      if (data === 1) {
        this.$refs.start_agora.loopback_record(true)
      } else {
        this.$refs.start_agora.loopback_record(false)
      }
    },
    // 改变声音
    change_voice (data) {
      if (data === 1) {
        this.$refs.start_agora.set_local_voice_changer(0)
      } else if (data === 2) {
        this.$refs.start_agora.set_local_voice_changer(1)
      } else if (data === 3) {
        this.$refs.start_agora.set_local_voice_changer(2)
      } else if (data === 4) {
        this.$refs.start_agora.set_local_voice_changer(3)
      } else if (data === 5) {
        this.$refs.start_agora.set_local_voice_changer(5)
      }
    },
    // 设置我是否能说话
    async myVoiceStatus (data) {
      console.log(this.$refs.start_agora._isMounted)
      if (this.$refs.start_agora._isMounted) {
        this.$refs.start_agora.start_stop_audio(data)
      }
    }
  },
  created () {
    console.log(
      // remote.getGlobal('myNNID'),
      // Storage.get('token' + remote.getGlobal('myNNID')),
      getCurrentToken(),
      getCurrentUserInfo()
    )
    // 获取房间的no
    let roomId = this.$route.query.roomid
    let id = getCurrentUserInfo().nn_id
    ipcRenderer.on('ws-is-true-false', (event, params) => {
      console.log('ws-is-true-false', params)
      if (params.istrue) {
        ipcRenderer.send('enter-to-room', roomId)
      } else {
        let token = getCurrentToken()
        console.log('room-创建-ws')
        ipcRenderer.send('establish-ws', token)
      }
    })

    // 获取游客身份
    // ipcRenderer.on('acquire-tourist-status', (event, params) => {
    //   console.log('acquire-tourist-status: ', event, params)
    // })
    ipcRenderer.send('getRoomConfig')
    // 获取房间配置成功
    ipcRenderer.on('getRoomConfigSuccess', (event, params) => {
      console.log('getRoomConfig', params)
      if (params.data.code === 0) {
        this.$store.dispatch(
          'setRoomClothesList',
          params.data.data.channel_role
        )
        this.$store.dispatch('setRoomEmojiList', params.data.data.im_face)
      }
    })
    // ws登录成功
    ipcRenderer.on('ws-login-success', (event, params) => {
      console.log('ws-login-success: ', params)
      ipcRenderer.send('enter-to-room', roomId)
    })
    // 进入频道成功
    ipcRenderer.on('enter-room-success', (event, params) => {
      console.log('enter-room-success', params)
      if (params.code === 0) {
        this.roomInfo = params.data.sub_channel_detail

        this.$store.dispatch('setRoomInfo', params.data)
        this.$store.dispatch(
          'setCurrentRoomInfo',
          params.data.sub_channel_detail
        )
        let users = params.data.sub_channel_detail.users
        let id = Storage.get('nn_id')
        for (let i = 0; i < users.length; i++) {
          if (users[i].nn_id === id) {
            this.$store.dispatch('setUserInfo', users[i])
            this.$store.dispatch('setMyTypeStatus', users[i].word_forbid)
          }
        }
        // 加入声网聊天频道
        this.$refs.start_agora.join_channel(
          md5(`nn${params.data.sub_channel_detail.sub_channel_id}`),
          Number(id)
        )
        setTimeout(() => {
          if (params.data.sub_channel_detail.style_extra.chat_mode === 1) {
            this.$refs.start_agora.start_stop_audio(true)
          } else {
            this.$refs.start_agora.start_stop_audio(false)
          }
        }, 0)
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg
        })
        setTimeout(() => {
          window.close()
        }, 1000)
      }
    })
    // 进入子频道成功
    ipcRenderer.on('enter-child-room-success', (event, params) => {
      console.log('enter-child-room-success', params)
      this.$store.dispatch('setCurrentRoomInfo', params.data)
      let users = params.data.users
      for (let i = 0; i < users.length; i++) {
        if (users[i].nn_id === id) {
          this.$store.dispatch('setUserInfo', users[i])
        }
      }
      // 退出原来的声网频道
      this.$refs.start_agora.leave_channel()
      // 加入新的声网频道
      this.$refs.start_agora.join_channel(
        md5(`nn${params.data.sub_channel_id}`),
        Number(id)
      )
    })
    // 登录态失效
    ipcRenderer.on('token-expired', (event, params) => {
      this.$notify.error({
        title: '提示',
        message: '登录状态过期,请重新登录'
      })
      ipcRenderer.send('leave-room')
      window.close()
    })
  },
  mounted () {
    // 未登录进入房间请求游客身份
    // remote.session.defaultSession.cookies.get({}, (e, cookies) => {
    //   // 判断是否有token
    //   let isLogin = cookies.some(e => {
    //     return e.name === 'token'
    //   })
    //   if (!isLogin) {
    //     ipcRenderer.send('request-tourist-status', (event, params) => {
    //       console.log('request-tourist-status: ', event, params)
    //     })
    //   }
    // })
    let token = getCurrentToken()
    // let ws = 'ws:192.168.3.69:50001'

    // 判断ws是否存在
    ipcRenderer.send('ws-is-true')
  },
  destroyed () {
    ipcRenderer.send('leave-room')
  }
}
</script>

<style lang="less" scoped>
.room-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-header {
    width: 100%;
    height: 100px;
  }
  .room-content {
    margin: 10px;
    // width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .room-footer {
    height: 40px;
  }
}
</style>
