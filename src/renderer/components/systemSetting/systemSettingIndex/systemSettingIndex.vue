<template>
  <div class="systemSettingIndex-wrap">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="$store.state.userSetting.systemSetting"
      @open="openDialog"
    >
      <SystemHeader />
      <div class="systemSettingIndex-body">
        <div class="systemSettingIndex-left">
          <div
            :class="i === (centerMenuId - 1) ? 'left-item-choose' : ''"
            :key="i"
            @click="chooseType(i)"
            class="left-item"
            v-for="(item, i) in typeList"
          >{{item}}</div>
        </div>
        <div class="systemSettingIndex-right">
          <SystemSet v-if="centerMenuId === 1" />
          <!-- <VoiceSet v-if="centerMenuId === 2" /> -->
          <VoicePointOut v-if="centerMenuId === 2" />
          <FriendSet :info="friendSet" v-if="centerMenuId === 3" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

 <script>
import SystemHeader from './systemSettingHeader'
import SystemSet from '../systemSet/systemSet'
import VoiceSet from '../voiceSet/voiceSetIndex'
import VoicePointOut from '../voicePointOut/voicePointOutIndex'
import FriendSet from '../friendSet/friendSetIndex'
import { ipcRenderer, remote, session } from 'electron'
export default {
  data () {
    return {
      centerMenuId: 1,
      //   typeList: ['系统设置', '语音调节', '声音提示', '好友设置'],
      typeList: ['系统设置', '声音提示', '好友设置'],
      friendSet: {}
    }
  },
  components: {
    SystemHeader,
    SystemSet,
    VoiceSet,
    VoicePointOut,
    FriendSet
  },
  destroyed () {
    ipcRenderer.removeListener('get-extend-info-res', this.extendInfo)
  },
  created () {
    // ipcRenderer.on('get-extend-info-res', (event, params) => {
    //   if (params.code === 0) {
    //     this.friendSet = params.data
    //   } else {
    //     this.$message({
    //       message: params.msg,
    //       type: 'error'
    //     })
    //   }
    // })
    ipcRenderer.on('get-extend-info-res', this.extendInfo)

    ipcRenderer.on('updata-extend-info-res', (event, params) => {
      if (params.code === 0) {
        this.$message({
          message: '设置成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
  },
  mounted () {},
  methods: {
    chooseType (i) {
      this.centerMenuId = i + 1
      ipcRenderer.send('system-setting-get-extend-info')
    },
    openDialog () {
      ipcRenderer.send('system-setting-get-extend-info')
    },
    extendInfo (event, params) {
      console.log(222222)
      if (params.code === 0) {
        console.log(params.data)
        this.friendSet = params.data
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

 <style lang="less" scoped>
.systemSettingIndex-wrap {
  /deep/ .el-dialog {
    width: 666px;
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
  .systemSettingIndex-body {
    height: 444px;
    display: flex;
    .systemSettingIndex-left {
      width: 150px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e7e7e7;
      .left-item {
        line-height: 60px;
        text-align: center;
        font-size: 16px;
        color: #666;
        cursor: pointer;
      }
      .left-item-choose {
        background: rgba(240, 240, 240, 1);
        color: #333;
      }
    }
    .systemSettingIndex-right {
      flex: 1;
      padding: 30px;
      overflow: hidden;
      overflow-y: scroll;
    }
  }
}
</style>