<template>
  <!-- 被踢出频道收到的弹框 -->
  <div class="room-bomb-remind-exit-room">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="请出频道"
      width="376px"
    >
      <div v-if="roomInfo && roomInfo.channel_detail">
        <p>
          你已经被
          <img :src="userInfo.roleIcon" alt />
          <span>{{ userInfo.nickname}}</span>
          请出
          <span>{{`【${roomInfo.channel_detail.name }】`}}</span>
          频道，
          <span class="exitTime">{{minTime}}分钟</span>
          内无法进入
        </p>
        <el-button @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      userInfo: {},
      minTime: ''
    }
  },
  computed: {
    roomInfo () {
      return this.$store.state.room.roomInfo
    }
  },
  methods: {
    open (item, min) {
      this.userInfo = item
      let roleList = [...this.$store.state.room.roomClothesList]
      roleList.map(i => {
        if (this.userInfo.role === i.id) {
          if (this.userInfo.gender === 1) {
            this.userInfo.roleIcon = i.icon_male
          } else if (this.userInfo.gender === 2) {
            this.userInfo.roleIcon = i.icon_female
          }
        }
      })
      this.minTime = min
      this.dialogVisible = true
    },
    submit () {
      this.dialogVisible = false
      window.close()
    }
  }
}
</script>

<style lang="less" scoped>
.room-bomb-remind-exit-room {
  /deep/.el-dialog {
    border-radius: 5px;
    /deep/.el-dialog__title {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: rgba(48, 48, 51, 1);
      line-height: 21px;
    }
    /deep/.el-dialog__body p {
      padding: 0;
      line-height: 25px;
      margin: 0;
    }
    /deep/.el-dialog__body {
      height: auto;
      box-shadow: 1px 1px 5px #ccc;
      padding: 20px 39px;
      border-radius: 5px;
      box-sizing: border-box;
      span {
        font-size: 14px;
        font-family: MicrosoftYaHeiUI;
        color: rgba(0, 0, 0, 1);
        line-height: 14px;
      }
      .exitTime {
        color: #4e4afc;
      }
      /deep/.el-button {
        width: 120px;
        height: 36px;
        margin: 25px 0 0 89px;
      }
      /deep/.el-button:focus {
        border-color: #dcdfe6;
        color: #606266;
        background-color: transparent;
      }
      /deep/.el-button:hover {
        color: #4e4afc;
        border-color: #4e4afc;
        background-color: transparent;
      }
    }
  }
}
</style>