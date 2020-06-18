<template>
  <div class="changePhone-wrap">
    <div class="changePhone-header">
      <div
        :class="isFirst ? 'isFirst' : ''"
        @click="goToAccount"
        class="changePhone-header-left"
      >账号管理 ></div>
      <div :class="!isFirst ? 'isFirst' : ''" class="changePhone-header-right">更换绑定手机</div>
    </div>
    <div class="changePhone-container">
      <div v-if="isFirst">
        <div class="changePhone-container-item">
          <div>当前绑定的手机号：</div>
          <div class="changePhone-container-item-leftBox-phone">{{info.mobile|formatter}}</div>
        </div>

        <div class="changePhone-container-form">
          <el-form :model="form" :rules="rules" ref="reqModel">
            <el-form-item prop="code">
              <div class="changePhone-container-form-inputBox">
                <el-input maxlength="4" placeholder="请输入验证码" v-model="form.code" />
                <el-button
                  :class="clickCode ? 'clickBtn' : 'noClickBtn'"
                  :disabled="codeDisable"
                  @click="getCode"
                  class="changePhone-container-form-btn"
                >{{countDown}}</el-button>
              </div>
            </el-form-item>
            <div class="changePhone-container-form-next">
              <el-button @click="onNext" class>下一步</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <div v-else>
        <SecendStep :info="info" @changePhoneOk="goToAccount" />
      </div>
    </div>
  </div>
</template>

<script>
import SecendStep from './changePhoneSecend'
import { ipcRenderer, remote, session } from 'electron'
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
    return {
      isFirst: true,
      countDown: '获取验证码',
      codeDisable: false,
      timer: null,
      num: 60,
      clickCode: false,
      form: {
        code: ''
      },
      rules: {
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
    SecendStep
  },
  props: {
    info: Object
  },
  created () {
    ipcRenderer.on('user-setting-chackout-mobile-res', (event, params) => {
      if (params.code === 0) {
        this.isFirst = false
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
    ipcRenderer.on('user-setting-get-code-res', (event, params, name) => {
      if (name === 'phone') {
        if (params.code === 0) {
          this.$message({
            message: '验证码发送成功！',
            type: 'success'
          })
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
          this.$message({
            message: params.msg,
            type: 'error'
          })
        }
      }
    })
  },
  methods: {
    getCode () {
      this.codeDisable = true
      let data = {
        mobile: `${this.info.mobile}`,
        country_code: this.info.country_code,
        type: 5
      }
      ipcRenderer.send('user-setting-get-code', data, 'phone')
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
    goToAccount () {
      this.$emit('goAccount')
      this.isFirst = true
    },
    onNext () {
      this.$refs['reqModel'].validate(valid => {
        if (valid) {
          let data = {
            code: `${this.form.code}`
          }
          ipcRenderer.send('user-setting-chackout-mobile', data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.changePhone-wrap {
  .changePhone-header {
    display: flex;
    align-items: center;
    padding: 17px 0 28px;
    font-size: 17px;

    .changePhone-header-left {
      cursor: pointer;
    }
    .isFirst {
      color: #4e4afc;
    }
  }
  .changePhone-container {
    margin-left: 80px;
    .changePhone-container-item {
      padding: 20px 0;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 15px;
      }
      .changePhone-container-item-leftBox-phone {
        margin-left: 30px;
      }
    }
    .changePhone-container-form {
      .changePhone-container-form-next {
        button {
          width: 100px;
          height: 40px;
        }
      }
      .changePhone-container-form-inputBox {
        display: flex;
        align-items: center;
        /deep/ .el-input {
          width: 180px !important;
          .el-input__inner {
            height: 32px !important;
          }
        }
        .changePhone-container-form-btn {
          width: 100px;
          height: 28px;
          line-height: 28px;
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
  }
}
</style>