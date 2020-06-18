<template>
  <div class="tray-page">
    <el-menu class="el-menu-vertical-demo title" default-active="1">
      <!-- 托盘顶部信息 -->
      <el-menu-item @click="onClick(0)" class="item-title item-bottom-line" index="0">
        <el-image :src="logoPic" class="avatar-0"></el-image>
        <span slot="title" style="font-size: 13px;margin-left:55px;">打开NN主窗口</span>
      </el-menu-item>
      <hr style="margin-left: 8px;margin-right: 8px;" />
      <!-- 用户登录状态显示托盘列表 -->
      <div v-if="isLogin">
        <el-menu-item
          :class="item.index==2?'tray-avatar-block':''"
          :key="item.index"
          @click="onClick(item.index)"
          class="tray-avatar-rev"
          v-for="item in data"
        >
          <el-image :src="item.src" class="avatar" fit="fill"></el-image>&nbsp;
          <span slot="title">{{ item.title }}</span>
          <span style="float: right;color:#80868a;" v-if="item.index===2">&gt;</span>
          <span style="float: right;color:#80868a;" v-if="item.index===4">&gt;</span>
          <!-- 帮助下拉框 -->
          <div class="tray-avatar-pos" v-if="item.index===2">
            <el-menu-item
              :key="list.index"
              @click="onClickChild(list.index)"
              v-for="list in item.children"
            >
              <p>{{list.title}}</p>
            </el-menu-item>
          </div>
        </el-menu-item>
      </div>
      <!-- 用户未登录状态显示托盘列表 -->
      <div v-if="!isLogin">
        <el-menu-item
          :class="item.index==2?'tray-avatar-block':''"
          :key="item.index"
          @click="onClick(item.index)"
          class="tray-avatar-rev"
          v-for="item in quitData"
        >
          <el-image :src="item.src" class="avatar" fit="fill"></el-image>&nbsp;
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>
<script>
import { ipcRenderer, shell } from 'electron'
import { Storage } from '../../../main/db/dbStore'
export default {
  name: 'tary',
  data () {
    return {
      isLogin: false,
      logoPic: 'static/tray/nn.png',
      data: [
        {
          index: 1,
          title: '安全中心',
          src: 'static/tray/jiami.png'
        },
        {
          index: 2,
          title: '帮助',
          src: 'static/tray/banghzu.png',
          children: [
            // {
            //   index: 1,
            //   title: 'NN官网'
            // },
            {
              index: 2,
              title: '帮助中心'
            },
            {
              index: 3,
              title: '在线客服'
            }
          ]
        },
        {
          index: 3,
          title: '关于NN',
          src: 'static/tray/fuwu.png'
        },
        // {
        //   index: 4,
        //   title: '修改状态',
        //   src: 'static/tray/change.png'
        // },
        {
          index: 5,
          title: '切换账号',
          src: 'static/tray/fenpei.png'
        },
        {
          index: 6,
          title: '退出程序',
          src: 'static/tray/logout.png'
        }
      ], // 用户登录托盘列表
      quitData: [
        {
          index: 1,
          title: '登录',
          src: 'static/tray/login.png'
        },
        {
          index: 2,
          title: '注册',
          src: 'static/tray/register.png'
        },
        {
          index: 3,
          title: '帮助',
          src: 'static/tray/banghzu.png'
        },
        {
          index: 4,
          title: '关于NN',
          src: 'static/tray/fuwu.png'
        },
        {
          index: 5,
          title: '退出程序',
          src: 'static/tray/logout.png'
        }
      ] // 用户退出托盘列表
    }
  },
  created () {
    ipcRenderer.on('get-token', (event, params) => {
      this.isLogin = !!params
    })
    ipcRenderer.on('token-expire', (event, params) => {
      this.isLogin = params
    })
    ipcRenderer.on('quit-login-success', (event, params) => {
      this.isLogin = params
    })
  },
  methods: {
    onClick (val) {
      if (this.isLogin) {
        switch (val) {
          case 0:
            ipcRenderer.send('openMainWindow')
            break
          case 1:
            ipcRenderer.send('changeMenu', 1)
            break
          case 2:
            break
          case 3:
            ipcRenderer.send('changeMenu', 3)
            break
          case 4:
            ipcRenderer.send('openState')
            break
          case 5:
            ipcRenderer.send('changeMenu', 5)
            break
          case 6:
            ipcRenderer.send('appquit')
            break
        }
      } else {
        if (val === 5) {
          ipcRenderer.send('appquit')
        } else {
          ipcRenderer.send('changeMenuQuit', val)
        }
      }
    },
    onClickChild (index) {
      // if (index === 1) {
      //   let safetyUrl = window.location.origin // 'https://test-web.nn.com/channelHall'
      //   shell.openExternal(`${safetyUrl}/channelHall`)
      // } else {
      //   ipcRenderer.send('changeMenuList', index)
      // }
      ipcRenderer.send('changeMenuList', index)
    }
  }
}
</script>
<style lang="less" scoped>
hr {
  padding: 0;
  margin: 0;
  border: 0.5px solid #e2e2e3;
}
.avatar {
  position: relative;
  width: 16px;
  height: 16px;
}
.avatar-0 {
  position: absolute;
  width: 56px;
  height: 52px;
  margin-top: -20px;
}
.tray-page {
  padding-top: 30px;
  width: 200px;
  border-radius: 6px;
  color: black;
}
.tray-page .title {
  width: 200px;
  border-radius: 6px;
}
.tray-page .item-title {
  height: 50px;
  line-height: 50px;
}
.tray-page .el-menu-item {
  margin: 0 !important;
  padding: 0 10px !important;
  height: 40px;
  line-height: 40px;
}
.el-menu {
  border-right: solid 0px #e6e6e6;
}
.tray-page .tray-avatar-rev {
  position: relative;
}
.tray-page .tray-avatar-block::after {
  content: '';
  position: absolute;
  top: -34px;
  right: -70px;
  width: 95px;
  height: 134px;
  opacity: 0;
}
.tray-page .tray-avatar-pos {
  position: absolute;
  right: -100px;
  top: -34px;
  background: #fff;
  width: 84px;
  // height: 130px;
  border-radius: 10px;
  display: none;
  z-index: 1;
  padding: 5px;
  box-shadow: 0px 1px 6px 2px rgba(0, 0, 0, 0.1);
  p {
    height: 40px;
    line-height: 40px;
  }
}
.tray-avatar-block {
  position: relative;
}
.tray-avatar-block:hover {
  .tray-avatar-pos {
    display: block;
  }
}
.el-menu-item.is-active {
  color: #333333;
}
.el-menu-vertical-demo {
  padding: 5px;
}
</style>