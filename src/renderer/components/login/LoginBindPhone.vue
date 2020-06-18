<!--搜索组件-->
<template>
  <div class="container">
    <div @click="closeDialog" class="userSetting-header-topHeader-close">
      <i class="el-icon-close" style="width:25px;height:25px;line-height:25px;"></i>
    </div>
    <div class="titleWrap">
      <h3>绑定手机号</h3>
    </div>
    <el-form
      :model="form"
      :rules="rules"
      class="form"
      label-position="left"
      label-width="0px"
      ref="form"
      size="mini"
    >
      <div class="input-item-excountry">
        <IntlTelInput :toFront="toFront" @excountry="excountry" countryCode="cn" />
        <el-form-item prop="mobile">
          <input
            @blur="validateField('mobile')"
            @input="inputValidate"
            class="borderInput phone"
            placeholder="手机号"
            type="text"
            v-model="form.mobile"
          />
          <span class="focus-border">
            <i></i>
          </span>
        </el-form-item>
      </div>
      <div class="captcha-view" v-show="!password_show">
        <div id="captchaBox3"></div>
        <div @click="validateField('mobile',true)" class="captcha-box" v-if="verifica_block"></div>
      </div>
      <el-form-item prop="code" v-show="password_show">
        <input
          @blur="validateField('code')"
          class="border-input code valid-input"
          placeholder="验证码"
          type="text"
          v-model="form.code"
        />
        <span class="focus-border">
          <i></i>
        </span>
        <el-button
          :disabled="is_send"
          @click="sendCode()"
          class="codeBtn"
          size="medium"
        >{{is_send&&time>0?(time+'s'):'获取验证码'}}</el-button>
      </el-form-item>
      <el-form-item prop="password" v-if="isPassWordShow">
        <input
          @blur="validateField('password')"
          class="borderInput pwd"
          placeholder="请输入密码"
          type="password"
          v-model="form.password"
        />
        <span class="focus-border">
          <i></i>
        </span>
      </el-form-item>
    </el-form>
    <el-button
      :class="['findBtn',{'findBtn_disabled':form.mobile==''||form.code==''}]"
      :disabled="NoGt||registerAndBind||hasPassword||hasCode"
      @click="onSubmit"
      size="medium"
      type="primary"
    >确认</el-button>
  </div>
</template>
<script>
import axios from 'axios'
import md5 from 'js-md5'
import IntlTelInput from './IntlTelInput/index'
import { ipcRenderer, remote } from 'electron'
import { DB, Storage } from '../../../main/db/dbStore'
import {
  checkPhoneIsBind,
  codeSend,
  accountLogin
} from '../../../main/api/login'
import { changeWS } from '../../../main/api/baseURL'
// import MobileRegularExp from './IntlTelInput/MobileRegularExp.js'

export default {
  name: 'LoginBindPhone',
  data () {
    var checkPass = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('密码必须为6-12位数字与字母组合'))
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        // 失去焦点判断是不是中国手机号需要判断是否符合规范
        if (this.item.code === 'cn') {
          var regCn = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          if (regCn.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        } else {
          // 其他国家只用判断是否为数字
          var regEn = /^[0-9]*$/
          if (regEn.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
    }
    return {
      initGeetest: null,
      form: {
        mobile: '',
        password: '',
        code: ''
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          {
            validator: checkPhone,
            message: '请输入正确的手机号',
            trigger: ['blur']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            validator: checkPass,
            message: '密码必须为6-12位数字与字母组合',
            trigger: ['blur']
          }
        ]
      },
      item: {},
      toFront: ['cn'],
      time: 60,
      timer: null,
      checked: true,
      isSend: false,
      password_show: false,
      is_send: false,
      verifica_block: true,
      init_gt_res: null,
      login_account_res: '',
      // 密码框是否显示
      isPassWordShow: false,
      // 是否注册
      isRegister: false,
      // 是否绑定手机号
      isBindPhone: false,
      // 是否级验证
      isGt: false,
      captchaObj: null
    }
  },
  props: {
    getLeigodToken: String
  },
  mounted () {
    ipcRenderer.send('init-gt')
  },
  computed: {
    // 没有级验证
    NoGt () {
      return !this.isGt
    },
    // 又注册又绑定
    registerAndBind () {
      return this.isRegister && this.isBindPhone
    },
    // 有输入密码，密码为空
    hasPassword () {
      return this.isPassWordShow && !this.form.password
    },
    // 有code为空
    hasCode () {
      return (
        (!this.isRegister && !this.form.code) ||
        (this.isRegister && !this.isBindPhone && !this.form.code)
      )
    }
  },
  destroyed () {
    ipcRenderer.removeListener('bind-phone-login-res', this.bindPhoneLogin)
    ipcRenderer.removeListener('init-gt-res', this.initGtRes)
    ipcRenderer.removeListener(
      'check-phone-is-bind-res',
      this.checkPhoneIsBindRes
    )
    ipcRenderer.removeListener('bind-phone-login-res', this.bindPhoneLogin)
  },
  created () {
    ipcRenderer.on('init-gt-res', this.initGtRes)
    ipcRenderer.on('check-phone-is-bind-res', this.checkPhoneIsBindRes)
    ipcRenderer.on('bind-phone-login-res', this.bindPhoneLogin)
  },
  components: {
    IntlTelInput
  },
  methods: {
    checkPhoneIsBindRes (event, params) {
      this.login_account_res = params
      this.bindPhone()
    },
    initGtRes (event, params) {
      if (params.data.success === 1) {
        this.init_gt_res = params.data
        this.initGeetest = require('./gt/gt')
        this.initGt()
      }
    },
    bindPhoneLogin (event, params) {
      // 确认绑定成功关闭弹窗
      if (params.data && params.data.code === 0) {
        // 获取ws ip
        changeWS(params.data.data.gateway)
        if (params.data.data.nn_id) {
          Storage.set('nn_id', params.data.data.nn_id)
          // 将nn_id保存到主进程，用于axios获取token
          ipcRenderer.send('home_save_nn_id', params.data.data.nn_id)
          ipcRenderer.send('get-token', params.data.data.token)
          ipcRenderer.send('change_login_token', params.data.data.token)
          this.$store.commit('savePublicToken', params.data.data.token)
          ipcRenderer.send('user-setting-user-info')
        }
        this.$store.dispatch('loginBtnClick', 0)
        this.$notify({
          message: '登录成功',
          type: 'success'
        })
      } else {
        this.$notify({
          message: params.data.msg,
          type: 'error'
        })
      }
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    closeDialog () {
      this.$store.dispatch('loginBtnClick', 0)
      // // 添加点击pv
      // if (window._czc) {
      //   window._czc.push(['_trackEvent', '绑定手机号关闭', '点击', '1'])
      // }
    },
    // 级验证
    initGt () {
      let _this = this
      document.getElementById('captchaBox3').innerHTML = ''
      this.initGeetest.default.initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt: this.init_gt_res.gt,
          challenge: this.init_gt_res.challenge,
          offline: !this.init_gt_res.success,
          new_captcha: true,
          width: '100%',
          product: 'float'
        },
        function (captchaObj, params) {
          _this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.appendTo('#captchaBox3')
          captchaObj
            .onSuccess(function (res) {
              let _this = params
              _this.isGt = true
              const data = {
                mobile: _this.form.mobile,
                country_code: _this.item.dialCode
              }
              checkPhoneIsBind(data)
                .then(res => {
                  if (res.data.code === 0) {
                    if (res.data.data) {
                      console.log(res.data.data)
                      if (res.data.data.register) {
                        if (res.data.data.leigod_bind) {
                          _this.$notify({
                            message: '该手机号已绑定其他账号',
                            type: 'warning'
                          })
                          _this.resetGeetest()
                          return
                        } else {
                          _this.isPassWordShow = false
                        }
                      } else {
                        _this.isPassWordShow = true
                      }
                      if (_this.form.mobile) {
                        _this.password_show = true
                        // 发送验证码
                        _this.sendCode()
                      } else {
                        _this.$message.error('请输入手机号')
                      }
                    } else {
                      _this.$notify({
                        message: '手机号已被使用，请更换新手机号',
                        type: 'error'
                      })
                      _this.captchaObj.reset()
                    }
                  } else {
                    _this.$message.warning('网络异常，请重试')
                    _this.captchaObj.reset()
                  }
                })
                .catch(res => {
                  _this.$message.warning('网络异常，请重试')
                  _this.captchaObj.reset()
                })
            })
            .onError(function (res) {
              console.log(res, 'onError')
            })
        },
        _this
      )
    },
    bindPhone () {
      let res = this.login_account_res
      if (res.data && res.data.code === 0) {
        // 是否注册
        if (res.data.data.register) {
          this.isRegister = true
          if (res.data.data.leigod_bind) {
            this.isBindPhone = true
            this.password_show = false
            // 注册有绑定雷神账号
            this.$notify({
              message: '手机号已绑定过雷神号，请输入其他手机号',
              type: 'error'
            })
            this.isPassWordShow = false
          } else {
            // 注册没有绑定雷神，不用输密码
            this.isPassWordShow = false
          }
        } else {
          this.isPassWordShow = true
        }
      }
    },
    inputValidate () {
      // 如果已现实验证码输入框，手机号变动，则返回级验证，清空定时器
      if (this.password_show) {
        this.resetGeetest()
      }
      // 输入框判断是不是中国的手机号
      if (this.form.mobile.trim() === '') {
        // 如果手机号变为空，则返回级验证，清空定时器
        this.verifica_block = true
        this.resetGeetest()
      } else {
        if (this.item.code === 'cn') {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          this.form.mobile = this.form.mobile.replace(/\s+/g, '')
          this.form.password = this.form.password.replace(/\s+/g, '')
          if (reg.test(this.form.mobile)) {
            this.verifica_block = false
          } else {
            this.verifica_block = true
            this.resetGeetest()
          }
        } else {
          const reg = /^[0-9]*$/
          this.form.mobile = this.form.mobile.replace(/\s+/g, '')
          this.form.password = this.form.password.replace(/\s+/g, '')
          if (reg.test(this.form.mobile)) {
            this.verifica_block = false
            this.resetGeetest()
          } else {
            this.verifica_block = true
          }
        }
      }
    },
    resetGeetest () {
      this.isPassWordShow = false
      // 重置级验证及定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.password_show = false
      if (this.captchaObj) {
        this.captchaObj.reset()
      }
    },
    validateField (props, msg) {
      this.$refs.form.validateField(props, e => {
        if (e && msg) {
          this.$message.warning(e)
        }
      })
    },
    excountry (item) {
      this.item = item
      this.form.mobile = ''
    },
    onSubmit () {
      if (!this.isGt) {
        return this.$message.error('请先进行极验验证！')
      }
      // // 添加点击pv
      // if (window._czc) {
      //   window._czc.push(['_trackEvent', '绑定手机号', '点击', '1'])
      // }
      var that = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            token: this.getLeigodToken,
            mobile: that.form.mobile,
            country_code: that.item.dialCode,
            code: that.form.code,
            password: md5(that.form.password)
          }
          // 确认绑定接口
          ipcRenderer.send('bind-phone-login', data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取验证码
    sendCode () {
      let _this = this
      this.is_send = true
      const url = '/api/v1/sms/send'
      const data = {
        mobile: this.form.mobile,
        country_code: this.item.dialCode,
        type: 3
      }
      codeSend(data)
        .then(res => {
          if (res.data.code === 0) {
            _this.$notify({ message: '验证码已发送', type: 'success' })
            // 开始倒计时
            _this.timeOut()
          } else {
            if (res.data.msg) {
              _this.$notify({
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
              // 清空验证码输入的信息
              this.form.code = ''
              // 关闭定时器
              clearInterval(this.timer)
              // 重置
              this.is_send = false
              _this.resetGeetest()
            }
          }
        })
        .catch(res => {
          _this.$message.error('验证码发送失败，请重试')
        })
    },
    timeOut () {
      this.time = 60
      this.timer = setInterval(_ => {
        this.time--
        if (this.time < 0) {
          clearInterval(this.timer)
          // 重置
          this.is_send = false
        }
      }, 1000)
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.el-button--primary {
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #4444fc),
    color-stop(100%, #8e79fe)
  );
  color: #fff;
}
/deep/.selected-flag {
  height: 46px !important;
}
/deep/.el-button--primary:focus,
.el-button--primary:hover {
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #4444fc),
    color-stop(100%, #8e79fe)
  );
  box-shadow: 0 2px 4px 0 rgba(98, 54, 255, 0.3);
  color: #fff;
}
/deep/.el-button--primary.is-disabled,
.el-button--primary.is-disabled:active,
.el-button--primary.is-disabled:focus,
.el-button--primary.is-disabled:hover {
  color: #fff;
  background-color: #b7b7b7;
  border-color: #b7b7b7;
}

/deep/ .selected-flag {
  width: 80px !important;
}
/deep/ .intl-tel-input.allow-dropdown .flag-container,
.intl-tel-input.separate-dial-code .flag-container {
  width: 80px !important;
  padding: 0 !important;
  padding-left: 14px;
  box-sizing: border-box;
}
/deep/ .intl-tel-input .selected-flag {
  padding: 0 0 0 14px;
}
.container {
  .userSetting-header-topHeader-close {
    position: absolute;
    right: 5px;
    /* left: 10px; */
    top: 5px;
    color: #333;
    width: 25px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
  }
  text-align: center;
  // display: -webkit-box;
  // background-color: #ddd;
  h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 20px;
    color: #333;
  }
}
.form {
  .el-form-item {
    width: 282px;
    margin: 0 auto;
    border: 0;
    border-bottom: 1px solid #ccc;
  }
  padding: 0px;
  .intl-tel-input {
    float: left;
    &::after {
      z-index: 2;
      position: absolute;
      left: 90px;
      top: 14px;
      width: 1px;
      height: 20px;
      background: #d8d8d8;
      content: '';
    }
  }
  .el-form-item--mini {
    margin-bottom: 21px !important;
  }
  .captcha-view {
    margin: 0 auto;
    position: relative;
    width: 282px;
    height: 44px;
    .captcha-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 44px;
    }
  }
  .codeBtn {
    width: 92px;
    display: block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #4e4afc;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0 auto;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    float: right;
    padding: 12px 10px;
    font-size: 14px;
    border: none;
  }
  .input-item-excountry {
    width: 100%;
  }
  .border-input {
    outline: none;
    padding: 7px 14px 9px;
  }
  .valid-input {
    width: 160px;
    border: none;
  }
  .border-input:focus {
    outline: none;
    border-radius: 0;
  }
  .border-input ~ .focus-border:before,
  .border-input ~ .focus-border:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background-color: #3399ff;
    // transition: 0.5s;
  }
  .border-input ~ .focus-border:after {
    top: auto;
    bottom: 0;
  }
  .border-input ~ .focus-border i:before,
  .border-input ~ .focus-border i:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 1px;
    height: 0;
    background-color: #3399ff;
    // transition: 0.7s;
  }
  .border-input ~ .focus-border i:after {
    left: auto;
    right: 0;
  }

  .border-input:focus ~ .focus-border:after {
    left: 0;
    width: 100%;
    transition: 0.5s;
    color: #333;
    border-color: #333;
  }

  input {
    height: 44px;
    line-height: 44px;
    border-radius: 4px;
    border: 1px solid #c0c4cc;
    // border: 0;
    float: left;
  }
  input::-webkit-input-placeholder {
    color: #999;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #999;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #999;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #999;
  }
  .phone {
    border: 0;
    color: #333;
    // border-bottom: 1px solid #ccc;
    padding: 0;
    padding-left: 86px;
    // width: 208px;
    transition: box-shadow 1s ease-in-out;
  }
  .code {
    padding-top: 0;
    padding-bottom: 0;
    height: 38px;
  }

  .pwd {
    /* border-radius: 4px; */
    border: 0;
    // border-bottom: 1px solid #ccc;
    padding: 0 15px;
    // width: 298px;
    outline: none;
    // border: 1px solid #ccc;
    transition: 0.5s;
    transition: all 1s ease-in-out;
    color: #333;
  }
}

.el-radio__input {
  display: none;
}
.findBtn {
  transition: all 0.5s ease-in-out;
  border-color: #fff;
  margin-bottom: 25px;
  margin-top: 34px;
  height: 42px;
  width: 282px;
}
.findBtn_disabled {
  background-color: rgba(64, 158, 255, 0.4);
}
</style>


