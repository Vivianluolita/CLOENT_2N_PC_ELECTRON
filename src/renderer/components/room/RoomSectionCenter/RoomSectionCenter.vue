<template>
  <!-- 房间中心区域 -->
  <div class="room-section-center-wrap">
    <RoomSectionCenterMsgInfo
      @beExitRoom="beExitRoomFromMsgInfo"
      @dblClickUser="dblClickUserFromMsgInfo"
      @sendToOne="sendToOneFromMsgInfo"
      class="room-section-center-msg-info"
    />
    <RoomSectionCenterToolbar
      @sendEmoji="sendEmojiByToolBar"
      @sendToOne="sendToOne"
      class="room-section-center-tool-bar"
      ref="room_section_center_toolbar"
    />
    <RoomSectionCenterMsgSend
      :sendToOne_="sendToOne_"
      class="room-section-center-msg-send"
      ref="room_center_msg_send"
    />
  </div>
</template>

<script>
import RoomSectionCenterMsgInfo from './RoomSectionCenterMsgInfo'
import RoomSectionCenterToolbar from './RoomSectionCenterToolbar'
import RoomSectionCenterMsgSend from './RoomSectionCenterMsgSend'
export default {
  data () {
    return {
      // 要@的人
      sendToOne_: ''
    }
  },
  components: {
    RoomSectionCenterMsgInfo,
    RoomSectionCenterToolbar,
    RoomSectionCenterMsgSend
  },
  methods: {
    sendEmojiByToolBar (data) {
      this.$refs.room_center_msg_send.textAreaAddEmoji(data)
    },
    sendToOne (data) {
      if (data && data.nn_id) {
        console.log(data)
        let txt = '@' + data.nickname + ':'
        this.$refs.room_center_msg_send.changePlaceHolder(txt)
      } else {
        this.$refs.room_center_msg_send.changePlaceHolder('请输入聊天内容')
      }

      this.sendToOne_ = data
    },
    sendToOneFromMsgInfo (data) {
      this.$refs.room_section_center_toolbar.addSendToOneList(data)
    },
    dblClickUserFromMsgInfo (item) {
      this.$refs.room_section_center_toolbar.addSendToOneList(item)
    },
    beExitRoomFromMsgInfo (data) {
      this.$emit('beExitRoomFromMsgInfo', data)
    }
  }
}
</script>

<style lang="less" scoped>
.room-section-center-wrap {
  flex: 1;
  border: 1px solid rgb(229, 228, 228);
  box-sizing: border-box;
  margin: 0 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  .room-section-center-msg-info {
    flex: 1;
  }
  .room-section-center-tool-bar {
    border-top: 1px solid #d4d4dd;
    height: 40px;
  }
  .room-section-center-msg-send {
    height: 151px;
  }
}
</style>