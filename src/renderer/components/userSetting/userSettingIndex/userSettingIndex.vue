<template>
  <div class="userSetting-warp">
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="$store.state.userSetting.isShow"
      @open="openDialog"
    >
      <div class="userSetting-contentBox">
        <UserSettingHeader :info="JSON.parse(JSON.stringify(userInfo))" />
        <div class="userSetting-container">
          <div class="userSetting-container-leftBox">
            <div
              :class="i === (centerMenuId - 1) ? 'userSetting-container-isChoose' : ''"
              :key="i"
              @click="chooseType(i)"
              class="userSetting-container-leftitem"
              v-for="(item, i) in leftBtnName"
            >{{item}}</div>
          </div>
          <div class="userSetting-container-rightBox">
            <UserInfo
              :isUpdataOk="isOk"
              :provinceList="provinceList"
              :userInfo="userInfo"
              @changeIsOk="setIsOk"
              v-if="centerMenuId === 1"
            />
            <UserAccount :userInfo="userInfo" v-if="centerMenuId === 2" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserInfo from '../userInfo/userInfoIndex'
import UserAccount from '../userAccount/userAccountIndex'
import UserSettingHeader from './userSettingHeader'
import { ipcRenderer, remote, session } from 'electron'
import { Storage } from '../../../../main/db/dbStore'
import util from '../../../utils/util'
export default {
  name: 'userSetting',
  data () {
    return {
      isShowUserSetting: true,
      centerMenuId: 1,
      leftBtnName: ['个人信息', '账号安全'],
      userInfo: {},
      provinceList: [],
      isOk: false
    }
  },
  computed: {
    isOpen () {
      return this.$store.state.userSetting.isShow
    }
  },
  components: {
    UserInfo,
    UserAccount,
    UserSettingHeader
  },
  watch: {
    isOpen: function (old, val) {
      if (val) {
        this.centerMenuId = 1
      }
    }
  },
  created () {
    ipcRenderer.on('user-info-res', (event, params) => {
      console.log('user-info-res', params)
      if (params.code === 0) {
        this.userInfo = params.data
        Storage.set('publicUserInfo', JSON.stringify(params.data))
        this.$store.dispatch('savePublicUserInfo', params.data)
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
    ipcRenderer.on('user-setting-get-address-list-res', (event, params) => {
      if (params.code === 0) {
        this.provinceList = params.data
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })

    ipcRenderer.on('updata-uesr-info-res', (event, params) => {
      if (params.code === 0) {
        this.$message({
          message: '信息更新成功!',
          type: 'success'
        })
        this.isOk = true
        ipcRenderer.send('user-setting-user-info')
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })

    ipcRenderer.on('remove-lei-god-res', (event, params) => {
      if (params.code === 0) {
        this.$message({
          message: '雷神账号解绑成功！',
          type: 'success'
        })
        ipcRenderer.send('user-setting-user-info')
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })

    ipcRenderer.on('user-setting-new-password-res', (event, params) => {
      if (params.code === 0) {
        this.$message({
          message: '密码重置成功',
          type: 'success'
        })

        let isLoginShow = this.$store.state.loginShow.isLoginShow
        console.log(isLoginShow)
        this.$store.dispatch('loginBtnClick', 1)
        // 登出入口
        Storage.set('publicUserInfo', '')
        this.$store.commit('savePublicToken', '')
        this.$store.commit('savePublicUserInfo', '')
        this.$store.dispatch('SetFootprintList', [])
        // 呼出登录框
        this.$store.dispatch('loginBtnClick', 1)
        // 清空足迹
        this.$store.dispatch('SetFootprintList', [])
        // 清除global的nn_id
        ipcRenderer.send('home_save_nn_id', '')
        // 把主页还原到最开始的状态
        util.homeRestore()
        // // 清除搜索框的value
        // this.$store.dispatch('GetSearchValue', '')
        // // 关闭搜索框的历史列表
        // this.$store.dispatch('ShowSearchHistory', false)
        // // 左侧列表的选中项
        // this.$store.dispatch('SelectContainerLeftList', 0)
        // // 开启排序
        // this.$store.dispatch('ShowChannelSortType', true)
        // // 排序默认为人气
        // this.$store.dispatch('SelectChannelSortType', 1)
        // // 显示数量重新变成100
        // this.$store.dispatch('SetChannelListLimit', 100)
        // // 选择房间列表显示的类型
        // this.$store.dispatch('SetChannelListTpye', 0)

        var that = this
        setTimeout(function () {
          that.$store.dispatch('userSettingClick')
        }, 200)
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
  },
  mounted () {
    ipcRenderer.send('user-setting-get-address-list')
  },
  methods: {
    chooseType (i) {
      this.centerMenuId = i + 1
    },
    openDialog () {
      ipcRenderer.send('user-setting-user-info')
    },
    setIsOk (val) {
      this.isOk = val
    },
    traySafeCenter () {
      this.centerMenuId = 2
    }
  }
}
</script>

<style lang="less" scoped>
.userSetting-warp {
  /deep/.el-dialog {
    width: 750px;
    height: 580px;
    border-radius: 4px;
  }
  /deep/ .el-dialog__header {
    padding: 0px;
    .el-dialog__headerbtn {
      display: none;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/.personal-sign .el-textarea__inner {
    width: 300px;
  }
  .userSetting-contentBox {
    border-radius: 4px;
    .userSetting-container {
      width: 100%;
      height: 450px;
      display: flex;
      flex-direction: row;
      .userSetting-container-leftBox {
        // width: 15%;
        // min-width: 70px;
        width: 150px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e7e7e7;
        .userSetting-container-leftitem {
          line-height: 60px;
          text-align: center;
          font-size: 16px;
          color: #666;
          cursor: pointer;
        }
        .userSetting-container-isChoose {
          background: rgba(240, 240, 240, 1);
          color: #333;
        }
      }
      .userSetting-container-rightBox {
        flex: 1;
        padding: 0 16px;
        overflow: hidden;
        overflow-y: scroll;
      }
      .userSetting-container-rightBox::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>