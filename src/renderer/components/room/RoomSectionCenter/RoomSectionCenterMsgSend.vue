<template>
  <!-- 房间发送消息的区域 -->
  <div
    class="room-section-center-msg-send-wrap"
    v-if="!$store.state.room.currentRoomInfo.word_forbid &&  !$store.state.room.myTypeStatus"
  >
    <el-input
      :placeholder="placeholder"
      :rows="5"
      @keydown.native.enter="sendmsg"
      class="chat-textarea"
      resize="none"
      type="textarea"
      v-model="textarea"
    ></el-input>
    <!-- 发送语音按钮 -->
    <div @mousedown.prevent="recordingAudio" class="room-chat-send-micro">
      <!-- <img src="@/assets/img/icon/micphone.png" alt /> -->
      <div class="audio_box" v-show="audio_box">
        <img :src="send_sound_gif" alt style="width:80px; margin-bottom:8px;" />
      </div>
      <div class="audio_hover" v-show="!audio_box">
        <img :src="send_sound" class="icon-audio" />
      </div>
    </div>
    <!-- 发送消息按钮 -->
    <div @click="sendmsg" class="room-section-center-msg-send-sendmsg-btn">{{btnTxt}}</div>
  </div>
  <div class="room-section-center-msg-forbid-wrap" v-else>当前禁止打字</div>
</template>

<script>
import RoomMsgSendEmoji from './components/RoomMsgSendEmoji'
import RoomMsgSendAudio from './components/RoomMsgSendAudio'
import RoomMsgSendPicture from './components/RoomMsgSendPicture'
import baseURL from '../../../../main/api/baseURL'
import { ipcRenderer, remote, session } from 'electron'
import Recorder from 'js-audio-recorder'
import axios from '../../../../main/api/axios'
export default {
  data () {
    return {
      placeholder: '请输入聊天内容',
      // 发送语音动态图
      send_sound_gif: require('@/assets/img/room/icon/send_sound.gif'),
      send_sound: require('@/assets/img/room/icon/send_sound.png'),
      textarea: '',
      // 按钮文字
      btnTxt: '发送',
      //   语音消息是否显示边框
      audio_box: false,
      recorder: null,
      // 录音时长
      audioTime: Number,
      addEmoji: false
    }
  },
  created () {},
  mounted () {
    // 松开发送语音按钮
    document.onmouseup = () => {
      if (this.audio_box) {
        this.audio_box = false
        this.stopAudio()
      }
    }
  },
  props: ['sendToOne_'],
  methods: {
    // @时修改placeholder
    changePlaceHolder (item) {
      this.placeholder = item
    },
    // 给Textarea添加emoji
    textAreaAddEmoji (text) {
      this.textarea += text
    },
    // 发送消息
    sendmsg (e) {
      e.cancelBubble = true
      e.preventDefault()
      e.stopPropagation()
      if (/^\s*$/g.test(this.textarea)) {
        this.$notify.error({
          message: '请输入聊天内容',
          title: '错误',
          duration: 2000
        })
        this.textarea = ''
        return
      }
      if (this.textarea.length > 200) {
        return this.$notify.error({
          message: '您输入的字符超过200,请重新输入!',
          title: '错误',
          duration: 2000
        })
      }
      this.$store.dispatch('setRoomMsgContent', this.textarea)
      // type = 1 我发的全部消息 2 我对别人发的消息
      // 文字消息
      if (this.sendToOne_.nn_id) {
        ipcRenderer.send('send-txt-msg', {
          type: 2,
          msginfo: this.textarea,
          toUser: this.sendToOne_
        })
      } else {
        ipcRenderer.send('send-txt-msg', {
          type: 1,
          msginfo: this.textarea
        })
      }

      this.textarea = ''
    },
    // 按下发送语音按钮
    recordingAudio () {
      this.audioTime = 0
      this.audio_box = true
      console.log('start recording')
      this.recorder = new Recorder()
      this.recorder.start()
      this.recorder.onprogress = params => {
        this.audioTime = String(Math.ceil(params.duration))
        this.btnTxt = this.audioTime + 's'
        if (this.audioTime >= 10) {
          this.stopAudio()
          this.audio_box = false
          this.btnTxt = '发送'
        }
      }
    },
    // 松开发送语音按钮
    stopAudio () {
      this.recorder.stop()
      this.audio_box = false
      this.btnTxt = '发送'

      // if (!this.audioTime) {
      //   this.$message.warning('未检测到音频输入设备!')
      //   return
      // }
      if (this.audioTime < 2) {
        this.$message.warning('语音消息时间过短,请重新发送!')
        this.recorder.destroy().then(() => {
          this.recorder = null
        })
      } else {
        // 获取语音文件
        let file = this.recorder.getWAVBlob()
        console.log(file)
        const formData = new FormData()
        formData.append('file', file)

        // 存储语音消息
        axios
          .post(baseURL.imgPath + '/upload/audio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(res => {
            console.log(res)
            if (res.data.code === 0) {
              // 语音消息
              if (this.sendToOne_.nn_id) {
                ipcRenderer.send('send-audio-msg', {
                  type: 2,
                  msginfo: res.data.data.url,
                  voice_duration: this.audioTime,
                  toUser: this.sendToOne_
                })
              } else {
                ipcRenderer.send('send-audio-msg', {
                  type: 1,
                  msginfo: res.data.data.url,
                  voice_duration: this.audioTime
                })
              }

              this.$store.dispatch('setRoomMsgContent', {
                content: res.data.data.url,
                sec: this.audioTime
              })
              this.recorder.destroy().then(() => {
                this.recorder = null
                this.audioTime = ''
              })
            } else {
              this.$notify.error({
                message: res.msg,
                title: '错误'
              })
            }
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.room-section-center-msg-send-wrap {
  position: relative;
  /deep/ .el-textarea__inner {
    outline: none;
    border: none;
  }
  // 发送语音按钮
  .room-chat-send-micro {
    cursor: pointer;
    // 动态语音图片盒子
    .audio_box {
      // display: none;
      position: absolute;
      right: 10px;
      bottom: 57px;
      width: 80px;
      height: 30px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(245, 245, 245, 1) 100%
      );
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 30px;
      border: 1px solid rgba(204, 204, 204, 1);
    }
    .audio_hover .icon-audio {
      position: absolute;
      bottom: 6px;
      right: 32px;
    }
    // 静态语音图标
    .icon-audio {
      width: 16px;
      height: 16px;
    }
    // 静态语音图标外盒子
    .audio_hover {
      position: absolute;
      right: 10px;
      bottom: 57px;
      width: 80px;
      height: 30px;
      background: transparent;
      border-radius: 30px;
      border: 1px solid transparent;
    }
    .audio_hover:hover {
      border: 1px solid rgba(204, 204, 204, 1);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    }
  }
  // 发送消息按钮
  .room-section-center-msg-send-sendmsg-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(245, 245, 245, 1) 100%
    );
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 14px;
    cursor: pointer;
    text-align: center;
  }
}
.room-section-center-msg-forbid-wrap {
  line-height: 151px;
  text-align: center;
  font-size: 16px;
}
</style>