/* eslint-disable no-redeclare */
<!--搜索组件-->
<template>
  <div class="login-normal-wrap">
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
            class="border-input phone"
            placeholder="手机号"
            ref="toPhone"
            type="text"
            v-model="form.mobile"
          />
          <img :src="imgSrc.login_close" @click="clearPwd" class="img-eyes" />
          <span class="focus-border">
            <i></i>
          </span>
        </el-form-item>
      </div>
      <div class="input-item-excountry">
        <el-form-item prop="password" v-show="passwordShow">
          <input
            :type="check_pwd"
            @blur="validateField('password')"
            @input="inputValidate"
            @keyup.native="loginKeyDown"
            class="border-input password"
            placeholder="密码"
            v-model="form.password"
          />
          <img
            :src="eyesClose ? imgSrc.login_eyes : imgSrc.login_eyes_open"
            @click="checkPwd"
            class="img-eyes check-pwd"
          />
          <span class="focus-border">
            <i></i>
          </span>
        </el-form-item>
      </div>
    </el-form>

    <div style="position: relative;margin-bottom: 30px;">
      <el-checkbox style="color: #333;position: absolute;left: 17px;" v-model="checked">记住密码</el-checkbox>
      <span
        @click="handleGoFindClick"
        class="foget"
        style="position: absolute;right: 12px;top: 2px;font-size: 12px;"
      >忘记密码？</span>
    </div>
    <br />
    <el-button
      :class="[
        'loginBtn',
        { loginBtn_disabled: form.mobile == '' || form.password == '' }
      ]"
      :disabled="!form.mobile || !form.password"
      :loading="loginBtnLoading"
      @click="onSubmit"
      size="medium"
      style="width: 282px;height:42px"
      type="primary"
    >
      立即登录
      <i></i>
    </el-button>
    <div style="font-size: 12px;margin-top: 19px;margin-bottom: 11px;">
      <span @click="handleGoLoginClick" style="color:#4E4AFC;cursor: pointer;">注册账号 ></span>
    </div>
    <!-- 第三方登录图标 -->
    <div class="leload-login">
      <div class="leload-login-wrap">
        <span class="leload-login-text">其他登录方式：</span>
        <img :src="imgSrc.login_leigod" @click="handleLeigodClick" class="image" />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import md5 from 'js-md5'
import IntlTelInput from './IntlTelInput/index'
import { changeWS } from '../../../main/api/baseURL'
import { ipcRenderer, remote, session, BrowserWindow } from 'electron'
import util from '../../utils/util'
import { DB, Storage } from '../../../main/db/dbStore'
export default {
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
      loginBtnLoading: false,
      websocket: null,
      initGeetest: null,
      verificaBlock: true,
      passwordShow: true,
      eyesClose: true,
      // base_url: baseURL.path,
      form: {
        mobile: '',
        password: ''
      },
      item: {},
      imgSrc: {
        login_leigod: require('@/assets/img/login/login_leigod.png'),
        login_eyes: require('@/assets/img/login/close-eyes.png'),
        login_eyes_open: require('@/assets/img/login/open-eyes.png'),
        login_close: require('@/assets/img/login/login-close.png')
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
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
          // {
          //   validator: checkPass,
          //   message: '密码必须为6-12位数字与字母组合',
          //   trigger: ['blur']
          // }
        ]
      },
      toFront: ['cn'],
      checked: true,
      pwd: '',
      login_account_res: '',
      check_pwd: 'password',
      firstTochar: false,
      bigChar: false
    }
  },
  mounted () {
    this.initLogin()
  },
  props: {
    // 传入找回密码账号
    findPwdLoginNumber: {
      type: String,
      default: ''
    }
  },
  components: {
    IntlTelInput
  },
  watch: {
    item: {
      handler (newValue, oldValue) {
        this.$refs['form'].resetFields()
      },
      deep: true
    }
  },
  destroyed () {
    ipcRenderer.removeListener('account-login-res', this.accountLoginRes)
    ipcRenderer.removeListener('user-info-login-res', this.handleLoginSuccess)
  },
  created () {
    // 手动登录
    ipcRenderer.on('account-login-res', this.accountLoginRes)
    this.initLogin()
    ipcRenderer.on('user-info-login-res', (event, params) => {
      if (params.code === 0) {
        this.$store.dispatch('savePublicUserInfo', params.data)
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
  },
  methods: {
    accountLoginRes (event, params) {
      let myData = params
      if (myData.data && myData.data.code === 0) {
        this.login_account_res = myData
        this.accountLogin()
        // =================ws======================
        let token = this.$store.state.public.token
        let params = {
          token
        }
        if (token) {
          ipcRenderer.send('establish-ws', token)
        } else {
          this.$message.error('创建连接失败')
        }
        // =======================================
      } else {
        this.$notify({
          message: `${params.data.msg}`,
          type: 'error'
        })
        return false
      }
    },
    handleGoLoginClick () {
      this.$store.dispatch('loginBtnClick', 2)
    },
    handleGoFindClick () {
      this.$store.dispatch('loginBtnClick', 5)
    },
    handleLeigodClick () {
      this.$store.dispatch('loginBtnClick', 3)
    },
    // 登陆页面 不登陆 直接跳转大厅
    goHome () {
      this.$router.push({ name: 'channelHall' })
    },
    // 密码框的回车事件 执行登录
    onEnter (param) {
      if (!this.passwordShow) return
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            mobile: this.form.mobile,
            country_code: this.item.dialCode,
            password: md5(this.form.password)
          }
          ipcRenderer.send('account-login', data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
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
    // 清空账号
    clearPwd (e) {
      this.form.mobile = ''
    },
    inputValidate () {
      this.form.mobile = this.form.mobile.replace(/\s+/g, '')
      this.form.password = this.form.password.replace(/\s+/g, '')
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (reg.test(this.form.mobile)) {
        this.verificaBlock = false
      } else {
        this.verificaBlock = true
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
    },
    // 判断大小写
    loginKeyDown (event) {
      const _that = this
      if (event.keyCode === 13) {
        this.onSubmit()
      }
    },
    onSubmit () {
      // // 添加点击pv
      // if (window._czc) {
      //   window._czc.push(['_trackEvent', '登录按钮', '点击', '1'])
      // }
      if (!this.passwordShow) return
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            mobile: this.form.mobile,
            country_code: this.item.dialCode,
            password: md5(this.form.password)
          }
          ipcRenderer.send('account-login', data)
        } else {
          return false
        }
      })
    },
    handleLoginSuccess (event, args) {},
    initLogin () {
      console.log('this.findPwdLoginNumber: ', this.findPwdLoginNumber)
      if (this.findPwdLoginNumber) {
        this.form.password = ''
        this.form.mobile = this.findPwdLoginNumber
      } else {
        let password = Storage.get('password')
        let phone = Storage.get('phone')
        if (password && phone) {
          this.form.password = password
          this.form.mobile = phone
        }
      }
    },
    accountLogin () {
      let res = this.login_account_res
      console.log('account-login: ', res)
      this.loginBtnLoading = false
      // 登录成功
      if (res.data && res.data.code === 0) {
        this.NN_MSG('登录成功', 'success')
        // 修改用户登录类型为普通用户登录
        ipcRenderer.send('change_user_login_type', 1)
        // 自动登录成功后，将token，userinfo信息保存到内存中
        ipcRenderer.send('guest_login_info_set', res.data.data)
        ipcRenderer.send('destroy-ws')
        // =================ws======================
        let token = res.data.data.token
        if (token) {
          ipcRenderer.send('establish-ws', token)
        } else {
          this.$message.error('创建连接失败')
        }
        // 获取ws ip
        changeWS(res.data.data.gateway)
        // 如果保存密码，则记住密码
        let url = util.getLocation()
        // 将nn_id保存到主进程，用于axios获取token
        ipcRenderer.send('home_save_nn_id', res.data.data.nn_id)

        if (this.checked) {
          Storage.set('password', this.form.password)
        } else {
          Storage.set('password', '')
          this.form.password = ''
        }
        Storage.set('phone', this.form.mobile)
        Storage.set('country_code', this.item.dialCode)
        ipcRenderer.send('get-token', res.data.data.token)
        ipcRenderer.send('change_login_token', res.data.data.token)
        this.$store.commit('savePublicToken', res.data.data.token)
        ipcRenderer.send('user-setting-user-info')
        let password = Storage.get('password')
        let phone = Storage.get('phone')
        if (password && phone) {
          this.form.password = password
          this.form.mobile = phone
        }
        this.$store.commit('SAVESETTING', res.data.data)
        this.$store.dispatch('loginBtnClick', 0)
      } else {
        this.$notify({
          message: res.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4e4afc;
  font-size: 12px;
}
/deep/.el-checkbox__input + .el-checkbox__label {
  font-size: 12px;
}
// 记住密码勾选背景
/deep/.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #4e4afc;
  border-color: #4e4afc;
}
// 记住密码边框
/deep/.el-checkbox__input.is-focus.el-checkbox__inner {
  border-color: #333 !important;
}
/deep/.el-checkbox__inner {
  border-radius: 0;
}
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
.login-normal-wrap {
  text-align: center;
  .top {
    position: relative;
    width: 300px;
    height: 300px;
    background-color: #eee;
    margin: auto;
  }
  h3 {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    margin-top: 100px;
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
    .input-item-excountry {
      width: 100%;
    }
    .border-input {
      outline: none;
      transition: 0.5s;
      transition: all 1s ease-in-out;
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
      transition: 0.5s;
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
      transition: 0.7s;
    }
    .border-input ~ .focus-border i:after {
      left: auto;
      right: 0;
    }
    .border-input:focus ~ .focus-border:after {
      left: 0;
      width: 100%;
      transition: 0.5s;
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
  }
  .el-form-item--mini {
    margin-bottom: 13px !important;
  }
  .el-form-item__content {
    border: 0;
    border-bottom: 1px solid #ccc;
  }
  .captchaView {
    position: relative;
    width: 330px;
    height: 44px;
    margin: 0 auto;
    margin-bottom: 13px;
  }
  .captchaBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 44px;
    cursor: pointer;
  }
  input {
    height: 44px;
    line-height: 44px;
    border: 1px solid #c0c4cc;
  }
  input::-webkit-input-placeholder {
    color: #999;
  }
  input::-moz-placeholder {
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
    // border-bottom: 1px solid #ccc;
    padding: 0;
    padding-left: 43px;
    // width: 208px;
    transition: box-shadow 1s ease-in-out;
  }
  .password {
    border: 0;
    // border-bottom: 1px solid #ccc;
    outline: none;
    padding: 0px;
    padding-left: 10px;
    float: left;
    // width: 298px;
    transition: box-shadow 1s ease-in-out;
  }

  .country {
    width: 120px;
  }
  .code {
    width: 120px;
  }
  .pwd {
    width: 330px;
  }
  .el-radio__input {
    display: none;
  }
  .foget {
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
    position: absolute;
    right: 8px;
  }
  .foget:hover {
    color: #4e4afc;
  }
  .hr-center {
    float: left;
    height: 20px;
    width: 40%;
    // background-color: #aaa;
  }
  .hr-center span {
    color: #bbb;
  }
  .hr-left {
    float: left;
    height: 1px;
    margin-top: 8px;
    width: 30%;
    background-color: #ccc;
  }
  .hr-right {
    float: left;
    height: 1px;
    margin-top: 8px;
    width: 30%;
    background-color: #ccc;
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
        margin-right: 5px;
      }
      .image {
        position: absolute;
        width: 18px;
        height: 18px;
        right: -14px;
        top: 2px;
        cursor: pointer;
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

  /deep/.selected-flag {
    height: 46px !important;
  }
  // 登陆页面跳转主页按钮
  .goHome {
    position: absolute;
    right: 30px;
    top: 20px;
    color: #333;
  }
  /deep/.el-icon-s-home {
    font-size: 20px;
  }
  .goHome:hover {
    color: #4e4afc;
  }
  .goHome {
    cursor: pointer;
  }
}
</style>
