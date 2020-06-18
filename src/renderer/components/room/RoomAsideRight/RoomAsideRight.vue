<template>
  <div class="room-aside-right-wrap">
    <RoomMicro @sendToOne="sendToOneFromUser" @VoiceType="VoiceType" class="room-micro" />
    <RoomAllUser @sendToOne="sendToOneFromUser" class="room-all-user" ref="room_all_user" />
  </div>
</template>

<script>
import RoomAllUser from './RoomAllUser/RoomAllUser'
import RoomMicro from './RoomMicro/RoomMicro'
export default {
  data () {
    return {}
  },
  components: {
    RoomMicro,
    RoomAllUser
  },
  methods: {
    sendToOneFromUser (data) {
      this.$emit('sendToOneFromUser', data)
    },
    VoiceType (data) {
      console.group('----------------------')
      console.log(data)
      console.groupEnd()
      this.$emit('myVoiceStatus', data)
    }
  }
}
</script>

<style lang="less" scoped>
.room-aside-right-wrap {
  width: 264px;
  height: 100%;
  border: 1px solid rgb(229, 228, 228);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .room-micro {
    width: 264px;
    height: 195px;
    border-bottom: 1px solid rgb(229, 228, 228);
    box-sizing: border-box;
  }
  .room-all-user {
    width: 264px;
    flex: 1;
    box-sizing: border-box;
    background-color: #f8f8f8;
  }
}
</style>