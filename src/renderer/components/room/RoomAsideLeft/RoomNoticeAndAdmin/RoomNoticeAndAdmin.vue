<template>
  <!-- 房间公告和管理员 -->
  <div class="room-notice-and-admin-wrap">
    <span :class="['notice',{'current':noticeCurrent}]" @click="notice_current">公告</span>
    <span :class="['admin',{'current':adminCurrent}]" @click="admin_current">管理员</span>
    <!-- 房间公告  -->
    <RoomNotice :roomInfo="roomInfo" class="roomNotice" v-show="showNotice"></RoomNotice>
    <!-- 房间管理员 -->
    <RoomAdmin :roomInfo="roomInfo" v-show="!showNotice"></RoomAdmin>
  </div>
</template>

<script>
import RoomNotice from './RoomNotice'
import RoomAdmin from './RoomAdmin'
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      showNotice: true,
      adminCurrent: true,
      noticeCurrent: false
    }
  },
  components: {
    RoomNotice,
    RoomAdmin
  },
  props: ['roomInfo'],
  methods: {
    notice_current () {
      this.adminCurrent = true
      this.noticeCurrent = false
      this.showNotice = true
    },
    admin_current () {
      this.noticeCurrent = true
      this.adminCurrent = false
      this.showNotice = false
    }
  }
}
</script>

<style lang="less" scoped>
.room-notice-and-admin-wrap {
  .notice,
  .admin {
    cursor: pointer;
    display: inline-block;
    width: 123px;
    height: 27px;
    line-height: 27px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px 0px 0px 0px;
    border-bottom: 1px solid rgba(229, 228, 228, 1);
    text-align: center;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(0, 0, 0, 1);
  }
  .notice {
    border-right: 1px solid rgba(229, 228, 228, 1);
  }
  .admin {
    float: right;
    width: 124px;
  }
  .current {
    color: #666666;
    background: rgba(245, 245, 245, 1);
  }
  .notice:hover,
  .admin:hover {
    color: rgba(0, 0, 0, 1);
  }
  // 房间公告
  .roomNotice {
    padding: 9px 20px 0 20px;
  }
}
</style>