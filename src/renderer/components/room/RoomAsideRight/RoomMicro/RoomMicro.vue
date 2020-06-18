<template>
  <div class="room-micro-wrap">
    <!-- 麦序模式 -->
    <div class="mic_info">
      <!-- 麦克风模式 -->
      <div class="mic_maixu">
        <!-- <span style="cursor:default">麦序模式</span> -->
        <el-dropdown trigger="click">
          <span style="cursor:pointer">
            {{chat_mode===1?'自由模式':'麦序模式'}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu class="chatModeMenu" slot="dropdown">
            <el-dropdown-item class="chatMode">
              <span @click="changeMacType">{{chat_mode===1?'麦序模式':'自由模式'}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 说话方式 -->
      <span class="speak_type" v-if="chat_mode===2">
        <div
          style="cursor:context-menu"
          v-show="micro_info.mic_time"
        >{{micro_time_transform(micro_time)}}</div>
        <el-divider class="mic_divider" direction="vertical" />
        <template>
          <div @click="wheatControl" class="wheat_control">
            <span v-if="wheat_control">控麦</span>
            <span v-if="!wheat_control">放麦</span>
          </div>
          <el-divider class="mic_divider" direction="vertical" />
          <div @click="wheatBan" class="wheat_ban">
            <span v-if="wheat_ban">禁麦</span>
            <span v-if="!wheat_ban">开麦</span>
          </div>
          <el-divider class="mic_divider" direction="vertical" />
        </template>
        <div
          :class="wheat_ban_click === true ? 'rob_wheat' : 'rob_wheat_disable'"
          @click="robWheat"
        >
          <span v-if="rob_wheat">抢麦</span>
          <span v-if="!rob_wheat">下麦</span>
        </div>
      </span>
      <span class="speak_type_all" v-if="chat_mode===1">所有人都可以说话</span>
    </div>
    <!-- 麦序列表 -->
    <li
      :key="index"
      class="all-user-list"
      v-for="(item,index) in micro_info.users"
      v-show="chat_mode===2"
    >
      <div
        :class="['all-user-list-li',{'onchoose':item.onchoose === true}]"
        @click="chooseUser(item)"
        @contextmenu="e => oncontextmenu(index,item,e)"
      >
        <!-- <el-badge class="user-status" is-dot type="success" /> -->
        <img :src="mic" class="mic_pic" />
        <!-- <span class="itemId">{{item.userInfo.nn_id + '.'}}</span> -->
        <img :src="item.userInfo.roleIcon" alt class="user-cloth" />
        <span>
          <el-tooltip :content="item.userInfo.nickname" effect="light" placement="left-start">
            <span class="user-nickname">{{item.userInfo.nickname}}</span>
          </el-tooltip>
        </span>
      </div>
    </li>
    <RoomBombUpperWheat ref="RoomBombUpperWheat" />
    <contextMenu :mouse="mousePosition" :pop-items="popItems" @ListItemClick="list_item_click" />
    <RoomBombUserInfo ref="RoomBombUserInfo" />
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import RoomBombUpperWheat from '../../RoomBombBox/RoomBombUpperWheat'
import contextMenu from '../../contextMenu/contextMenu'
import RoomBombUserInfo from '../../RoomBombBox/RoomBombUserInfo'
export default {
  data () {
    return {
      mic: require('@/assets/img/room/icon/mic.png'),
      // 放麦  控麦
      wheat_control: true,
      // 禁麦 开麦
      wheat_ban: true,
      wheat_ban_click: true,
      // 抢麦 下麦
      rob_wheat: true,
      // 麦序列表
      // micro_list: [],
      micro_time: 0,
      chat_mode: 1,
      micInterval: null,
      // 右键菜单的位置
      mousePosition: [],
      // 选中的那一列
      treeItem: Object,
      popItems: [
        { txt: '@TA' },
        { txt: '个人信息' },
        { txt: '加为好友' },
        { txt: '增加一倍麦序时长' },
        { txt: '从麦序中移除' },
        { txt: '清空所有麦序' },
        { txt: '将用户麦序上移' },
        { txt: '将用户麦序下移' }
      ]
    }
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        console.log(newValue)
        this.chat_mode = JSON.parse(
          JSON.stringify(newValue)
        ).style_extra.chat_mode
        this.$store.dispatch(
          'setMyVoiceStatus',
          JSON.parse(JSON.stringify(newValue)).style_extra.chat_mode === 1
        )
        this.$emit('VoiceType', this.$store.state.room.myVoiceStatus)
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
    },
    micro_info: {
      get () {
        return JSON.parse(JSON.stringify(this.$store.state.room.microList))
      },
      set () {}
    }
  },
  components: {
    RoomBombUpperWheat,
    contextMenu,
    RoomBombUserInfo
  },
  mounted () {
    // 点击的时候关闭右键菜单
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })
  },
  methods: {
    // 右键点击用户列表
    oncontextmenu (index, item, e) {
      console.log(item)
      this.treeItem = item
      let x = e.pageX
      let y = e.pageY
      let clientX =
        document.documentElement.clientWidth || document.body.clientWidth

      if (clientX - e.pageX <= 120) {
        x = e.pageX - 100
      }
      this.mousePosition = [x, y]
      if (index === 0) {
        this.popItems = [
          { txt: '@TA' },
          { txt: '个人信息' },
          { txt: '加为好友' },
          { txt: '增加一倍麦序时长' },
          { txt: '从麦序中移除' },
          { txt: '清空所有麦序' }
        ]
      } else if (index === 1) {
        this.popItems = [
          { txt: '@TA' },
          { txt: '个人信息' },
          { txt: '加为好友' },
          { txt: '从麦序中移除' },
          { txt: '清空所有麦序' },
          { txt: '将用户麦序下移' }
        ]
      } else if (index === 2) {
        this.popItems = [
          { txt: '@TA' },
          { txt: '个人信息' },
          { txt: '加为好友' },
          { txt: '从麦序中移除' },
          { txt: '清空所有麦序' },
          { txt: '将用户麦序上移' },
          { txt: '将用户麦序下移' }
        ]
      }
    },
    //  // 右键菜单
    list_item_click (index, item) {
      var _this = this
      if (item.txt === '@TA') {
        this.$emit(
          'sendToOne',
          JSON.parse(JSON.stringify(_this.treeItem.userInfo))
        )
      } else if (item.txt === '个人信息') {
        this.$refs.RoomBombUserInfo.open(_this.treeItem.userInfo)
      } else if (item.txt === '加为好友') {
        this.$confirm(
          `是否确定添加${_this.treeItem.userInfo.nickname}为好友?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            ipcRenderer.send('im-send-add-friend-msg', {
              nn_id: _this.treeItem.userInfo.nn_id
            })
            this.NN_MSG('添加好友请求发送成功', 'success')
          })
          .catch(() => {})
      } else if (item.txt === '增加一倍麦序时长') {
        ipcRenderer.send('increase-micro-time')
      } else if (item.txt === '从麦序中移除') {
        ipcRenderer.send('remove-micro-list', _this.treeItem.userInfo)
      } else if (item.txt === '清空所有麦序') {
        ipcRenderer.send('remove-micro-list')
      } else if (item.txt === '将用户麦序上移') {
        ipcRenderer.send('move-micro-list-order', {
          userInfo: _this.treeItem.userInfo,
          status: 1
        })
      } else if (item.txt === '将用户麦序下移') {
        ipcRenderer.send('move-micro-list-order', {
          userInfo: _this.treeItem.userInfo,
          status: 0
        })
      }
    },
    // 上麦倒计时弹窗
    // upperWheat () {
    //   this.$refs.RoomBombUpperWheat.open()
    // },
    // 改变麦序模式
    changeMacType () {
      ipcRenderer.send('change-micro-type', this.chat_mode === 1 ? 2 : 1)
    },
    // 单击选择一个用户
    chooseUser (item) {
      this.allUserListInit()
      this.$set(item, 'onchoose', true)
    },
    // 初始化所有用户列表的样式
    allUserListInit () {
      this.allUserList.map(e => {
        this.$set(e, 'onchoose', false)
      })
    },
    // 放麦  控麦
    wheatControl () {
      if (this.wheat_control) {
        // 请求控麦

        ipcRenderer.send('request-to-control-micro', true)
      } else {
        // 请求放麦

        ipcRenderer.send('request-to-release-micro', false)
      }
    },
    // 禁麦 开麦
    wheatBan () {
      if (this.wheat_ban) {
        // 请求禁麦

        ipcRenderer.send('request-to-forbid-micro')
      } else {
        // 请求开麦

        ipcRenderer.send('request-to-open-micro')
      }
    },
    // 抢麦 下麦
    robWheat () {
      if (this.rob_wheat) {
        // 抢麦
        ipcRenderer.send('request-to-start-micro')
      } else {
        // 下麦
        ipcRenderer.send('request-to-end-micro')
      }
    },
    micro_time_transform (time) {
      let min = Math.floor(time / 60)
      let sec = time % 60
      min < 10 ? (min = '0' + min) : (min = '' + min)
      sec < 10 ? (sec = '0' + sec) : (sec = '' + sec)
      return `${min}:${sec}`
    }
  },
  created () {
    // 修改麦序成功
    ipcRenderer.on('change-micro-type-success', (event, params) => {
      console.log('change-micro-type-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          this.chat_mode === 1 ? (this.chat_mode = 2) : (this.chat_mode = 1)
          this.$store.dispatch('setMyVoiceStatus', this.chat_mode === 1)
          this.$emit('VoiceType', this.$store.state.room.myVoiceStatus)
          if (this.chat_mode === 1) {
            // this.micro_list = []
            this.$store.dispatch('setMicroList', '')
          }
        } else if (params.message_type === 2) {
          this.chat_mode = params.data.mode
          if (this.chat_mode === 1) {
            // this.micro_list = []
            this.$store.dispatch('setMicroList', '')
          }
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg
        })
      }
    })
    // 上麦成功
    ipcRenderer.on('request-to-start-micro-success', (event, params) => {
      console.log('request-to-start-micro-success', params)
      this.rob_wheat = false
      this.wheat_ban_click = false
      let startMicro = setTimeout(() => {
        this.wheat_ban_click = this.wheat_ban
        clearTimeout(startMicro)
      }, 3000)
    })
    // 下麦成功
    ipcRenderer.on('request-to-end-micro-success', (event, params) => {
      console.log('request-to-end-micro-success', params)
      this.rob_wheat = true
      this.wheat_ban_click = false
      let startMicro = setTimeout(() => {
        this.wheat_ban_click = this.wheat_ban
        clearTimeout(startMicro)
      }, 3000)
    })
    // 控麦/放麦成功
    ipcRenderer.on(
      'request-to-control-release-micro-success',
      (event, params) => {
        console.log('request-to-control-release-micro-success', params)
        if (params.code === 0) {
          if (params.message_type === 1) {
            if (this.wheat_control) {
              clearInterval(this.micInterval)
            } else {
              this.micInterval = setInterval(() => {
                this.micro_time--
                if (this.micro_time <= 1) {
                  this.micInterval = null
                  clearInterval(this.micInterval)
                }
              }, 1000)
            }
            this.wheat_control = !this.wheat_control
          } else if (params.message_type === 2) {
            this.wheat_control = !params.data.status
            if (!this.wheat_control) {
              clearInterval(this.micInterval)
            } else {
              this.micInterval = setInterval(() => {
                this.micro_time--
                if (this.micro_time <= 1) {
                  this.micInterval = null
                  clearInterval(this.micInterval)
                }
              }, 1000)
            }
          }
        } else {
          this.$notify.error({
            title: '提示',
            message: params.msg
          })
        }
      }
    )
    // 禁麦/开麦成功
    ipcRenderer.on('request-to-forbid-open-micro-success', (event, params) => {
      console.log('request-to-forbid-open-micro-success', params)
      if (params.code === 0) {
        this.wheat_ban = !this.wheat_ban
        this.wheat_ban_click = !this.wheat_ban_click
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg
        })
      }
    })
    // 增加麦序时长的广播
    ipcRenderer.on('increase-micro-time-success', (event, params) => {
      console.log('increase-micro-time-success', params)
      if (params.code === 0) {
        // 这里是麦序增加的广播
      }
    })
    // 移出麦序/清空麦序的广播
    ipcRenderer.on('remove-micro-list-success', (event, params) => {
      console.log('remove-micro-list-success', params)
      if (params.code === 0) {
        // 这里是移除麦序的广播
      }
    })
    // 上移麦序/下移麦序
    ipcRenderer.on('move-micro-list-order-success', (event, params) => {
      console.log('move-micro-list-order-success', params)
      if (params.code === 0) {
        // 这里是上移麦序/下移麦序的广播
      }
    })
    // 麦序广播
    ipcRenderer.on('return-micro-info-success', (event, params) => {
      console.log('return-micro-info-success', params)
      if (params.code === 0) {
        // 如果是麦序模式,默认开始都不让说话
        this.$emit('VoiceType', false)
        this.wheat_control = !params.data.mic_control
        this.wheat_ban = !params.data.mic_forbid
        // 有麦序广播的时候,将时间赋值
        this.micro_time = JSON.parse(JSON.stringify(params.data.mic_time))
        // 如果时间为零,那么就是没有人在麦上
        if (this.micro_time === 0) {
          this.micInterval = null
          clearInterval(this.micInterval)
        } else {
          // 时间不为零,如果定时器不存在,就创建定时器,有定时器的时候就是正在倒计时
          // 判断是否控麦,没控麦的 可以开启定时器
          // 如果控麦了 就不动
          if (this.wheat_control) {
            if (!this.micInterval) {
              this.micInterval = setInterval(() => {
                this.micro_time--
                if (this.micro_time <= 1) {
                  this.micInterval = null
                  clearInterval(this.micInterval)
                }
              }, 1000)
            }
          }
        }
        this.$store.dispatch('setMicroList', params.data)
        let microlist = JSON.parse(JSON.stringify(params.data))
        // 如果我在麦序上
        if (
          microlist.users &&
          microlist.users.some(e => {
            return e.user_id === remote.getGlobal('myNNID')
          })
        ) {
          this.rob_wheat = false
        } else {
          this.rob_wheat = true
        }
        // 如果麦序存在,而且第一个人是我
        if (microlist.users && microlist.users.length) {
          if (microlist.users[0].user_id === remote.getGlobal('myNNID')) {
            this.$emit('VoiceType', true)
          } else {
            this.$emit('VoiceType', false)
          }
        }
      } else {
        this.$notify.error({
          title: '提示',
          message: params.msg
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.room-micro-wrap {
  .mic_info {
    height: 27px;
    border-bottom: 1px solid rgba(229, 228, 228, 1);
    display: flex;
    align-items: center;
    .mic_maixu {
      display: flex;
      width: 72px;
      height: 17px;
      line-height: 17px;
      margin-left: 12px;
      span {
        font-size: 13px;
        font-family: MicrosoftYaHei;
        color: #000;
        i {
          height: 17px;
          line-height: 17px;
        }
      }
    }
    .speak_type {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 10px;
      .wheat_control,
      .wheat_ban,
      .rob_wheat {
        cursor: pointer;
      }
      .rob_wheat_disable {
        color: #ccc;
        cursor: default;
        pointer-events: none;
      }
    }
    .speak_type_all {
      flex: 1;
      text-align: right;
      margin-right: 10px;
      font-size: 13px;
    }
    .el-divider--vertical {
      margin: 0 9px !important;
    }
  }
  .all-user-list {
    height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .itemId {
      display: inline-block;
      font-size: 14px;
      margin-right: 5px;
      height: 34px;
      line-height: 34px;
    }
    .mic_pic {
      width: 20px;
      height: 21px;
      margin: 0 5px 0 10px;
    }
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
        margin-top: -3px;
      }
      .user-nickname {
        display: inline-block;
        vertical-align: middle;
        max-width: 125px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        margin-top: -3px;
      }
    }
  }
}
.el-dropdown-menu.chatModeMenu {
  padding: 0 !important;
}
/deep/.chatMode {
  padding: 0;
  line-height: normal;
  span {
    display: block;
    padding: 5px 10px;
  }
}
.onchoose {
  background-color: #e3e6e8;
}
</style>