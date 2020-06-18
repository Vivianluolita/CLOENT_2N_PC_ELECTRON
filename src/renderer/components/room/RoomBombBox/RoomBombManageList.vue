<template>
  <div class="manageList">
    <el-dialog
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="dialogVisible"
      @close="close"
      title="查看管理记录"
      width="800px"
    >
      <el-table :data="manageList" class="manageList-table" style="width: 760px">
        <el-table-column label="类型" prop="type" width="125"></el-table-column>
        <el-table-column label="操作时间" prop="created_time" style="font-size:12px;" width="190"></el-table-column>
        <el-table-column label="事件描述" prop="disc" width="445"></el-table-column>
      </el-table>
      <div style="padding-bottom:20px">
        <el-button @click="lastPage" style="margin-left:590px">上一页</el-button>
        <el-button @click="nextPage" style="margin-left:20px">下一页</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseURL from '../../../../main/api/baseURL'
import axios from 'axios'
import { DB, Storage } from '../../../../main/db/dbStore'
import { remote } from 'electron'
import { getCurrentToken } from '../../../common'
export default {
  data () {
    return {
      dialogVisible: false,
      manageList: [],
      currentPage: 1, // 当前页码
      total: '', // 总条数
      pageSize: 5, // 每页的数据条数,
      roomId: '', // 主频道的号码
      userinfo: '' // 被操作的用户信息
    }
  },
  methods: {
    close () {
      this.dialogVisible = false
    },
    open (id, item) {
      // id为房间的id,item 为用户的全部信息
      this.roomId = id
      this.userinfo = item
      this.dialogVisible = true
      this.getOperateList(
        this.roomId,
        0,
        this.userinfo,
        this.currentPage,
        this.pageSize
      )
    },

    getOperateList (id, childId, item, page, limit) {
      let url = `${baseURL.path}/api/v1/channel/operate/list`
      axios
        .post(
          url,
          {
            channel_no: id,
            sub_channel_id: childId,
            operator_id: item.nn_id,
            page: page,
            limit: limit
          },
          {
            headers: {
              Authorization: `Bearer ${getCurrentToken()}`
            }
          }
        )
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.total = res.data.data.total
            this.manageList = res.data.data.list.map(e => {
              let str = e.description
                .replace(/\[#user_id\]/, '[' + e.user_nickname + ']')
                .replace(
                  /\[#involve_user_id\]/,
                  '[' + e.involve_user_nickname + ']'
                )
              console.log(str)
              e.disc = str
              console.log(e.disc)
              return e
            })
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
    },
    lastPage () {
      if (this.currentPage === 1) {
        return this.$message.warning('当前是第一页!')
      }
      this.currentPage--
      this.getOperateList(
        this.roomId,
        0,
        this.userinfo,
        this.currentPage,
        this.pageSize
      )
    },
    nextPage () {
      let num = Math.ceil(this.total / this.pageSize)
      if (this.currentPage === num) {
        return this.$message.warning('当前是最后一页!')
      }
      this.currentPage++
      this.getOperateList(
        this.roomId,
        0,
        this.userinfo,
        this.currentPage,
        this.pageSize
      )
    }
  }
}
</script>

<style lang="less" scoped>
.manageList {
  .manageList-table {
    margin: 20px;
  }
  /deep/ .is-leaf {
    background-color: rgba(240, 240, 240, 1);
    color: rgba(48, 48, 51, 1);
  }
  /deep/ .cell {
    padding-left: 30px;
  }
}
</style>