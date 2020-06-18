<!--新增子频道-->
<template>
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
          <ul>
            <li>
              <span class="label">父频道：</span>
              <span class="value">{{this.parentChannel.title}}</span>
            </li>
            <li>
              <span class="label">频道名称：</span>
              <el-input placeholder="请输入频道名称" type="text" v-model="childForm.name"></el-input>
            </li>
            <li>
              <span class="label">密码：</span>
              <el-input placeholder="请设置密码" type="password" v-model="childForm.join_password"></el-input>
            </li>
          </ul>
        </div>
      </el-container>
    </div>
    <!-- title -->
    <div class="dialog-title" slot="title">
      <span style="font-size: 16px;">新建子频道</span>
    </div>
    <!-- footer -->
    <div class="dialog-footer" slot="footer">
      <el-button @click="onSubmit" size="small" type="primary">确定</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="close" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import md5 from 'js-md5'
import baseURL from '../../../../main/api/baseURL'
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      childForm: {
        pid: '',
        name: '',
        join_password: ''
      },
      parentChannel: {},
      dialogVisible: false
    }
  },
  created () {
    ipcRenderer.on('room-new-channel-success', (event, params) => {
      // console.log(params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          let id = this.childForm.pid
          let paramsdata = {
            id,
            data: params.data
          }
          this.$store.dispatch('addRoomChannel', paramsdata)
          this.childForm = {}
          this.dialogVisible = false
        } else if (params.message_type === 2) {
          let id = params.data.pid
          let paramsdata = {
            id,
            data: params.data.sub_channel_detail
          }
          this.$store.dispatch('addRoomChannel', paramsdata)
          this.childForm = {}
          this.dialogVisible = false
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg,
          duration: 2000
        })
      }
    })
  },
  methods: {
    // 提交
    async onSubmit () {
      this.childForm.pid = this.parentChannel.id
      if (this.childForm.name.replace(/\s+/g, '') === '') {
        return this.$message.warning('频道名称不能为纯空格!')
      }
      if (this.childForm.name.length > 40 || this.childForm.name.length < 3) {
        return this.$message.warning('频道名称应为3-40个字')
      }
      if (this.childForm.join_password) {
        let reg = /^[\da-zA-Z]{6,12}$/i
        if (!reg.test(this.childForm.join_password)) {
          return this.$message.warning('密码只能为6-12位数字或字母!')
        }
        this.childForm.join_password = md5(this.childForm.join_password)
      } else {
        this.childForm.join_password = ''
      }
      if (
        this.childForm.pid ===
        this.$store.state.room.roomInfo.channel_detail.channel_no
      ) {
        this.childForm.pid = 0
      }
      ipcRenderer.send('room-new-channel', this.childForm)
    },
    childNameChange () {
      this.childForm.name = this.childForm.name.replace(/[^0-9a-zA-Z]/g, '')
    },
    open (item) {
      this.parentChannel = item
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.main {
  padding: 32px 0;
  font-size: 14px;
  color: rgba(48, 48, 51, 1);
  .el-input {
    width: 290px;
    height: 32px;
    /deep/.el-input__inner {
      width: 290px;
      height: 32px;
      border-radius: 4px;
    }
  }
  ul {
    padding-left: 65px;
    li {
      margin-bottom: 20px;
      .label {
        display: inline-block;
        width: 80px;
      }
      .value {
        color: rgba(96, 97, 102, 1);
      }
    }
  }
}
.dialog-title {
  text-align: left;
  font-size: 16px;
  color: rgba(48, 48, 51, 1);
}
.dialog-footer {
  text-align: center;
  padding-bottom: 8px;
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


