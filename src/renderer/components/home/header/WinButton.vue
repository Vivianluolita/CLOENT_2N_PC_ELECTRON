<template>
  <div class="header-win-button-wrap">
    <div @click="clickSystemSetting" class="block">
      <el-image :src="setting"></el-image>
    </div>
    <div @click="minWin" class="block">
      <el-image :src="min" class="cus-height"></el-image>
    </div>
    <div @click="maxWin" class="block">
      <el-image :src="max"></el-image>
    </div>
    <div @click="closeWin" class="block">
      <el-image :src="close"></el-image>
    </div>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron'
import { getCurrentLoginType } from '../../../common'
export default {
  name: 'Setting',
  data () {
    return {
      setting: require('@/assets/img/home/setting.png'),
      min: require('@/assets/img/home/min_win.png'),
      max: require('@/assets/img/home/max_win.png'),
      close: require('@/assets/img/home/close_win.png')
    }
  },
  computed: {
    haveToken: function () {
      if (
        this.$store.state.public.token !== undefined &&
        this.$store.state.public.token !== ''
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    closeWin () {
      ipcRenderer.send('hide-window')
    },
    maxWin () {
      if (remote.getCurrentWindow().isMaximized()) {
        ipcRenderer.send('orignal-window')
      } else {
        ipcRenderer.send('show-full-window')
      }
    },
    minWin () {
      ipcRenderer.send('hide-window')
    },
    clickSystemSetting () {
      if (getCurrentLoginType() === 0) {
        this.$store.dispatch('loginBtnClick', 1)
        return
      }
      if (this.haveToken) {
        this.$store.commit('isSettingClick')
        ipcRenderer.send('system-setting-get-extend-info')
      } else {
        let isLoginShow = this.$store.state.loginShow.isLoginShow
        this.$store.dispatch('loginBtnClick', 1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header-win-button-wrap {
  display: inline-flex;
  flex-direction: row;

  .block {
    width: 18px;
    height: 18px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    margin: 0 10px;
    cursor: pointer;
    .cus-height {
      height: 4px;
    }
  }
}
</style>
