<template>
  <div class="channel-list-features-wrap">
    <div class="contain-main-list-wrap" v-if="_repeat || channelInfoList.length > 0">
      <div
        :class="['placeholder-wrap',{'placeholder-wrap-last' : channelInfoList.length-1 === index}]"
        @click="goRoom(item.channel_no)"
        v-bind:key="index"
        v-for="(item,index) in channelInfoList"
      >
        <div @mouseleave="is_right_mune = -1" class="channel-item">
          <img :src="item.cover" alt class="channel-item-cover" />
          <p class="channel-item-tag">
            <span v-bind:key="i" v-for="(tag,i) in item.tags" v-show="i<3">{{tag.name}}</span>
          </p>
          <div class="channel-item-bottom">
            <p class="channel-item-title">{{item.name}}</p>
            <p class="channel-item-bottom-left">
              <img :src="item.avatar" alt class="channel-item-avatar" />
              <span v-show="item.special_channel_no === 0">{{item.channel_no}}</span>
              <span v-show="item.special_channel_no !== 0">{{item.special_channel_no}}</span>
            </p>
            <p class="channel-item-bottom-right">
              <img :src="ic_hot" class="channel-item-hot" />
              <span>{{item.hots}}</span>
            </p>
          </div>
          <div class="share-wrap">
            <p
              @click="collectChannel(item.channel_no)"
              class="collect-btn"
              v-show="!_repeat&&channelListType !== 2 &&!item.is_collect"
            >
              <img :src="ic_collect" alt class="collect-img" />
              <span>收藏</span>
            </p>
            <img :src="ic_plane" @click="sendPlaneTicket(item.channel_no)" alt class="plane-img" />
          </div>
          <div
            @contextmenu.prevent="e=>oncontextmenu(e,index)"
            class="right-menu-wrap"
            v-show="channelListType === 1"
          >
            <img :src="ic_right_menu" alt class="neme-img" />
          </div>
          <ul class="right-menu" v-show="is_right_mune === index">
            <li
              @click="rightMenuClick(menu_item.text,item.channel_no)"
              v-bind:key="i"
              v-for="(menu_item,i) in channel_right_mune"
              v-show="_repeat === menu_item.repeat"
            >{{menu_item.text}}</li>
          </ul>
        </div>
      </div>
      <!-- 我的频道添加创建房间按钮 -->
      <div
        @click="onCreateChannelBtnCick"
        class="newChannel"
        v-if="_repeat && channelInfoList.length<3"
      >
        <img :src="new_channel_btn" alt />
        <span>创建频道</span>
      </div>
    </div>
    <nn-channel-list-default v-show="!_repeat&& channelInfoList.length === 0"></nn-channel-list-default>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ContainerMainListDefault from './ContainerMainListDefault'
import utils from '../../../../utils/util.js'
export default {
  name: 'ContainerMainList',
  data () {
    return {
      // channel_info_list: '',
      is_right_mune: -1,
      ic_hot: require('@/assets/img/home/ic_hot.png'),
      ic_collect: require('@/assets/img/room/icon/iconCollection_active.png'),
      ic_plane: require('@/assets/img/room/icon/iconPlaneTicket.png'),
      ic_right_menu: require('@/assets/img/home/right-menu-ic.png'),
      new_channel_btn: require('@/assets/img/home/my_channel_new_btn.png'),
      channel_right_mune: [
        { text: '进入频道', repeat: true },
        { text: '编辑频道信息', repeat: true },
        { text: '解散频道', repeat: true },
        { text: '进入频道', repeat: false },
        { text: '查看频道信息', repeat: false }
      ],
      disbandChannel: false
    }
  },
  components: {
    'nn-channel-list-default': ContainerMainListDefault
  },
  props: {
    _repeat: Boolean
  },
  computed: {
    // 频道信息列表
    channelInfoList () {
      if (this._repeat) {
        return this.$store.state.home.myChannelInfoList
      } else {
        return this.$store.state.home.channelInfoList
      }
      // return this.$store.state.home.channelInfoList
    },
    channelListType () {
      // 0是选择左侧列表的类型，1是我的频道的类型， 2是我的收藏的类型
      return this.$store.state.home.channelListType
    },
    getCookie () {
      return this.$store.state.public.token
    }
  },
  destroyed () {
    ipcRenderer.removeListener('collect-channel-res', this.collectChannelRes)
  },
  created () {
    ipcRenderer.on('collect-channel-res', this.collectChannelRes)
  },
  mounted () {
    // this.getChannelInfo()
  },
  methods: {
    collectChannelRes (event, params, channelNo) {
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        this.reviseChannelList('channel_no', channelNo, 'is_collect')
      }
    },
    // 收藏频道
    collectChannel (channelNo) {
      event.stopPropagation()
      let collectData = {
        channel_no: channelNo,
        collect_type: 1
      }
      ipcRenderer.send('collect-channel', collectData, channelNo)
    },
    // 进入房间
    goRoom (channelNo) {
      ipcRenderer.send('is-room-window', channelNo)
      // let url =
      //   window.location.href +
      //   `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
      // ipcRenderer.send('request-new-win', url)
    },
    oncontextmenu (e, index) {
      this.is_right_mune = index
    },
    // 修改列表数据
    reviseChannelList (compareKey, data, reviseKey) {
      // let channelListArr = Object.assign(
      //   [],
      //   this.$store.state.home.channelInfoList
      // )
      let channelListArr = JSON.parse(
        JSON.stringify(this.$store.state.home.channelInfoList)
      )
      channelListArr.map((item, index) => {
        if (item[compareKey] === data) {
          // item.is_collect = true
          item[reviseKey] = true
        }
      })
      this.$store.dispatch('SetChannelInfoList', channelListArr)
    },
    // 右键点击事件
    rightMenuClick (text, channelNo) {
      event.stopPropagation()
      switch (text) {
        case '进入频道':
          this.goRoom(channelNo)
          break
        case '编辑频道信息':
          this.$store.dispatch('editChannelBtnClick', true)
          let data = { channel_no: channelNo }
          this.$store.dispatch('SelectedChannelNo', channelNo)
          ipcRenderer.send('get-edit-channel-info', data)
          break
        case '解散频道':
          this.$store.dispatch('SelectedChannelNo', channelNo)
          this.$store.dispatch('ShowDisbandChannel', true)
          break
        case '查看频道信息':
          // watchChannelBtnClick
          this.$store.dispatch('watchChannelBtnClick', true)
          let watchData = { channel_no: channelNo }
          this.$store.dispatch('SelectedChannelNo', channelNo)
          ipcRenderer.send('get-watch-channel-info', watchData)
          break
        default:
          break
      }
    },
    onCreateChannelBtnCick () {
      // 判断有没有token
      if (this.getCookie) {
        this.$store.dispatch('NewChannelBtnClick', true)
        // } else {
      }
    },
    // 发送飞机票
    sendPlaneTicket (channelNo) {
      event.stopPropagation()
      utils.copyValue(`nn://nnpd-[nn_sup=${channelNo}]`)
      this.$notify({
        title: '成功',
        message: '复制飞机票成功',
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>
<style lang="less" scoped>
.channel-list-features-wrap {
  padding: 0 8px 0 20px;
  overflow: auto;
  .contain-main-list-wrap {
    width: 100%;
    height: 100%;
    // overflow: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    .placeholder-wrap {
      position: relative;
      margin: 13px 13px 0 0;
      width: 240px;
      height: 187px;
      .channel-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 240px;
        height: 187px;
        background-color: #ffffff;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .share-wrap {
          width: 32px;
          height: 66px;
          overflow: hidden;
          display: none;
        }
        .right-menu-wrap {
          display: none;
          position: absolute;
          bottom: 75px;
          right: 12px;
          width: 10px;
          height: 17px;
          .neme-img {
            margin-left: 3px;
            width: 4px;
            height: 17px;
          }
        }
        .right-menu {
          position: absolute;
          bottom: 40px;
          left: 260px;
          width: 120px;
          text-align: center;
          background-color: #ffffff;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          li {
            width: 100%;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            color: #999999;
            cursor: pointer;
          }
          li:hover {
            color: #333333;
            background-color: #f5f5f5;
          }
        }
        .channel-item-cover {
          width: 240px;
          height: 120px;
          border-radius: 3px 3px 0 0;
        }
        .channel-item-tag {
          position: absolute;
          left: 0;
          top: 95px;
          display: flex;
          span {
            margin-left: 5px;
            width: 56px;
            height: 20px;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
            color: #ffffff;
            background-color: rgba(51, 51, 51, 0.7);
            border-radius: 3px;
            border: none;
            display: none;
          }
          span:nth-of-type(1) {
            display: block;
          }
        }
        .channel-item-bottom {
          position: relative;
          width: 100%;
          height: 67px;
          .channel-item-title {
            position: absolute;
            left: 0;
            top: 0;
            padding: 10px;
            width: 100%;
            height: 38px;
            font-size: 13px;
            line-height: 18px;
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .channel-item-bottom-left {
            position: absolute;
            left: 5px;
            bottom: 5px;
            width: 120px;
            height: 25px;
            display: flex;
            align-items: center;
            .channel-item-avatar {
              width: 25px;
              height: 25px;
              border-radius: 12.5px;
            }
            span {
              padding-left: 5px;
              height: 25px;
              color: #999999;
              font-size: 12px;
              line-height: 25px;
            }
          }
          .channel-item-bottom-right {
            position: absolute;
            right: 5px;
            bottom: 12px;
            width: 40px;
            height: 12px;
            display: flex;
            align-items: center;
            .channel-item-hot {
              width: 12px;
              height: 12px;
            }
            span {
              padding-left: 5px;
              height: 12px;
              color: #999999;
              font-size: 12px;
              line-height: 12px;
            }
          }
        }
      }
      .channel-item:hover {
        top: -10px;
        left: -10px;
        width: 260px;
        height: 240px;
        z-index: 9;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        .right-menu-wrap {
          display: block;
        }
        .share-wrap {
          position: absolute;
          bottom: 5px;
          right: 9px;
          display: block;
          .collect-btn {
            padding-bottom: 11px;
            width: 100%;
            height: 33px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            .collect-img {
              width: 19.5px;
              height: 18.5px;
            }
            span {
              width: 32px;
              height: 14px;
              text-align: center;
              line-height: 14px;
              color: #333333;
            }
          }
          .plane-img {
            width: 32px;
            height: 18.5px;
            cursor: pointer;
          }
        }
        .channel-item-cover {
          width: 260px;
          height: 140px;
        }
        .channel-item-tag {
          top: 211px;
          left: 4px;
          span {
            color: #999999;
            border: 1px solid #cccccc;
            background-color: #ffffff;
            display: block;
          }
        }
        .channel-item-bottom {
          position: relative;
          width: 100%;
          height: 110px;
          .channel-item-bottom-left {
            bottom: 44px;
            span {
              margin-top: -16px;
              height: 12px;
              line-height: 12px;
            }
          }
          .channel-item-bottom-right {
            right: 182px;
            bottom: 44px;
          }
        }
      }
    }
    .placeholder-wrap-last {
      padding-bottom: 50px;
    }
    .newChannel {
      margin: 13px 13px 0 0;
      width: 240px;
      height: 186px;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        width: 39px;
        height: 39px;
      }
      span {
        padding-top: 10px;
        height: 21px;
        font-size: 16px;
        color: #cccccc;
        line-height: 21px;
      }
    }
  }
}
</style>