/* eslint-disable camelcase */
<template>
  <div class="views-home-wrap">
    <Header class="header" />
    <div class="container">
      <!-- <div class="con-main"></div> -->
      <div :class="['con-left',{'con-left-close':containerLeftDiaVisible}]">
        <nn-container-left></nn-container-left>
        <p
          :class="['con-left-hide-btn',{'con-left-show-btn':containerLeftDiaVisible}]"
          @click="containerLeftVisible"
        ></p>
      </div>
      <div class="con-main">
        <nn-container-main v-if="channelListType === 0"></nn-container-main>
        <!-- 我的频道 -->
        <nn-container-main-channel v-if="channelListType === 1"></nn-container-main-channel>
        <!-- 我的收藏 -->
        <nn-container-main-collect v-if="channelListType === 2"></nn-container-main-collect>
        <!-- 加载更多 -->
        <nn-more class="cantain-main-more"></nn-more>
        <nn-new-channel></nn-new-channel>
      </div>
      <div class="con-right">
        <ImWindow />
      </div>
    </div>
    <nn-login :modal-append-to-body="false"></nn-login>
    <UserSetting ref="UserSetting" />
    <SystemSetting />
    <!-- 热更新弹框 -->
    <hot-update></hot-update>
  </div>
</template>

<script>
import Login from '@/components/login/Login'
import Header from '../components/home/header/Header'
import ContainerLeft from '../components/home/container/ContainerLeft'
import ContainerMain from '../components/home/container/ContainerMain'
import ContainerMainChannel from '../components/home/container/ContainerMainChannel'
import ContainerMainCollect from '../components/home/container/ContainerMainCollect'
import More from '../components/home/container/ContainerMain/More'
import { ipcRenderer, remote } from 'electron'
import ImMini from '@/components/im/chat/ImMini'
import ImWindow from '@/components/im/chat/ImWindow'
import UserSetting from '../components/userSetting/userSettingIndex/userSettingIndex'
import SystemSetting from '../components/systemSetting/systemSettingIndex/systemSettingIndex'
import md5 from 'js-md5'
import { Storage } from '../../main/db/dbStore'
import util from '../utils/util'
import NewChannelDialog from '../components/home/container/ContainerMain/NewChannelDialog'
import store from '../store'
import hotUpdate from '../components/hotUpdate/hotUpdate' // 热更新弹窗
import { changeWS } from '../../main/api/baseURL'
import { guestLogin } from '../../main/api/login'
import {
  getCurrentToken,
  getCurrentUserInfo,
  getCurrentLoginType
} from '../common'
export default {
  name: 'home',
  components: {
    'nn-login': Login,
    'nn-container-left': ContainerLeft,
    'nn-container-main': ContainerMain,
    'nn-container-main-channel': ContainerMainChannel,
    'nn-container-main-collect': ContainerMainCollect,
    'nn-more': More,
    'nn-new-channel': NewChannelDialog,
    'hot-update': hotUpdate,
    Header,
    ImMini,
    ImWindow,
    UserSetting,
    SystemSetting
  },
  data () {
    return {
      traySafeCenter: Number
    }
  },
  destroyed () {
    ipcRenderer.removeListener('category-list-res', this.categoryListRes)
    ipcRenderer.removeListener('get-config-res', this.getConfigRes)
    ipcRenderer.removeListener(
      'auto-user-info-login-res',
      this.autoUserInfoLoginRes
    )
    ipcRenderer.removeListener(
      'auto-account-login-res',
      this.autoAccountLoginRes
    )
    // token登录过期
    ipcRenderer.removeListener('token-expired', this.tokenExpired)
    // 托盘呼出登录
    ipcRenderer.removeListener('tray-request-login', this.trayRequestLogin)
    // 托盘呼出注册
    ipcRenderer.removeListener(
      'tray-request-register',
      this.trayRequestRegister
    )
    ipcRenderer.removeListener('tray-request-safety', this.trayRequestSafety)
    ipcRenderer.removeListener('is_room_window', this.isRoomWindow)
  },
  created () {
    ipcRenderer.send('change_user_login_type', 0)
    // 关闭进程的时候清vuex
    ipcRenderer.on('close-before', (event, params) => {
      // this.$store.dispatch('ShowSearchHistory', false)
    })
    ipcRenderer.on('category-list-res', this.categoryListRes)
    ipcRenderer.on('get-config-res', this.getConfigRes)
    ipcRenderer.on('auto-user-info-login-res', this.autoUserInfoLoginRes)
    ipcRenderer.on('auto-account-login-res', this.autoAccountLoginRes)
    // token登录过期
    ipcRenderer.on('token-expired', this.tokenExpired)
    // 托盘呼出登录
    ipcRenderer.on('tray-request-login', this.trayRequestLogin)
    // 托盘呼出注册
    ipcRenderer.on('tray-request-register', this.trayRequestRegister)
    ipcRenderer.on('tray-request-safety', this.trayRequestSafety)
    // 判断是否有打开频道窗口
    ipcRenderer.on('is-room-window-res', this.isRoomWindow)
    // 被挤号的判断
    // ipcRenderer.on('user-squeeze', (event, params) => {
    //   // this.$message({
    //   //   message: '被挤号了',
    //   //   type: 'error'
    //   // })
    //   this.$store.dispatch('loginBtnClick', 1)
    // })
  },
  methods: {
    isRoomWindow (event, params) {
      let channelNo = params
      console.log(remote.getGlobal('windowObject').roomWindow)
      if (remote.getGlobal('windowObject').roomWindow) {
        // 提示房间已经存在，弹出选择框，是否关闭房间再新开一个房间
        this.$alert('是否退出当前频道，进入新的频道', '提示', {
          center: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            remote.getGlobal('windowObject').roomWindow.close()
            remote.getGlobal('windowObject').roomWindow = null
            let url =
              window.location.href +
              `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
            ipcRenderer.send('request-new-win', url)
          })
          .catch(action => {})
      } else {
        let url =
          window.location.href +
          `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
        ipcRenderer.send('request-new-win', url)
      }
    },
    categoryListRes (event, params) {
      if (params.data && params.data.code === 0) {
        var _arr = []
        let categoryList = params.data.data
        categoryList.map((item, index) => {
          let _obj = {}
          _obj.icon = item.icon
          _obj.no_icon = item.no_icon
          _obj.name = item.name
          _obj.id = item.id
          _obj.allow_user = item.allow_user
          _obj.index = index++
          if (item.tags !== null) {
            _obj.menu = item.tags
          }
          _arr.push(_obj)
        })
        this.$store.dispatch('SaveCategoryListArr', _arr)
      }
    },
    getConfigRes (event, params) {
      if (params.data && params.data.code === 0) {
        Storage.set('configInfo', params.data.data)
        let channelAvatar = params.data.data.channel_avatar
        this.$store.dispatch('SavePageConfigArr', channelAvatar)
      }
    },
    autoUserInfoLoginRes (event, params) {
      console.log('自动登录：===', params)
      if (getCurrentLoginType() === 0) {
        this.$store.dispatch('savePublicUserInfo', params)
      } else {
        if (params.data.code === 0) {
          this.$store.dispatch('savePublicUserInfo', params.data.data)
        } else {
          this.$message({
            message: params.data.msg,
            type: 'error'
          })
        }
      }
    },
    autoAccountLoginRes (event, params) {
      if (params.data.code === 0) {
        // 登录成功，修改登录类型
        ipcRenderer.send('change_user_login_type', 1)
        // 自动登录成功后，将token，userinfo信息保存到内存中
        ipcRenderer.send('guest_login_info_set', params.data.data)
        // 获取ws ip
        changeWS(params.data.data.gateway)
        ipcRenderer.send('home_save_nn_id', params.data.data.nn_id)
        this.$store.commit('savePublicToken', params.data.data.token)
        ipcRenderer.send('get-token', params.data.data.token)
        ipcRenderer.send('change_login_token', params.data.data.token)
        // =================ws======================
        ipcRenderer.send('destroy-ws')
        let token = params.data.data.token
        if (token) {
          ipcRenderer.send('establish-ws', token)
        } else {
          this.$message.error('创建连接失败')
        }
        ipcRenderer.send('auto-user-info-login')
      }
    },
    // token 过期
    tokenExpired (event, params) {
      // 登出入口
      Storage.set('publicUserInfo', '')
      this.$store.commit('savePublicToken', '')
      this.$store.dispatch('savePublicUserInfo', '')
      // 呼出登录框
      this.$store.dispatch('loginBtnClick', 1)
      // 清除global的nn_id
      ipcRenderer.send('home_save_nn_id', '')
      // 清空足迹
      this.$store.dispatch('SetFootprintList', [])
      // 把主页还原到最开始的状态
      util.homeRestore()
    },
    trayRequestLogin (event, params) {
      this.$store.dispatch('loginBtnClick', 1)
    },
    trayRequestRegister (event, params) {
      this.$store.dispatch('loginBtnClick', 2)
    },
    trayRequestSafety (event, params) {
      this.$refs.UserSetting.traySafeCenter()
      this.$store.dispatch('userSettingClick')
    },
    categoryList () {
      ipcRenderer.send('category-list')
    },
    // 获取全局配置
    getConfig () {
      ipcRenderer.send('get-config')
    },
    // 左侧列表的显示隐藏
    containerLeftVisible () {
      let isShow = !this.$store.state.home.containerLeftDiaVisible
      this.$store.dispatch('ShowContainerLeft', isShow)
    },
    autoLogin () {
      let isOpenNN = Storage.get('isOpenNN')
      console.log('isOpenNN: ', isOpenNN)
      if (isOpenNN === undefined || isOpenNN) {
        // 自动登录
        let password = Storage.get('password')
        let phone = Storage.get('phone')
        let countryCode = Storage.get('country_code')
        console.log('开始自动登录：', password, phone, countryCode)
        if (password && phone && countryCode) {
          const data = {
            mobile: phone,
            country_code: countryCode,
            password: md5(password)
          }
          ipcRenderer.send('auto-account-login', data)
        }
      }
    },
    guestLogin () {
      // 游客登录
      guestLogin()
        .then(res => {
          if (res.data && res.data.code === 0) {
            ipcRenderer.send('change_user_login_type', 0)
            ipcRenderer.send('guest_login_info_set', res.data.data)
            ipcRenderer.send('auto-user-info-login')
            ipcRenderer.send('change_login_token', res.data.data.token)
            this.$store.commit('savePublicToken', res.data.data.token)
          } else {
            this.$notify({
              message: '游客登录失败',
              type: 'error'
            })
          }
        })
        .catch(res => {
          console.log('游客异常：', res)
          this.$notify({
            title: '网络异常',
            message: '游客登录失败',
            type: 'error'
          })
        })
    }
  },
  mounted () {
    this.categoryList()
    this.getConfig()
    console.log(
      '自动登录标记：',
      remote.getGlobal('isAutoLogin'),
      Storage.get('isOpenNN')
    )
    // 如果是首次打开程序，则进行自动登录，否则进行游客登录
    if (remote.getGlobal('isAutoLogin')) {
      this.autoLogin()
    } else {
      this.guestLogin()
    }
  },
  computed: {
    containerLeftDiaVisible () {
      return this.$store.state.home.containerLeftDiaVisible
    },
    // 当前加载的中间列表是哪种类型 0是选择左侧列表的类型，1是我的频道的类型， 2是我的收藏的类型
    channelListType () {
      return this.$store.state.home.channelListType
    },
    getToken () {
      return this.$store.state.public.token
    }
  },
  watch: {
    getToken: {
      handler (newValue, oldValue) {
        ipcRenderer.send('get-token', newValue)
        ipcRenderer.send('change_login_token', newValue)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.views-home-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 55px;
  }
  .container {
    // min-width: 1515px;
    flex: 1;
    display: flex;
    flex-direction: row;

    .con-left {
      position: relative;
      width: 160px;
      height: 100%;
      .con-left-hide-btn,
      .con-left-show-btn {
        position: absolute;
        top: 50%;
        right: -13px;
        width: 13px;
        height: 122px;
        transform: translate(0, -50%);
        z-index: 999;
      }
      .con-left-hide-btn {
        background-image: url('../assets/img/home/left_list_hide.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .con-left-show-btn {
        background-image: url('../assets/img/home/left_list_show.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .con-left-show-btn:hover {
        background-image: url('../assets/img/home/left_list_show_hover.png');
      }
    }
    .con-left-close {
      width: 0;
    }

    .con-right {
      // width: 305px;
      width: auto;
      background: transparent;
    }

    .con-right-close {
      width: 13px;
    }

    .con-main {
      flex: 1;
      position: relative;
      .cantain-main-more {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 0;
        width: 80px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
