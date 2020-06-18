<template>
  <div class="state-wrap">
    <el-menu class="menu" default-active="1">
      <el-menu-item
        :key="item.index"
        @click="onClick(item.index)"
        style="height: 40px;line-height:40px;padding-left: 8px;padding-right:8px"
        v-for="item in data"
      >
        <el-image :src="item.src" class="avatar" fit="fill"></el-image>
        <span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'tary',
  data () {
    return {
      logoPic: 'static/tray/nn.png',
      data: [
        {
          index: 1,
          title: '我在线上',
          src: 'static/tray/online.png'
        },
        {
          index: 2,
          title: '游戏中',
          src: 'static/tray/youxi.png'
        },
        {
          index: 3,
          title: '离开',
          src: 'static/tray/likai.png'
        },
        {
          index: 4,
          title: '忙碌',
          src: 'static/tray/manglu.png'
        },
        {
          index: 5,
          title: '隐身',
          src: 'static/tray/hidden.png'
        }
      ]
    }
  },
  methods: {
    onClick (val) {
      ipcRenderer.send('changeState', val)
      this.changeState(val)
    }
  }
}
</script>
<style lang="less" scoped>
html,
body {
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: 'Microsoft Yahei', 'SimHei', 'PingFang SC';
}
span {
  font-size: 12px;
}
hr {
  padding: 0;
  margin: 0;
  border: 0.5px solid #e2e2e3;
}

// .state-wrap {
//   padding-top: 30px;
// }
// .state-wrap .title {
//   width: 200px;
//   border-radius: 6px;
// }
// .state-wrap .item-title {
//   height: 50px;
//   line-height: 50px;
// }

.avatar {
  position: relative;
  width: 16px;
  height: 16px;
}
.avatar-0 {
  position: absolu;
  width: 56px;
  height: 62px;
  margin-top: -20px;
}
.el-menu-item {
  margin: 0 !important;
  padding: 0 10px !important;
  height: 40px;
  line-height: 40px;
}
.el-menu {
  border-right: solid 0px #e6e6e6;
}
</style>