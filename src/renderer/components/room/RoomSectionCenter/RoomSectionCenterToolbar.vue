<template>
  <!-- 中心区域工具条 -->
  <div class="room-section-center-tool-bar-wrap">
    <div class="room-section-center-tool-bar-left">
      <div class="room-section-center-tool-bar-icon">
        <!-- emoji表情 -->
        <el-popover
          :disabled="$store.state.room.currentRoomInfo.word_forbid"
          placement="top-start"
          trigger="click"
          width="200"
        >
          <ul class="room-section-center-tool-emojilist">
            <li :key="index" @click="sendEmoji(item)" v-for="(item, index) in emojiList">
              <img :src="item.image" alt />
            </li>
          </ul>
          <img :src="emojiSrc" alt class="room-section-center-tool-bar-emoji" slot="reference" />
          <!-- <i class="iconfont icon-biaoqing emoji" id="chat-pic" slot="reference" style="color:#999"></i> -->
        </el-popover>
      </div>
      <!-- 图片 -->
      <div class="room-section-center-tool-bar-icon">
        <el-upload
          :action="imgurl"
          :before-upload="beforeAvatarUpload"
          :disabled="$store.state.room.currentRoomInfo.word_forbid"
          :on-success="logoUploadSucess"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <!-- <i class="el-icon-picture-outline" style="color:#999" /> -->
          <img :src="pictureSrc" alt class="room-section-center-tool-bar-picture" />
        </el-upload>
      </div>
      <!-- 分隔线 -->
      <el-divider class="mic_divider" direction="vertical" />
    </div>
    <div class="room-section-center-tool-bar-right">
      <!-- 房间内最近@的人的头像 -->
      <div class="recent_avatar_div" v-if="recentContactsItem.nickname">
        <img :src="recentContactsItem.avatar" class="recent_avatar" />
        <i @click="romove_recent_avatar" class="el-icon-close" v-if="recentContactsItem.close"></i>
      </div>
      <!-- 房间内@的历史纪录 -->
      <el-popover
        placement="top"
        popper-class="recent_avatar_list"
        trigger="manual"
        v-model="visible"
      >
        <span
          @blur="visible = false"
          @click="visible = !visible"
          class="moreContacts el-dropdown-link"
          slot="reference"
          style="cursor:pointer"
          v-show="recentContactsList.length"
        >更多</span>
        <div>
          <!-- 更多联系人列表外加滚动条 -->
          <div class="change_recent_avatar_div">
            <div
              :key="index"
              class="change_recent_avatar"
              v-for="(item,index) in recentContactsList"
            >
              <span
                @click="changeRecentAvatar(index)"
                @mouseenter="item.close = true"
                @mouseleave="item.close = false"
                class="change_recent_avatar_span"
              >
                <img :src="item.avatar" class="recent_avatar" />
                {{item.nickname}}
                <i
                  @click.stop="clearCurrentItem(index)"
                  class="el-icon-close"
                  v-if="item.close"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import baseURL from '../../../../main/api/baseURL'
import { ipcRenderer, remote, session } from 'electron'
export default {
  data () {
    return {
      visible: false,
      // item_close: true,
      // show_recent_avatar: true,
      emojiSrc: require('@/assets/img/room/icon/emoji.png'),
      pictureSrc: require('@/assets/img/room/icon/picture.png'),
      // recentAvatar: require('@/assets/img/room/icon/pic.png'),
      imgurl: baseURL.imgPath + '/upload/image',
      emojiList: [
        { text: 'biequ', image: require('@/assets/img/room/emoji/biequ.png') },
        { text: 'bishi', image: require('@/assets/img/room/emoji/bishi.png') },
        { text: 'bizui', image: require('@/assets/img/room/emoji/bizui.png') },
        { text: 'bye', image: require('@/assets/img/room/emoji/bye.png') },
        { text: 'daku', image: require('@/assets/img/room/emoji/daku.png') },
        { text: 'gou', image: require('@/assets/img/room/emoji/gou.png') },
        {
          text: 'guguai',
          image: require('@/assets/img/room/emoji/guguai.png')
        },
        {
          text: 'haixiu',
          image: require('@/assets/img/room/emoji/haixiu.png')
        },
        {
          text: 'jingxia',
          image: require('@/assets/img/room/emoji/jingxia.png')
        },
        { text: 'ku', image: require('@/assets/img/room/emoji/ku.png') },
        {
          text: 'liulei',
          image: require('@/assets/img/room/emoji/liulei.png')
        },
        {
          text: 'nanshou',
          image: require('@/assets/img/room/emoji/nanshou.png')
        },
        {
          text: 'qinqin',
          image: require('@/assets/img/room/emoji/qinqin.png')
        },
        { text: 'se', image: require('@/assets/img/room/emoji/se.png') },
        {
          text: 'shengqi',
          image: require('@/assets/img/room/emoji/shengqi.png')
        },
        { text: 'smile', image: require('@/assets/img/room/emoji/smile.png') },
        {
          text: 'wabishi',
          image: require('@/assets/img/room/emoji/wabishi.png')
        },
        { text: 'weiqu', image: require('@/assets/img/room/emoji/weiqu.png') },
        { text: 'wunai', image: require('@/assets/img/room/emoji/wunai.png') },
        { text: 'wuyu', image: require('@/assets/img/room/emoji/wuyu.png') },
        { text: 'wuzui', image: require('@/assets/img/room/emoji/wuzui.png') },
        { text: 'xixi', image: require('@/assets/img/room/emoji/xixi.png') },
        {
          text: 'younide',
          image: require('@/assets/img/room/emoji/younide.png')
        },
        { text: 'yun', image: require('@/assets/img/room/emoji/yun.png') }
      ],
      // 显示出来的联系人
      recentContactsItem: {},
      // 最近@联系人列表
      recentContactsList: []
    }
  },
  methods: {
    // 发送图片之前
    beforeAvatarUpload (file) {
      let list = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.pdf',
        '.JPG',
        '.JPEG',
        '.PBG',
        '.GIF',
        '.BMP',
        '.PDF'
      ]
      const isJPG = list.some(e => {
        return file.name.indexOf(e) !== -1
      })
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('只能发送图片文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    logoUploadSucess (res) {
      let url = res.data.url

      this.$store.dispatch('setRoomMsgContent', url)
      if (this.recentContactsItem && this.recentContactsItem.nn_id) {
        ipcRenderer.send('send-img-msg', {
          type: 2,
          msginfo: url,
          toUser: this.recentContactsItem
        })
      } else {
        ipcRenderer.send('send-img-msg', {
          type: 1,
          msginfo: url
        })
      }
    },
    // 发送表情
    sendEmoji (item) {
      // console.log(item.text)
      this.$emit('sendEmoji', `[/${item.text}]`)
      // this.$store.dispatch('setRoomSendEmoji', `[/${item.text}]`)
    },
    // 切换最近联系人到工具栏
    changeRecentAvatar (index) {
      this.visible = false
      console.log(index)
      let item = null
      if (this.recentContactsItem.nickname) {
        item = JSON.parse(JSON.stringify(this.recentContactsItem))
      }
      this.recentContactsItem = this.recentContactsList[index]
      this.recentContactsItem.show_recent_avatar = true
      this.recentContactsItem.close = true
      this.recentContactsList.splice(index, 1)
      if (item) {
        item.close = false
        item.show_recent_avatar = false
        this.recentContactsList.unshift(item)
      }
      this.$emit('sendToOne', this.recentContactsItem)
    },
    // 删除最近联系人当前项
    clearCurrentItem (index) {
      this.visible = false
      this.recentContactsList.splice(index, 1)
    },
    // 从工具栏移除最近@对象
    romove_recent_avatar () {
      this.recentContactsItem = {}
      this.$emit('sendToOne', '')
      this.$store.dispatch('setRoomMsgTarget', '')
      this.visible = false
    },
    // @TA
    addSendToOneList (item) {
      if (this.recentContactsItem.nickname) {
        if (item.nn_id === this.recentContactsItem.nn_id) {
          return 0
        } else {
          let index = -1
          for (let i = 0; i < this.recentContactsList.length; i++) {
            if (this.recentContactsList[i].nn_id === item.nn_id) {
              index = i
            }
          }
          if (index > -1) {
            this.changeRecentAvatar(index)
          } else {
            item.close = false
            item.show_recent_avatar = false
            this.recentContactsList.unshift(item)
            this.changeRecentAvatar(0)
          }
        }
      } else {
        this.recentContactsItem = item
        this.recentContactsItem.show_recent_avatar = true
        this.recentContactsItem.close = true
      }
      this.$emit('sendToOne', this.recentContactsItem)
      this.$store.dispatch('setRoomMsgTarget', this.recentContactsItem)
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.room-section-center-tool-bar-wrap {
  // width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // padding-top: 8px;
  .room-section-center-tool-bar-left {
    display: flex;
    flex-direction: row;
    .room-section-center-tool-bar-emoji {
      margin: 9px 16px 0 10px;
      width: 24px;
      height: 24px;
      // margin-top: 8px;
      cursor: pointer;
    }
    .room-section-center-tool-bar-picture {
      width: 24px;
      height: 24px;
      margin-top: 8px;
    }
    .mic_divider {
      width: 1px;
      height: 20px;
      background: rgba(226, 226, 226, 1);
      margin: 10px 0 0 20px;
    }
  }
  .room-section-center-tool-bar-right {
    display: flex;
    flex-direction: row;
    // 工具栏最近联系人头像
    .recent_avatar_div,
    .recent_avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-top: 4px;
    }
    .recent_avatar_div {
      position: relative;
      margin-right: 10px;
      .el-icon-close {
        position: absolute;
        top: -1px;
        right: -2px;
        color: #fff;
        background-color: red;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .moreContacts {
      font-size: 13px;
      font-family: MicrosoftYaHei;
      color: rgba(48, 48, 51, 1);
      line-height: 40px;
      margin: 0 20px;
    }
  }
}
.room-section-center-tool-emojilist {
  height: 150px;
  overflow-y: auto;
  li {
    padding: 5px;
    display: inline-block !important;
    img {
      cursor: pointer;
    }
  }
}
// 最近联系列表内用户头像
.recent_avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
// 更多联系人列表

// 更多联系人列表外滚动条
.change_recent_avatar_div {
  max-height: 220px;
  overflow-y: auto;
}
// 更多联系人列表的每一项
.change_recent_avatar {
  position: relative;
  width: 124px;
  height: 44px;
  line-height: 44px;
  padding: 0 15px 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  .change_recent_avatar_span {
    width: 134px;
    display: inline-block;
    line-height: 44px;
  }
  // 每一项删除按钮
  .el-icon-close {
    position: absolute;
    right: -2px;
    top: 15px;
  }
}
</style>