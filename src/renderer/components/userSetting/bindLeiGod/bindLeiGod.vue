<template>
  <div class="bindLeiGod-wrap">
    <div class="bindLeiGod-header">
      <div @click="goToAccount" class="bindLeiGod-header-left">账号管理 ></div>
      <div class="bindLeiGod-header-right">绑定雷神</div>
    </div>
    <div class="bindLeiGod-container">
      <div>
        <div class="bindLeiGod-container-item">
          <div class="title">绑定雷神</div>
        </div>

        <div class="bindLeiGod-container-form">
          <el-form :model="form" :rules="rules" ref="reqModel">
            <el-form-item prop="mobile" v-if="isMobile">
              <!-- <div class="bindLeiGod-container-form-inputBox">
                <el-input maxlength="11" placeholder="请输入雷神账号" v-model="form.mobile" />
                
              </div>-->
              <div class="bindLeiGod-container-form-inputBox">
                <div class="topBox">
                  <IntlTelInput :toFront="toFront" @excountry="excountry" countryCode="cn" />
                  <el-input placeholder="请输入新手机号" v-model="form.mobile" />
                </div>
                <div @click="isMobile = false" class="bindLeiGod-container-form-btn">更换为邮箱登录</div>
              </div>
            </el-form-item>
            <el-form-item prop="account" v-else>
              <div class="bindLeiGod-container-form-inputBox">
                <el-input placeholder="请输入邮箱账号" v-model="form.account" />
                <div @click="isMobile = true" class="bindLeiGod-container-form-btn">更换为雷神账号登录</div>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="bindLeiGod-container-form-inputBox">
                <el-input clearable placeholder="请输入密码" show-password v-model="form.password" />
              </div>
            </el-form-item>
            <div class="bindLeiGod-container-form-next">
              <el-button @click="okClick" class>确定</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote, session } from 'electron'
import md5 from 'js-md5'
import IntlTelInput from '../../login/IntlTelInput/index'
export default {
  filters: {
    formatter: function (value) {
      if (value !== '') {
        let phoneArr = value.split('')
        phoneArr.splice(3, 1, '*')
        phoneArr.splice(4, 1, '*')
        phoneArr.splice(5, 1, '*')
        phoneArr.splice(6, 1, '*')

        return phoneArr.join('')
      }
    }
  },
  data () {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        // 失去焦点判断是不是中国手机号需要判断是否符合规范
        if (this.Country_C === 86) {
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
          console.log(reg.test(value))
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        } else {
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

    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱账号'))
      } else {
        return callback()
      }
    }
    return {
      isMobile: true,
      countDown: '获取验证码',
      codeDisable: false,
      timer: null,
      num: 60,
      Country_C: '',
      clickCode: false,
      form: {
        password: '',
        mobile: '',
        account: ''
      },
      toFront: ['cn'],
      rules: {
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
        ],
        account: [{ validator: checkEmail, trigger: ['blur', 'change'] }]
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
    Country_C (val) {},
    isMobile (val) {
      this.$refs['reqModel'].resetFields()
    }
  },
  created () {
    ipcRenderer.on('bind-lei-god-res', (event, params) => {
      console.log('44444444', params)
      if (params.code === 0) {
        this.$message({
          message: '雷神账号绑定成功!',
          type: 'success'
        })
        this.$emit('goAccount')
        ipcRenderer.send('user-setting-user-info')
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
  },
  methods: {
    changeType (i) {},
    goToAccount () {
      this.$emit('goAccount')
    },
    okClick () {
      this.$refs['reqModel'].validate(valid => {
        if (valid) {
          let data = {}
          for (let i in this.form) {
            data[i] = this.form[i]
          }
          if (this.isMobile) {
            delete data.account
          } else {
            delete data.mobile
          }
          data.country_code = this.Country_C || this.info.country_code
          data.password = md5(data.password)
          ipcRenderer.send('user-setting-bind-lei-god', data)
        } else {
          return false
        }
      })
    },
    excountry (item) {
      this.Country_C = item.dialCode
      this.$refs['reqModel'].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.bindLeiGod-wrap {
  .bindLeiGod-header {
    display: flex;
    align-items: center;
    padding: 17px 0 28px;
    font-size: 17px;

    .bindLeiGod-header-left {
      cursor: pointer;
      color: #4e4afc;
    }
    .isFirst {
      color: #4e4afc;
    }
  }
  .bindLeiGod-container {
    margin-left: 80px;
    .bindLeiGod-container-item {
      padding: 15px 0;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 15px;
      }
      .title {
        font-size: 14px;
        color: #333;
      }
      .bindLeiGod-container-item-leftBox-phone {
        margin-left: 30px;
      }
    }
    .bindLeiGod-container-form {
      .bindLeiGod-container-form-next {
        margin-top: 50px;
        button {
          width: 100px;
          height: 40px;
        }
      }
      .bindLeiGod-container-form-inputBox {
        display: flex;
        align-items: center;
        /deep/ .el-input {
          width: 60%;
          max-width: 290px;
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
        .topBox {
          width: 60%;
          display: flex;
          align-items: center;
          /deep/ .el-input {
            // width: 100%;
            flex: 1;
            max-width: 290px;
          }
        }
        .bindLeiGod-container-form-btn {
          flex: 1;
          margin-left: 10px;
          line-height: 20px;
          color: #4e4afc;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
