<template>
  <!-- 频道信息  包含名称,ID,热度等 -->
  <div class="room-header-info-wrap">
    <!-- 频道标题 -->
    <p class="roomTitle">{{roomTitle}}</p>
    <div class="roomTitleInfo">
      <!-- 频道id -->
      <div class="roomId">
        <img :src="roomId" />
        <span>{{room_no}}</span>
      </div>
      <!-- 频道热度 -->
      <div class="roomFire">
        <img :src="roomFire" />
        <span>{{room_hot}}</span>
      </div>
      <!-- 分隔线 -->
      <el-divider direction="vertical"></el-divider>
      <!-- 收藏 -->
      <div @click="collectRoom" class="iconCollectionBox" v-show="collection">
        <img :src="iconCollection_active" />
        <span>收藏</span>
      </div>
      <!-- 取消收藏 -->
      <div @click="collectRoom" class="iconCollectionBox" v-show="!collection">
        <img :src="iconCollection" />
        <span>取消</span>
      </div>
      <!-- 分享 -->
      <!-- <div @click="shareMyRoom" class="share">
        <img :src="iconShare" class="iconShare" style="-webkit-app-region:no-drag;" />
        <span>分享</span>
      </div>-->
    </div>
  </div>
</template>

<script>
import utils from '../../../utils/util.js'
import { DB, Storage } from '../../../../main/db/dbStore'
import axios from 'axios'
import { getCurrentToken } from '../../../common'
import { remote } from 'electron'
import baseURL from '../../../../main/api/baseURL'
export default {
  data () {
    return {
      collection: false,
      roomId: require('@/assets/img/room/icon/userID.png'),
      roomFire: require('@/assets/img/room/icon/fire_icon.png'),
      iconCollection_active: require('@/assets/img/room/icon/iconCollection_active.png'),
      iconCollection: require('@/assets/img/room/icon/iconCollection.png'),
      iconShare: require('@/assets/img/room/icon/iconShare.png'),
      roomTitle: '',
      room_no: Number,
      room_hot: Number,
      notify: ''
    }
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        this.collection = !newValue.is_collect
        console.log(this.collection)
        this.roomTitle = newValue.channel_detail.name
        this.room_no = newValue.channel_detail.channel_no
        this.room_hot = newValue.user_num
      },
      deep: true
    }
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
    }
  },
  methods: {
    // 点击切换收藏
    collectRoom () {
      if (this.collection === true) {
        this.collect_cancel(1).then(res => {
          if (this.notify) {
            this.notify.close()
          }
          if (res.data.code === 0) {
            this.notify = this.$notify({
              title: '提示',
              message: '收藏成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('setRoomCollectStatus', true)
          } else {
            this.notify = this.$notify.error({
              title: '提示',
              message: res.data.msg,
              duration: 2000
            })
          }
        })
      } else {
        this.collect_cancel(0).then(res => {
          if (this.notify) {
            this.notify.close()
          }
          if (res.data.code === 0) {
            this.notify = this.$notify({
              title: '提示',
              message: '取消收藏成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('setRoomCollectStatus', false)
          } else {
            this.notify = this.$notify.error({
              title: '提示',
              message: res.data.msg,
              duration: 2000
            })
          }
        })
      }
      this.collection = !this.collection
    },
    // 频道收藏取消
    collect_cancel (id) {
      return axios.post(
        `${baseURL.path}/api/v1/user/channel/collect_cancel`,
        {
          channel_no: this.roomInfo.channel_detail.channel_no,
          collect_type: id
        },
        {
          headers: {
            Authorization: `Bearer ${getCurrentToken()}`
          }
        }
      )
    }
    // 分享我的房间
    // shareMyRoom () {
    //   utils.copyValue(
    //     'https://' +
    //       window.location.host +
    //       window.location.pathname +
    //       '?id=' +
    //       this.inChannelRoomId
    //   )
    //   this.$notify({
    //     title: '成功',
    //     message: '分享内容已复制到剪贴板',
    //     type: 'success'
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.room-header-info-wrap {
  .roomTitle {
    // width: 673px;
    height: 16px;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
  }
  .roomTitleInfo {
    display: flex;
    align-content: center;
    padding-top: 10px;
    .roomId {
      display: inline-block;
      padding-top: 10px;
      // margin-top: 22px;
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
    // 分隔线
    .el-divider {
      width: 1px;
      height: 12px;
      background: rgba(204, 204, 204, 1);
      margin: 12px 15px 1px 15px;
      border-radius: 1px;
    }
    // 收藏框
    .iconCollectionBox,
    .share {
      cursor: pointer;
      display: inline-block;
      width: 76px;
      height: 28px;
      margin-top: 5px;
      line-height: 28px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(245, 245, 245, 1) 100%
      );
      border-radius: 14px;
      border: 1px solid rgba(204, 204, 204, 1);
      margin-right: 10px;
      img {
        width: 20px;
        height: 19px;
        margin-left: 10px;
        margin-top: -3px;
      }
      span {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        line-height: 12px;
      }
    }
    .share {
      .iconShare {
        width: 16px;
        height: 16px;
        margin-left: 12px;
        margin-right: 2px;
      }
    }
  }
}
</style>