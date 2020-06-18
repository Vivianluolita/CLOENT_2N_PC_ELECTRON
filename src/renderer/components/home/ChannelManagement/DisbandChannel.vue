<!--解散频道-->
<template>
  <el-dialog
    :before-close="onClose"
    :close-on-click-modal="false"
    :visible.sync="delChannelDialogVisible"
    append-to-body
    class="disband-channel-dialog"
    height="273px"
    width="376px"
  >
    <!-- title -->
    <div class="dialog-title">
      <span style="font-size: 16px;">解散频道</span>
    </div>
    <!-- content -->
    <div class="nn-box">
      <p class="info">为了您的资产安全，请先验证手机号</p>
      <p class="info">绑定手机号：{{getUserMobile}}</p>
      <br />
      <div style="display: flex; justify-content: center;">
        <el-input class="inpt-code" placeholder="请输入验证码" size="mini" v-model="code"></el-input>
        <el-button
          :disabled="isSend"
          @click="sendCode()"
          size="mini"
        >{{isSend&&time>0?(time+'s'):'获取验证码'}}</el-button>
      </div>
    </div>
    <!-- footer -->
    <div class="dialog-footer">
      <!-- <el-button @click="onSubmit" size="small" type="primary">确定</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="onClose()" size="small">取 消</el-button>-->
      <p @click="onSubmit" class="btn submit-btn">确定</p>
      <p @click="onClose" class="btn">取消</p>
    </div>
  </el-dialog>
</template>
<script>
import { DB, Storage } from '../../../../main/db/dbStore'
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      // 验证码
      code: '',
      userMobile: '',
      dialCode: '',
      time: 60,
      timer: null,
      isSend: false
    }
  },
  computed: {
    // 解散频道页面显示标识
    delChannelDialogVisible () {
      return this.$store.state.home.disbandChannelVisible
    },
    // 获取手机号
    getUserMobile () {
      this.userMobile = this.$store.state.public.publicUserInfo.mobile
      let hideMobile
      if (this.userMobile && this.userMobile.length > 0) {
        hideMobile =
          this.userMobile.substring(0, 3) +
          '****' +
          this.userMobile.substring(this.userMobile.length - 4)
      }
      return hideMobile
    }
    // user_mobile () {
    //   // 手机号加*，this.userMobile是完整的手机号
    //   // stroge会出问题，需要存到vuex
    //   let userMobile = this.$store.state.public.publicUserInfo.mobile
    //   userMobile =
    //     this.userMobile.substring(0, 3) +
    //     '****' +
    //     this.userMobile.substring(this.userMobile.length - 4)
    //   // 手机号加*，this.userMobile是完整的手机号
    //   return userMobile
    // }
  },
  destroyed () {
    // 获取验证码
    ipcRenderer.removeListener('code-send-res', this.codeSendRes)
    // 解散频道
    ipcRenderer.removeListener('disband-channel-res', this.disbandChannelRes)
  },
  created () {
    // 获取验证码
    ipcRenderer.on('code-send-res', this.codeSendRes)
    // 解散频道
    ipcRenderer.on('disband-channel-res', this.disbandChannelRes)
  },
  mounted () {
    // Storage.get('phone')
    // this.userMobile = Storage.get('phone')
    this.dialCode = Storage.get('country_code')
  },
  methods: {
    codeSendRes (event, params) {
      console.log('code-send-res:', params)
      if (params.data.code === 0) {
        this.isSend = true
        this.timeOut()
        this.$notify({
          title: '^_^',
          message: '验证码已发送~',
          type: 'success'
        })
      } else {
        if (params.data.msg) {
          this.$notify.error({
            title: '-_-',
            // message: '似乎发生了一些错误~'
            message: params.data.msg
          })
        }
      }
    },
    disbandChannelRes (event, params) {
      console.log('disband-channel-res:', params)
      if (params.data.code === 0) {
        this.$notify({
          title: '^_^',
          message: '解散频道成功~',
          type: 'success'
        })
        this.clearTime()
        this.$store.dispatch('ShowDisbandChannel', false)
        // 刷新我创建的频道列表
        let data = {
          page: 1,
          // 现在只能创建三个频道,需要修改
          limit: 3
        }
        ipcRenderer.send('my-channel-list', data)
        // 加载左侧下拉的数据
        let downData = {
          page: 1,
          limit: 3
        }
        ipcRenderer.send('get-my-channel', downData)
      } else {
        if (params.data.msg) {
          this.time = 0
          clearInterval(this.timer)
          this.$notify.error({
            title: '-_-',
            // message: '似乎发生了一些错误~'
            message: params.data.msg
          })
        }
      }
    },
    // 请求验证码
    sendCode () {
      const url = '/api/v1/sms/send'
      const data = {
        mobile: this.userMobile,
        country_code: this.dialCode,
        type: 7
      }
      ipcRenderer.send('code-send', data)
    },
    // 取消按钮
    onClose () {
      this.clearTime()
      this.$store.dispatch('ShowDisbandChannel', false)
    },
    // 提交
    onSubmit () {
      let selectedChannelNo = this.$store.state.home.selectedChannelNo
      let data = {
        channel_no: selectedChannelNo,
        code: this.code
      }
      ipcRenderer.send('disband-channel', data)
    },
    timeOut () {
      this.time = 60
      this.timer = setInterval(_ => {
        this.time--
        if (this.time < 0) {
          clearInterval(this.timer)
          // 重置
          this.isSend = false
        }
      }, 1000)
    },
    // 清除验证码的倒计时
    clearTime () {
      clearInterval(this.timer)
      this.isSend = false
      this.code = ''
    }
  }
}
</script>

<style lang="less" scoped>
.disband-channel-dialog {
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    padding: 0;
  }
  /deep/.el-button {
    margin-left: 9px;
    padding: 9px 15px;
    width: 100px;
    color: #303033;
  }
  .dialog-title {
    padding-left: 20px;
    height: 48px;
    text-align: left;
    line-height: 48px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  }
  .nn-box {
    position: relative;
    padding: 20px;
    height: 110px;
    .info {
      font-size: 14px;
      color: #303033;
      line-height: 28px;
    }
    .inpt-code {
      width: 205px;
      height: 32px;
      /deep/.el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .dialog-footer {
    padding: 11px 0 24px;
    width: 100%;
    height: 36px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 108px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      color: #999999;
      // border: 1px dashed #cccccc;
      border: 1px solid #cccccc;
      cursor: pointer;
    }
    .submit-btn {
      margin-right: 20px;
      width: 110px;
      height: 36px;
      color: #ffffff;
      border: none;
      background-image: linear-gradient(to bottom, #4444fc, #8e79fe);
    }
    .btn:hover {
      width: 110px;
      height: 36px;
      color: #ffffff;
      border: none;
      background-image: linear-gradient(to bottom, #4444fc, #8e79fe);
    }
  }
}
</style>


