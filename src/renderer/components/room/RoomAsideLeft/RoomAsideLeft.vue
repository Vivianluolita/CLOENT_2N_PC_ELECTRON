<template>
  <!-- 房间左边 -->
  <div class="room-aside-left-wrap">
    <RoomNoticeAndAdmin :roomInfo="roomInfo" class="room-notice-and-admin" />
    <RoomChannelList :roomInfo="roomInfo" class="room-channellist" />
  </div>
</template>

<script>
import RoomNoticeAndAdmin from './RoomNoticeAndAdmin/RoomNoticeAndAdmin'
import RoomChannelList from './RoomChannelList/RoomChannelList'
export default {
  data () {
    return {}
  },
  props: ['roomInfo'],
  components: {
    RoomNoticeAndAdmin,
    RoomChannelList
  }
}
</script>

<style lang="less" scoped>
.room-aside-left-wrap {
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .room-notice-and-admin {
    width: 250px;
    height: 218px;
    box-sizing: border-box;
    border: 1px solid rgb(229, 228, 228);
    border-radius: 4px;
  }
  .room-channellist {
    width: 250px;
    flex: 1;
  }
}
</style>