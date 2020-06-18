<template>
  <div class="header-wrap" style="-webkit-app-region: drag">
    <div class="header-row no-drag">
      <Logo />
      <Menu class="left-menu no-drag" />
      <div class="space"></div>
      <div class="right-menu no-drag">
        <Setting />
        <el-divider class="d-line" direction="vertical"></el-divider>
        <Avatar class="avatar" />
        <el-divider class="d-line" direction="vertical"></el-divider>
        <WinButton />
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import Avatar from './Avatar'
import Menu from './Menu'
import Setting from './Setting'
import WinButton from './WinButton'
export default {
  name: 'Header',
  components: {
    Logo,
    Menu,
    Avatar,
    Setting,
    WinButton
  }
}
</script>

<style lang="less" scoped>
.no-drag {
  -webkit-app-region: no-drag;
}
.header-wrap {
  display: flex;
  flex-direction: column;
  .left-menu {
    margin-left: 14px;
  }
  .space {
    flex: 1;
  }
  .header-row {
    height: 100%;
    padding: 0 14px;
    background-color: #fff;
    box-shadow: 0px 0px 3px #aaaaaa;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .avatar {
      margin: 0 11px;
    }
    .right-menu {
      display: flex;
      flex-direction: row;
      .d-line {
        align-self: center;
        height: 20px;
      }
    }
  }
}
</style>
