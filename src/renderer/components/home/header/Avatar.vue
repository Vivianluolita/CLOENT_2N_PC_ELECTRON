<template>
  <div @click="goSetting" class="header-avatar-wrap">
    <el-popover class="popover-wrap" placement="bottom" trigger="hover" v-model="isShowPop">
      <NoLogin v-if="!haveToken" />
      <AlreadyLogin @hiddenPop="changeIsShow" v-if="haveToken" />
      <el-avatar :src="loginSrc" class="avatar" slot="reference"></el-avatar>
    </el-popover>
  </div>
</template>

<script>
import NoLogin from './NoLogin'
import AlreadyLogin from './AlreadyLogin'
import { Storage } from '../../../../main/db/dbStore'
import { getCurrentLoginType } from '../../../common'
export default {
  name: 'Avatar',
  data () {
    return {
      isShowPop: false,
      token: '',
      trig: 'hover',
      src:
        'https://static.nn.com/image/2019/10/31/18/53/33/8224e03595d2e41f78bf8a7b74032e5d.png'
    }
  },
  mounted () {},
  computed: {
    haveToken: function () {
      if (
        this.$store.state.public.token &&
        this.$store.state.public.token !== undefined &&
        this.$store.state.public.token !== '' &&
        getCurrentLoginType() === 1
      ) {
        return true
      } else {
        return false
      }
    },
    getToken () {
      return this.$store.state.public.token
    },
    loginSrc () {
      let userInfo = this.$store.state.public.publicUserInfo
      if (this.getToken && userInfo) {
        return userInfo.avatar
      } else {
        return this.src
      }
    }
  },
  components: {
    NoLogin,
    AlreadyLogin
  },
  methods: {
    goLogin () {
      let isLoginShow = this.$store.state.loginShow.isLoginShow
      this.$store.dispatch('loginBtnClick', 0)
    },
    // 根据token判断是否登录
    goSetting () {
      if (
        this.$store.state.public.token &&
        this.$store.state.public.token !== undefined &&
        this.$store.state.public.token !== '' &&
        getCurrentLoginType() !== 0
      ) {
        this.$store.dispatch('userSettingClick')
      } else {
        this.$store.dispatch('loginBtnClick', 1)
      }
    },
    changeIsShow () {
      this.isShowPop = false
    }
  }
}
</script>
<style lang="less" scoped>
.header-avatar-wrap {
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
  .popover-wrap {
    display: inline-flex;
    flex-direction: row;
    align-self: center;
    cursor: pointer;
    .avatar {
      width: 30px !important;
      height: 30px !important;
    }
  }
}
.unlogin {
  width: 200px;
  line-height: 100%;
  text-align: center;
  padding: 10px;
  border: 1px solid rgb(240, 240, 240);
  background-color: rgb(245, 245, 245);
  .login-btn {
    font-weight: 600;
    color: rgb(168, 0, 184);
    cursor: pointer;
  }
  // a {
  //   font-weight: 600;
  //   text-decoration: none;
  //   color: rgb(168, 0, 184);
  // }
}
</style>
