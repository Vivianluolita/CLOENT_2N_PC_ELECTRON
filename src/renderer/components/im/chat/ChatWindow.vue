<template>
  <div>
    <!-- 聊天窗口 -->
    <div style="background-color: #333;padding: 0px;">
      <div class="chat-window">
        <div class="chat-window-header" style="-webkit-app-region: drag">
          <div class="header-left"></div>
          <!-- 昵称 -->
          <div
            class="header-middle"
          >{{ chatterInfo.friend_info&&chatterInfo.friend_info.friend_remark?chatterInfo.friend_info.friend_remark:chatterInfo.nickname }}</div>
          <div class="header-right">
            <!-- 窗口最小化 -->
            <el-image
              :fit="fit"
              :src="url_min"
              @click="minChatWindow(1)"
              class="chat-window-btn-min"
            ></el-image>
            <!-- 关闭窗口 -->
            <el-image
              :fit="fit"
              :src="url_close"
              @click="closeChatWindow(1)"
              class="chat-window-btn-close"
            ></el-image>
          </div>
        </div>
        <div class="chat-window-body" ref="chatBox">
          <!-- 聊天消息 -->
          <div :key="item.id" class="msg-item" v-for="item in msg_box">
            <!-- 消息时间戳 -->
            <div class="msg-item-date" v-show="item.id % 4 === 0">{{ item.time }}</div>
            <!-- 消息所属者头像-左 -->
            <div class="msg-item-avatar-left">
              <el-image
                :fit="fit"
                :src="chatterInfo.avatar"
                style="width: 32px; height: 32px;border-radius: 16px;"
                v-show="item.position === 'left'"
              ></el-image>
            </div>
            <div
              class="msg-item-content"
              v-bind:class="{
                content__left: item.position === 'left' ? true : false,
                content__right: item.position === 'right' ? true : false
              }"
            >
              <!-- 消息气泡 -->
              <div
                class="content-item-bubble"
                v-bind:class="{
                  bubble__left: item.position === 'left' ? true : false,
                  bubble__right: item.position === 'right' ? true : false
                }"
              >
                <!-- 文字消息 -->
                <p class="chat-text" v-if="item.type===1">{{ item.content }}</p>
                <!-- 图片表情消息 -->
                <!-- 图片消息 -->
                <el-image
                  :preview-src-list="srcList"
                  :src="item.content"
                  @click="onClick"
                  class="avatar baseline-top"
                  fit="cover"
                  v-else
                ></el-image>
              </div>
            </div>
            <!-- 消息所属者头像-右 -->
            <div class="msg-item-avatar-right">
              <el-image
                :fit="fit"
                :src="userInfo.avatar"
                style="width: 32px; height: 32px;border-radius: 16px;"
                v-show="item.position === 'right'"
              ></el-image>
            </div>
          </div>
        </div>
        <div class="chat-window-footer">
          <!-- 中部工具栏 电话 表情 图片-->
          <div class="footer-toolbar">
            <!-- 语音电话 -->
            <el-image :fit="fit" :src="url_phone" @click="dial" class="footer-toolbar-item"></el-image>
            <!-- emoji表情 -->
            <el-popover placement="top-start" trigger="click" width="272">
              <ul class="chat-pic-icon">
                <li :key="index" @click="sendEmoji(index)" v-for="(item, index) in sysEmojis">
                  <img :src="`${item.image}`" :title="`${item.name}`" alt />
                </li>
              </ul>
              <el-image :fit="fit" :src="url_emoji" class="footer-toolbar-item" slot="reference"></el-image>
            </el-popover>
            <!-- emoji表情 -->
            <!-- 图片 -->
            <el-upload
              :action="imgurl"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
              style="width: 50px; float: left;"
              uon-success="UploadSucess"
            >
              <el-image :fit="fit" :src="url_image" class="footer-toolbar-item"></el-image>
            </el-upload>
          </div>
          <div class="footer-editzone">
            <!-- 文字编辑框 -->
            <el-input
              :autosize="{ minRows: 4, maxRows: 4 }"
              class="chat-window-user-input"
              maxlength="200"
              placeholder="请输入内容"
              resize="none"
              show-word-limit
              type="textarea"
              v-model="textarea_user_input"
              v-on:keyup.native.enter="pushMsg(textarea_user_input, 0)"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import utils from '../../../utils/util.js'
import baseURL from '../../../../main/api/baseURL'
export default {
  data () {
    return {
      imgurl: baseURL.imgPath + '/upload/image',
      // 图片自适应模式
      fit: 'fill',
      // 示例头像
      avatar_demo:
        'https://static.nn.com/image/2019/11/4/10/5/36/fc9dd6f91da9543f493677fe0db1c63f.png',
      // 关闭按钮icon
      url_close: require('@/components/im/imgs/close-2x.png'),
      // 最小化按钮的icon
      url_min: require('@/components/im/imgs/min-2x.png'),
      // 语音电话按钮的icon
      url_phone: require('@/components/im/imgs/phone-2x.png'),
      // emoji表情的icon
      url_emoji: require('@/components/im/imgs/emoji-2x.png'),
      // 图片按钮的icon
      url_image: require('@/components/im/imgs/image-2x.png'),
      // 当前待发送的文字消息
      textarea_user_input: '',
      // 消息盒子
      msg_box: [],
      msg_box_bak: [
        {
          id: 1,
          type: 1,
          time: '上午 11:08',
          content: '空山新雨后 天气晚来秋',
          position: 'left'
        },
        {
          id: 2,
          type: 1,
          time: '上午 11:08',
          content: '你说得真好！',
          position: 'right'
        },
        {
          id: 3,
          type: 1,
          time: '上午 11:08',
          content: '明天有空吗，我们一起去爬山吧？',
          position: 'left'
        },
        {
          id: 4,
          type: 1,
          time: '上午 11:08',
          content: '去哪里爬山呢？',
          position: 'right'
        },
        {
          id: 5,
          type: 1,
          time: '上午 11:08',
          content:
            '珠穆朗玛峰（俗称珠峰）是喜马拉雅山脉的主峰，同时是世界海拔最高的山峰，位于中国与尼泊尔边境线上，北部在中国西藏定日县境内（西坡在定日县扎西宗乡，东坡在定日县曲当乡，有珠峰大本营），南部在尼泊尔境内，是世界最高峰，也是中国跨越四个县的珠穆朗玛峰自然保护区和尼泊尔国家公园的中心所在。',
          position: 'left'
        },
        {
          id: 6,
          type: 1,
          time: '上午 11:08',
          content: '你要去爬珠峰？？？傻了吧你？',
          position: 'right'
        },
        {
          id: 7,
          type: 1,
          time: '上午 11:08',
          content: '我是认真的',
          position: 'left'
        }
      ],
      // 聊天对象的用户信息
      chatterInfo: {},
      // 当前登录用户的信息
      userInfo: {},
      // 当前聊天窗口的id
      currentWindowId: '999999',
      // 系统预设的emoji表情
      sysEmojis: [],
      // 聊天图片预览地址
      srcList: [],
      /* 当前用户的语音通话状态
        空闲：0，
        通话中：1，
        免打扰：2
      */
      userVoiceCallStatus: 0
    }
  },
  mounted () {
    this.init()
    this.getEmojis()
  },
  methods: {
    // 最小化窗口
    minChatWindow () {
      ipcRenderer.send('hide-chat-window', { id: this.currentWindowId })
    },
    // 关闭窗口
    closeChatWindow () {
      ipcRenderer.send('close-chat-window', { id: this.currentWindowId })
    },
    // 初始化聊天窗口信息
    init () {
      let params = {
        contact_id: this.chatterInfo.nn_id,
        limit: 100
      }
      // 拉取聊天记录
      ipcRenderer.send('get-chat-records', params)
    },
    // 获取系统预设的emoji表情
    getEmojis () {
      ipcRenderer.send('get-sys-emojis', { id: this.currentWindowId })
    },
    // 图片上传前的钩子函数
    beforeUpload (file) {
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
    // 图片上传成功后
    uploadSucess (res) {
      let url = res.data.url
      this.NN_IM_LOG('图片上传成功, url=', url)
      this.pushMsg(url, 1)
    },
    // 发送emoji表情
    sendEmoji (index) {
      let url = `${this.sysEmojis[index].image}`
      this.pushMsg(url, 1)
    },
    // 发送消息
    pushMsg (content, type) {
      // 判断content合法性
      switch (type) {
        case 0:
          this.NN_IM_LOG('发送文字消息', content)
          // 更新msg_box
          this.msg_box.push({
            id: utils.GUID(),
            type: 1,
            time: utils.timeStampToTime(new Date()),
            content: content,
            position: 'right'
          })
          // 清空文字编辑区域
          this.textarea_user_input = ''
          let params = {
            command_id: 300001,
            data: {
              to_id: this.chatterInfo.nn_id,
              message_type: 1,
              content: content
            }
          }
          ipcRenderer.send('im-send-msg', params)
          break
        case 1:
          this.NN_IM_LOG('发送图片，表情消息', content)
          // 更新msg_box
          this.msg_box.push({
            id: utils.GUID(),
            type: 2,
            time: utils.timeStampToTime(new Date()),
            content: content,
            position: 'right'
          })
          let params2 = {
            command_id: 300001,
            data: {
              to_id: this.chatterInfo.nn_id,
              message_type: 2,
              content: content
            }
          }
          ipcRenderer.send('im-send-msg', params2)
          break
        default:
          break
      }
      // 将聊天窗口滚动到底部
      setTimeout(() => {
        this.scrollChatWindow()
      }, 300)
    },
    // 聊天窗口滚动条实时滚动
    scrollChatWindow () {
      let chatBox = this.$refs.chatBox
      if (chatBox) {
        let chatBoxScrollHeight = chatBox.scrollHeight
        if (chatBoxScrollHeight) {
          chatBox.scrollTop = chatBoxScrollHeight + 300
        }
      }
    },
    // 预览聊天图片
    onClick (param, p) {
      this.srcList = [param.target.currentSrc]
    },
    // 拨打电话
    dial () {
      this.NN_IM_LOG('开始拨打电话')
      this.NN_IM_LOG('chatterInfo=', this.chatterInfo)
      // =======================================
      let url = ' http://' + window.location.host + '/#/phone'
      url += `?userInfo=${JSON.stringify(this.userInfo)}`
      url += `&chatterInfo=${JSON.stringify(this.chatterInfo)}`
      // isCaller: 是否是拨打电话的窗口 为false时表示接听电话的窗口
      url += `&isCaller=true`
      let data = {
        userId: this.userInfo.nn_id,
        chatterId: this.currentWindowId,
        remark: this.chatterInfo.nickname,
        url: url
      }
      ipcRenderer.send('show-voice-call-window', data)
      this.NN_IM_LOG('打开电话窗口，参数', data)
      this.NN_IM_LOG('window.location.href=', window.location.href)
      // =======================================a)
    },
    // 取消拨打电话
    cancelDial () {},
    // 挂断电话
    hangupCall () {}
  },
  created () {
    // 初始化
    this.chatterInfo = JSON.parse(this.$route.query.chatterInfo)
    this.userInfo = JSON.parse(this.$route.query.userInfo)
    this.currentWindowId = this.chatterInfo.nn_id
    this.NN_IM_LOG('chatterInfo=', this.chatterInfo)
    this.NN_IM_LOG('userInfo=', this.userInfo)
    /* hppt请求结果的回调 */
    // 获取聊天记录
    ipcRenderer.on('on-chat-records', (event, params) => {
      let _this = this
      this.NN_IM_LOG('聊天记录', params)
      if (params.data.code === 0) {
        let resArray = params.data.data.list
        if (Array.isArray(resArray) && resArray.length > 0) {
          resArray.forEach(item => {
            _this.msg_box.unshift({
              id: item.msg_id,
              type: item.message_type,
              time: utils.timeStampToTime(item.timestamp),
              content: item.content,
              position:
                item.from_id === _this.chatterInfo.nn_id ? 'left' : 'right'
            })
          })
          _this._contact_box = Object.assign([], _this.contact_box)
          this.NN_IM_LOG('拉取聊天记录成功')
          // 将聊天窗口滚动到底部
          setTimeout(() => {
            _this.scrollChatWindow()
          }, 500)
        }
      } else {
        this.NN_IM_LOG('拉取聊天记录失败')
      }
    })
    // 获取系统默认的emoji表情
    ipcRenderer.on('on-get-sys-emojis', (event, params) => {
      let _this = this
      this.NN_IM_LOG('emoji表情', params)
      if (params.data.code === 0) {
        let resArray = params.data.data.im_face
        if (Array.isArray(resArray)) {
          this.sysEmojis = resArray
        }
      } else {
        this.NN_IM_LOG('获取系统默认的emoji表情失败')
      }
    })
    /* ws回执 */
    // 发送文字图片消息
    ipcRenderer.on('ws-send-msg-repsonse', (event, params) => {
      let _this = this
      this.NN_IM_LOG('发送图文消息回执', params)
      if (params.code === 0) {
        this.NN_IM_LOG('消息发送成功！')
      } else {
        this.NN_IM_LOG('消息发送失败！')
      }
    })
    /* ws广播 */
    // 接受文字图片消息
    ipcRenderer.on('ws-msg-repsonse', (event, params) => {
      let _this = this
      this.NN_IM_LOG('收到图文消息', params)
      if (params.code === 0) {
        _this.msg_box.push({
          id: params.data.msg_id,
          type: params.data.message_type,
          time: utils.timeStampToTime(params.data.timestamp),
          content: params.data.content,
          position:
            params.data.from_user.nn_id === _this.chatterInfo.nn_id
              ? 'left'
              : 'right'
        })
        // 将聊天窗口滚动到底部
        setTimeout(() => {
          _this.scrollChatWindow()
        }, 500)
      }
    })
  },
  destroyed () {
    // ipcRenderer.removeAllListeners('on-chat-records')
    // ipcRenderer.removeAllListeners('on-get-sys-emojis')
    // ipcRenderer.removeAllListeners('ws-send-msg-repsonse')
    // ipcRenderer.removeAllListeners('on-get-sys-emojis')
    // ipcRenderer.removeAllListeners('on-get-sys-emojis')
  }
}
</script>

<style lang="less" scoped>
.chat-window {
  position: relative;
  width: 607px;
  height: 562px;
  // border: 1px #eee solid;
  // margin: auto;
  border-radius: 5px;
}
.chat-window-header {
  position: relative;
  width: 100%;
  height: 40px;
  background: linear-gradient(
    270deg,
    rgba(142, 121, 254, 1) 0%,
    rgba(68, 68, 252, 1) 100%
  );
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
.header-left {
  float: left;
  position: relative;
  height: 40px;
  width: 11%;
  // background-color: antiquewhite;
}
.header-middle {
  float: left;
  position: relative;
  height: 40px;
  width: 78%;
  // background-color: antiquewhite;
  font-size: 18px;
  line-height: 40px;
  color: #fff;
  text-align: center;
}
.header-right {
  float: left;
  position: relative;
  height: 40px;
  width: 11%;
  // background-color: antiquewhite;
}
.chat-window-body {
  position: relative;
  width: 607px;
  height: 382px;
  background-color: #f5f5f5;
  overflow-y: auto;
}
.chat-window-footer {
  position: relative;
  width: 607px;
  height: 140px;
  background-color: #fff;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.footer-toolbar {
  position: relative;
  // background-color: #cccccc;
  height: 30px;
  width: 100%;
  text-align: left;
  // padding: 10px;
}
.footer-editzone {
  position: relative;
  // background-color: #cccccc;
  height: 110px;
  width: 100%;
}
.chat-window-btn-min {
  width: 18px;
  height: 18px;
  margin-right: 7px;
  margin-top: 10px;
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.chat-window-btn-close {
  width: 16px;
  height: 16px;
  margin-left: 7px;
  margin-top: 10px;
  cursor: pointer;
  -webkit-app-region: no-drag;
}
.footer-toolbar-item {
  width: 22px;
  height: 22px;
  margin-left: 12px;
  cursor: pointer;
  margin-top: 10px;
}
.chat-window-user-input {
  margin-top: 8px;
  font-size: 14px;
}
.msg-item {
  width: 96%;
  min-height: 60px;
  // background-color: #eee;
  margin-left: 2%;
  margin-bottom: 10px;
  display: table;
}
.msg-item-date {
  // background-color: #909399;
  font-size: 12px;
  color: #888;
  line-height: 12px;
  text-align: center;
}
.msg-item-avatar-left {
  float: left;
  width: 35px;
  min-height: 60px;
  // background-color: #ddd;
}
.msg-item-avatar-right {
  float: left;
  width: 35px;
  min-height: 60px;
  // background-color: #ddd;
}
.msg-item-content {
  float: left;
  width: calc(100% - 70px);
  min-height: 60px;
  // background-color: #fff;
}
.content-item-bubble {
  position: relative;
  // height: 40px;
  // width: auto;
  display: inline-block !important;
  display: inline;
  // padding-top: 10px;
  // padding-bottom: 10px;
  padding: 10px;
}
.content__left {
  text-align: left;
}
.content__right {
  text-align: right;
}
.bubble__left {
  background-color: #fff;
  margin-top: 20px;
  margin-left: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}
.bubble__right {
  background-color: #38eeb1;
  margin-top: 20px;
  margin-right: 10px;
  border-top-left-radius: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
}
.chat-pic-icon {
  width: 100%;
  height: 110px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  li {
    height: 25px;
    margin: 5px;
    cursor: pointer;
  }
}
.chat-text {
  font-size: 14px;
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  max-width: 400px;
  word-break: normal;
  white-space: pre-warp;
  word-wrap: break-word;
}
.baseline-top {
  vertical-align: top;
}
.avatar {
  max-width: 250px;
  max-height: 250px;
  border-radius: 5px;
}
</style>
