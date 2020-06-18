<template>
  <div></div>
</template>

<script>
// import {
//   voiceChangerList,
//   voiceReverbPreset,
//   videoProfileList,
//   audioProfileList,
//   audioScenarioList,
//   APP_ID,
//   SHARE_ID,
//   RTMP_URL,
//   voiceReverbList
// } from '../../utils/agora-settings'
import AgoraRtcEngine from 'agora-electron-sdk'
import path from 'path'
import os from 'os'
const APP_ID = '6a7cffe477a748098e35c97ca9c32bae'
export default {
  data () {
    return {
      rtcEngine: null
    }
  },
  methods: {
    // 初始化声网
    startAgora () {
      if (!this.rtcEngine) {
        this.rtcEngine = new AgoraRtcEngine()
        this.rtcEngine.initialize(APP_ID)
        this.handleEvents(this.rtcEngine)
        /// 写入 日志
        let logpath = path.resolve(os.homedir(), './agoramain.sdk')
        this.rtcEngine.setLogFile(logpath)
      }
    },
    // 设置频道模式 0:通信 1:直播 2:游戏
    set_channel_type (id) {
      this.rtcEngine.setChannelProfile(id)
    },
    // 设置用户角色 1为主播 2为观众
    set_user_role (role) {
      this.rtcEngine.setClientRole(role)
    },
    // 设置音频编码配置并启用音频
    set_audio_config () {
      this.rtcEngine.setAudioProfile(0, 1)
    },
    // 启用音频模块
    start_audio () {
      console.log('start-audio')
      this.rtcEngine.enableAudio()
    },
    // 关闭音频模块
    stop_audio () {
      console.log('stop-audio')
      this.rtcEngine.disableAudio()
    },
    // 与web版互通
    enable_web_sdk () {
      this.rtcEngine.enableWebSdkInteroperability(true)
    },
    // 设置本地变声Num 0 原生 1大叔 2少女 3哥布林 4 猪八戒(弃用) 5 空灵 6 绿巨人(弃用)
    set_local_voice_changer (id) {
      this.rtcEngine.setLocalVoiceChanger(id)
    },
    // 音量提示(提示间隔ms>=200,平滑系数)
    volumn_indication () {
      this.rtcEngine.enableAudioVolumeIndication(1000, 3)
    },
    // 关闭视频模块
    kill_Video () {
      this.rtcEngine.disableVideo()
    },
    // 声卡采集 (用于播放背景音乐)
    loopback_record (bool) {
      this.rtcEngine.enableLoopbackRecording(bool)
    },
    // 是否发送音频流
    start_stop_audio (bool) {
      this.rtcEngine.muteLocalAudioStream(bool)
    },
    // 离开频道
    leave_channel () {
      this.rtcEngine.leaveChannel()
    },
    // 加入频道
    join_channel (channel, uid) {
      // 创建声网
      this.startAgora()
      // 设置频道模式
      this.set_channel_type(1)
      // 设置用户角色
      this.set_user_role(1)
      // 关闭视频
      this.kill_Video()
      // 启用音频
      this.set_audio_config()
      // 开启音频模块
      this.start_audio()
      // 与web互通
      this.enable_web_sdk()
      // 设置原生
      this.set_local_voice_changer(0)
      // 采集声卡
      // this.loopback_record(true)
      // console.log(channel, uid)
      // 加入聊天频道 (token:Str,channel:Str,info:Str,uid:Number)
      this.rtcEngine.joinChannel(null, channel, '', Number(uid))
    },
    // 监听声网响应
    handleEvents (rtc) {
      // 声网警告提示
      rtc.on('warning', (warn, msg) => {
        console.log(msg)
      })
      // 声网错误提示
      rtc.on('error', err => {
        console.log(err)
      })
      // 加入声网频道提示
      rtc.on('joinedChannel', (channel, uid, elapsed) => {
        console.log(`join-agora-success,channel:${channel},uid:${uid}`)
      })
      // 其他人加入声网的提示
      rtc.on('userjoined', (uid, elapsed) => {
        console.log(`user-join-agora-success,uid:${uid}`)
      })
      // 声网自动重连提示
      rtc.on('rejoinedChannel', (channel, uid, elapsed) => {
        console.log(`rejoin-agora-success,channel:${channel},uid:${uid}`)
      })
      // 声网提示谁在说话回调(Num,Num,Num,Num)
      rtc.on(
        'audioVolumeIndication',
        (uid, volumn, speakerNumber, totalVolumn) => {
          console.log(`audioVolumeIndication,uid:${uid},volumn:${volumn}`)
        }
      )
      rtc.on('userMuteAudio ', (uid, muted) => {
        console.log(`userMuteAudio,uid:${uid},muted:${muted}`)
      })
      // 群组提示谁在说话回调(arr,Num,Num)
      rtc.on(
        'groupAudioVolumeIndication',
        (speakers, speakerNumber, totalVolume) => {
          console.log(`groupAudioVolumeIndication,speakers:${speakers}`)
        }
      )
      // 离开房间的回调
      rtc.on('leaveChannel', () => {})
      // 发布音频流的回调
      rtc.on('streamPublished', (url, error) => {
        console.log(`url: ${url}, err: ${error}`)
      })
      // 音频流停止的回调
      rtc.on('streamUnpublished', url => {
        console.log(`url: ${url}`)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>