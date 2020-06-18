<template>
  <div class="phone-widnow">
    <!-- 来电者头像 作为底部图层进行模糊处理 -->
    <div class="voice-call-img-box">
      <el-image :src="chatterInfo.avatar" class="voice-call-img" fit="cover"></el-image>
    </div>
    <!-- 来电界面 -->
    <div class="voice-call">
      <!-- 来电者头像 -->
      <el-image :src="chatterInfo.avatar" class="voice-chat-caller-img-avatar" fit="cover"></el-image>
      <br />
      <br />
      <!-- 来电者昵称 -->
      <div style="margin-top: -10px;">
        <span class="voice-chat-caller-name">{{chatterInfo.nickname}}</span>
        <br />
        <br />
        <br />
        <!-- 通话状态 -->
        <span class="voice-chat-status">{{voiveCallStatus}}</span>
      </div>
      <!-- 底部的图标 -->
      <div class="voice-chat-caller-bottom">
        <el-image
          :src="onCall"
          @click="answerCall"
          class="voice-chat-caller-img-oncall"
          fit="cover"
          v-show="showOnCall"
        ></el-image>
        <el-image
          :src="offCall"
          @click="cancelCall"
          class="voice-chat-caller-img-offcall"
          fit="cover"
          v-show="showCancelCall"
        ></el-image>
      </div>
    </div>
    <agora ref="agora_instance" />
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import md5 from 'js-md5'
import agora from '../../agora/agora'
import contextMenuRight from '../../room/contextMenu/contextMenu'

export default {
  data () {
    return {
      //
      voiceCallsVisible: false,
      // 接听电话icon显示标示
      showOnCall: true,
      // 挂断/拒接电话icon显示标示
      showCancelCall: true,
      // 挂断电话的icon
      offCall: require('@/components/im/imgs/calloff2.png'),
      // 接听电话的icon
      onCall: require('@/components/im/imgs/call2.png'),
      chatterInfo: {
        nickname: '陈大饼',
        avatar:
          'https://static.nn.com/image/2019/11/4/10/5/36/fc9dd6f91da9543f493677fe0db1c63f.png'
      },
      // chatterInfo2: {
      //   avatar:
      //     'https://static.nn.com/image/2019/11/1/18/0/14/7216446a42c4351442264b5bccb6a97a.png',
      //   friend_info: {
      //     friend_from: 1,
      //     friend_remark: '陈三饼'
      //   },
      //   friend_verification_type: 1,
      //   gender: 2,
      //   last_msg: 'https://static.nn.com/image/face/1x/捂嘴笑.png',
      //   nickname: '陈三饼',
      //   nn_id: 100588,
      //   special_nn_id: 0,
      //   time: '19:13',
      //   unread_count: 11
      // },
      userInfo: {},
      isCaller: true,
      voiveCallStatus: '通话中',
      // 是否加入频道
      isJoinedChannel: false
    }
  },
  components: {
    agora
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.NN_IM_LOG('isCaller', this.isCaller)
      if (this.isCaller) {
        // 拨打电话
        this.senCall()
      } else {
        // 接听或者拒接电话
        // TODO 设置UI状态为来电
        this.setPhoneUI('onCall')
      }
    },
    // 设置语音电话UI状态
    setPhoneUI (type) {
      switch (type) {
        case 'call':
          // 拨打电话 连接网络
          // this.voiceCallsVisible = true
          this.voiveCallStatus = '拨号中...'
          this.showOnCall = false
          this.showCancelCall = true
          break
        case 'wait':
          // 声网连接成功 已加入频道
          // this.voiceCallsVisible = true
          this.voiveCallStatus = '正在等待对方接受邀请'
          this.showOnCall = false
          this.showCancelCall = true
          break
        case 'onCall':
          // 接到电话 等待处理
          // this.voiceCallsVisible = true
          this.voiveCallStatus = '你有一个语音通话'
          this.showOnCall = true
          this.showCancelCall = true
          break
        case 'refuse':
          // 已拒绝
          this.voiveCallStatus = '已拒绝'
          this.showOnCall = false
          this.showCancelCall = true
          setTimeout(() => {
            // TODO
            this.closePhoneWindow()
          }, 1000)
          break
        case 'chatting':
          // 通话中
          this.voiceCallsVisible = true
          this.voiveCallStatus = '正在通话中'
          this.showOnCall = false
          this.showCancelCall = true
          break
        case 'off':
          // 挂断
          this.voiveCallStatus = '已挂断'
          this.showOnCall = false
          this.showCancelCall = true
          setTimeout(() => {
            // TODO
            this.closePhoneWindow()
          }, 1000)
          break
        // case 'busy':
        //   // 通话忙
        //   this.voiveCallStatus = '对方正在通话中'
        //   this.showOnCall = false
        //   this.showCancelCall = true
        //   setTimeout(() => {
        //     this.voiceCallsVisible = false
        //   }, 1000)
        //   break
        case 'offLine':
          // 对方不在线
          this.voiveCallStatus = '对方不在线或正在通话中'
          this.showOnCall = false
          this.showCancelCall = true
          setTimeout(() => {
            // TODO
            this.closePhoneWindow()
          }, 3000)
          break
        default:
          break
      }
    },
    // 拨打电话
    senCall () {
      this.NN_IM_LOG('拨打电话 连接网络')
      // 更新电话状态-拨号中
      this.setPhoneUI('call')
      // 加入频道
      this.$refs.agora_instance.join_channel(
        `nn-${this.userInfo.nn_id}-${this.chatterInfo.nn_id}`,
        this.userInfo.nn_id
      )
      this.isJoinedChannel = true
      // 更新电话状态-等待对方应答
      setTimeout(() => {
        this.setPhoneUI('wait')
      }, 1000)
      // 给对方发送请求通话的ws请求
      let params = {
        command_id: 300003,
        data: {
          friend_id: this.chatterInfo.nn_id,
          status: 1
        }
      }
      ipcRenderer.send('im-send-call', params)
      this.NN_IM_LOG('拨打语音电话给：', this.chatterInfo.nickname)
    },
    // 接听电话
    answerCall () {
      this.NN_IM_LOG('接听电话')
      // 连接声网 加入频道
      this.$refs.agora_instance.join_channel(
        `nn-${this.chatterInfo.nn_id}-${this.userInfo.nn_id}`,
        this.userInfo.nn_id
      )
      this.isJoinedChannel = true
      setTimeout(() => {
        // 设置电话界面
        this.setPhoneUI('chatting')
      }, 1000)
      // 方发送同意接听的ws请求 告诉拨打者 我已接听
      let params = {
        command_id: 300003,
        data: {
          friend_id: this.chatterInfo.nn_id,
          status: 6
        }
      }
      ipcRenderer.send('im-send-agree-call', params)
      this.NN_IM_LOG('告诉拨打者 我已接听 对方的id=', this.chatterInfo.nickname)
    },
    // 挂断/拒绝语音通话
    cancelCall () {
      this.NN_IM_LOG('挂断电话')
      // 离开声网频道
      this.NN_IM_LOG('this.$refs.agora_instance=', this.$refs.agora_instance)
      if (this.isJoinedChannel) {
        this.$refs.agora_instance.leave_channel()
        this.isJoinedChannel = false
      }
      // 更新ui状态
      this.setPhoneUI('off')
      // 关闭电话窗口
      setTimeout(() => {
        this.closePhoneWindow()
      }, 1000)
      // 给对方发送挂断/拒接通话的ws请求
      let params = {
        command_id: 300003,
        data: {
          friend_id: this.chatterInfo.nn_id,
          // 为了简化逻辑 此处将挂断和拒绝统一作为挂断处理
          status: 9
        }
      }
      ipcRenderer.send('im-send-hang-up', params)
      console.info('发送挂断/拒绝的消息给:' + this.currentVoiceChatterId)
    },
    // 关闭此窗口
    closePhoneWindow () {
      ipcRenderer.send('im-close-phone-window')
    }
  },

  created () {
    // 初始化
    this.chatterInfo = JSON.parse(this.$route.query.chatterInfo)
    this.userInfo = JSON.parse(this.$route.query.userInfo)
    this.isCaller = this.$route.query.isCaller === 'true'

    this.NN_IM_LOG('chatterInfo=', this.chatterInfo)
    this.NN_IM_LOG('userInfo=', this.userInfo)
    /* hppt请求结果的回调 */
    /* ws回执 */
    // 发送语音通话请求
    ipcRenderer.on('ws-send-call-repsonse', (event, params) => {
      this.NN_IM_LOG('收到发送语音通话请求的回执', params)
      if (params.code === 0) {
        // TODO
      } else {
        // 连接异常 不在线或正在通话中 主动挂断电话
        this.setPhoneUI('off')
        // 退出原来的声网频道
        this.NN_IM_LOG('this.$refs.agora_instance=', this.$refs.agora_instance)
        if (this.isJoinedChannel) {
          this.$refs.agora_instance.leave_channel()
          this.isJoinedChannel = false
        }
        // 给对方发送挂断/拒接通话的ws请求
        let params = {
          command_id: 300003,
          data: {
            friend_id: this.chatterInfo.nn_id,
            // 为了简化逻辑 此处将挂断和拒绝统一作为挂断处理
            status: 9
          }
        }
        ipcRenderer.send('im-send-hang-up', params)
        console.info('发送挂断/拒绝的消息给:' + this.currentVoiceChatterId)
      }
    })
    /*
      ws广播
    */
    // 收到对方已同意接听语音电话的广播
    ipcRenderer.on('ws-send-call-be-agreed', (event, params) => {
      this.NN_IM_LOG('对方已同意接听', JSON.stringify(params))
      this.setPhoneUI('chatting')
    })
    // 收到对方已拒绝或挂断语音电话的广播
    ipcRenderer.on('ws-send-call-be-hangup', (event, params) => {
      this.NN_IM_LOG('对方已挂断/拒绝', JSON.stringify(params))
      this.setPhoneUI('off')
      // 离开省网频道
      this.NN_IM_LOG('this.$refs.agora_instance=', this.$refs.agora_instance)
      if (this.isJoinedChannel) {
        this.$refs.agora_instance.leave_channel()
        this.isJoinedChannel = false
      }
      setTimeout(() => {
        this.closePhoneWindow()
      }, 1500)
    })
    // 发送语音通话请求

    // ipcRenderer.on('ws-send-call-broadcast', (event, params) => {
    //   this.NN_IM_LOG('收到发送语音通话请求的广播1', JSON.stringify(params))
    // })
  }
}
</script>

<style lang="less" scoped>
.phone-widnow {
  width: 300px;
}
.voice-call-img-box {
  position: relative;
  width: 300px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center; /* 使用flex将图片水平垂直居中 */
  overflow: hidden; /* 溢出部分隐藏 */
  background-color: rgba(0, 0, 0, 0.6);
}
.voice-call-img {
  width: 300px;
  height: 500px;
  filter: blur(50px);
  opacity: 0.8;
  // Saturate（饱和)
  // filter: Saturate(0);
}
.voice-call-img-box {
  position: relative;
  width: 300px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center; /* 使用flex将图片水平垂直居中 */
  overflow: hidden; /* 溢出部分隐藏 */
  background-color: rgba(0, 0, 0, 0.6);
}
.voice-call {
  position: relative;
  width: 300px;
  height: 320px;
  // background-color: #3333331c;
  margin-top: -320px;
  text-align: center;
  top: -40px;
}
.voice-chat-caller-img-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
}
.voice-chat-caller-name {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}
.voice-chat-status {
  font-size: 12x;
  color: #fff;
}
.voice-chat-caller-img-oncall {
  position: relative;
  width: 50px;
  height: 50px;
  margin: auto;
  cursor: pointer;
  margin-right: 30px;
}
.voice-chat-caller-img-offcall {
  position: relative;
  width: 50px;
  height: 50px;
  margin: auto;
  cursor: pointer;
}
.voice-chat-caller-bottom {
  width: 100%;
  height: 100px;
  text-align: center;
  margin-top: 60px;
}
</style>
