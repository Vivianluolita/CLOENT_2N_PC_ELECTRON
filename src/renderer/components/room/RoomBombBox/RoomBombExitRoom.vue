<template>
  <div class="room-bomb-exit-room-wrap">
    <el-dialog :visible.sync="dialogVisible" title="请出频道" width="376px">
      <p>
        你确定将
        <img :src="userInfo.roleIcon" alt />
        <span>{{userInfo.nickname}}</span>
        请出频道吗？
      </p>
      <div class="temporaryDetach">
        <el-radio label="1" v-model="radio">
          <input type="text" v-model="minValue" />
          <span>分钟,不允许此人进入频道</span>
        </el-radio>
      </div>
      <div class="foreverDetach">
        <el-radio label="2" v-model="radio">永久请出频道</el-radio>
      </div>
      <div class="exitRoomFooter">
        <el-button @click="beExitRoom">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <RoomBombRemindExitRoom ref="RoomBombRemindExitRoom" />
  </div>
</template>

<script>
import { dialog, ipcRenderer, remote } from 'electron'
import RoomBombRemindExitRoom from './RoomBombRemindExitRoom'
export default {
  data () {
    return {
      radio: '1',
      dialogVisible: false,
      userInfo: {},
      minValue: ''
    }
  },
  components: {
    RoomBombRemindExitRoom
  },
  destroyed () {
    ipcRenderer.removeListener('be-exit-room-success', this.beExitRoomSuccess)
  },
  created () {
    ipcRenderer.on('be-exit-room-success', this.beExitRoomSuccess)
  },
  methods: {
    beExitRoomSuccess (event, params) {
      console.log('be-exit-room-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.$store.dispatch('reduceRoomUserList', this.userInfo)
        } else if (params.message_type === 2) {
          if (params.data.target.nn_id === remote.getGlobal('myNNID')) {
            this.$refs.RoomBombRemindExitRoom.open(
              params.data.operator,
              params.data.kick_time / 60
            )
          } else {
            this.$store.dispatch('reduceRoomUserList', params.data.target)
          }
        }
        this.dialogVisible = false
        this.minValue = ''
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg
        })
      }
    },
    open (item) {
      console.log(item)
      this.userInfo = item
      this.dialogVisible = true
    },
    beExitRoom () {
      if (Number(this.minValue) <= 0) {
        return this.$notify.error({
          title: '提示',
          message: '踢出时间不符合要求,请输入大于0的数字'
        })
      }
      if (!/^[0-9]{1,}$/.test(this.minValue)) {
        return this.$notify.error({
          title: '提示',
          message: '请输入数字'
        })
      }
      ipcRenderer.send('be-exit-room', {
        kick_time: Number(this.minValue * 60),
        user_id: this.userInfo.nn_id
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.room-bomb-exit-room-wrap {
  .el-dialog {
    height: 273px;
    .el-dialog__header {
      font-family: MicrosoftYaHei;
      color: rgba(48, 48, 51, 1);
      line-height: 14px;
    }
  }
  /deep/.el-dialog__body {
    box-shadow: 1px 1px 5px #ccc;
    height: 225px;
    padding: 0 0 0 31px;
    p {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 14px;
      padding-top: 27px;
      margin-bottom: 20px;
      span {
        color: rgba(0, 0, 0, 1);
        margin-right: 5px;
      }
      img {
        width: 19px;
        height: 19px;
        margin: -2px 0 0 5px;
      }
    }
    .temporaryDetach {
      input {
        width: 71px;
        height: 32px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #eee;
        padding: 1px 10px;
      }
    }
    .foreverDetach {
      margin: 19px 0 30px 0;
    }
    .exitRoomFooter {
      .el-button {
        width: 110px;
        height: 36px;
        padding: 10px 20px;
      }
      .el-button:nth-child(1) {
        margin: 0 10px 0 36px;
      }
      .el-button:hover {
        color: #4e4afc;
        border-color: #4e4afc;
        background-color: transparent;
      }
      .el-button:focus {
        background-color: transparent;
        border-color: #dcdfe6;
        color: #606266;
      }
    }
  }
  /deep/.el-dialog__header .el-dialog__title {
    font-size: 16px;
    display: inline-block;
    margin-top: -5px;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #4e4afc;
    background-color: #4e4afc;
  }
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #303033;
  }
  /deep/.el-radio__inner:hover {
    border-color: #4e4afc;
  }
}
</style>