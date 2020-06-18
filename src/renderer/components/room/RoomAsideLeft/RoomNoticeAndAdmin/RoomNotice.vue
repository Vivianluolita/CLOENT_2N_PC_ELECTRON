<template>
  <!-- 房间公告 -->
  <div class="room-notice-wrap">
    <img
      :src="editIcon"
      @click="notice_edit"
      class="edit_icon"
      v-if="$store.state.room.userInfo.role <= 5"
    />
    <span class="editNotice">{{notice}}</span>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      append-to-body
      class="dialog"
      width="500px"
    >
      <!-- content -->
      <div class="nn-box">
        <el-container>
          <div class="main">
            <el-input
              :rows="9"
              maxlength="200"
              placeholder="请输入内容"
              show-word-limit
              type="textarea"
              v-model="newNotice"
            ></el-input>
          </div>
        </el-container>
      </div>
      <!-- title -->
      <div class="dialog-title" slot="title">
        <span style="font-size: 16px;">编辑公告</span>
      </div>
      <!-- footer -->
      <div class="dialog-footer" slot="footer">
        <el-button @click="onSubmit" size="small" type="primary">确定</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      editIcon: require('@/assets/img/room/icon/edit.png'),
      id: '',
      notice: '',
      dialogVisible: false,
      newNotice: ''
    }
  },
  created () {
    ipcRenderer.on('change-room-notice-success', (event, params) => {
      console.log('change-room-notice-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.notice = this.newNotice
          this.newNotice = ''
        } else {
          this.notice = params.data.notice
        }

        this.$notify.success({
          title: '成功',
          message: '修改公告成功!',
          duration: 2000
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '修改公告失败!',
          duration: 2000
        })
      }

      this.dialogVisible = false
    })
  },
  mounted () {},
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        console.log(newValue)
        this.notice = newValue.notice
      },
      deep: true
    }
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.currentRoomInfo))
    }
  },
  methods: {
    notice_edit (id) {
      this.id = id
      this.dialogVisible = true
    },
    // 提交
    onSubmit () {
      // console.log(this.notice)
      ipcRenderer.send('change-room-notice', this.newNotice)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.room-notice-wrap {
  .edit_icon {
    width: 14px;
    height: 13px;
    margin-right: 5px;
  }
  .editNotice {
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
    word-break: break-all;
  }
}

.main {
  padding: 38px 60px;
  font-size: 14px;
  color: rgba(48, 48, 51, 1);
  width: 100%;
}
.dialog-title {
  text-align: left;
  font-size: 16px;
  color: rgba(48, 48, 51, 1);
}
.dialog-footer {
  text-align: center;
  margin-top: 40px;
  &/deep/.el-button {
    width: 120px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(192, 196, 204, 1);
    font-size: 16px;
    &.el-button--primary {
      border: 0;
      background-color: rgba(78, 74, 252, 1);
    }
  }
}
</style>