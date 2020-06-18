<template>
  <!-- 房间频道列表 -->
  <div class="room-channel-list-wrap">
    <RoomChannelMain :roomInfo="roomInfo" class="room-channel-main" />
    <RoomChannelTree :roomInfo="roomInfo" class="room-channel-tree" />
  </div>
</template>

<script>
import RoomChannelMain from './RoomChannelMain'
import RoomChannelTree from './RoomChannelTree'
export default {
  data () {
    return {}
  },
  props: ['roomInfo'],
  components: {
    RoomChannelMain,
    RoomChannelTree
  }
}
</script>

<style lang="less" scoped>
.room-channel-list-wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 10px;
  border: 1px solid rgb(229, 228, 228);
  border-radius: 4px;
  .room-channel-main {
    width: 250px;
    height: 10px;
  }
  .room-channel-tree {
    width: 250px;
    flex: 1;
  }
}
</style>