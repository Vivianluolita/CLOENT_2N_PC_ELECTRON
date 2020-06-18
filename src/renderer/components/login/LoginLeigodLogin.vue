<!--搜索组件-->
<template>
  <div class="container">
    <el-tabs @tab-click="handleClick" v-model="type">
      <el-tab-pane label="手机登录" name="first">
        <el-form
          :model="form1"
          :rules="rules"
          class="form"
          label-position="left"
          label-width="0px"
          ref="form1"
          size="mini"
        >
          <div class="input-item-excountry" v-show="!password_show">
            <IntlTelInput :toFront="toFront" @excountry="excountry" countryCode="cn" />
            <el-form-item prop="mobile">
              <input
                @blur="validateField('form1','mobile')"
                class="borderInput phone"
                placeholder="手机号"
                type="text"
                v-model="form1.mobile"
              />
              <span class="focus-border">
                <i></i>
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="password">
            <input
              @blur="validateField('form1','password')"
              @keyup.native="loginKeyDown"
              class="borderInput pwd"
              placeholder="密码"
              type="password"
              v-model="form1.password"
            />
            <span class="focus-border">
              <i></i>
            </span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="邮箱/账号登录" name="second">
        <el-form
          :model="form2"
          :rules="rules"
          class="form"
          label-position="left"
          label-width="0px"
          ref="form2"
          size="mini"
        >
          <div class="input-item-excountry">
            <el-form-item prop="account">
              <input
                @blur="validateField('form2','account')"
                class="borderInput email"
                placeholder="邮箱/账号"
                type="text"
                v-model="form2.account"
              />
              <span class="focus-border">
                <i></i>
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="password">
            <input
              @blur="validateField('form2','password')"
              class="borderInput pwd"
              placeholder="密码"
              type="password"
              v-model="form2.password"
            />
            <span class="focus-border">
              <i></i>
            </span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button
      :class="['loginBtn',{'loginBtn_disabled':(form1.mobile==''||form1.password=='')&&(form2.account==''||form2.password=='')}]"
      @click="onSubmit"
      size="medium"
      style="width: 282px;"
      type="primary"
    >登录</el-button>
    <div class="regiter-footer">
      <span @click="handleGoLoginClick" style="color:#999;cursor: pointer;">返回登录 ></span>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import md5 from 'js-md5'
import IntlTelInput from './IntlTelInput/index'
import { ipcRenderer, remote, session } from 'electron'
import { DB, Storage } from '../../../main/db/dbStore'
import { changeWS } from '../../../main/api/baseURL'
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
      type: 'first',
      form1: {
        mobile: '',
        password: ''
      },
      form2: {
        account: '',
        password: ''
      },
      item: {},
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
        ],
        account: [
          {
            required: true,
            message: '请输入邮箱/账号',
            trigger: ['blur', 'change']
          }
        ]
      },
      toFront: ['cn'],
      checked: true,
      pwd: '',
      login_account_res: '',
      password_show: false
    }
  },
  mounted () {},
  props: {},
  components: {
    IntlTelInput
  },
  created () {
    ipcRenderer.on('leigod-login-res', this.accountLogin)
    ipcRenderer.on('user-info-login-res', this.userInfoLogin)
  },
  destroyed () {
    ipcRenderer.removeListener('leigod-login-res', this.accountLogin)
    ipcRenderer.removeListener('user-info-login-res', this.userInfoLogin)
  },
  methods: {
    userInfoLogin (event, params) {
      if (params.code === 0) {
        this.$store.dispatch('savePublicUserInfo', params.data)
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    },
    loginKeyDown (event) {
      const _that = this
      if (event.keyCode === 13) {
        this.onSubmit()
      }
    },
    validateField (form, props, msg) {
      this.$refs[form].validateField(props)
    },
    // 切换不同的子组件
    handleGoLoginClick () {
      // this.$refs['form'].resetFields()
      this.$store.dispatch('loginBtnClick', 1)
    },
    forgetLeigod () {
      window.open('https://www.leigod.com//')
    },
    handleClick (tab, event) {
      console.log(tab, event)
      // this.$refs[this.type === '1' ? 'form2' : 'form1'].resetFields()
    },
    excountry (item) {
      this.item = item
    },
    onSubmit () {
      var that = this
      that.$refs[that.type === 'first' ? 'form1' : 'form2'].validate(valid => {
        if (valid) {
          var data = {}
          if (that.type === 'first') {
            data = {
              mobile: that.form1.mobile.trim(),
              country_code: that.item.dialCode,
              password: md5(that.form1.password)
            }
            // // 添加点击pv
            // if (window._czc) {
            //   window._czc.push(['_trackEvent', '雷神手机登录', '点击', '1'])
            // }
          } else {
            data = {
              account: that.form2.account.trim(),
              password: md5(that.form2.password)
            }
            // // 添加点击pv
            // if (window._czc) {
            //   window._czc.push(['_trackEvent', '注册广告位', '点击', '1'])
            // }
          }
          ipcRenderer.send('leigod-login', data)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    accountLogin (event, params) {
      this.login_account_res = params
      let res = this.login_account_res
      if (res.data && res.data.code === 0) {
        console.log('存取雷神token', res)
        // 获取ws ip
        changeWS(params.data.data.gateway)
        // 修改用户登录类型为普通用户登录
        ipcRenderer.send('change_user_login_type', 1)
        // 如果保存密码，则记住密码
        if (res.data.data.nn_id) {
          Storage.set('nn_id', res.data.data.nn_id)
          // 自动登录成功后，将token，userinfo信息保存到内存中
          ipcRenderer.send('guest_login_info_set', res.data.data)
          // 将nn_id保存到主进程，用于axios获取token
          ipcRenderer.send('home_save_nn_id', res.data.data.nn_id)
          ipcRenderer.send('get-token', res.data.data.token)
          ipcRenderer.send('destroy-ws')
          // =================ws======================
          let token = res.data.data.token
          if (token) {
            ipcRenderer.send('establish-ws', token)
          } else {
            this.$message.error('创建连接失败')
          }
          ipcRenderer.send('change_login_token', res.data.data.token)
          this.$store.commit('savePublicToken', res.data.data.token)
          ipcRenderer.send('user-setting-user-info')
        } else {
          // 如果没有nn_id,给绑定手机号传递雷神登录的token
          this.$emit('leigodToken', res.data.data.bind_token)
        }
        if (res.data.data.need_bind_mobile) {
          this.$store.dispatch('loginBtnClick', 4)
        } else {
          this.$store.dispatch('loginBtnClick', 0)
          this.$notify({
            message: '登录成功',
            type: 'success'
          })
        }
      } else {
        this.$notify({
          message: '账号登录失败',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang='less' scoped>
/deep/.el-tabs {
  .el-tabs__header {
    padding-left: 50px;
    margin-bottom: 0px;
    .el-tabs__active-bar {
      background: transparent;
      text-align: center;
      height: 6px;
      top: 18px;
      // top: 38px;
      z-index: 0;
      &::after {
        width: 30px;
        height: 6px;
        background: #ffd33e;
        // background: #f8c346;
        border-radius: 3px;
        position: absolute;
        display: inline-block;
        content: '';
        left: 50%;
        transform: translateX(-50%);
      }
      transition: transform 0.1s cubic-bezier(0.645, 0.045, 0.355, 1),
        -webkit-transform 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      color: #999999;
      font-size: 15px;
      transition: 0.1s all 0.1s;
      &.is-active,
      &:hover {
        color: #333;
      }
    }
  }
  .el-tabs__content {
    padding-top: 30px;
    overflow: inherit;
  }
}
/deep/.el-checkbox__inner {
  border-radius: 0;
}
/deep/.selected-flag {
  height: 46px !important;
}
/deep/.el-button--primary {
  color: #333;
  background-color: #ffd33f;
  border-color: #ffd33f;
}
/deep/.el-button--primary:hover {
  color: #333;
  background-color: #ffce2b;
  border-color: #ffce2b;
}
/deep/.el-button--primary:focus,
.el-button--primary:hover {
  background: #ffce2b;
  border-color: #ffce2b;
  color: #333;
}
/deep/.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  height: 42px;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
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
.intl-tel-input {
  height: 36px;
  color: #666;
  font-size: 14px;
  .country-list {
    z-index: 899;
    width: 190px;
    height: 172px !important;
    margin-top: 2px;
    left: 6px;
    border: none;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}
.container {
  text-align: center;
  // display: -webkit-box;
  // background-color: #ddd;
  .regiter-footer {
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 25px;
  }
}
.top {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: #eee;
  margin: auto;
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
    margin-bottom: 20px !important;
  }
  .input-item-excountry {
    width: 100%;
  }
  .border-input {
    /* border-radius: 4px; */
    outline: none;
    // border: 1px solid #ccc;
    // padding: 7px 14px 9px;
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
}
input {
  height: 44px;
  line-height: 44px;
  // border-radius: 4px;
  // border: 1px solid #c0c4cc;
  border: 0;
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
.country {
  width: 120px;
}
.code {
  width: 120px;
}
.email {
  border: 0;
  // border-bottom: 1px solid #ccc;
  padding-left: 10px;
  // width: 298px;
  outline: none;
  // border: 1px solid #ccc;
  transition: 0.5s;
  transition: all 1s ease-in-out;
  color: #333;
  float: left;
}
.pwd {
  /* border-radius: 4px; */
  border: 0;
  // border-bottom: 1px solid #ccc;
  padding-left: 10px;
  // width: 298px;
  outline: none;
  // border: 1px solid #ccc;
  transition: 0.5s;
  transition: all 1s ease-in-out;
  color: #333;
  float: left;
}
.el-radio__input {
  display: none;
}
.foget {
  float: right;
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
}
.foget:hover {
  color: #409eff;
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
.image {
  margin-left: 15px;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.25s linear;
}
.image:hover {
  transform: translateY(-1.5px);
  // box-shadow: 2px 2px 6px rgba(0,0,0,0.20),0 2px 8px rgba(0,0,0,0.09);
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
}
</style>


