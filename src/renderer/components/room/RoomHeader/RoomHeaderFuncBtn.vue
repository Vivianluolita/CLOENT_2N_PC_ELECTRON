<template>
  <!-- 最大最小化 退出按钮 -->
  <div class="room-header-func-btn">
    <div @click="minimize" class="minimizeBox">
      <img :src="minimizeSrc" class="minimize" />
    </div>
    <img :src="maximizeSrc" @click="maximize" class="maximize" v-show="maximize_restore" />
    <img :src=" restoreSrc" @click=" restore" class="restore" v-show="!maximize_restore" />
    <img :src="close_roomSrc" @click="close_room" class="close_room" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      // 窗口最大化--还原
      maximize_restore: true,
      minimizeSrc: require('@/assets/img/room/icon/minimize.png'),
      maximizeSrc: require('@/assets/img/room/icon/maximize.png'),
      restoreSrc: require('@/assets/img/room/icon/restore.png'),
      close_roomSrc: require('@/assets/img/room/icon/close_room.png')
    }
  },
  methods: {
    // 窗口最小化
    minimize () {
      ipcRenderer.send('hide-window')
    },
    // 窗口最大化
    maximize () {
      this.maximize_restore = false
      ipcRenderer.send('show-full-window')
    },
    // 关闭窗口
    close_room () {
      ipcRenderer.send('leave-room')
      ipcRenderer.send('room_window_close')
    },
    // 还原窗口
    restore () {
      this.maximize_restore = true
      ipcRenderer.send('orignal-window')
    }
  }
}
</script>

<style lang="less" scoped>
.room-header-func-btn {
  .minimizeBox {
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
  .maximize,
  .restore {
    height: 20px;
    width: 20px;
    margin: 0 24px;
    cursor: pointer;
  }
  .close_room {
    height: 20px;
    cursor: pointer;
  }
  .minimize {
    width: 20px;
  }
}
</style>