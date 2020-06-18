<template>
  <!-- 房间子频道tree -->
  <div class="room-channel-tree-wrap">
    <div class="room-channel-tree-list">
      <div :key="index" v-for="(item,index) in dataSource">
        <div
          :class="['parent_tree',{'onchoose':item.onchoose === true},{'enterRoom':item.enterRoom === true}]"
          :data-type="item.id"
          @click="chooseChannel(item)"
          @contextmenu="e=>span_oncontextmenu(item,e)"
          @dblclick="enterChannel(item)"
        >
          <img :src="item.icon" alt />
          <span
            :data-type="item.id"
            class="room_title"
            v-html="item.title.replace(/\s/g, '&nbsp;')"
          ></span>
          <span class="room_hot">({{index ===0 ?roomInfo.user_num:item.user_num}})</span>
        </div>
        <el-collapse-transition>
          <div v-show="dataSource[index].show_tree_children">
            <div
              :key="index"
              class="child_tree-mr"
              v-for="(item,index) in dataSource[index].childs"
            >
              <div
                :class="['child_tree',{'onchoose':item.onchoose === true},{'enterRoom':item.enterRoom === true}]"
                :data-type="item.id"
                @click="chooseChannel(item)"
                @contextmenu="e=>span_oncontextmenu(item,e)"
                @dblclick="enterChannel(item)"
              >
                <img :src="item.icon" alt />
                <span
                  :data-type="item.id"
                  class="room_title"
                  v-html="item.title.replace(/\s/g, '&nbsp;')"
                ></span>
                <span class="room_hot">({{item.user_num}})</span>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <contextMenuRight
      :mouse="mousePosition"
      :pop-items="popItems"
      @ListItemClick="list_item_click"
    />
    <RoomBombChannelInfo ref="RoomBombChannelInfo" />
    <RoomBombNewChannel ref="RoomBombNewChannel" />
  </div>
</template>

<script>
import contextMenuRight from '../../contextMenu/contextMenu'
import RoomBombChannelInfo from '../../RoomBombBox/RoomBombChannelInfo'
import RoomBombNewChannel from '../../RoomBombBox/RoomBombNewChannel'
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      // tree的数据
      dataSource: [],
      // 右键菜单的选项
      popItems: [
        {
          txt: '进入频道'
        },
        {
          txt: '频道信息'
        },
        {
          txt: '禁止打字'
        },
        {
          txt: '设置接待频道'
        },
        {
          txt: '新建子频道'
        },
        {
          txt: '删除子频道'
        }
      ],
      // 右键菜单的位置
      mousePosition: [],
      // 选中的那一列
      treeItem: Object
    }
  },
  components: {
    contextMenuRight,
    RoomBombChannelInfo,
    RoomBombNewChannel
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        this.dataSource = newValue.list

        // 给tree添加图标
        this.channelIconInit(this.dataSource)
        // 获取默认进去的频道
        let defaultRoomId = newValue.current_sub_channel_id
        // 存储频道id
        if (!this.$store.state.room.lastRoomId) {
          this.$store.dispatch('setLastRoomId', defaultRoomId)
        }
        this.$store.dispatch('setInRoomId', defaultRoomId)
        // 给默认进入的频道加入地标样式
        this.dataSource.map(e => {
          if (e.id === defaultRoomId) {
            this.$set(e, 'enterRoom', true)
            this.$set(
              e,
              'icon',
              require('@/assets/img/room/icon/ic_Positioning.png')
            )
          } else {
            if (e.childs) {
              e.childs.map(i => {
                if (i.id === defaultRoomId) {
                  this.$set(i, 'enterRoom', true)
                  this.$set(
                    i,
                    'icon',
                    require('@/assets/img/room/icon/ic_Positioning.png')
                  )
                }
              })
            }
          }
        })
      },
      deep: true
    }
  },
  computed: {
    roomInfo: {
      get () {
        return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
      },
      set () {}
    }
  },
  methods: {
    // // 删除所有选中效果
    deleteonchoose () {
      this.dataSource.map(e => {
        e.onchoose = false
        if (e.childs) {
          e.childs.map(i => {
            i.onchoose = false
          })
        }
      })
    },
    // 单击选中频道
    chooseChannel (item) {
      clearTimeout(window.clickTimer)
      var _this = this
      this.deleteonchoose()
      _this.$set(item, 'onchoose', true)
      // 单击事件延时进行,防止被双击事件触发
      window.clickTimer = setTimeout(function () {
        if (!item.join_password && item.childs && item.childs.length) {
          if (item.show_tree_children) {
            _this.$set(
              item,
              'icon',
              require('@/assets/img/room/icon/ic_spread.png')
            )
            _this.$set(item, 'show_tree_children', false)
          } else {
            _this.$set(
              item,
              'icon',
              require('@/assets/img/room/icon/ic_merge.png')
            )
            _this.$set(item, 'show_tree_children', true)
          }
        }
      }, 300)
    },
    // 点击菜单
    list_item_click (index, item) {
      var _this = this
      console.log(item)
      if (item.txt === '进入频道') {
        _this.enterChannel(_this.treeItem)
      } else if (item.txt === '频道信息') {
        _this.$refs.RoomBombChannelInfo.open(_this.treeItem)
      } else if (item.txt === '禁止打字') {
        ipcRenderer.send('set-room-type-status', { word_forbid: true })
      } else if (item.txt === '允许打字') {
        ipcRenderer.send('set-room-type-status', { word_forbid: false })
      } else if (item.txt === '设置接待频道') {
        ipcRenderer.send('set-reception-channel', _this.treeItem)
      } else if (item.txt === '取消接待频道') {
        ipcRenderer.send('set-reception-channel', { id: 0 })
      } else if (item.txt === '新建子频道') {
        _this.$refs.RoomBombNewChannel.open(_this.treeItem)
      } else if (item.txt === '删除子频道') {
        ipcRenderer.send('remove-room-channel', _this.treeItem)
      }
    },
    // 右键菜单
    span_oncontextmenu (item, e) {
      console.log(item)
      this.deleteonchoose()
      this.$set(item, 'onchoose', true)
      this.treeItem = item

      if (this.$store.state.room.userInfo.role <= 5) {
        if (this.$store.state.room.inRoomId === item.id) {
          if (item.isChild) {
            this.popItems = [
              {
                txt: '进入频道'
              },
              {
                txt: '频道信息'
              },
              {
                txt: this.$store.state.room.currentRoomInfo.word_forbid
                  ? '允许打字'
                  : '禁止打字'
              },
              {
                txt: item.is_reception ? '取消接待频道' : '设置接待频道'
              },
              {
                txt: '删除子频道'
              }
            ]
          } else {
            this.popItems = [
              {
                txt: '进入频道'
              },
              {
                txt: '频道信息'
              },
              {
                txt: this.$store.state.room.currentRoomInfo.word_forbid
                  ? '允许打字'
                  : '禁止打字'
              },
              {
                txt: item.is_reception ? '取消接待频道' : '设置接待频道'
              },
              {
                txt: '新建子频道'
              },
              {
                txt: '删除子频道'
              }
            ]
          }
        } else {
          if (item.isChild) {
            this.popItems = [
              {
                txt: '进入频道'
              },
              {
                txt: '频道信息'
              },
              {
                txt: '设置接待频道'
              },
              {
                txt: '删除子频道'
              }
            ]
          } else {
            this.popItems = [
              {
                txt: '进入频道'
              },
              {
                txt: '频道信息'
              },
              {
                txt: '设置接待频道'
              },
              {
                txt: '新建子频道'
              },
              {
                txt: '删除子频道'
              }
            ]
          }
        }
      } else {
        this.popItems = [
          {
            txt: '进入频道'
          },
          {
            txt: '频道信息'
          }
        ]
      }
      let x = e.pageX
      let y = e.pageY
      let clientY =
        document.documentElement.clientHeight || document.body.clientHeight
      let yy = (this.popItems.length + 1) * 30
      if (clientY - e.pageY <= yy) {
        y = clientY - (yy + 10)
      }
      this.mousePosition = [x, y]
      // console.log(this.$store.state.room.currentRoomInfo)
    },
    // 双击进入频道
    enterChannel (item) {
      if (window.clickTimer) {
        clearTimeout(window.clickTimer)
      }
      let oldRoomId = JSON.parse(
        JSON.stringify(this.$store.state.room.inRoomId)
      )
      this.$store.dispatch('setLastRoomId', oldRoomId)
      this.$store.dispatch('setInRoomId', item.id)
      ipcRenderer.send('enter-child-room', item.id)
      this.$store.dispatch('setLocalInRoom', item.id)
      this.channelIconInit(this.dataSource)
      this.$set(item, 'enterRoom', true)
      this.$set(
        item,
        'icon',
        require('@/assets/img/room/icon/ic_Positioning.png')
      )
      this.$store.dispatch('addRoomNumList', {
        id: item.id
      })
      if (
        oldRoomId !==
        this.$store.state.room.roomInfo.sub_channel_detail.channel_no
      ) {
        this.$store.dispatch('reduceRoomNumList', {
          id: oldRoomId
        })
      }
    },
    // 初始化频道的显示
    channelIconInit (list) {
      list.map(e => {
        this.$set(e, 'onchoose', false)
        this.$set(e, 'show_tree_children', false)
        if (e.join_password) {
          this.$set(e, 'icon', require('@/assets/img/room/icon/ic_lock.png'))
          this.$set(e, 'show_tree_children', false)
        } else {
          if (e.childs && e.childs.length) {
            this.$set(e, 'icon', require('@/assets/img/room/icon/ic_merge.png'))
            this.$set(e, 'show_tree_children', true)
          } else {
            this.$set(e, 'icon', require('@/assets/img/room/icon/ic_point.png'))
            this.$set(e, 'show_tree_children', false)
          }
        }
        this.$set(e, 'enterRoom', false)
        if (e.childs) {
          e.childs.map(i => {
            this.$set(i, 'onchoose', false)
            this.$set(i, 'isChild', true)
            if (i.join_password) {
              this.$set(
                i,
                'icon',
                require('@/assets/img/room/icon/ic_lock.png')
              )
            } else {
              this.$set(
                i,
                'icon',
                require('@/assets/img/room/icon/ic_point.png')
              )
            }
            this.$set(i, 'show_tree_children', false)
            this.$set(i, 'enterRoom', false)
          })
        }
      })
    },
    // 获取tree数据
    getDateTree () {}
  },
  mounted () {
    // tree 列表
    this.getDateTree()

    // 点击的时候关闭右键菜单
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  },
  created () {
    ipcRenderer.on('remove-room-channel-success', (event, params) => {
      console.log('remove-room-channel-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          let paramsdata = this.treeItem.id
          this.$store.dispatch('reduceRoomChannel', paramsdata)
        } else if (params.message_type === 2) {
          let paramsdata = params.data.sub_channel_id
          this.$store.dispatch('reduceRoomChannel', paramsdata)
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg,
          duration: 2000
        })
      }
    })
    ipcRenderer.on('set-reception-channel-success', (event, params) => {
      console.log('set-reception-channel-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.$notify.success({
            title: '提示',
            message: this.treeItem.is_reception
              ? '取消接待频道成功!'
              : '设置接待频道成功!'
          })
          this.$store.dispatch('setOrRemoveReception', {
            id: this.treeItem.id,
            flag: !this.treeItem.is_reception
          })
        } else if (params.message_type === 2) {
          this.$store.dispatch('setOrRemoveReception', {
            id: params.data.reception_id
          })
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg,
          duration: 2000
        })
      }
    })
    ipcRenderer.on('set-room-type-status-success', (event, params) => {
      console.log('set-room-type-status-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.$notify.success({
            title: '提示',
            message: this.$store.state.room.currentRoomInfo.word_forbid
              ? '设置允许打字成功!'
              : '设置禁止打字成功!'
          })
          this.$store.dispatch('setRoomTypeStatus', this.treeItem.id)
        } else if (params.message_type === 2) {
          this.$store.dispatch(
            'setRoomTypeStatus',
            this.$store.state.room.inRoomId
          )
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg,
          duration: 2000
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.room-channel-tree-wrap {
  box-sizing: border-box;
  width: 250px;
  overflow-y: auto;
  .room-channel-tree-list {
    height: 1px;
    // overflow: hidden;
  }
  .parent_tree,
  .child_tree {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    img {
      width: 16px;
      height: 16px;
      margin: 0 10px;
    }
    .room_title {
      width: 180px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .room_hot {
      position: absolute;
      right: 5px;
      top: 0;
    }
  }
  .parent_tree {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .child_tree img {
    margin-left: 30px;
  }
  .onchoose {
    background: rgba(242, 242, 255, 1);
  }
  .enterRoom {
    color: rgba(78, 74, 252, 1);
  }
}
</style>