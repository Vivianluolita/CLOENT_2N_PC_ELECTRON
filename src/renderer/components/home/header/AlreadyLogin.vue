<template>
  <div class="AlreadyLogin-wrap">
    <div class="AlreadyLogin-header">
      <div @click="goOut" class="box">
        <el-image :src="out" alt style="width: 16px;height:16px;margin-right: 5px;" />
        <div style="margin-top: 3px;">登出</div>
      </div>
    </div>
    <div class="AlreadyLogin-infoBox">
      <!-- <el-image :src="userInfo.avatar" class="AlreadyLogin-avatar" fit="fill" /> -->
      <img :src="userInfo.avatar" alt class="AlreadyLogin-avatar" />
      <div class="AlreadyLogin-info">
        <div class="AlreadyLogin-name">{{userInfo.nickname}}</div>
        <div class="AlreadyLogin-userInfo">
          <div class="AlreadyLogin-id">ID:{{userInfo.nn_id}}</div>
          <el-image :src="userInfo.gender === 1 ? man : woman" class="AlreadyLogin-sex" fit="fill" />
          <div class="AlreadyLogin-xin" v-if="birth !== ''">{{birth}}</div>
        </div>
      </div>
    </div>
    <div class="AlreadyLogin-intro">{{userInfo.intro}}</div>
    <div class="AlreadyLogin-doBox">
      <div :key="i" @click="chooseType(i)" class="AlreadyLogin-item" v-for="(item, i) in doList">
        <el-image :src="item.img" class="AlreadyLogin-item-img" fit="fill" />
        <div>{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { Storage } from '../../../../main/db/dbStore'
import util from '../../../utils/util'
import { guestLogin } from '../../../../main/api/login'
import { getCurrentLoginType } from '../../../common'
export default {
  data () {
    return {
      haveBirth: true,
      out: require('../../../assets/img/userSetting/out.png'),
      man: require('../../../assets/img/userSetting/man.png'),
      woman: require('../../../assets/img/userSetting/woman.png'),
      avatar: '',
      doList: [
        {
          img: require('../../../assets/img/userSetting/add.png'),
          title: '个人中心'
        },
        {
          img: require('../../../assets/img/userSetting/upSin.png'),
          title: '我的频道'
        },
        {
          img: require('../../../assets/img/userSetting/shou.png'),
          title: '我的收藏'
        },
        {
          img: require('../../../assets/img/userSetting/create.png'),
          title: '创建频道'
        }
      ]
    }
  },
  created () {
    // this.userInfo = this.$store.state.public.publicUserInfo
  },
  computed: {
    userInfo () {
      return this.$store.state.public.publicUserInfo
    },
    birth () {
      let birthDay = this.userInfo.birthday
      if (birthDay) {
        let m = birthDay.substr(5, 2)
        let d = birthDay.substr(8, 2)
        return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
          m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2,
          2
        )
      } else {
        return ''
      }
    }
  },
  watch: {
    userInfo (val) {}
  },
  methods: {
    getAstro (birth) {
      if (birth) {
        let m = birth.substr(5, 2)
        let d = birth.substr(8, 2)
        return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
          m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2,
          2
        )
      } else {
        this.haveBirth = false
      }
    },
    goLogin () {
      let isLoginShow = this.$store.state.loginShow.isLoginShow
      this.$store.dispatch('loginBtnClick', isLoginShow)
    },
    goPost () {
      let isLoginShow = this.$store.state.loginShow.isLoginShow
      this.$store.dispatch('loginBtnClick', isLoginShow)
    },
    chooseType (i) {
      if (getCurrentLoginType() === 0) {
        this.$store.dispatch('loginBtnClick', 1)
        return
      }
      switch (i) {
        case 0:
          // 个人中心
          this.$store.dispatch('userSettingClick')
          break
        case 1:
          // 我的频道
          this.$store.dispatch('IsShowMyCollectList', false)
          this.$store.dispatch('IsShowMyChannelList', true)
          const channelData = {
            page: 1,
            limit: 3
          }
          ipcRenderer.send('get-my-channel', channelData)
          // 请求40条数据
          this.$store.dispatch('SetChannelListLimit', 40)
          // 左侧列表显示为一个都不选中
          this.$store.dispatch('SelectContainerLeftList', -1)
          // last_id还原
          this.$store.dispatch('SetLastChannelId', 0)
          // 是我的频道下面的列表
          this.$store.dispatch('SetChannelListTpye', 1)
          // 我创建的频道的右边频道列表
          let channelLimit = this.$store.state.home.channelListLimitNum
          const channelDataAll = {
            page: 1,
            // 现在只能创建三个频道,需要修改
            limit: 3
          }
          ipcRenderer.send('my-channel-list', channelDataAll)
          // 我管理的频道右边频道列表
          const manageDataAll = {
            page: 1,
            limit: channelLimit
          }
          ipcRenderer.send('manage-channel-list', manageDataAll)
          break
        case 2:
          // 我的收藏
          this.$store.dispatch('IsShowMyCollectList', true)
          this.$store.dispatch('IsShowMyChannelList', false)
          const collectData = {
            page: 1,
            limit: 3
          }
          ipcRenderer.send('get-my-collect', collectData)
          // 请求40条数据
          this.$store.dispatch('SetChannelListLimit', 40)
          // 左侧列表显示为一个都不选中
          this.$store.dispatch('SelectContainerLeftList', -1)
          // last_id还原
          this.$store.dispatch('SetLastChannelId', 0)
          // 收藏的右边频道列表
          this.$store.dispatch('SetChannelListTpye', 2)
          let collectLimit = this.$store.state.home.channelListLimitNum
          const collectDataAll = {
            page: 1,
            limit: collectLimit
          }
          ipcRenderer.send('get-my-collect-list', collectDataAll)
          break
        case 3:
          // 创建频道
          this.$store.dispatch('NewChannelBtnClick', true)
          break
        default:
          break
      }
    },
    guestLogin () {
      if (getCurrentLoginType() !== 0) {
        // 游客登录
        guestLogin()
          .then(res => {
            if (res.data && res.data.code === 0) {
              // 将登录类型设置为游客登录
              ipcRenderer.send('change_user_login_type', 0)
              ipcRenderer.send('guest_login_info_set', res.data.data)
              ipcRenderer.send('auto-user-info-login')
              this.$store.commit('savePublicToken', res.data.data.token)
            } else {
              this.$notify({
                message: '游客登录失败',
                type: 'error'
              })
            }
          })
          .catch(res => {
            this.$notify({
              title: '网络异常',
              message: '游客登录失败',
              type: 'error'
            })
          })
      }
    },
    goOut () {
      this.$alert('是否确认退出登录？', '提示', {
        center: true,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          // 登出入口，如果是游客登录，则不做一下操作
          if (getCurrentLoginType() !== 0) {
            this.$store.commit('savePublicToken', '')
            this.$store.dispatch('savePublicUserInfo', {})
            this.$emit('hiddenPop')
            let isLoginShow = this.$store.state.loginShow.isLoginShow
            // 清除global的nn_id
            ipcRenderer.send('home_save_nn_id', '')
            // 登出后进行游客登录
            this.guestLogin()
            // 清空足迹
            this.$store.dispatch('SetFootprintList', [])
            // this.$store.dispatch('loginBtnClick', 1)
            ipcRenderer.send('quit-login')
          }
          // 把主页还原到最开始的状态
          util.homeRestore()
          // 呼出登录框
          this.$store.dispatch('loginBtnClick', 1)
          // 断开websocket
          ipcRenderer.send('destroy-ws')
        })
        .catch(action => {})
    }
  }
}
</script>

<style lang="less" scoped>
.AlreadyLogin-wrap {
  width: 350px;
  padding: 0 20px;
  .AlreadyLogin-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .box {
      display: flex;
      align-items: center;
      padding: 10px 0;
      color: #666;
      cursor: pointer;
    }
  }
  .AlreadyLogin-infoBox {
    display: flex;
    .AlreadyLogin-avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      margin-right: 10px;
    }
    .AlreadyLogin-name {
      font-size: 14px;
      color: #333;
    }
    .AlreadyLogin-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .AlreadyLogin-userInfo {
        display: flex;
        align-items: center;
        .AlreadyLogin-id {
          margin-right: 10px;
          font-size: 12px;
          color: #999;
        }
        .AlreadyLogin-sex {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }
        .AlreadyLogin-xin {
          height: 16px;
          text-align: center;
          line-height: 16px;
          padding: 0 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 8px;
          color: #666;
        }
      }
    }
  }
  .AlreadyLogin-intro {
    font-size: 12px;
    color: #999;
    font-family: MicrosoftYaHei;
    margin-top: 20px;
  }
  .AlreadyLogin-doBox {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 20px;
    justify-content: space-between;
    .AlreadyLogin-item {
      width: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      div {
        font-size: 12px;
        color: #333;
        margin-top: 10px;
      }
      .AlreadyLogin-item-img {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>