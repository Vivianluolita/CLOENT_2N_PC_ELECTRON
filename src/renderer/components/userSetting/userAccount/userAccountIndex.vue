<template>
  <div>
    <div class="userAccunt-wrap" v-if="isSet === 0">
      <header class="userAccunt-headerBox">
        <div class="userAccunt-headerBox-title">账号管理</div>
      </header>
      <section class="userAccunt-container">
        <div class="userAccunt-container-Bigitem">
          <div class="userAccunt-container-item">
            <div class="userAccunt-container-item-leftBox">
              <img alt src="../../../assets/img/userSetting/32deb63.png" />
              <div>绑定手机</div>
              <div class="userAccunt-container-item-leftBox-phone">{{userInfo.mobile|formatter}}</div>
            </div>
            <div @click="changePhone" class="userAccunt-container-item-rightBox">更换手机号</div>
          </div>
        </div>
        <div class="userAccunt-container-Bigitem">
          <div class="userAccunt-container-item">
            <div class="userAccunt-container-item-leftBox">
              <img alt src="../../../assets/img/userSetting/c447ac3.png" />
              <div>账号密码</div>
            </div>
            <div
              @click="changePassword"
              class="userAccunt-container-item-rightBox"
              v-if="!isChangePassword"
            >修改密码</div>
            <div class="userAccunt-container-item-btns" v-if="isChangePassword">
              <div @click="changePasswordCancel" class="cancel">取消</div>
              <div @click="save" class="save">保存</div>
            </div>
          </div>
          <!-- 修改密码 -->
          <div class="userAccunt-container-changePassword" v-if="isChangePassword">
            <div class="userAccunt-container-changePassword-item">
              <div class="userAccunt-container-changePassword-left">手机号码:</div>
              <div class="userAccunt-container-changePassword-right">{{userInfo.mobile|formatter}}</div>
            </div>
            <div class="userAccunt-container-changePassword-item">
              <div class="userAccunt-container-changePassword-left">验证码:</div>
              <div class="userAccunt-container-changePassword-right input-Box">
                <el-input clearable placeholder="请输入验证码" v-model="code"></el-input>
                <el-button
                  :class="codeDisable ? 'isDisabel' : ''"
                  :disabled="codeDisable"
                  @click="getCode"
                  class="sendCode"
                >{{countDown}}</el-button>
              </div>
            </div>
            <div class="userAccunt-container-changePassword-item">
              <div class="userAccunt-container-changePassword-left">新密码:</div>
              <div class="userAccunt-container-changePassword-right">
                <el-input clearable placeholder="请输入新密码" show-password v-model="newPassword" />
              </div>
            </div>
            <div class="userAccunt-container-changePassword-item">
              <div class="userAccunt-container-changePassword-left">确认新密码:</div>
              <div class="userAccunt-container-changePassword-right">
                <el-input clearable placeholder="请再次确认新密码" show-password v-model="affirmPassword"></el-input>
              </div>
            </div>
          </div>
        </div>

        <!-- 绑定雷神 -->
        <div class="userAccunt-container-Bigitem">
          <div class="userAccunt-container-item">
            <div class="userAccunt-container-item-leftBox">
              <img alt src="../../../assets/img/userSetting/leigod.png" />
              <div>绑定雷神</div>
              <div class="noBang" v-if="!userInfo.leigod">请使用雷神第三方登录进行账号绑定</div>
            </div>
            <div
              @click="bindLeiGod"
              class="userAccunt-container-item-rightBox"
              v-if="userInfo.leigod"
            >解除绑定</div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="isSet === 1">
      <ChangePhonePage :info="userInfo" @goAccount="closeChangePhone" />
    </div>
    <div v-if="isSet === 2">
      <BindLeiGod :info="userInfo" @goAccount="closeBindLeiGod" />
    </div>
  </div>
</template>

<script>
import ChangePhonePage from '../changPhone/changPhoneFirst'
import BindLeiGod from '../bindLeiGod/bindLeiGod'
import { ipcRenderer, remote, session } from 'electron'
import md5 from 'js-md5'
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
      isSet: 0, // 0 页面为显示 1 更换手机号 2 绑定雷神
      isNoBindLeiGod: false,
      isChangePassword: false,
      userInfoData: {},
      code: '',
      newPassword: '',
      affirmPassword: '',
      countDown: '获取验证码',
      codeDisable: false,
      timer: null,
      num: 60
    }
  },
  components: {
    ChangePhonePage,
    BindLeiGod
  },
  props: {
    userInfo: Object
  },
  watch: {
    userInfo: val => {
      console.log('...........', val)
    }
  },
  created () {
    ipcRenderer.on('user-setting-get-code-res', (event, params, name) => {
      if (name === 'password') {
        if (params.code === 0) {
          this.$message({
            message: '验证码发送成功！',
            type: 'success'
          })
          this.codeDisable = true
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            if (this.num === 0) {
              clearInterval(this.timer)
              this.num = 60
              this.codeDisable = false
              this.countDown = '获取验证码'
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
    bindLeiGod () {
      if (!this.userInfo.leigod) {
        this.isSet = 2
        return false
      } else {
        this.$alert('是否确定解除绑定雷神账号?', '提示', {
          center: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            let data = { type: 3 }
            ipcRenderer.send('user-setting-remove-lei-god', data)
          })
          .catch(action => {})
      }
      // this.isNoBindLeiGod = true
    },
    noBindLeiGod () {
      let data = { type: 3 }
      ipcRenderer.send('user-setting-remove-lei-god', data)
      this.isNoBindLeiGod = false
    },
    getCode () {
      // this.codeDisable = true
      let data = {
        mobile: `${this.userInfo.mobile}`,
        country_code: this.userInfo.country_code,
        type: 4
      }
      ipcRenderer.send('user-setting-get-code', data, 'password')
      // clearInterval(this.timer)
      // this.timer = setInterval(() => {
      //   if (this.num === 0) {
      //     clearInterval(this.timer)
      //     this.num = 60
      //     this.codeDisable = false
      //     this.countDown = '获取验证码'
      //   } else {
      //     this.num--
      //     this.countDown = `${this.num}S重新获取`
      //   }
      // }, 1000)
    },
    changePhone () {
      this.isSet = 1
    },
    changePassword () {
      this.isChangePassword = true
    },
    changePasswordCancel () {
      this.isChangePassword = false
      this.code = ''
      this.newPassword = ''
      this.affirmPassword = ''
    },
    closeChangePhone () {
      this.isSet = 0
      console.log('jjjjjjjjjjjjjjjjjjj', this.userInfo)
    },
    closeBindLeiGod () {
      this.isSet = 0
    },
    changePasswordSave () {},
    save () {
      if (this.code === '') {
        this.$message({
          message: '请输入验证码',
          type: 'warning'
        })
        return false
      }
      if (this.newPassword === '') {
        this.$message({
          message: '请输入新密码',
          type: 'warning'
        })
        return false
      }
      if (this.affirmPassword === '') {
        this.$message({
          message: '请输入确认密码',
          type: 'warning'
        })
        return false
      }
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/

      if (!reg.test(this.newPassword)) {
        this.$message({
          message: '密码必须为6-12位数字与字母组合',
          type: 'warning'
        })
        return false
      }

      if (this.affirmPassword !== this.newPassword) {
        this.$message({
          message: '确认密码和新密码不一致',
          type: 'warning'
        })
        return false
      }
      let data = {
        mobile: this.userInfo.mobile,
        country_code: this.userInfo.country_code,
        code: this.code,
        password: md5(this.newPassword)
      }

      ipcRenderer.send('user-setting-new-password', data)
    }
  }
}
</script>

<style lang="less" scoped>
.userAccunt-wrap {
  width: 100%;
  .userAccunt-headerBox {
    width: 100%;
    padding: 17px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .userAccunt-headerBox-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  .userAccunt-container {
    .userAccunt-container-Bigitem {
      border-bottom: 1px dotted #a1a1a1;
      .userAccunt-container-item {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .userAccunt-container-item-leftBox {
          display: flex;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 25px;
          }
          .userAccunt-container-item-leftBox-phone {
            margin-left: 80px;
          }
          .noBang {
            font-size: 14px;
            color: #fa6400;
            margin-left: 80px;
          }
        }
        .userAccunt-container-item-rightBox {
          cursor: pointer;
          width: 90px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          color: #666;
        }
        .userAccunt-container-item-btns {
          display: flex;
          align-items: center;
          div {
            margin-left: 10px;
            cursor: pointer;
            width: 90px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .save {
            border-color: #4e4afc;
            color: #4e4afc;
          }
        }
      }
    }

    .userAccunt-container-changePassword {
      margin-left: 65px;
      padding-bottom: 10px;
      .userAccunt-container-changePassword-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .userAccunt-container-changePassword-left {
          width: 90px;
        }
        .userAccunt-container-changePassword-right {
          width: 290px;
          display: flex;
          align-items: center;
          .sendCode {
            width: 100px;
            height: 32px;
            padding: 0;
            line-height: 32px;
            text-align: center;
            border: 1px solid #4e4afc;
            font-size: 12px !important;
            color: #4e4afc;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
          }
          .isDisabel {
            border: 1px solid #ddd;
            color: #ddd;
          }
        }
        .input-Box {
          .el-input {
            flex: 1;
          }
        }
      }
    }
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
  /deep/ .el-input__suffix {
    top: -5px;
  }
}
</style>