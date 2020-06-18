<template>
  <div class="regiter-wrap">
    <!-- <div @click="closeDialog" class="userSetting-header-topHeader-close">x</div> -->
    <el-form
      :model="form"
      :rules="rules"
      class="regiter-form"
      label-position="left"
      label-width="0px"
      ref="form"
      size="mini"
    >
      <div class="input-item-excountry">
        <IntlTelInput
          :toFront="to_front"
          @excountry="excountry"
          countryCode="cn"
          style="height: 45px; line-height: 45px;"
        />
        <el-form-item prop="mobile">
          <input
            @blur="validateField('mobile')"
            @change="changeValue"
            @input="inputValidate"
            class="border-input phone"
            placeholder="手机号"
            type="text"
            v-model="form.mobile"
          />
          <img :src="imgSrc.login_close" @click="clearPwd" class="img-eyes" />
          <span class="focus-border">
            <i></i>
          </span>
        </el-form-item>
      </div>
      <div class="captcha-view" v-show="!password_show">
        <div id="captchaBox2"></div>
        <div @click="validateField('mobile',true)" class="captcha-box" v-if="verifica_block"></div>
      </div>
      <el-form-item prop="code" style="border-bottom: 1;" v-show="password_show">
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
      <el-form-item prop="password">
        <input
          :type="check_pwd"
          @blur="validateField('password')"
          @keyup.native="loginKeyDown"
          class="border-input pwd"
          placeholder="密码"
          v-model="form.password"
        />
        <img
          :src="eyesClose?imgSrc.login_eyes:imgSrc.login_eyes_open"
          @click="checkPwd"
          class="img-eyes check-pwd"
        />
        <span class="focus-border">
          <i></i>
        </span>
      </el-form-item>
    </el-form>
    <div style="position: relative;margin-bottom: 50px;">
      <el-checkbox style="color: #333;position: absolute;left: 17px;" v-model="checked"></el-checkbox>
      <span style="color: #666;position: absolute;left: 37px;top:2px;font-size: 12px;">
        已阅读并同意
        <span @click="userProtocol(1)" class="userProtocol">《用户服务协议》</span>和
        <span @click="userProtocol(2)" class="userProtocol">《隐私政策》</span>
      </span>
    </div>
    <el-button
      :class="['registerBtn',{'registerBtn_disabled':form.mobile==''||form.password==''}]"
      :disabled="!form.mobile||!form.password"
      :loading="register_btn_loading"
      @click="onSubmit"
      size="medium"
      style="width: 282px; border-color：#4e4afc"
      type="primary"
    >立即注册</el-button>
    <div class="regiter-footer">
      <span @click="handleGoLoginClick" style="color:#4E4AFC;cursor: pointer;">返回登录 ></span>
    </div>
    <!-- 第三方登录图标 -->
    <div class="leload-login">
      <div class="leload-login-wrap">
        <span class="leload-login-text">其他登录方式：</span>
        <img :src="imgSrc.login_leigod" @click="handleLeigodClick" class="image" />
      </div>
    </div>
    <!-- 用户协议 -->
    <nn-login-private-protocol :isShow="dialogIsProtocol" @close-dialog="closeProtocolDialog"></nn-login-private-protocol>
    <nn-login-user-protocol :isShow="dialogIsPrivate" @close-dialog="closePravateDialog"></nn-login-user-protocol>
  </div>
</template>

<script>
import IntlTelInput from './IntlTelInput/index'
import { ipcRenderer, remote } from 'electron'
import md5 from 'js-md5'
import baseURL, { changeWS } from '../../../main/api/baseURL'
import { DB, Storage } from '../../../main/db/dbStore'
import LoginUserProtocol from '@/components/login/LoginUserProtocol'
import LoginPrivarateProtocol from '@/components/login/LoginPrivarateProtocol'

import {
  checkPhoneIsBind,
  codeSend
  // accountLogin
} from '../../../main/api/login'
export default {
  name: 'LoginRegister',
  data () {
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
            return callback(new Error('手机号'))
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
    var checkPass = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('密码必须为6-12位数字与字母组合'))
      }
    }
    var checkPassConfirm = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('密码必须为6-12位数字与字母组合'))
      }
    }

    return {
      captchaObj: null,
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
      base_url: baseURL.path,
      to_front: ['cn'],
      password_show: false,
      verifica_block: true,
      is_send: false,
      item: {},
      check_pwd: 'password',
      check_pwd_confirm: 'password',
      init_gt_res: '',
      time: 10,
      checked: true,
      eyesClose: true,
      register_btn_loading: false,
      firstTochar: false,
      bigChar: false,
      imgSrc: {
        login_leigod: require('@/assets/img/login/login_leigod.png'),
        login_eyes: require('@/assets/img/login/close-eyes.png'),
        login_eyes_open: require('@/assets/img/login/open-eyes.png'),
        login_close: require('@/assets/img/login/login-close.png')
      },
      login_account_res: '',
      mobile: '',
      dialogIsProtocol: false,
      dialogIsPrivate: false
    }
  },
  components: {
    // 选择国家
    'nn-login-user-protocol': LoginUserProtocol,
    'nn-login-private-protocol': LoginPrivarateProtocol,
    IntlTelInput
  },
  watch: {
    item: {
      handler (newValue, oldValue) {
        this.$refs['form'].resetFields()
      },
      deep: true
    },
    form (val) {}
  },
  destroyed () {
    // // 添加点击pv
    // if (window._czc) {
    //   window._czc.push(['_trackEvent', '注册弹窗关闭', '点击', '1'])
    // }
    ipcRenderer.removeListener('check-phone-is-bind-res', this.bindPhoneRes)
    ipcRenderer.removeListener('init-gt-res', this.initGtMessage)
  },
  created () {
    ipcRenderer.on('init-gt-res', this.initGtMessage)
    ipcRenderer.on('check-phone-is-bind-res', this.bindPhoneRes)
    ipcRenderer.on('login-register-res', (event, params) => {
      this.register_btn_loading = false
      let url = 'http://dev-svr.nn.com'
      if (params.data.code === 0) {
        this.$message.success('注册成功！')
        Storage.set('password', this.form.password)
        Storage.set('phone', this.form.mobile)
        // 登录成功，修改登录类型
        ipcRenderer.send('change_user_login_type', 1)
        // 自动登录成功后，将token，userinfo信息保存到内存中
        ipcRenderer.send('guest_login_info_set', params.data.data)
        changeWS(params.data.data.gateway)
        ipcRenderer.send('destroy-ws')
        // =================ws======================
        let token = params.data.data.token
        if (token) {
          ipcRenderer.send('establish-ws', token)
        } else {
          this.$message.error('创建连接失败')
        }
        // 将nn_id保存到主进程，用于axios获取token
        ipcRenderer.send('home_save_nn_id', params.data.data.nn_id)
        Storage.set('password', this.form.password)
        Storage.set('phone', this.form.mobile)
        Storage.set('country_code', this.item.dialCode)
        ipcRenderer.send('get-token', params.data.data.token)
        ipcRenderer.send('change_login_token', params.data.data.token)
        this.$store.commit('savePublicToken', params.data.data.token)
        ipcRenderer.send('user-setting-user-info')
        this.$store.dispatch('loginBtnClick', 0)

        // // 注册成功，自动登录系统
        // const data = {
        //   mobile: this.form.mobile,
        //   country_code: this.item.dialCode,
        //   password: md5(this.form.password)
        // }
        // accountLogin(data).then(res => {
        //   if (res.data && res.data.code === 0) {
        //     // 登录成功，修改登录类型
        //     ipcRenderer.send('change_user_login_type', 1)
        //     // 自动登录成功后，将token，userinfo信息保存到内存中
        //     ipcRenderer.send('guest_login_info_set', params.data.data)
        //     changeWS(params.data.data.gateway)
        //     ipcRenderer.send('destroy-ws')
        //     // =================ws======================
        //     let token = res.data.data.token
        //     if (token) {
        //       ipcRenderer.send('establish-ws', token)
        //     } else {
        //       this.$message.error('创建连接失败')
        //     }
        //     // 将nn_id保存到主进程，用于axios获取token
        //     ipcRenderer.send('home_save_nn_id', res.data.data.nn_id)
        //     Storage.set('password', this.form.password)
        //     Storage.set('phone', this.form.mobile)
        //     Storage.set('country_code', this.item.dialCode)
        //     ipcRenderer.send('get-token', res.data.data.token)
        //     ipcRenderer.send('change_login_token', params.data.data.token)
        //     this.$store.commit('savePublicToken', res.data.data.token)
        //     ipcRenderer.send('user-setting-user-info')
        //   }
        //   this.$store.dispatch('loginBtnClick', 0)
        // })
      } else {
        this.$notify({
          message: params.data.msg,
          type: 'error'
        })
      }
    })
  },
  mounted () {
    ipcRenderer.send('init-gt')
    // // 添加点击pv
    // if (window._czc) {
    //   window._czc.push(['_trackEvent', '注册曝光', '自动', '1'])
    // }
  },
  methods: {
    // closeDialog () {
    //   this.$store.dispatch('loginBtnClick', 0)
    // },
    initGtMessage (event, params) {
      if (params.data.success === 1) {
        this.init_gt_res = params.data
        this.initGeetest = require('./gt/gt')
        this.initGt()
      }
    },
    bindPhoneRes (event, params) {
      this.login_account_res = params
      let res = params
      if (res.data && res.data.code === 0) {
        // register=true代表已注册，不可以发验证码，否则发送验证码
        if (res.data.data.register) {
          this.verifica_block = true
          // 不发验证码
          this.$notify({
            message: '此手机号已被使用',
            type: 'error'
          })
        } else {
          this.verifica_block = false
        }
      } else {
        this.$notify({
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    closeProtocolDialog () {
      this.dialogIsProtocol = false
    },
    closePravateDialog () {
      this.dialogIsPrivate = false
    },
    changeValue (e) {
      this.mobile = e.target.value
    },
    // 切换不同的子组件
    handleGoLoginClick () {
      this.$refs['form'].resetFields()
      this.$store.dispatch('loginBtnClick', 1)
    },
    handleLeigodClick () {
      this.$store.dispatch('loginBtnClick', 3)
    },
    excountry (item) {
      this.item = item
      this.verifica_block = true
      this.resetGeetest()
    },
    resetGeetest () {
      // 重置级验证及定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.password_show = false
      if (this.captchaObj) {
        this.captchaObj.reset()
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
    validateField (props, msg) {
      this.$refs.form.validateField(props, e => {
        if (e && msg) {
          this.$message.warning(e)
        }
      })
    },
    // 密码的明文和非明文切换
    checkPwd () {
      if (this.check_pwd === 'password') {
        this.check_pwd = 'text'
        this.eyesClose = false
      } else {
        this.check_pwd = 'password'
        this.eyesClose = true
      }
    },
    userProtocol (param) {
      if (param === 1) {
        this.dialogIsProtocol = true
      } else {
        this.dialogIsPrivate = true
      }
    },
    // 清空账号
    clearPwd (e) {
      this.form.mobile = ''
    },
    checkPwdConfirm () {
      if (this.check_pwd_confirm === 'password') {
        this.check_pwd_confirm = 'text'
      } else {
        this.check_pwd_confirm = 'password'
      }
    },
    // 级验证
    initGt () {
      let _that = this
      document.getElementById('captchaBox2').innerHTML = ''
      this.initGeetest.default.initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt: this.init_gt_res.gt,
          challenge: this.init_gt_res.challenge,
          offline: !this.init_gt_res.success,
          width: '100%',
          product: 'float'
        },
        (captchaObj, param) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          _that.captchaObj = captchaObj
          captchaObj.appendTo('#captchaBox2')
          captchaObj
            .onSuccess(res => {
              let _this = param
              // 验证成功之后，检查手机号是否被注册
              const data = {
                mobile: _this.form.mobile,
                country_code: _this.item.dialCode
              }
              checkPhoneIsBind(data)
                .then(res => {
                  if (res.data.code === 0) {
                    if (res.data.data && !res.data.data.register) {
                      if (_this.mobile) {
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
              // console.log(res, "onError");
            })
        },
        _that
      )
    },
    // 获取验证码
    sendCode () {
      let _this = this
      this.is_send = true
      const url = '/api/v1/sms/send'
      const data = {
        mobile: this.form.mobile,
        country_code: this.item.dialCode,
        type: 2
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
    // 提交接口
    onSubmit () {
      if (!this.checked) {
        return this.$message({
          message: '请勾选“阅读并同意《服务条款》”',
          type: 'warning'
        })
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.register()
        } else {
          return false
        }
      })
    },

    loginKeyDown (event) {
      const _that = this
      if (event.keyCode === 13) {
        this.onSubmit()
      }
    },
    register () {
      this.register_btn_loading = true
      const data = {
        mobile: this.form.mobile,
        country_code: this.item.dialCode,
        code: this.form.code,
        password: md5(this.form.password)
      }
      ipcRenderer.send('login-register', data)
    },
    // 验证码倒计时
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

<style lang="less" scoped>
// 按钮样式
/deep/.el-button {
  display: block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0 auto;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
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
.el-button:focus,
.el-button:hover {
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
/deep/ .login-wrap {
  border-radius: 8px;
  background-color: #fff;
  border: 0px;
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
.regiter-wrap {
  width: 100%;
  height: 100%;
  .userSetting-header-topHeader-close {
    position: absolute;
    right: 10px;
    /* left: 10px; */
    top: 10px;
    color: #fff;
    width: 20px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  .regiter-header {
    padding-top: 100px;
    padding-bottom: 20px;
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    text-align: center;
  }
  .regiter-form {
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
      padding: 0;
      padding-left: 86px;
      transition: box-shadow 1s ease-in-out;
    }
    .code {
      padding-top: 0;
      padding-bottom: 0;
      height: 38px;
    }
    .pwd,
    .confirm-pwd {
      border: 0;
      padding: 0 15px;
      outline: none;
      transition: 0.5s;
      transition: all 1s ease-in-out;
      color: #333;
    }
    .check-pwd {
      width: 16px;
      position: absolute;
      right: 10px;
      top: 16px;
      cursor: pointer;
    }
    .img-eyes {
      position: absolute;
      right: 10px;
      top: 16px;
      cursor: pointer;
    }
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
      margin-bottom: 20px !important;
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
  }
  .regiter-footer {
    font-size: 12px;
    text-align: center;
    margin-top: 19px;
    margin-bottom: 11px;
  }
  .leload-login {
    position: relative;
    padding: 10px;
    .leload-login-wrap {
      position: absolute;
      top: 13px;
      right: 10px;
      .leload-login-text {
        color: #999999;
        font-size: 12px;
      }
      .image {
        position: absolute;
        width: 18px;
        height: 18px;
        right: -14px;
        top: 2px;
      }
    }
  }
  .leload-login:after {
    content: ' ';
    position: absolute;
    left: -20px;
    bottom: 12px;
    right: -22px;
    border-bottom: 1px solid #d9d9d9;
    color: #d9d9d9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 5;
  }
  .userProtocol:hover {
    color: rgb(78, 74, 252);
  }
}
</style>