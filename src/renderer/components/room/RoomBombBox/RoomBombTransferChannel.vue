<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    @close="close"
    class="transferChannel"
    title="转让频道"
    width="500px"
  >
    <p>查找转让人ID</p>
    <el-input
      class="transferChannel_searchUser"
      placeholder="请输入对方的NN号"
      type="number"
      v-model="UserNNnumber"
    >
      <i @click="searchUser" class="el-input__icon el-icon-search" slot="suffix"></i>
    </el-input>
    <div class="transferChannel_tip">说明：频道转让后您将不在拥有该频道的使用权，请慎重操作！</div>
    <div class="transferChannel_searchinfo" v-if="searchInfo">
      <div style="margin-left:10px;display:flex;align-items:center">
        <el-avatar :size="25" :src="searchInfo.avatar" shape="square"></el-avatar>
        <span style="margin-left:9px;">{{searchInfo.nickname}}</span>
      </div>
      <div class="transferChannel_searchinfo_nn_id">ID:{{searchInfo.nn_id}}</div>
    </div>
    <div class="transferChannel_user_sendcode">
      <p class="info">手机号码：{{user_mobile}}</p>
      <div class="sendcode">
        <span style="width:61px">验证码：</span>
        <el-input
          class="inpt-code"
          placeholder="请输入验证码"
          size="small"
          style="width:180px;height:32px;margin-right:12px;line-height;32px;margin-left:9px"
          v-model="code"
        ></el-input>
        <el-button
          :disabled="isSend"
          @click="sendCode()"
          size="small"
          style="color:rgba(78,74,252,1);border:1px solid rgba(78,74,252,1);"
        >{{isSend&&time>0?(time+'s'):'获取验证码'}}</el-button>
      </div>
      <div class="transferChannel_button">
        <el-button
          @click="onSubmit"
          size="large"
          style="color:rgba(78,74,252,1);border:1px solid rgba(78,74,252,1);margin-left:120px;width:120px;margin-right:21px"
        >确定</el-button>
        <el-button @click="close" size="large" style="width:120px">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import baseURL from '../../../../main/api/baseURL'
import { DB, Storage } from '../../../../main/db/dbStore'
import axios from 'axios'
import { remote } from 'electron'
import { getCurrentToken } from '../../../common'
export default {
  data () {
    return {
      dialogVisible: false,
      UserNNnumber: '',
      //   searchInfo: {
      //     avatar:
      //       'https://static.nn.com/image/2019/11/11/10/6/12/d2d34694d4113d4b21ee3a96275da05b.png',
      //     nickname: '人类真正的强大是自我改变',
      //     nn_id: 100416
      //   },
      searchInfo: null,
      user_mobile: '',
      code: '',
      time: 60,
      timer: null,
      isSend: false
    }
  },
  watch: {
    roomInfo (newValue, oldValue) {},
    deep: true
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
    }
  },
  methods: {
    close () {
      this.code = ''
      this.UserNNnumber = ''
      this.dialogVisible = false
      this.searchInfo = null
      this.clearTime()
    },
    open () {
      this.user_mobile = Storage.get('phone')
      this.dialogVisible = true
    },
    searchUser () {
      var _this = this
      if (!this.UserNNnumber) {
        this.$message.warning('请先输入对方的NN号!')
        return
      }
      let url = `${baseURL.path}/api/v1/user/public/info`
      axios
        .post(
          url,
          { id: Number(this.UserNNnumber) },
          {
            headers: {
              Authorization: `Bearer ${getCurrentToken()}`
            }
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            _this.searchInfo = res.data.data
          } else {
            _this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
    },
    // 请求验证码
    async sendCode () {
      // 写死的国内的区号
      this.dialCode = 86

      const url = `${baseURL.path}/api/v1/sms/send`
      const data = {
        mobile: this.user_mobile,
        country_code: this.dialCode,
        type: 8
      }
      let res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${getCurrentToken()}`
        }
      })

      if (res.data.code === 0) {
        this.isSend = true
        this.timeOut()
        this.$notify({
          title: '^_^',
          message: '验证码已发送~',
          type: 'success'
        })
      } else {
        this.time = 0
        clearInterval(this.timer)
        this.$notify.error({
          title: '-_-',
          message: res.msg
        })
      }
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
    },
    async onSubmit () {
      if (!this.searchInfo) {
        this.$message.warning('请先搜索确认要转让的用户!')
        return
      }
      if (!this.code) {
        this.$message.warning('请输入验证码!')
        return
      }
      let url = `${baseURL.path}/api/v1/channel/transfer`
      axios
        .post(
          url,
          {
            channel_no: Number(this.$route.query.roomid),
            code: this.code,
            user_id: Number(this.searchInfo.nn_id)
          },
          {
            headers: {
              Authorization: `Bearer ${getCurrentToken()}`
            }
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '频道转让成功'
            })

            let id = JSON.parse(localStorage.userInfo_nn).id
            this.UserNNnumber = ''
            this.code = ''
            this.dialogVisible = false
            this.clearTime()
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.transferChannel {
  p {
    height: 24px;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(48, 48, 51, 1);
    line-height: 24px;
    text-align: center;
    margin: 27px 0 16px;
  }
  .transferChannel_searchUser {
    width: 403px;
    height: 42px;
    line-height: 42px;
    margin-left: 49px;
    i {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .transferChannel_tip {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(201, 97, 97, 1);
    line-height: 19px;
    margin-left: 50px;
    margin-top: 6px;
  }
  .transferChannel_searchinfo {
    width: 400px;
    height: 40px;
    border-radius: 5px;
    margin-left: 51px;
    background-color: #f7f7f7;
    margin-top: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .transferChannel_searchinfo_nn_id {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      line-height: 20px;
      margin-right: 12px;
    }
  }
  .transferChannel_user_sendcode {
    .info {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin-left: 50px;
      text-align: left;
    }
    .sendcode {
      margin-left: 50px;
      display: flex;
      align-items: center;
    }
  }
  .transferChannel_button {
    display: flex;
    align-items: center;
    margin-top: 41px;
    padding-bottom: 30px;
  }
}
</style>