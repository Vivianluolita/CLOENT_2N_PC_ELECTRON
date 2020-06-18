<template>
  <div class="changePhoneSecend-wrap">
    <div class="changePhoneSecend-title">绑定新手机号</div>
    <el-form :model="form" :rules="rules" :show-message="isShowError" ref="reqModel">
      <el-form-item class="changePhoneSecend-form-item" prop="mobile">
        <div class="changePhoneSecend-form-item-inputBox">
          <IntlTelInput :toFront="toFront" @excountry="excountry" countryCode="cn" />
          <el-input placeholder="请输入新手机号" v-model="form.mobile" />
        </div>
      </el-form-item>
      <el-form-item class="changePhoneSecend-form-item" prop="code">
        <div class="changePhoneSecend-form-inputBox">
          <el-input maxlength="4" placeholder="请输入验证码" v-model="form.code" />
          <el-button
            :class="clickCode ? 'clickBtn' : 'noClickBtn'"
            :disabled="codeDisable"
            @click="verifyPhone"
            class="changePhoneSecend-form-btn"
          >{{countDown}}</el-button>
        </div>
      </el-form-item>
      <div class="changePhoneSecend-form-next">
        <el-button @click="onNext" class>确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { checkPhoneIsBind, guestLogin } from '../../../../main/api/login'
import { getCurrentLoginType } from '../../../common'
import util from '../../../utils/util'
import { ipcRenderer, remote, session } from 'electron'
import IntlTelInput from '../../login/IntlTelInput/index'
import axios from '../../../../../src/main/api/axios'
import BASEURL from '../../../../main/api/baseURL'
import { setTimeout } from 'timers'
export default {
  data () {
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (this.Country_C === 86) {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          console.log(reg.test(value))
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        } else {
          console.log(',,,,..../////')
          // 其他国家只用判断是否为数字
          const reg = /^[0-9]*$/
          console.log(reg.test(value))
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
    }
    return {
      countDown: '获取验证码',
      codeDisable: false,
      timer: null,
      num: 60,
      isShowError: true,
      toFront: ['cn'],
      clickCode: false,
      form: {
        mobile: '',
        code: ''
      },
      Country_C: null,
      rules: {
        mobile: [{ validator: phone, trigger: ['change', 'blur'] }],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  components: {
    IntlTelInput
  },
  props: {
    info: Object
  },
  watch: {
    Country_C (val) {
      this.$refs['reqModel'].resetFields()
    }
  },
  destroyed () {
    ipcRenderer.removeListener('change-phone-res', this.changePhone)
    ipcRenderer.removeListener('check-phone-have-res', this.checkPhoneHaveRes)
  },
  created () {
    ipcRenderer.on('change-phone-res', this.changePhone)
    ipcRenderer.on('check-phone-have-res', this.checkPhoneHaveRes)

    this.Country_C = this.info.country_code
  },
  methods: {
    checkPhoneHaveRes (event, params) {
      console.log('checkPhoneHaveRes: ', params)
      if (params.code === 0) {
        if (!params.data.register) {
          let data = {
            ...{ country_code: this.info.country_code },
            ...this.form
          }
          console.log('register false: ', data)
          ipcRenderer.send('user-setting-updata-change-phone', data)
        } else {
          this.$message({
            message: '手机号已被注册',
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    },
    changePhone (event, params) {
      console.log('changePhone:  ', params)
      if (params.code === 0) {
        this.$message({
          message: '手机号绑定成功！',
          type: 'success'
        })
        this.$emit('changePhoneOk')
        // 登出入口，如果是游客登录，则不做一下操作
        if (getCurrentLoginType() !== 0) {
          this.$store.commit('savePublicToken', '')
          this.$store.dispatch('savePublicUserInfo', {})
          this.$emit('hiddenPop')
          let isLoginShow = this.$store.state.loginShow.isLoginShow
          // 清除global的nn_id
          ipcRenderer.send('home_save_nn_id', '')
          // 登出后进行游客登录
          this.guestLogin()
          // 清空足迹
          this.$store.dispatch('SetFootprintList', [])
          // this.$store.dispatch('loginBtnClick', 1)
          ipcRenderer.send('quit-login')
        }
        // 把主页还原到最开始的状态
        util.homeRestore()
        // 呼出登录框
        this.$store.dispatch('loginBtnClick', 1)
        // 断开websocket
        ipcRenderer.send('destroy-ws')
        // 关闭个人中心
        this.$store.dispatch('userSettingClick')
        // 获取当前的用户信息
        // ipcRenderer.send('user-setting-user-info')
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    },
    // 验证手机号
    verifyPhone () {
      let _this = this
      let data = {
        mobile: this.form.mobile,
        country_code: this.Country_C
      }
      checkPhoneIsBind(data)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data && !res.data.data.register) {
              if (_this.form.mobile) {
                _this.password_show = true
                // 发送验证码
                _this.getCode()
              } else {
                _this.$message.error('请输入手机号')
              }
            } else {
              _this.$notify({
                message: '手机号已被使用，请更换新手机号',
                type: 'error'
              })
            }
          } else {
            _this.$message.warning('网络异常，请重试')
          }
        })
        .catch(res => {
          _this.$message.warning('网络异常，请重试')
        })
    },
    getCode () {
      if (this.form.mobile === '' || this.form.mobile === null) {
        this.$message({
          message: '请输入新手机号',
          type: 'warning'
        })
        return false
      }
      this.codeDisable = true
      let data = {
        mobile: `${this.form.mobile}`,
        country_code: this.Country_C,
        type: 6
      }
      this.sendCode(data)
      // this.clickCode = true
      // clearInterval(this.timer)
      // this.timer = setInterval(() => {
      //   if (this.num === 0) {
      //     clearInterval(this.timer)
      //     this.num = 60
      //     this.codeDisable = false
      //     this.countDown = '获取验证码'
      //     this.clickCode = false
      //   } else {
      //     this.num--
      //     this.countDown = `${this.num}S重新获取`
      //   }
      // }, 1000)
    },
    sendCode (data) {
      axios({
        url: `${BASEURL.path}/api/v1/sms/send`,
        method: 'post',
        data: data
      })
        .then(response => {
          var res = response.data
          if (res.code === 0) {
            this.$message({
              message: '验证码发送成功！',
              type: 'success'
            })
            // 请求成功了再开始倒计时
            this.clickCode = true
            clearInterval(this.timer)
            this.timer = setInterval(() => {
              if (this.num === 0) {
                clearInterval(this.timer)
                this.num = 60
                this.codeDisable = false
                this.countDown = '获取验证码'
                this.clickCode = false
              } else {
                this.num--
                this.countDown = `${this.num}S重新获取`
              }
            }, 1000)
          } else {
            clearInterval(this.timer)
            this.num = 60
            this.codeDisable = false
            this.countDown = '获取验证码'
            this.clickCode = false
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        .catch(e => {})
    },
    onNext () {
      let data = { country_code: this.Country_C, mobile: this.form.mobile }
      ipcRenderer.send('user-setting-check-phone-have', data)
      console.log('onNext: ')
    },
    excountry (item) {
      this.Country_C = item.dialCode
    },
    // 游客登录
    guestLogin () {
      if (getCurrentLoginType() !== 0) {
        // 游客登录
        guestLogin()
          .then(res => {
            if (res.data && res.data.code === 0) {
              // 将登录类型设置为游客登录
              ipcRenderer.send('change_user_login_type', 0)
              ipcRenderer.send('guest_login_info_set', res.data.data)
              ipcRenderer.send('auto-user-info-login')
              this.$store.commit('savePublicToken', res.data.data.token)
            } else {
              this.$notify({
                message: '游客登录失败',
                type: 'error'
              })
            }
          })
          .catch(res => {
            this.$notify({
              title: '网络异常',
              message: '游客登录失败',
              type: 'error'
            })
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.changePhoneSecend-wrap {
  .changePhoneSecend-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 15px;
  }

  .changePhoneSecend-form-item {
    width: 290px;
    margin-bottom: 15px;
    /deep/ .el-input {
      .el-input__inner {
        height: 32px !important;
      }
    }
    /deep/ .intl-tel-input .flag-container {
      position: static;
      width: 70px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 10px;
      .selected-flag {
        width: 100%;
        padding: 0;
        display: flex;
        justify-content: center;
        .iti-checked {
          height: 32px;
          line-height: 32px;
        }
        .iti-arrow {
          left: 57px;
        }
      }
    }
    /deep/ .intl-tel-input {
      height: 32px;
    }
    /deep/ .flag-container {
      padding: 0;
    }
    .changePhoneSecend-form-item-inputBox {
      display: flex;
      align-items: center;
    }
    .changePhoneSecend-form-inputBox {
      display: flex;
      align-items: center;
      /deep/ .el-input {
        width: 180px !important;
        .el-input__inner {
          height: 30px !important;
        }
      }
      .changePhoneSecend-form-btn {
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        margin-left: 10px;
        padding: 0;
        color: #888;
        cursor: pointer;
      }
      .noClickBtn {
        color: #888;
        border-color: #d1d1d1;
      }
      .clickBtn {
        border-color: #ddd;
        color: #ddd;
      }
    }
  }
  .changePhoneSecend-form-next {
    width: 120px;
    height: 40px;
    margin-top: 40px;
    /deep/ .el-button {
      width: 100%;
      height: 100%;
      border: 1px solid #4e4afc;
      color: #4e4afc;
    }
  }
}
</style>