<template>
  <!-- 频道飞机票 -->
  <div class="room-header-plane-ticket-wrap">
    <el-tooltip content="飞机票" effect="light" placement="bottom">
      <img
        :src="iconPlaneTicket"
        @click="sendPlaneTicket"
        @mouseleave="changePlaneTicket2"
        @mouseover="changePlaneTicket"
        style="-webkit-app-region:no-drag;"
      />
    </el-tooltip>
  </div>
</template>

<script>
import utils from '../../../utils/util.js'
export default {
  data () {
    return {
      // 飞机票图片
      iconPlaneTicket: require('@/assets/img/room/icon/iconPlaneTicket.png')
    }
  },
  methods: {
    // 发送飞机票
    sendPlaneTicket () {
      utils.copyValue(
        `nn://nnpd-[nn_sup=${this.$route.query.roomid}&room=${this.$store.state.room.currentRoomInfo.sub_channel_id}]`
      )
      this.$notify({
        title: '成功',
        message: '复制飞机票成功',
        type: 'success',
        duration: 2000
      })
    },
    // 切换飞机票图片
    changePlaneTicket () {
      this.iconPlaneTicket = require('@/assets/img/room/icon/iconPlaneTicket.gif')
    },
    changePlaneTicket2 () {
      this.iconPlaneTicket = require('@/assets/img/room/icon/iconPlaneTicket.png')
    }
  }
}
</script>

<style lang="less" scoped>
.room-header-plane-ticket-wrap img {
  cursor: pointer;
  width: 40px;
  height: 24px;
}
</style>