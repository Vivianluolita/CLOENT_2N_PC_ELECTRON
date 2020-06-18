<template>
  <el-dialog
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    :show-close="false"
    :visible="isVisible===0?false:true"
    height="407px"
    width="360px"
  >
    <div class="login-wrap">
      <div @click="closeDialog" class="userSetting-header-topHeader-close">
        <i class="el-icon-close" style="width:25px;height:25px;line-height:25px;"></i>
      </div>
      <div>
        <img
          :src="isVisible === 3?imgSrc[1].login_bg:(isVisible === 1?imgSrc[0].login_bg:imgSrc[2].login_bg)"
          @click="loginBannerJump"
          alt
          class="login-bg"
          v-if="showImg"
        />
      </div>
      <el-main class="login-input">
        <nn-login-normal
          :findPwdLoginNumber="findPwdLoginNumber"
          @goComponents="goComponents"
          class="login-nomal"
          ref="component2"
          v-if="isVisible === 1"
        ></nn-login-normal>
        <nn-login-register
          :phone_value="phone_value"
          @goComponents="goComponents"
          @transferPhone="transferPhone"
          v-if="isVisible === 2"
        ></nn-login-register>
        <nn-login-leigod
          @goComponents="goComponents"
          @leigodToken="leigodToken"
          v-if="isVisible === 3"
        ></nn-login-leigod>
        <nn-login-bind-phone
          :getLeigodToken="getLeigodToken"
          @goComponents="goComponents"
          v-if="isVisible === 4"
        ></nn-login-bind-phone>
        <nn-login-find-pwd
          @findPwdLogin="findPwdLogin"
          @goComponents="goComponents"
          v-if="isVisible === 5"
        ></nn-login-find-pwd>
      </el-main>
    </div>
  </el-dialog>
</template>

<script>
import LoginRegister from '@/components/login/LoginRegister'
import LoginBindPhone from '@/components/login/LoginBindPhone'
import LoginNormal from '@/components/login/LoginNormal'
import LoginFindPwd from '@/components/login/LoginFindPwd'
import LoginLeigodLogin from '@/components/login/LoginLeigodLogin'
import { ipcRenderer } from 'electron'

export default {
  name: 'login',
  data () {
    return {
      // imgSrc: {
      //   login_bg: require('@/assets/img/login/login_header_bg.png'),
      //   legiod_bg: require('@/assets/img/login/legiod_header_bg.png'),
      //   register_bg: require('@/assets/img/login/login_header_bg.png')
      // },
      imgSrc: [
        // 登录
        {
          login_bg: require('@/assets/img/login/login_header_bg.png'),
          url: ''
        },
        // 雷神登录
        {
          login_bg: require('@/assets/img/login/legiod_header_bg.png'),
          url: ''
        },
        // 注册
        {
          login_bg: require('@/assets/img/login/login_header_bg.png'),
          url: ''
        }
      ],
      isLeigod: false,
      phone_value: '',
      // 忘记密码登录账号登录回显
      findPwdLoginNumber: '',
      // 雷神登录token
      getLeigodToken: ''
    }
  },
  components: {
    // 注册
    'nn-login-register': LoginRegister,
    'nn-login-normal': LoginNormal,
    'nn-login-leigod': LoginLeigodLogin,
    'nn-login-bind-phone': LoginBindPhone,
    'nn-login-find-pwd': LoginFindPwd
  },
  mounted () {
    // // pv曝光
    // if (window._czc) {
    //   window._czc.push(['_trackEvent', '登录界面', '曝光', '1'])
    // }
  },
  destroyed () {
    ipcRenderer.removeListener('advertise-login-res', this.adverticeLogin)
  },
  created () {
    ipcRenderer.on('advertise-login-res', this.adverticeLogin)
    ipcRenderer.send('advertise-login')
    this.findPwdLoginNumber = ''
  },
  methods: {
    // 雷神登录token传递
    leigodToken (data) {
      this.getLeigodToken = data
    },
    // 做子组件的切换
    goComponents (type) {
      this.login_type = type
    },
    // 子组件之间的电话号码传递
    transferPhone (text) {
      this.phone_value = text
    },
    // 登陆页面 不登陆 直接跳转大厅
    goHome () {
      // this.$router.push({ name: 'channelHall' })
    },
    handleClose () {
      this.$store.dispatch('loginBtnClick', 0)
    },
    findPwdLogin (data) {
      this.findPwdLoginNumber = data
    },
    handleWrapClose () {
      return false
    },
    closeDialog () {
      // // 添加点击pv
      // if (window._czc) {
      //   window._czc.push(['_trackEvent', '关闭弹窗', '点击', '1'])
      // }
      this.$store.dispatch('loginBtnClick', 0)
    },
    adverticeLogin (event, params) {
      let res = params
      console.log(12212)
      console.log(params)
      if (res.data && res.data.code === 0) {
        // 如果有广告位数据
        if (res.data.data.length) {
          for (var i = 0; i < res.data.data.length; i++) {
            // 如果是登录则给登录的图片
            if (res.data.data[i].show_position === 1 && res.data.data[i].icon) {
              // 注册
              this.imgSrc[2].login_bg = res.data.data[i].icon
              this.imgSrc[2].url = res.data.data[i].url
            }
            if (res.data.data[i].show_position === 0 && res.data.data[i].icon) {
              // 登录
              this.imgSrc[0].login_bg = res.data.data[i].icon
              this.imgSrc[0].url = res.data.data[i].url
            }
          }
        }
        console.log(this.imgSrc)
      }
    },
    loginBannerJump () {
      if (this.isVisible === 1) {
        // 登录
        console.log(this.imgSrc[0])
        if (this.imgSrc[0].url) {
          this.openWin(this.imgSrc[0].url)
        }
      } else if (this.isVisible === 2) {
        // 注册
        console.log(this.imgSrc[2])
        if (this.imgSrc[2].url) {
          this.openWin(this.imgSrc[2].url)
        }
      }
    },
    // 页面跳转
    openWin (url) {
      console.log(url)
      if (url.indexOf('http') !== -1) {
        window.open(url)
      } else {
        if (url.indexOf('channel/enter') !== -1) {
          let channelNo = url.split('?channel_no=')[1]
          ipcRenderer.send('is-room-window', channelNo)
          // let jumpUrl =
          //   window.location.href +
          //   `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
          // ipcRenderer.send('request-new-win', jumpUrl)
        }
      }
      // window.open('http://' + url)
    }
  },

  computed: {
    isVisible () {
      return this.$store.state.loginShow.isLoginShow
    },
    showImg () {
      return (
        this.isVisible !== 4 &&
        this.isVisible !== 5 &&
        this.isVisible !== 6 &&
        this.isVisible !== 7
      )
    }
  },
  watch: {
    isVisible (newValue, oldValue) {
      if (newValue !== 1 && oldValue !== 5) {
        this.findPwdLoginNumber = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  border-radius: 7px;
}
/deep/.el-dialog__header {
  padding: 0px 0px 0px;
}
/deep/.el-dialog__body {
  padding: 0px 0px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
/deep/.el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}
/deep/ .el-main {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 13px 20px 19px 20px;
}
/deep/ .el-dialog__headerbtn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px;
}
.login-wrap {
  border-radius: 4px;
  background-color: #fff;
  .userSetting-header-topHeader-close {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #fff;
    width: 25px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
  }
  .login-bg {
    width: 100%;
    height: 119px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    object-fit: cover;
    cursor: pointer;
  }
  .login-input {
    overflow-x: hidden !important;
    .login-goHome {
      position: absolute;
      top: 20px;
      right: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
      display: flex;
      .el-icon-s-home {
        margin-right: 4px;
        font-size: 20px;
      }
      .login-goHome:hover {
        color: #4e4afc;
      }
    }
  }
}
</style>