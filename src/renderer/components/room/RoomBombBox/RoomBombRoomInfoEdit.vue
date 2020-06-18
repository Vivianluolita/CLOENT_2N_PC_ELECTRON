<template>
  <div class="room-bomb-room-info-edit-wrap">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @close="close"
      class="channelInfoClass"
      title="频道详情"
      width="666px"
    >
      <div class="system-setup">
        <ul @click="changeCurrenMenu" class="setup-left-menu">
          <li :class="{'setup-current-menu':currentId==0}" data-index="0">频道信息</li>
          <li :class="{'setup-current-menu':currentId==1}" data-index="1">管理列表</li>
        </ul>
        <!--频道信息-->

        <div class="channel-info" v-if="currentId==0">
          <!-- 房间主看到的 可编辑-->
          <div v-if="$store.state.room.userInfo.role === 2">
            <div class="channel-info-name">
              <span>频道名称:</span>
              <input type="text" v-model="name" />
            </div>
            <div class="channel-info-logo">
              <span>频道形象:</span>
              <img
                :src="imageUrl"
                @mouseenter="shadow_show = true"
                class="channel-info-logo-avatar"
              />

              <div
                @click.stop="e=>changeChannelInfo(e)"
                @mouseleave="shadow_show = false"
                class="channel-info-logo-shadow"
                v-show="shadow_show"
              >
                <ImageCropper
                  :_fnToparent="'imageUrlName'"
                  :_height="150"
                  :_review="false"
                  :_width="150"
                  @imageUrlCallback="imageUrlCallback"
                  class="channel-info-logo-avatar-image"
                />
                <i class="el-icon-camera-solid"></i>
              </div>
            </div>
            <div class="channel-info-kind">
              <span>频道类型:</span>
              <span class="channel-info-kind-type">
                <span :class="channel_type?'onchoose':''" @click="channel_type =true ">默认类型</span>
                <span :class="!channel_type?'onchoose':''" @click="channel_type =false ">游戏频道</span>
              </span>
            </div>
            <div class="channel-info-tag" v-if="!channel_type">
              <span>频道标签:</span>
              <span class="channel-info-tag-checkbox">
                <el-checkbox-group @change="changeCheckBox" v-model="checkedType">
                  <el-checkbox
                    :key="index"
                    :label="type.name"
                    v-for="(type,index) in channel_type_list"
                  >{{type.name}}</el-checkbox>
                </el-checkbox-group>
              </span>
            </div>
            <div class="showChecked" v-if="!channel_type && checkedType && checkedType.length">
              <span :key="index" class="checkedItem" v-for="(item,index) in checkedType">{{item}}</span>
            </div>
            <div class="btnBlock" style="margin-top:20px">
              <el-button @click="submit" style="margin-left:84px;width:120px" v-loading="loading">保存</el-button>
              <el-button @click="close" style="margin-left:22px;width:120px">取消</el-button>
            </div>
          </div>
          <!-- 除了房间主  其他人看到的 -->

          <div class="room_info_users" v-else>
            <el-container v-if="roomInfo && roomInfo.channel_detail">
              <el-container>
                <el-aside width="179px">
                  <img :src="roomInfo.channel_detail.avatar" class="room_logo_users" />
                </el-aside>

                <el-main>
                  <span class="room_title_users">{{name}}</span>
                  <!-- 频道id -->
                  <div class="roomId">
                    <img :src="roomId" />
                    <span>{{roomInfo.channel_detail.channel_no}}</span>
                  </div>
                  <!-- 频道热度 -->
                  <div class="roomFire">
                    <img :src="roomFire" />
                    <span>{{roomInfo.user_num}}</span>
                  </div>
                  <!-- 游戏频道 -->
                  <div class="room_info_tag_all">
                    <span :key="type" class="room_info_tag" v-for="type in checkedType">{{type}}</span>
                  </div>
                </el-main>
              </el-container>
              <el-footer>{{roomInfo.channel_detail.notice}}</el-footer>
            </el-container>
          </div>
        </div>

        <!--管理列表-->
        <div class="channel-info" v-else-if="currentId==1">
          <div class="channel-info-name">
            <span class="channel-info-name-width">频道名称:</span>
            <div>{{roomInfo.channel_detail.name}}</div>
          </div>
          <div class="channel-info-manage-table">
            <el-table :data="adminList" @row-contextmenu="handleContextMenu" style="width: 100%">
              <el-table-column
                label="序号"
                style="backgroundColor:rgba(240,240,240,1);"
                type="index"
                width="100"
              ></el-table-column>
              <el-table-column label="昵称" prop="nickname" width="200"></el-table-column>
              <el-table-column label="身份" prop="role" width="154"></el-table-column>
            </el-table>
          </div>
          <contextMenu
            :mouse="mousePosition"
            :pop-items="popItems"
            @ListItemClick="list_item_click"
          />
        </div>
      </div>
      <RoomBombUserInfo ref="RoomBombUserInfo" />
      <manageList ref="manageList" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'
import contextMenu from '../contextMenu/contextMenu'
import manageList from './RoomBombManageList'
import baseURL from '../../../../main/api/baseURL'
// import NnImage from '../../userSetting/userSettingIndex/NnImage'
import { DB, Storage } from '../../../../main/db/dbStore'
import ImageCropper from '../../common/ImageCropper'
import RoomBombUserInfo from './RoomBombUserInfo'
import { ipcRenderer, remote } from 'electron'
import { getCurrentToken } from '../../../common'
export default {
  data () {
    return {
      roomId: require('@/assets/img/room/icon/userID.png'),
      roomFire: require('@/assets/img/room/icon/fire_icon.png'),
      name: '',
      dialogVisible: false,
      currentId: 0,
      // 已选配置的json对象
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
      tableItem: '',
      imageUrl: '',
      // 选择的频道类型
      channel_type: true,
      // 选中的类型
      checkedType: [],
      channel_type_list: [],
      // channel_type_list_checked: ['王者荣耀4', '英雄联盟', '王者荣耀555']
      shadow_show: false
    }
  },
  components: {
    contextMenu,
    manageList,
    ImageCropper,
    RoomBombUserInfo
  },
  mounted () {
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  },
  created () {
    ipcRenderer.on('cancel-manager-success', (event, params) => {
      console.log(params)
      // if(params.code === 0){

      // }
    })
  },
  watch: {
    roomInfo (newValue, oldValue) {
      console.log(newValue)
      this.name = JSON.parse(JSON.stringify(newValue)).channel_detail.name
      this.imageUrl = JSON.parse(JSON.stringify(newValue)).channel_detail.avatar
      if (newValue.channel_detail && newValue.channel_detail.tags) {
        this.checkedType = JSON.parse(
          JSON.stringify(newValue)
        ).channel_detail.tags.map(e => {
          return e.name
        })
        this.channel_type = false
      } else {
        this.channel_type = true
      }
    },
    deep: true
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
    }
  },
  methods: {
    // 点击切换头像的时候
    changeChannelInfo (e) {
      // e.target.parentNode.children[0].children[0].click()
    },
    // 选择checkbox
    changeCheckBox (e) {
      if (e.length > 3) {
        e.pop()
        this.$message.error('频道最多只允许选择3个标签哦~')
        return e
      }
    },
    // 剪切头像图片的返回值
    imageUrlCallback (data, funcName) {
      console.log('imageUrlCallback')
      if (data === '图片上传失败') {
        this.$message({
          type: 'error',
          message: '图片上传失败'
        })
      } else {
        this.imageUrl = data
        this.img_file = data
      }
    },
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
      // if(this.$store.state.room.currentRoomInfo)
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
            sub_channel_id: 0
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
    // 获取频道标签
    getChannelType () {
      let url = `${baseURL.path}/api/v1/category/list`
      axios
        .post(
          url,
          {
            channel_no: Number(this.$route.query.roomid),
            sub_channel_id: 0
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
            res.data.data.map(e => {
              if (e.name === '游戏频道') {
                this.channel_type_list = e.tags
              }
            })
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
    },
    open () {
      this.getChannelType()
      this.getAdminList()
      this.dialogVisible = true
    },
    changeCurrenMenu (e) {
      // 当前显示内容切换
      if (e.target.nodeName.toLowerCase() === 'li') {
        this.currentId = e.target.dataset.index
      }
    },
    submit () {
      let list = []
      this.checkedType.map(e => {
        this.channel_type_list.map(i => {
          if (e === i.name) {
            list.push(i.id)
          }
        })
      })
      let data = {
        channel_no: this.roomInfo.channel_detail.channel_no,
        name: this.name,
        avatar: this.imageUrl,
        cover: this.roomInfo.channel_detail.cover,
        tags: this.channel_type ? [] : list
      }
      let url = `${baseURL.path}/api/v1/channel/info/update`
      axios
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${getCurrentToken()}`
          }
        })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '修改频道信息成功'
            })
            this.dialogVisible = false
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // console.log(this.name, this.imageUrl, this.channel_type, this.checkedType)
    },
    close () {
      this.dialogVisible = false
    },
    // 获取用户详情
    getUserInfo (userId) {
      const url = `${baseURL.path}/api/v1/user/public/info`
      return axios.post(
        url,
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${getCurrentToken()}`
          }
        }
      )
    },

    // 菜单中的选项
    list_item_click (index) {
      switch (index) {
        case 2:
          console.log(this.tableItem)
          this.$confirm(
            `当前操作会撤销 ${this.tableItem.nickname}的管理员身份, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              let item = this.tableItem
              ipcRenderer.send('cancel-manager', item)
            })
            .catch(() => {})
          break
        case 0:
          let item = this.tableItem
          this.getUserInfo(item.nn_id).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$refs.RoomBombUserInfo.open(res.data.data)
            } else {
              this.$notify.error({
                title: '提示',
                message: res.data.msg
              })
            }
          })
          break
        case 1:
          this.$refs.manageList.open(
            Number(this.$route.query.roomid),
            this.tableItem
          )
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.room-bomb-room-info-edit-wrap {
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
  .channel-info {
    width: 516px;
    padding: 20px 26px 22px 16px;
    text-align: left;
    .room_info_users {
      .el-aside {
        padding: 31px 0 0 33px;

        .room_logo_users {
          display: inline-block;
          width: 129px;
          height: 129px;
        }
      }
      .el-main {
        padding: 0;
        .room_title_users {
          width: 272px;
          // height: 60px;
          float: right;
          margin-top: 31px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          font-size: 15px;
          font-family: MicrosoftYaHei;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
        }
        .roomId {
          display: inline-block;
          padding-top: 10px;
          margin-left: 5px;
          img {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            margin-top: -3px;
          }
        }
        .roomFire {
          display: inline-block;
          // margin-top: 22px;
          padding-top: 10px;
          margin-left: 15px;
          img {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            margin-top: -3px;
          }
        }
        .room_info_tag_all {
          margin-top: 10px;
          .room_info_tag {
            display: inline-block;
            padding: 0 10px;
            height: 24px;
            line-height: 24px;
            border-radius: 14px;
            border: 1px solid rgba(204, 204, 204, 1);
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: rgba(0, 0, 0, 1);
            margin: 5px;
          }
        }
      }
      .el-footer {
        padding: 0;
        margin: 20px 0 0 30px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        line-height: 19px;
      }
    }

    .channel-info-name,
    .channel-info-logo,
    .channel-info-kind,
    .channel-info-tag {
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
        height: 30px;
        border-radius: 4px;
        border: 1px solid rgba(204, 204, 204, 1);
        line-height: 32px;
        padding: 0 5px;
      }
    }

    .channel-name-input {
      margin-left: 0 !important;
      font-weight: 400;
    }
    .channel-info-logo {
      position: relative;
      height: 64px;
      line-height: 64px;
      margin-top: 14px;
      margin-bottom: 11px;
      border-radius: 5px;
      .channel-info-logo-avatar {
        width: 60px;
        height: 60px;
        border-radius: 5px;
      }
      .channel-info-logo-avatar-image /deep/ .btn-orange {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        padding: 0;
        z-index: 1;
      }
      .channel-info-logo-shadow {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 0;
        left: 94px;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
        border-radius: 5px;
        .el-icon-camera-solid {
          position: absolute;
          top: 20px;
          left: 20px;
          color: #fff;
          font-size: 20px;
        }
      }
    }
    .channel-info-kind {
      .channel-info-kind-type {
        display: inline-block;
        span {
          display: inline-block;
          width: 80px;
          line-height: 34px;
          text-align: center;
          border: 1px solid #dcdfe6;
          margin: 0;
          cursor: pointer;
        }
        span:hover {
          color: #6236ff;
        }
        .onchoose {
          color: #fff;
          border-color: #4444fc;
          background: linear-gradient(#4444fc, #8e79fe);
        }
        .onchoose:hover {
          color: #fff;
        }
      }
    }
    .channel-info-tag {
      margin-top: 20px;
      span {
        overflow-wrap: no-wrap;
      }
      .channel-info-tag-checkbox {
        // overflow: hidden;
        display: flex;
        flex-direction: row;
        /deep/ .el-checkbox-group {
          width: 360px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
    }
    .showChecked {
      margin-top: 20px;
      margin-left: 80px;
      padding: 10px;
      width: 330px;
      box-shadow: 1px 1px 3px 0px #dcdfe6;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .checkedItem {
        width: 70px;
        height: 24px;
        font-size: 12px;
        margin: 5px 5px;
        line-height: 24px;
        border: 1px solid #dcdfe6;
        white-space: no-wrap;
        text-align: center;
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
      .dialogBox {
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
  }
}
.channel-info-tag {
  /deep/.is-checked .el-checkbox__inner {
    background-color: #6236ff;
    border-color: #6236ff;
  }
}
.channel-info-tag {
  /deep/.el-checkbox__inner:hover {
    border-color: #6236ff;
  }
}
.channel-info-tag {
  /deep/.el-checkbox__inner:focus {
    outline-color: #6236ff;
  }
}
.channel-info-tag {
  /deep/.is-focus .el-checkbox__inner {
    border-color: #6236ff;
  }
}
.channel-info-tag {
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #6236ff;
  }
}
</style>
