<template>
  <div class="room-bomb-upper-wheat">
    <el-dialog
      :close-on-click-modal="false"
      :title="`管理员【${userInfo.nickname}】提醒您`"
      :visible.sync="dialogVisible"
      width="376px"
    >
      <span>
        <img :src="userMicroIcon" alt />
        <p>上麦提醒</p>
        <p>马上轮到您上麦了，请做好准备！</p>
        <el-button>知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userMicroIcon: require('@/assets/img/room/icon/userMicroIcon.png'),
      dialogVisible: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.room.userInfo
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.room-bomb-upper-wheat {
  /deep/.el-dialog {
    border-radius: 5px;
    /deep/.el-dialog__title {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: rgba(48, 48, 51, 1);
      line-height: 21px;
    }
    /deep/.el-dialog__body {
      height: 229px;
      box-shadow: 1px 1px 5px #ccc;
      padding: 0;
      border-radius: 5px;
      text-align: center;
      img {
        width: 36px;
        height: 48px;
        margin: 36px 0 13px 0;
      }
      p:nth-child(2) {
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
      }
      p:nth-child(3) {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #303033;
        line-height: 21px;
        margin: 5px 0 17px 0;
      }
      div {
        width: 133px;
        height: 36px;
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