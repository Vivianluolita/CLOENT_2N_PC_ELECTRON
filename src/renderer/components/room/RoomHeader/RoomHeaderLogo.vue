<template>
  <!-- 频道形象 -->
  <div class="room-header-logo-wrap">
    <el-image :src="roomHeaderLogo" @contextmenu.prevent="e=>oncontextmenu(e)"></el-image>
    <contextMenuRight
      :mouse="mousePosition"
      :pop-items="popItems"
      @ListItemClick="list_item_click"
    />
    <RoomBombRoomInfoEdit ref="RoomBombRoomInfoEdit" />
    <!-- <RoomBombManageList /> -->
    <RoomBombTransferChannel ref="RoomBombTransferChannel" />
  </div>
</template>

<script>
import contextMenuRight from '../contextMenu/contextMenu'
import RoomBombRoomInfoEdit from '../RoomBombBox/RoomBombRoomInfoEdit'
// import RoomBombManageList from '../RoomBombBox/RoomBombManageList'
import RoomBombTransferChannel from '../RoomBombBox/RoomBombTransferChannel'
import baseURL from '../../../../main/api/baseURL'
import axios from 'axios'
import { getCurrentToken } from '../../../common'
import { remote, ipcRenderer } from 'electron'
import { DB, Storage } from '../../../../main/db/dbStore'
export default {
  data () {
    return {
      roomHeaderLogo: require('@/assets/img/room/icon/pic.png'),
      // 基本路径
      staticPath: '',
      // 右键菜单的东西
      popItems: [
        {
          txt: '频道详情'
        },
        {
          txt: '频道收藏'
        },
        {
          txt: '频道转让'
        },
        {
          txt: '退出'
        }
      ],
      mousePosition: [],
      isCollect: false
    }
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        console.log(newValue)
        this.isCollect = newValue.is_collect
        this.roomHeaderLogo = newValue.channel_detail.avatar
      },
      deep: true
    }
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
    }
  },
  components: {
    contextMenuRight,
    RoomBombRoomInfoEdit,
    // RoomBombManageList,
    RoomBombTransferChannel
  },
  methods: {
    // 右键频道形象
    oncontextmenu (e) {
      let x = e.pageX
      let y = e.pageY
      this.mousePosition = [x, y]
      if (this.$store.state.room.userInfo.role === 2) {
        this.popItems = [
          {
            txt: '频道信息'
          },
          {
            txt: '频道转让'
          },
          {
            txt: '退出'
          }
        ]
      } else {
        this.popItems = [
          {
            txt: '频道信息'
          },
          {
            txt: this.isCollect ? '取消收藏' : '频道收藏'
          },
          {
            txt: '退出'
          }
        ]
      }
    },
    list_item_click (index, item) {
      if (item.txt === '频道信息') {
        this.$refs.RoomBombRoomInfoEdit.open()
      } else if (item.txt === '频道收藏') {
        this.collect_cancel(1).then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '收藏频道成功!',
              duration: 2000
            })
            this.$store.dispatch('setRoomCollectStatus', true)
          } else {
            this.$notify.error(res.data.msg)
          }
        })
      } else if (item.txt === '取消收藏') {
        this.collect_cancel(0).then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            this.$notify.success({
              title: '提示',
              message: '取消收藏成功!',
              duration: 2000
            })
            this.$store.dispatch('setRoomCollectStatus', false)
          } else {
            this.$notify.error(res.data.msg)
          }
        })
      } else if (item.txt === '频道转让') {
        this.$refs.RoomBombTransferChannel.open()
      } else if (item.txt === '退出') {
        ipcRenderer.send('leave-room')
        window.close()
      }
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
  },
  mounted () {
    // 点击的时候关闭右键菜单
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  }
}
</script>

<style lang="less" scoped>
.room-header-logo-wrap {
  width: 80px;
  height: 80px;
}
.room-header-logo-wrap .el-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid rgba(234, 236, 239, 1);
  cursor: context-menu;
}
</style>