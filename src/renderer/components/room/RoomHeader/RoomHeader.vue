<template>
  <!-- 频道头部总组件 -->
  <div class="room-header-wrap">
    <!-- 房间头部频道形象 -->
    <RoomHeaderLogo class="room-header-logo"></RoomHeaderLogo>
    <!-- 房间内部频道信息 -->
    <RoomHeaderInfo class="room-header-info"></RoomHeaderInfo>
    <!-- 房间内部飞机票 -->
    <RoomHeaderPlaneTicket class="room-header-plane-ticket"></RoomHeaderPlaneTicket>
    <!-- 房间内部个人中心 -->
    <RoomHeaderPersonalCenter class="room-header-personal-center"></RoomHeaderPersonalCenter>
    <!-- 房间内部最大最小化 -->
    <RoomHeaderFuncBtn class="room-header-func-btn"></RoomHeaderFuncBtn>
  </div>
</template>

<script>
import RoomHeaderLogo from './RoomHeaderLogo'
import RoomHeaderInfo from './RoomHeaderInfo'
import RoomHeaderPlaneTicket from './RoomHeaderPlaneTicket'
import RoomHeaderPersonalCenter from './RoomHeaderPersonalCenter'
import RoomHeaderFuncBtn from './RoomHeaderFuncBtn'

export default {
  data () {
    return {}
  },
  components: {
    RoomHeaderLogo,
    RoomHeaderInfo,
    RoomHeaderPlaneTicket,
    RoomHeaderPersonalCenter,
    RoomHeaderFuncBtn
  }
}
</script>

<style lang="less" scoped>
.room-header-wrap {
  position: relative;
  height: 100px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px 6px 0px 0px;
  border-bottom: 1px solid #e5e4e4;
  -webkit-app-region: drag;
  .room-header-plane-ticket {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 21px;
    right: 234px;
  }
  .room-header-logo {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .room-header-info {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 25px;
    left: 110px;
  }
  .room-header-personal-center {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 12px;
    right: 170px;
  }
  .room-header-func-btn {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 22px;
    right: 21px;
  }
}
</style>