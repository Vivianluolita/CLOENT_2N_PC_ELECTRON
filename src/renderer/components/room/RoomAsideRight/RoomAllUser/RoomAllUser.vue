<template>
  <!-- 房间所有用户 -->
  <div class="room-all-user-wrap">
    <div class="room-all-user-title">房间用户</div>
    <ul class="room-all-user-list">
      <draggable
        @dragover="dragOver"
        @drop="drop"
        @end="dragEnd"
        @start="dragStart"
        v-model="allUserList"
      >
        <li :key="index" class="all-user-list" v-for="(item,index) in allUserList">
          <div
            :class="['all-user-list-li',{'onchoose':item.onchoose === true}]"
            @click="chooseUser(item)"
            @contextmenu.prevent="e=>oncontextmenu(item,e)"
            @dblclick="chooseUserChat(item)"
          >
            <el-badge class="user-status" is-dot type="success" />
            <img :src="item.roleIcon" alt class="user-cloth" />
            <span>
              <el-tooltip :content="item.nickname" effect="light" placement="left-start">
                <span class="user-nickname">{{item.nickname}}</span>
              </el-tooltip>
            </span>
          </div>
        </li>
      </draggable>
    </ul>
    <contextMenuRight
      :mouse="mousePosition"
      :pop-items="popItems"
      @ListItemChildClick="list_item_child_click"
      @ListItemClick="list_item_click"
    />
    <RoomBombUserInfo ref="RoomBombUserInfo" />
    <RoomBombExitRoom ref="RoomBombExitRoom" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import contextMenuRight from '../../contextMenu/contextMenu'
import RoomBombUserInfo from '../../RoomBombBox/RoomBombUserInfo'
import RoomBombExitRoom from '../../RoomBombBox/RoomBombExitRoom'
import { ipcRenderer, remote } from 'electron'
export default {
  data () {
    return {
      allUserList: [],
      // 右键菜单的选项
      popItems: [
        {
          txt: '@TA'
        },
        {
          txt: '个人信息'
        },
        {
          txt: '加为好友'
        },
        {
          txt: '成员管理',
          children: [
            {
              txt: '设为嘉宾'
            },
            {
              txt: '设为会员'
            },
            {
              txt: '设为子频道管理员'
            },
            {
              txt: '设为全频道管理员'
            }
          ]
        },
        {
          txt: '添加到麦序'
        },
        {
          txt: '禁止打字'
        },
        {
          txt: '踢出频道'
        }
      ],
      // 右键菜单的位置
      mousePosition: [],
      // 选中的那一列
      treeItem: Object,
      // 要设置的用户权限
      setUserRole: {}
    }
  },
  components: {
    draggable,
    contextMenuRight,
    RoomBombUserInfo,
    RoomBombExitRoom
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        console.log(newValue)
        this.allUserList = JSON.parse(JSON.stringify(newValue)).users
        // 设置频道里的人
        this.getUserList()
      },
      deep: true
    }
  },
  computed: {
    roomInfo: {
      get () {
        return JSON.parse(
          JSON.stringify(this.$store.state.room.currentRoomInfo)
        )
      },
      set () {}
    }
  },
  methods: {
    // 移动用户
    dragStart (e) {
      let index = e.oldIndex
    },
    dragEnd () {},
    dragOver (e) {
      e.preventDefault()
    },
    drop (e) {
      console.log(e)
    },
    // 初始化所有用户列表的样式
    allUserListInit () {
      this.allUserList.map(e => {
        this.$set(e, 'onchoose', false)
      })
    },
    // 单击选择一个用户
    chooseUser (item) {
      this.allUserListInit()
      this.$set(item, 'onchoose', true)
    },
    // 双击@用户
    chooseUserChat (item) {
      if (item.nn_id === remote.getGlobal('myNNID')) {
        return false
      }
      this.$emit('sendToOne', JSON.parse(JSON.stringify(item)))
    },
    // 右键单击
    oncontextmenu (item, e) {
      console.log(item)
      console.log(this.$store.state.room.microList)
      let users
      if (this.$store.state.room.microList.users) {
        users = JSON.parse(
          JSON.stringify(this.$store.state.room.microList.users)
        )
      }
      this.allUserListInit()
      this.$set(item, 'onchoose', true)
      this.treeItem = item
      if (item.nn_id === this.$store.state.room.userInfo.nn_id) {
        this.popItems = [
          {
            txt: '个人信息'
          }
        ]
      } else {
        if (this.$store.state.room.userInfo.role <= 5) {
          // 管理员以上的级别
          this.popItems = [
            {
              txt: '@TA'
            },
            {
              txt: '个人信息'
            },
            {
              txt: '加为好友'
            },
            {
              txt: '成员管理',
              children: [
                {
                  txt: item.role === 8 ? '取消嘉宾' : '设为嘉宾'
                },
                {
                  txt: item.role === 7 ? '取消会员' : '设为会员'
                },
                {
                  txt:
                    item.role === 5 ? '取消子频道管理员' : '设为子频道管理员'
                },
                {
                  txt:
                    item.role === 4 ? '取消全频道管理员' : '设为全频道管理员'
                }
              ]
            },
            {
              txt: '添加到麦序'
            },
            {
              txt: item.word_forbid ? '允许打字' : '禁止打字'
            },
            {
              txt: '踢出频道'
            }
          ]
        } else {
          this.popItems = [
            {
              txt: '@TA'
            },
            {
              txt: '个人信息'
            },
            {
              txt: '加为好友'
            }
          ]
        }

        // 如果这个人在麦序上
        if (
          users &&
          users.some(e => {
            return e.user_id === item.nn_id
          })
        ) {
          if (this.$store.state.room.userInfo.role <= 5) {
            // 管理员以上的级别
            this.popItems = [
              {
                txt: '@TA'
              },
              {
                txt: '个人信息'
              },
              {
                txt: '加为好友'
              },
              {
                txt: '成员管理',
                children: [
                  {
                    txt: item.role === 8 ? '取消嘉宾' : '设为嘉宾'
                  },
                  {
                    txt: item.role === 7 ? '取消会员' : '设为会员'
                  },
                  {
                    txt:
                      item.role === 5 ? '取消子频道管理员' : '设为子频道管理员'
                  },
                  {
                    txt:
                      item.role === 4 ? '取消全频道管理员' : '设为全频道管理员'
                  }
                ]
              },
              {
                txt: item.word_forbid ? '允许打字' : '禁止打字'
              },
              {
                txt: '踢出频道'
              }
            ]
          } else {
            this.popItems = [
              {
                txt: '@TA'
              },
              {
                txt: '个人信息'
              },
              {
                txt: '加为好友'
              }
            ]
          }
        }
      }
      let x = e.pageX
      let y = e.pageY
      let clientY =
        document.documentElement.clientHeight || document.body.clientHeight
      let clientX =
        document.documentElement.clientWidth || document.body.clientWidth
      let yy = (this.popItems.length + 1) * 30
      if (clientY - e.pageY <= yy) {
        y = clientY - (yy + 10)
      }
      if (clientX - e.pageX <= 120) {
        x = e.pageX - 100
      }
      this.mousePosition = [x, y]
    },
    // 右键菜单
    list_item_click (index, item) {
      var _this = this
      if (item.txt === '@TA') {
        this.$emit('sendToOne', JSON.parse(JSON.stringify(_this.treeItem)))
      } else if (item.txt === '个人信息') {
        this.$refs.RoomBombUserInfo.open(_this.treeItem)
      } else if (item.txt === '加为好友') {
        this.$confirm(`是否确定添加${_this.treeItem.nickname}为好友?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            ipcRenderer.send('im-send-add-friend-msg', {
              nn_id: _this.treeItem.nn_id
            })
            this.NN_MSG('添加好友请求发送成功', 'success')
          })
          .catch(() => {})
      } else if (item.txt === '添加到麦序') {
        ipcRenderer.send('add-to-microlist', _this.treeItem)
      } else if (item.txt === '禁止打字') {
        // treeItme.word_forbid = false
        ipcRenderer.send('room-set-user-word-forbid', _this.treeItem)
      } else if (item.txt === '允许打字') {
        // treeItme.word_forbid = true
        ipcRenderer.send('room-set-user-word-forbid', _this.treeItem)
      } else if (item.txt === '踢出频道') {
        this.$refs.RoomBombExitRoom.open(_this.treeItem)
      }
    },
    // 右键菜单的子菜单
    list_item_child_click (index, item) {
      var _this = this

      if (item.txt === '设为嘉宾') {
        this.setUserRole = {
          role: 8,
          nn_id: Number(_this.treeItem.nn_id)
        }
        ipcRenderer.send('set-others-role', {
          role: 8,
          user_id: Number(_this.treeItem.nn_id)
        })
      } else if (item.txt === '设为会员') {
        this.setUserRole = {
          role: 7,
          nn_id: Number(_this.treeItem.nn_id)
        }
        ipcRenderer.send('set-others-role', {
          role: 7,
          user_id: Number(_this.treeItem.nn_id)
        })
      } else if (item.txt === '设为子频道管理员') {
        this.setUserRole = {
          role: 5,
          nn_id: Number(_this.treeItem.nn_id)
        }
        ipcRenderer.send('set-others-role', {
          role: 5,
          user_id: Number(_this.treeItem.nn_id)
        })
      } else if (item.txt === '设为全频道管理员') {
        this.setUserRole = {
          role: 4,
          nn_id: Number(_this.treeItem.nn_id)
        }
        ipcRenderer.send('set-others-role', {
          role: 4,
          user_id: Number(_this.treeItem.nn_id)
        })
      } else if (
        item.txt === '取消嘉宾' ||
        '取消会员' ||
        '取消子频道管理员' ||
        '取消全频道管理员'
      ) {
        this.setUserRole = {
          role: 10,
          nn_id: Number(_this.treeItem.nn_id)
        }
        ipcRenderer.send('set-others-role', {
          role: 10,
          user_id: Number(_this.treeItem.nn_id)
        })
      }
    },
    // 获取频道里的人
    getUserList () {
      let roleList = JSON.parse(
        JSON.stringify(this.$store.state.room.roomClothesList)
      )

      this.allUserList.map(e => {
        this.$set(e, 'onchoose', false)
        roleList.map(i => {
          if (e.role === i.id) {
            if (e.gender === 1) {
              e.roleIcon = i.icon_male
            } else if (e.gender === 2) {
              e.roleIcon = i.icon_female
            }
          }
        })
      })
      this.allUserListInit()
    }
  },
  mounted () {
    // 点击的时候关闭右键菜单
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  },
  created () {
    ipcRenderer.on('set-others-role-success', (event, params) => {
      console.log('set-others-role-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          // 回执消息
          // console.log(this.setUserRole)
          if (this.setUserRole) {
            this.$store.dispatch('setCurrentRoomRoleInfo', this.setUserRole)
          }
        } else if (params.message_type === 2) {
          // 广播消息
          this.$store.dispatch('setCurrentRoomRoleInfo', {
            nn_id: params.data.user_id,
            role: params.data.role
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
    ipcRenderer.on('set-room-user-word-forbid-success', (event, params) => {
      console.log('set-room-user-word-forbid-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          if (this.treeItem) {
            this.$store.dispatch('setCurrentRoomUserWordForbid', this.treeItem)
          }
        } else if (params.message_type === 2) {
          // 广播消息
          if (params.data.target.nn_id === remote.getGlobal('myNNID')) {
            this.$store.dispatch('setMyTypeStatus', params.data.forbid)
          }
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
.room-all-user-wrap {
  width: 264px;
  display: flex;
  flex-direction: column;
  .room-all-user-title {
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    font-family: MicrosoftYaHei;
    color: #606166;
    padding-left: 10px;
  }
  .room-all-user-list {
    flex: 1;
    overflow-y: auto;
    .all-user-list {
      height: 32px;
      line-height: 32px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .all-user-list-li {
        width: 100%;
        .user-status {
          line-height: 22px;
          padding: 10px 15px 0 10px;
        }
        .user-cloth {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        .user-nickname {
          display: inline-block;
          vertical-align: middle;
          max-width: 125px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .onchoose {
    background-color: #e3e6e8;
  }
}
</style>