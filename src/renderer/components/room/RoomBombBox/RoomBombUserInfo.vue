<template>
  <!-- 房间内所有用户--个人信息 -->
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    append-to-body
    class="dialog"
    width="432px"
  >
    <!-- content -->
    <div class="nn-box">
      <el-container>
        <div class="main">
          <div class="user_header">
            <i @click="closeUserInfo" class="el-icon-close"></i>
            <div class="avatar">
              <img :src="userInfo.avatar" alt />
            </div>
            <div class="text">
              <ul>
                <li class="name">{{userInfo.nickname}}</li>
                <li class="num">
                  <img :src="userID" alt />
                  <span>{{userInfo.nn_id}}</span>
                </li>
                <!-- <img
                    :src="$store.state.channelRoom.userInfoData.icon"
                    alt
                    style="width:15px;margin-left:8px;vertical-align:text-bottom"
                />-->
              </ul>
              <!-- <p class="des">{{userInfo.intro||'这个人很懒'}}</p> -->
            </div>
          </div>
          <!-- <div class="title">
            <span>
              <img
                alt
                src="@/assets/img/room/icon/logo1.png"
                style="width:25px;height:25px;vertical-align:bottom"
              /> NN
            </span>
          </div>-->

          <ul>
            <li v-if="userInfo.friend_info">
              <span class="label">备注名：</span>
              <span class="value">{{userInfo.friend_info.friend_remark || userInfo.nickname}}</span>
            </li>
            <li>
              <span class="label">区域：</span>
              <span class="value">{{userInfo.region1||'未知'}} {{userInfo.region2||'未知'}}</span>
            </li>
            <li>
              <span class="label">NN号：</span>
              <span class="value">{{userInfo.nn_id||'未知'}}</span>
            </li>
            <li>
              <span class="label">生日：</span>
              <span class="value">{{userInfo.birthday||'未知'}}</span>
            </li>
            <li v-if="userInfo.friend_info">
              <span class="label">来源：</span>
              <span class="value">{{userInfo.friend_info.friend_from || 来源}}</span>
            </li>
            <li>
              <span class="label">个性签名：</span>
              <span class="value">{{userInfo.intro||'这个人很懒'}}</span>
            </li>
          </ul>
        </div>
        <div class="bottom">
          <!-- 聊天 -->
          <img
            :src="liveChatIcon"
            @mouseleave="changeLiveChatIcon"
            @mouseover="changeLiveChatIcon_active"
            alt
          />
          <!-- 添加好友 -->
          <img
            :src="addUserIcon"
            @click="AddFriend"
            @mouseleave="changeAddUserIcon"
            @mouseover="changeAddUserIcon_active"
            alt
            v-if="!userInfo.friend_info && userInfo.nn_id !== $store.state.room.userInfo.nn_id"
          />
        </div>
      </el-container>
    </div>
  </el-dialog>
</template>
<script>
import { ipcRenderer, remote } from 'electron'
import axios from 'axios'
import { DB, Storage } from '../../../../main/db/dbStore'
import baseURL from '../../../../main/api/baseURL'
import { getCurrentToken } from '../../../common'
export default {
  data () {
    return {
      userID: require('@/assets/img/room/icon/userinfoID.png'),
      liveChatIcon: require('@/assets/img/room/icon/liveChatIcon.png'),
      // liveChatIcon: require('@/assets/img/room/icon/liveChatIcon_active.png'),
      addUserIcon: require('@/assets/img/room/icon/addUserIcon.png'),
      // addUserIcon: require('@/assets/img/room/icon/addUserIcon_active.png'),
      userInfo: {},
      dialogVisible: false
    }
  },
  computed: {},
  methods: {
    // 加为好友
    AddFriend () {
      this.$confirm(`是否确定添加${this.userInfo.nickname}为好友?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ipcRenderer.send('im-send-add-friend-msg', {
            nn_id: this.userInfo.nn_id
          })
          this.NN_MSG('添加好友请求发送成功', 'success')
        })
        .catch(() => {})
    },
    open (item) {
      // this.userInfo = item
      axios
        .post(
          baseURL.path + '/api/v1/user/public/info',
          { id: item.nn_id },
          {
            headers: {
              Authorization: `Bearer ${getCurrentToken()}`
            }
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.userInfo = res.data.data
            console.log(this.userInfo)
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg
            })
          }
        })
      this.dialogVisible = true
      console.log(item)
    },
    closeUserInfo () {
      this.dialogVisible = false
    },
    changeLiveChatIcon_active () {
      this.liveChatIcon = require('@/assets/img/room/icon/liveChatIcon_active.png')
    },
    changeLiveChatIcon () {
      this.liveChatIcon = require('@/assets/img/room/icon/liveChatIcon.png')
    },
    changeAddUserIcon_active () {
      this.addUserIcon = require('@/assets/img/room/icon/addUserIcon_active.png')
    },
    changeAddUserIcon () {
      this.addUserIcon = require('@/assets/img/room/icon/addUserIcon.png')
    }
  }
}
</script>

<style scoped lang="less">
.el-dialog {
  .el-container {
    height: 553px;
  }
  .nn-box {
    position: relative;
    border-radius: 10px 10px 0 0;
    background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.06));
    box-sizing: border-box;
    // padding: 76px 52px;
    .main {
      .user_header {
        position: relative;
        background-image: url(../../../assets/img/room/icon/user_bg.png);
        background-size: contain;
        width: 432px;
        height: 199px;
        text-align: center;
        margin-bottom: 38px;
        .el-icon-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: rgba(255, 255, 255, 1);
        }
        .avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: inline-block;
          margin: 42px 0 13px;
          img {
            width: 76px;
            height: 76px;
            border-radius: 50%;
          }
        }
        .text {
          // float: left;
          padding-top: 5px;
          p {
            margin-bottom: 13px;
          }
          .name {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 22px;
            img {
              width: 15px;
              height: 15px;
              margin-bottom: 2px;
            }
          }
          .num {
            margin-top: 8px;
            img {
              width: 17px;
              height: 17px;
            }
            span {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: rgba(191, 182, 255, 1);
              line-height: 17px;
            }
          }
          .des {
            font-size: 14px;
            font-weight: 400;
            color: rgba(96, 97, 102, 1);
            line-height: 20px;
          }
        }
      }
      .title {
        position: absolute;
        top: 20px;
        left: 20px;
        span {
          font-size: 16px;
          color: rgba(48, 48, 51, 1);
          line-height: 16px;
          letter-spacing: 1px;
        }
      }
      > ul {
        padding-left: 30px;
        li {
          margin-bottom: 23px;
          .label {
            display: inline-block;
            width: 80px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(144, 147, 153, 1);
            line-height: 20px;
          }
          .value {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(48, 48, 51, 1);
            line-height: 20px;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      right: 30px;
      bottom: 30px;
      img {
        cursor: pointer;
        width: 30px;
        height: 28px;
        &:first-of-type {
          margin-right: 30px;
        }
        &:last-of-type {
          color: #4e4afc;
        }
      }
    }
  }
}
/deep/.el-dialog {
  border-radius: 12px 12px 5px 5px;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/.el-dialog__body {
  padding: 0;
}
</style>


