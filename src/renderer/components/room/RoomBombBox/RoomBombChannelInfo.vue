<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    @close="close"
    class="channelInfoClass"
    title="频道信息"
    width="666px"
  >
    <div class="system-setup">
      <ul @click="changeCurrenMenu" class="setup-left-menu">
        <li :class="{'setup-current-menu':currentId==0}" data-index="0">频道信息</li>
        <li :class="{'setup-current-menu':currentId==1}" data-index="1">管理列表</li>
      </ul>
      <!--频道信息-->
      <div class="channel-info" v-if="currentId==0">
        <template>
          <div class="channel-info-name">
            <span>频道名称:</span>
            <input type="text" v-model="name" />
          </div>
          <div class="channel-info-password">
            <span>频道密码:</span>
            <input type="text" v-model="join_password" />
          </div>
        </template>
        <div class="btnBlock" style="margin-top:20px">
          <el-button @click="submit" style="margin-left:84px;width:120px" v-loading="loading">保存</el-button>
          <el-button @click="close" style="margin-left:22px;width:120px">取消</el-button>
        </div>
      </div>
      <!--管理列表-->
      <div class="channel-info" v-else-if="currentId==1">
        <div class="channel-info-name">
          <span class="channel-info-name-width">频道名称:</span>
          <div>{{name}}</div>
        </div>
        <div class="channel-info--manage-table">
          <el-table :data="adminList" @row-contextmenu="handleContextMenu" style="width: 100%;">
            <el-table-column
              label="序号"
              style="backgroundColor:rgba(240,240,240,1);"
              type="index"
              width="100"
            ></el-table-column>
            <el-table-column label="昵称" prop="nickname" width="200"></el-table-column>
            <el-table-column label="身份" prop="role" width="154"></el-table-column>
          </el-table>
          <context-menu
            :mouse="mousePosition"
            :pop-items="popItems"
            @ListItemClick="list_item_click"
          ></context-menu>
        </div>
      </div>
    </div>
    <manageList ref="manageList" />
  </el-dialog>
</template>

<script>
import axios from 'axios'
import { getCurrentToken, getCurrentUserInfo } from '../../../common'
import { DB, Storage } from '../../../../main/db/dbStore'
import { remote } from 'electron'
import md5 from 'js-md5'
import contextMenu from '../contextMenu/contextMenu'
import manageList from './RoomBombManageList'
import baseURL from '../../../../main/api/baseURL'
export default {
  name: '',
  data () {
    return {
      name: '',
      join_password: '',
      childRoomInfo: {},
      dialogVisible: false,
      currentId: 0,
      // 已选配置的json对象
      option: [],
      loading: false,
      adminList: [],
      // 右键菜单的东西
      popItems: [
        {
          txt: '查看个人信息'
        },
        {
          txt: '查看管理记录'
        }
      ],
      mousePosition: [],
      // 点击的那条数据
      tableItem: ''
    }
  },
  components: {
    contextMenu,
    manageList
  },
  mounted () {
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  },
  methods: {
    // 右键选中一条
    handleContextMenu (row, column, e) {
      this.tableItem = row
      if (this.$store.state.room.userInfo.role === 2) {
        // console.log(row)
        if (row.nn_id === this.$store.state.room.userInfo.nn_id) {
          this.popItems = [
            {
              txt: '查看个人信息'
            },
            {
              txt: '查看管理记录'
            }
          ]
        } else {
          this.popItems = [
            {
              txt: '查看个人信息'
            },
            {
              txt: '查看管理记录'
            },
            {
              txt: '撤销管理员'
            }
          ]
        }
      } else {
        this.popItems = [
          {
            txt: '查看个人信息'
          },
          {
            txt: '查看管理记录'
          }
        ]
      }
      let x = e.pageX
      let y = e.pageY
      this.mousePosition = [x, y]
    },
    // 获取管理员列表
    getAdminList (id) {
      let url = `${baseURL.path}/api/v1/channel/admin/list`
      axios
        .post(
          url,
          {
            channel_no: Number(this.$route.query.roomid),
            sub_channel_id: id
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
            this.adminList = res.data.data
            // console.log(this.adminList)
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
    },
    open (item) {
      this.childRoomInfo = item
      this.name = item.title
      if (item.locked) {
        this.join_password = '有密码,怕不怕'
      } else {
        this.join_password = ''
      }
      console.log(this.childRoomInfo)
      this.getAdminList(item.id)
      this.dialogVisible = true
    },
    changeCurrenMenu (e) {
      // 当前显示内容切换
      if (e.target.nodeName.toLowerCase() === 'li') {
        this.currentId = e.target.dataset.index
      }
    },
    submit () {
      this.$notify.error({ title: '失败', message: `一姐不让你提交` })
    },
    close () {
      this.dialogVisible = false
    },
    // 获取用户详情
    getUserInfo (userId) {
      const url = `/api/v1/room_user/${userId}`
      return this.$axios.get(url)
    },
    // 菜单中的选项
    list_item_click (index) {
      switch (index) {
        case 2:
          this.$confirm(
            `当前操作会撤销 ${this.tableItem.user_nickname}的管理员身份, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            let item = this.tableItem
            let id = 10
          })
          break
        case 0:
          let item = this.tableItem
          this.getUserInfo(item.id).then(res => {
            if (res.code === 0) {
              let data = res.data
              this.$set(data, 'icon', item.icon)
              this.$store.dispatch('channelRoom/setUserInfoData', data)
              this.$store.dispatch('channelRoom/setUserInfoVisible', true)
            }
          })
          break
        case 1:
          this.$refs.manageList.open(this.$route.query.roomid, this.tableItem)
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.system-setup {
  width: 666px;
  min-height: 480px;
  margin: 0 auto;
  display: flex;
  box-shadow: 1px 1px 5px #ccc;
  // box-shadow: 1px 1px 10px #eee;
}
/deep/.el-dialog__header {
  text-align: left;
  box-shadow: none;
  height: 30px;
  line-height: 20px;
  .el-dialog__title {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: rgba(48, 48, 51, 1);
    line-height: 21px;
  }
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/.el-dialog__headerbtn .el-dialog__close {
  font-size: 20px;
}
/deep/.el-header {
  line-height: 20px !important;
}
.setup-left-menu {
  background-color: #fff;
  text-align: center;
  border-right: 1px solid rgba(224, 224, 224, 1);
  li {
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    font-size: 16px;
  }
}
.setup-current-menu {
  width: 149px !important;
  background-color: #eee;
}
/deep/.el-form-item__label {
  color: #303033;
}
.channel-info {
  width: 516px;
  padding: 20px 26px 22px 16px;
  text-align: left;

  .channel-info-name,
  .channel-info-password {
    // height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(48, 48, 51, 1);
    line-height: 32px;
    display: flex;
    span:nth-child(1) {
      width: 80px;
      margin-right: 14px;
    }

    input {
      width: 356px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(204, 204, 204, 1);
      line-height: 32px;
      padding: 0 5px;
    }
  }
  .channel-info-password {
    margin-top: 20px;
  }
  .btnBlock {
    position: absolute;
    bottom: 30px;
  }
  .channel-info-avatar {
    margin-top: 19px;
    display: flex;
    line-height: 54px;
    color: rgba(48, 48, 51, 1);
    span:nth-child(1) {
      width: 80px;
      margin-right: 14px;
    }
    .channel-info-avatar-img {
      width: 54px;
      height: 54px;
      border-radius: 2px;
      position: relative;
      text-align: center;
    }
    .channel-info-avatar-img,
    .personal-center-right {
      display: inline-block;
    }
    .personal-center-right {
      font-size: 16px;
      color: #fff;
    }
    .personal-img,
    .change-pic-btn {
      width: 54px;
      height: 54px;
      border-radius: 2px;
    }

    .change-pic-btn {
      width: 54px;
      height: 54px;
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background: rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      color: #fff;
      padding: 0;
      cursor: pointer;
      i {
        display: inline-block;
        font-size: 18px;
      }
    }
    .img-upload {
      width: 54px;
      height: 54px;
      border-radius: 2px;
      position: absolute;
      left: 0;
      top: 0;
      outline: none;
      opacity: 0;
      cursor: pointer;
    }
    .channel-info-avatar-img:hover .change-pic-btn {
      display: block;
      cursor: pointer;
    }
  }
  .channel-info-type {
    margin-top: 19px;
    color: rgba(48, 48, 51, 1);
    span:nth-child(1) {
      width: 70px;
    }
    .channel-info-header {
      div:nth-child(1) {
        // width: 381px;
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(144, 147, 153, 1);
        line-height: 19px;
      }
      .channel-info-type-game {
        width: 370px;
        height: 141px;
        background: rgba(238, 238, 238, 1);
        margin-top: 16px;
        padding-bottom: 16px;
        border-radius: 4px;
        position: relative;
        // overflow-y: auto;
        .channel-info-type-game-icon {
          position: absolute;
          top: -8px;
          left: 150px;
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba(238, 238, 238, 1);
        }
        /deep/ .el-tag {
          width: 78px;
          height: 30px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(204, 204, 204, 1);
          font-family: MicrosoftYaHei;
          color: rgba(96, 97, 102, 1);
          line-height: 30px;
          text-align: center;
          margin-top: 10px;
        }
      }
      .channel-info-type-playwith {
        width: 370px;
        height: 141px;
        background: rgba(238, 238, 238, 1);
        margin-top: 16px;
        padding-bottom: 16px;
        // overflow-y: auto;
        border-radius: 4px;
        position: relative;
        .channel-info-type-game-icon {
          position: absolute;
          top: -8px;
          left: 260px;
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba(238, 238, 238, 1);
        }
        /deep/ .el-tag {
          width: 78px;
          height: 30px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(204, 204, 204, 1);
          font-family: MicrosoftYaHei;
          color: rgba(96, 97, 102, 1);
          line-height: 30px;
          text-align: center;
          margin-top: 10px;
        }
      }
    }
  }
  .channel-info-relation-playwith {
    display: flex;
    margin-top: 19px;
    color: rgba(48, 48, 51, 1);
    font-family: MicrosoftYaHei;
    color: rgba(48, 48, 51, 1);
    line-height: 32px;
    span:nth-child(1) {
      width: 80px;
    }
    input {
      width: 180px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(204, 204, 204, 1);
      line-height: 32px;
      padding: 0 5px;
    }
  }
  .channel-info--manage-table {
    margin-top: 16px;
  }
  /deep/ .is-leaf {
    background-color: rgba(240, 240, 240, 1);
    color: rgba(48, 48, 51, 1);
  }
}
.channelInfoClass /deep/.el-form-item__content {
  margin-left: 94px !important;
}
.channelInfoClass /deep/.el-radio-group {
  margin-left: -16px;
}
.channelInfoClass /deep/.el-checkbox:first-of-type {
  margin-left: -16px;
}
</style>
