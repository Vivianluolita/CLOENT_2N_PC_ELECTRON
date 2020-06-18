<template>
  <!-- 消息区域 -->
  <div class="room-section-center-msg-info-wrap">
    <div class="room-section-center-msg-info-header">
      <span :class="['chooseChat', {'onchoose':info_show==='allpeople'}]" @click="chooseChatInfo">全员</span>
      <span
        :class="['chooseChat',{'onchoose':info_show==='manager'}]"
        @click="chooseManageChatInfo"
      >管理</span>
    </div>
    <div class="room-section-center-msg-info-content">
      <!-- 房间公告 -->
      <div class="room-section-center-msg-info-content-notice">
        <img :src="enterNotice" alt />
        <span>{{roomInfo.notice}}</span>
      </div>
      <div class="room-section-center-msg-info-show-more" v-if="showMoreChatListBtn">
        <span @click="showMoreTextListBtn">{{showMoreBtnText}}</span>
      </div>
      <div :key="index" v-for="(item,index) in showRoomChatList">
        <!-- 我发送的文字消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 1 && item.message_type === 1"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <span class="msg_content" v-html="item.content"></span>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
          </div>
        </div>
        <!-- 我@别人的文字消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 11 && item.message_type === 1"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <span class="msg_content" v-html="item.content"></span>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
          </div>
        </div>
        <!-- 我发送的语音消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 1 && item.message_type === 3"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" alt class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <div
                @click="e=>startAudioPlay(e,item)"
                class="room-section-center-msg-info-content-audio"
              >
                <audio :src="item.content">您的浏览器不支持播放语音文件!</audio>
                <img :src="voiceToText" @click.stop="voiceToTextfunc(item)" class="voiceToText" />

                <img
                  :src="item.voiceImg"
                  @click.stop="e=>startAudioPlayImg(e,item)"
                  alt
                  class="voice_img"
                />
                <span @click.stop="e=>startAudioPlaySpan(e,item)" class="audioTime">{{item.sec}}s</span>
              </div>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                alt
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
            <!-- 语音转换文字区域 -->
            <span class="voiceToTextContent" v-if="item.text">{{item.text}}</span>
          </div>
        </div>
        <!-- 我@别人的语音消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 11 && item.message_type === 3"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" alt class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <div
                @click="e=>startAudioPlay(e,item)"
                class="room-section-center-msg-info-content-audio"
              >
                <audio :src="item.content">您的浏览器不支持播放语音文件!</audio>
                <img :src="voiceToText" @click.stop="voiceToTextfunc(item)" class="voiceToText" />

                <img
                  :src="item.voiceImg"
                  @click.stop="e=>startAudioPlayImg(e,item)"
                  alt
                  class="voice_img"
                />
                <span @click.stop="e=>startAudioPlaySpan(e,item)" class="audioTime">{{item.sec}}s</span>
              </div>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                alt
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
            <!-- 语音转换文字区域 -->
            <span class="voiceToTextContentToSomeone" v-if="item.text">{{item.text}}</span>
          </div>
        </div>
        <!-- 我发送的图片消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 1 && item.message_type === 2"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <el-image
                :src="item.content"
                alt
                class="room-section-center-msg-info-content-sendIMG"
                fit="contain"
              ></el-image>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
          </div>
        </div>
        <!-- 我@别人的图片消息 -->
        <div
          class="room-section-center-msg-info-content-sendByMyself"
          v-if="item.sendType === 11 && item.message_type === 2"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <img :src="item.cloth" class="user_cloth" />
              <span>{{item.nickname}}</span>
            </div>
            <div class="room-section-center-msg-info-content-content">
              <el-image
                :src="item.content"
                alt
                class="room-section-center-msg-info-content-sendIMG"
                fit="contain"
              ></el-image>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item,e)"
                class="room-section-center-msg-info-content-avatar"
              />
            </div>
          </div>
        </div>
        <!-- 别人发送的文字消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 2 && item.message_type ===1"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="msg_content" v-html="item.content"></span>
            </div>
          </div>
        </div>
        <!-- 别人发送的语音消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 2 && item.message_type ===3"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" alt class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                alt
                class="room-section-center-msg-info-content-avatar"
              />
              <div @click="e=>startAudioPlay(e)" class="room-section-center-msg-info-content-audio">
                <audio :src="item.content">您的浏览器不支持播放语音文件!</audio>
                <span @click.stop="e=>startAudioPlaySpan(e,item)" class="audioTime">{{item.sec}}s</span>
                <img
                  :src="item.voiceImg"
                  @click.stop="e=>startAudioPlayImg(e,item)"
                  alt
                  class="voice_img"
                />
                <img :src="voiceToText" @click.stop="voiceToTextfunc(item)" class="voiceToText" />
              </div>
            </div>
            <!-- 语音转换文字区域 -->
            <span class="voiceToTextContent" v-if="item.text">{{item.text}}</span>
          </div>
        </div>
        <!-- 别人发送的图片消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 2 && item.message_type ===2"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                class="room-section-center-msg-info-content-avatar"
              />
              <el-image
                :src="item.content"
                alt
                class="room-section-center-msg-info-content-sendIMG"
                fit="contain"
              ></el-image>
            </div>
          </div>
        </div>
        <!-- 接收到的@文字消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 21 && item.message_type ===1"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                @dblclick="chooseUserChat(item.from_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="msg_content" v-html="item.content"></span>
            </div>
          </div>
        </div>
        <!-- 接收到的@图片消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 21 && item.message_type ===2"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                @dblclick="chooseUserChat(item.from_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <el-image
                :src="item.content"
                alt
                class="room-section-center-msg-info-content-sendIMG"
                fit="contain"
              ></el-image>
            </div>
          </div>
        </div>
        <!-- 接收到的@语音消息 -->
        <div
          class="room-section-center-msg-info-content-sendByOthers"
          v-if="item.sendType === 21 && item.message_type ===3"
        >
          <div class="room-section-center-msg-info-content-sendTime">{{item.sendTime}}</div>
          <div class="room-section-center-msg-info-content-sendInfo">
            <div class="room-section-center-msg-info-content-user">
              <span>{{item.nickname}}</span>
              <img :src="item.cloth" alt class="user_cloth" />
            </div>
            <div class="room-section-center-msg-info-content-content">
              <img
                :src="item.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.from_user,e)"
                @dblclick="chooseUserChat(item.from_user)"
                alt
                class="room-section-center-msg-info-content-avatar"
              />
              <span class="towards">对</span>
              <img
                :src="item.to_user.avatar"
                @contextmenu.prevent="e=>oncontextmenu(item.to_user,e)"
                @dblclick="chooseUserChat(item.to_user)"
                class="room-section-center-msg-info-content-avatar"
              />
              <div @click="e=>startAudioPlay(e)" class="room-section-center-msg-info-content-audio">
                <audio :src="item.content">您的浏览器不支持播放语音文件!</audio>
                <span @click.stop="e=>startAudioPlaySpan(e,item)" class="audioTime">{{item.sec}}s</span>
                <img
                  :src="item.voiceImg"
                  @click.stop="e=>startAudioPlayImg(e,item)"
                  alt
                  class="voice_img"
                />
                <img :src="voiceToText" @click.stop="voiceToTextfunc(item)" class="voiceToText" />
              </div>
            </div>
            <!-- 语音转换文字区域 -->
            <span class="voiceToTextContentToSomeone" v-if="item.text">{{item.text}}</span>
          </div>
        </div>

        <!-- 有人进入了房间   -->
        <div
          class="room-section-center-msg-info-content-enterMessage"
          v-if="item.command_id === 200002 && item.data.sub_channel_id === $store.state.room.currentRoomInfo.sub_channel_id"
        >
          <p>
            <img :size="32" :src="item.data.user.avatar" />用户
            <span class="user_nickname">{{item.data.user.nickname}}</span>
            <span>进入了房间！</span>
          </p>
        </div>
        <!-- 有人进入了从别的房间进来了   -->
        <div
          class="room-section-center-msg-info-content-enterMessage"
          v-if="item.command_id === 200004 && item.data.sub_channel_id === $store.state.room.currentRoomInfo.sub_channel_id"
        >
          <p>
            <img :size="32" :src="item.data.user.avatar" />用户
            <span class="user_nickname">{{item.data.user.nickname}}</span>
            <span>进入了房间！</span>
          </p>
        </div>
        <!-- 有人离开了房间  -->
        <div
          class="room-section-center-msg-info-content-leaveMessage"
          v-if="item.command_id == 200003"
        >
          <p
            style="margin:20px 0;display:flex;align-items:center;cursor:context-menu;color:#999999"
          >
            <img
              :src="item.data.user.avatar"
              style="margin:0 15px;width:32px;height:32px;border-radius:50%"
            />用户
            <span style="margin:0 10px;font-size:14px;color:#9c9aff">{{item.data.user.nickname}}</span>
            <span>离开了房间！</span>
          </p>
        </div>
        <div
          class="room-section-center-msg-info-content-enterMessage"
          v-if="item.command_id === 200004 && item.data.prev_sub_channel_id === $store.state.room.currentRoomInfo.sub_channel_id"
        >
          <p
            style="margin:20px 0;display:flex;align-items:center;cursor:context-menu;color:#999999"
          >
            <img
              :src="item.data.user.avatar"
              style="margin:0 15px;width:32px;height:32px;border-radius:50%"
            />用户
            <span style="margin:0 10px;font-size:14px;color:#9c9aff">{{item.data.user.nickname}}</span>
            <span>离开了房间！</span>
          </p>
        </div>
        <!-- 有人被禁止打字了     -->
        <!-- <div v-if="item.command_id == 200009">
                  <p style="margin:20px 0;display:flex;align-items:center;cursor:context-menu">
                    <img
                      :src="item.response.user_avatar"
                      style="margin:0 15px;width:32px;height:32px;border-radius:50%"
                    />管理员
                    <span
                      style="margin:0 10px;font-size:14px;color:#9c9aff"
                    >{{item.response.user_nickname}}</span>
                    <span>{{item.status == 1?'禁止了':'开启了'}}</span>
                    <img
                      :src="item.request.user_avatar"
                      style="margin:0 15px;width:32px;height:32px;border-radius:50%"
                    />用户
                    <span
                      style="margin:0 10px;font-size:14px;color:#9c9aff"
                    >{{item.request.user_nickname}}</span>
                    <span>的打字功能</span>
                  </p>
        </div>-->
        <!-- 有人被踢出频道了  -->
        <!-- <div v-if="item.command_id == 200012">
                  <p style="margin:20px 0;display:flex;align-items:center;cursor:context-menu">
                    <img
                      :src="item.response.user_avatar"
                      style="margin:0 15px;width:32px;height:32px;border-radius:50%"
                    />管理员
                    <span
                      style="margin:0 10px;font-size:14px;color:#9c9aff"
                    >{{item.response.user_nickname}}</span>
                    <span>将</span>
                    <img
                      :src="item.kick.user_avatar"
                      style="margin:0 15px;width:32px;height:32px;border-radius:50%"
                    />用户
                    <span
                      style="margin:0 10px;font-size:14px;color:#9c9aff"
                    >{{item.kick.user_nickname}}</span>
                    <span>踢出频道!</span>
                  </p>
        </div>-->
      </div>
    </div>
    <contextMenuRight
      :mouse="mousePosition"
      :pop-items="popItems"
      @ListItemChildClick="list_item_child_click"
      @ListItemClick="list_item_click"
    />
    <RoomBombUserInfo ref="RoomBombUserInfo" />
  </div>
</template>

<script>
import { ipcRenderer, remote, session } from 'electron'
import utils from '../../../utils/util'
import baseURL from '../../../../main/api/baseURL'
import axios from '../../../../main/api/axios'
import contextMenuRight from '../contextMenu/contextMenu'
import RoomBombExitRoom from '../RoomBombBox/RoomBombExitRoom'
import RoomBombUserInfo from '../RoomBombBox/RoomBombUserInfo'
// utils.timeStampToTime(timestamp)
export default {
  data () {
    return {
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
        }
      ],
      // 右键菜单的位置
      mousePosition: [],
      // 选中的那一列
      treeItem: Object,
      setUserRole: {},
      // 公屏切换全员或者管理
      info_show: 'allpeople',
      // 房间里的所有消息列表
      allRoomChatList: [],
      // 房间里显示的消息列表
      showRoomChatList: [],
      // 查看更多消息的按钮:
      showMoreChatListBtn: false,
      showMoreBtnIsClick: false,
      showMoreBtnText: '查看更多记录',
      // 我的马甲
      myClothType: '',
      voice_level: [
        require('@/assets/img/room/voice/right1.png'),
        require('@/assets/img/room/voice/right2.png'),
        require('@/assets/img/room/voice/right3.png'),
        require('@/assets/img/room/voice/left1.png'),
        require('@/assets/img/room/voice/left2.png'),
        require('@/assets/img/room/voice/left3.png')
      ],
      enterNotice: require('@/assets/img/room/icon/notice.png'),
      voiceToText: require('@/assets/img/room/voice/wen1.png'),
      // emoji表情库
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
      planeTicketHome: require('@/assets/img/room/icon/home_on.png')
    }
  },
  created () {
    // 个人信息
    // JSON.parse(JSON.stringify(this.$store.state.room.userInfo))
    ipcRenderer.on('send-msg-success', (event, params) => {
      console.group('----------收到发送的消息------------')
      console.log(params)
      console.groupEnd()
      // 获取我的马甲
      let myrole = this.$store.state.room.userInfo.role
      let mygender = this.$store.state.room.userInfo.gender
      this.getClothImg(myrole, mygender, e => {
        this.myClothType = e
      })

      if (params.code === 0) {
        // 【sendType == 1 是我发的,2是别人发的】
        // 【定义的message_type为消息类型,非params里面的message_type】

        // 我发送的文字消息
        if (params.message_type === 1 && params.data.message_type === 1) {
          let emojiReg = /\[\/[a-z]{2,9}\]/
          let msg = this.$store.state.room.roomMsgContent
          let reg = /\[\/[a-z]{2,9}\]/g
          let list2 = []
          if (emojiReg.test(msg)) {
            let list = msg.match(reg)
            list.map(e => {
              this.emojiList.map(i => {
                if (e.split('/')[1].split(']')[0] === i.text) {
                  list2.push(i.image)
                }
              })
            })
            for (let i = 0; i < list.length; i++) {
              msg = msg.replace(list[i], `<img src="${list2[i]}">`)
            }
          }
          let planeTicketReg = /nn:\/\/nnpd-\[nn_sup=[0-9]{1,}&room=[0-9]{1,}\]/
          let planeTicketReg2 = /nn:\/\/nnpd-\[nn_sup=[0-9]{1,}&room=[0-9]{1,}\]/g
          let list3 = []
          if (planeTicketReg.test(msg)) {
            let list4 = msg.match(planeTicketReg2)
            list4.map(e => {
              list3.push(e.split('nn://nnpd-[nn_sup=')[1].split('&')[0])
            })
            for (let i = 0; i < list4.length; i++) {
              msg = msg.replace(
                list4[i],
                `<span style="cursor:pointer">
                  <img src="${this.planeTicketHome}" class="plane-ticket-home" /><span class="plane-ticket-text">${list3[i]}</span>
                </span>`
              )
            }
          }
          let msgContent = {
            content: msg,
            sendTime: utils.timeStampToTime(params.data.timestamp),
            cloth: this.myClothType,
            message_type: 1,
            sendType: 1,
            ...this.$store.state.room.userInfo
          }
          let sendTarget = JSON.parse(
            JSON.stringify(this.$store.state.room.roomMsgTarget)
          )
          if (utils.judgeObj(sendTarget)) {
            msgContent.to_user = sendTarget
            msgContent.sendType = 11
          }
          this.$store.dispatch('setRoomMsgContent', '')
          this.allRoomChatList.push(msgContent)
          // this.showRoomChatList.push(msgContent)
        }
        // 我发送的语音消息
        if (params.message_type === 1 && params.data.message_type === 3) {
          let msgContent = {
            content: this.$store.state.room.roomMsgContent.content,
            sec: this.$store.state.room.roomMsgContent.sec,
            sendTime: utils.timeStampToTime(params.data.timestamp),
            cloth: this.myClothType,
            message_type: 3,
            voiceImg: this.voice_level[2],
            sendType: 1,
            ...this.$store.state.room.userInfo
          }
          let sendTargetImg = JSON.parse(
            JSON.stringify(this.$store.state.room.roomMsgTarget)
          )
          // console.log(sendTargetImg)
          if (utils.judgeObj(sendTargetImg)) {
            msgContent.to_user = sendTargetImg
            msgContent.sendType = 11
          }
          // console.log(msgContent)
          this.$store.dispatch('setRoomMsgContent', '')
          this.allRoomChatList.push(msgContent)
          // this.showRoomChatList.push(msgContent)
        }
        // 我发送的图片消息
        if (params.message_type === 1 && params.data.message_type === 2) {
          let msgContent = {
            content: this.$store.state.room.roomMsgContent,
            sendTime: utils.timeStampToTime(params.data.timestamp),
            cloth: this.myClothType,
            message_type: 2,
            sendType: 1,
            ...this.$store.state.room.userInfo
          }
          let sendTargetImg = JSON.parse(
            JSON.stringify(this.$store.state.room.roomMsgTarget)
          )
          // console.log(sendTargetImg)
          if (utils.judgeObj(sendTargetImg)) {
            msgContent.to_user = sendTargetImg
            msgContent.sendType = 11
          }
          // console.log(msgContent)
          this.$store.dispatch('setRoomMsgContent', '')
          this.allRoomChatList.push(msgContent)
          // this.showRoomChatList.push(msgContent)
        }
        // 别人发送的文字消息
        if (params.message_type === 2 && params.data.message_type === 1) {
          let content = params.data.content
          let emojiReg = /\[\/[a-z]{2,9}\]/

          let reg = /\[\/[a-z]{2,9}\]/g
          let list2 = []
          if (emojiReg.test(content)) {
            let list = content.match(reg)
            list.map(e => {
              this.emojiList.map(i => {
                if (e.split('/')[1].split(']')[0] === i.text) {
                  list2.push(i.image)
                }
              })
            })
            for (let i = 0; i < list.length; i++) {
              content = content.replace(list[i], `<img src="${list2[i]}">`)
            }
          }
          let planeTicketReg = /nn:\/\/nnpd-\[nn_sup=[0-9]{1,}&room=[0-9]{1,}\]/
          let planeTicketReg2 = /nn:\/\/nnpd-\[nn_sup=[0-9]{1,}&room=[0-9]{1,}\]/g
          let list3 = []
          if (planeTicketReg.test(content)) {
            let list4 = content.match(planeTicketReg2)
            list4.map(e => {
              list3.push(e.split('nn://nnpd-[nn_sup=')[1].split('&')[0])
            })
            for (let i = 0; i < list4.length; i++) {
              content = content.replace(
                list4[i],
                `<span style="cursor:pointer">
                  <img src="${this.planeTicketHome}" class="plane-ticket-home" />
                  <span class="plane-ticket-text">${list3[i]}</span>
                </span>`
              )
            }
          }
          params.data.content = content
          params.data.sendTime = utils.timeStampToTime(params.data.timestamp)
          this.getClothImg(
            params.data.from_user.role,
            params.data.from_user.gender,
            e => {
              params.data.cloth = e
            }
          )

          params.data.nickname = params.data.from_user.nickname
          params.data.avatar = params.data.from_user.avatar
          params.data.sendType = 2
          if (params.data.to_user) {
            params.data.sendType = 21
          }
          // console.log(params.data)
          this.allRoomChatList.push(params.data)
          // this.showRoomChatList.push(params.data)
        }
        // 别人发送的语音消息
        if (params.message_type === 2 && params.data.message_type === 3) {
          params.data.sendTime = utils.timeStampToTime(params.data.timestamp)
          this.getClothImg(
            params.data.from_user.role,
            params.data.from_user.gender,
            e => {
              params.data.cloth = e
            }
          )
          params.data.nickname = params.data.from_user.nickname
          params.data.avatar = params.data.from_user.avatar
          params.data.sec = params.data.extra.voice_duration
          params.data.voiceImg = this.voice_level[5]
          params.data.sendType = 2
          if (params.data.to_user) {
            params.data.sendType = 21
          }
          // console.log(params.data)
          this.allRoomChatList.push(params.data)
          // this.showRoomChatList.push(params.data)
        }
        // 别人发送的图片消息
        if (params.message_type === 2 && params.data.message_type === 2) {
          params.data.sendTime = utils.timeStampToTime(params.data.timestamp)
          this.getClothImg(
            params.data.from_user.role,
            params.data.from_user.gender,
            e => {
              params.data.cloth = e
            }
          )
          params.data.nickname = params.data.from_user.nickname
          params.data.avatar = params.data.from_user.avatar
          params.data.sendType = 2
          if (params.data.to_user) {
            params.data.sendType = 21
          }
          // console.log(params.data)
          this.allRoomChatList.push(params.data)
          // this.showRoomChatList.push(params.data)
        }
        this.allListToShowList()
      } else {
        this.$notify.error({
          title: '错误',
          message: params.msg,
          duration: 2000
        })
      }
    })
    // 有人进入了频道
    ipcRenderer.on('others-enter-room-success', (event, params) => {
      console.log('others-enter-room-success', params)
      console.log(this.$store.state.room.currentRoomInfo)
      if (params.code === 0) {
        if (
          params.data.sub_channel_id ===
          this.$store.state.room.currentRoomInfo.sub_channel_id
        ) {
          this.$store.dispatch('addRoomUserList', params.data.user)
          this.allRoomChatList.push(params)
          this.allListToShowList()
        }
        this.$store.dispatch('addRoomNumList', {
          id: params.data.sub_channel_id
        })
      }
    })
    // 有人进入了子频道
    ipcRenderer.on('others-enter-child-room-success', (event, params) => {
      console.log('others-enter-child-room-success', params)
      if (params.code === 0) {
        if (
          params.data.sub_channel_id ===
          this.$store.state.room.currentRoomInfo.sub_channel_id
        ) {
          this.$store.dispatch('addRoomUserList', params.data.user)
          this.allRoomChatList.push(params)
          this.allListToShowList()
        }
        if (
          params.data.prev_sub_channel_id ===
          this.$store.state.room.currentRoomInfo.sub_channel_id
        ) {
          this.$store.dispatch('reduceRoomUserList', params.data.user)
          this.allRoomChatList.push(params)
          this.allListToShowList()
        }
        this.$store.dispatch('addRoomNumList', {
          id: params.data.sub_channel_id
        })
        this.$store.dispatch('reduceRoomNumList', {
          id: params.data.prev_sub_channel_id
        })
      }
    })
    // 有人离开了频道
    ipcRenderer.on('others-leave-room-success', (event, params) => {
      console.log('others-leave-room-success', params)
      if (params.code === 0) {
        if (
          params.data.sub_channel_id ===
          this.$store.state.room.currentRoomInfo.sub_channel_id
        ) {
          this.$store.dispatch('reduceRoomUserList', params.data.user)
          this.allRoomChatList.push(params)
          this.allListToShowList()
        }
        this.$store.dispatch('reduceRoomNumList', {
          id: params.data.sub_channel_id
        })
      }
    })
    // 被添加到麦序
    ipcRenderer.on('add-to-microlist-success', (event, params) => {
      console.log('add-to-microlist-success', params)
      if (params.code === 0) {
      }
    })
    // 设置用户权限成功
    ipcRenderer.on('set-others-role-success', (event, params) => {
      console.log('set-others-role-success', params)
      if (params.code === 0) {
        if (params.message_type === 1) {
          // 回执消息
          console.log(this.setUserRole)
          if (this.setUserRole) {
            this.$store.dispatch('setCurrentRoomRoleInfo', this.setUserRole)
            this.treeItem.role = this.setUserRole.role
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
    // 设置用户禁止打字
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
            this.treeItem.word_forbid = !this.treeItem.word_forbid
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
    // 展示信息的处理
    allListToShowList () {
      if (this.allRoomChatList.length <= 50) {
        this.showMoreChatListBtn = false
        this.showRoomChatList = JSON.parse(JSON.stringify(this.allRoomChatList))
      } else {
        if (this.allRoomChatList.length > 200) {
          this.allRoomChatList.splice(0, this.allRoomChatList.length - 200)
        }
        if (!this.showMoreBtnIsClick) {
          this.showMoreBtnText = '查看更多记录'
          this.showMoreChatListBtn = true
          this.showRoomChatList = JSON.parse(
            JSON.stringify(this.allRoomChatList)
          )
          this.showRoomChatList.splice(0, this.allRoomChatList.length - 50)
        } else {
          this.showMoreBtnText = '隐藏聊天记录'
          this.showMoreChatListBtn = true
          this.showRoomChatList = JSON.parse(
            JSON.stringify(this.allRoomChatList)
          )
        }
      }
      console.group('----------------------')
      console.log(this.showRoomChatList)
      console.groupEnd()
    },
    // 点击查看更多记录
    showMoreTextListBtn () {
      this.showMoreBtnIsClick = !this.showMoreBtnIsClick
      if (this.showMoreBtnIsClick) {
        this.showMoreBtnText = '隐藏聊天记录'
        this.showMoreChatListBtn = true
        this.showRoomChatList = JSON.parse(JSON.stringify(this.allRoomChatList))
      } else {
        this.showMoreBtnText = '查看更多记录'
        this.showMoreChatListBtn = true
        this.showRoomChatList = JSON.parse(JSON.stringify(this.allRoomChatList))
        this.showRoomChatList.splice(0, this.allRoomChatList.length - 50)
      }
    },
    // 双击公屏内的头像
    chooseUserChat (item) {
      console.log(item)
      if (item.nn_id === remote.getGlobal('myNNID')) {
        return false
      }
      this.$emit('dblClickUser', item)
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

      // this.$set(item, 'onchoose', true)
      this.treeItem = item
      if (item.nickname === this.$store.state.room.userInfo.nickname) {
        this.popItems = [
          {
            txt: '个人信息'
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
                txt: item.role === 5 ? '取消子频道管理员' : '设为子频道管理员'
              },
              {
                txt: item.role === 4 ? '取消全频道管理员' : '设为全频道管理员'
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
        // 如果这个人在麦序上
        if (
          users &&
          users.some(e => {
            return e.user_id === item.nn_id
          })
        ) {
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
        _this.$emit('beExitRoom', _this.treeItem)
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
    // 获取马甲图片
    getClothImg (role, gender, fn) {
      let roleList = JSON.parse(
        JSON.stringify(this.$store.state.room.roomClothesList)
      )
      roleList.map(e => {
        if (e.id === role) {
          if (gender === 1) {
            fn(e.icon_male)
          } else if (gender === 2) {
            fn(e.icon_female)
          }
        }
      })
    },
    // 播放语音
    startAudioPlay (e, item) {
      if (e.target) {
        e.target.children[0].play()
      } else {
        e.children[0].play()
      }
      console.log(item)
      if (item.voiceImg === this.voice_level[2]) {
        let index = 0
        let timer = setInterval(() => {
          this.$set(item, 'voiceImg', this.voice_level[index])
          index++
          if (index === 3) {
            index = 0
          }
        }, 300)
        setTimeout(() => {
          clearInterval(timer)
          timer = null
          this.$set(item, 'voiceImg', this.voice_level[2])
        }, item.sec * 1000)
      } else if (item.voiceImg === this.voice_level[5]) {
        let index = 3
        let timer = setInterval(() => {
          this.$set(item, 'voiceImg', this.voice_level[index])
          index++
          if (index === 5) {
            index = 3
          }
        }, 300)
        setTimeout(() => {
          clearInterval(timer)
          timer = null
          this.$set(item, 'voiceImg', this.voice_level[5])
        }, item.sec * 1000)
      }
    },
    // 点到图片了
    startAudioPlayImg (e, item) {
      this.startAudioPlay(e.target.parentNode, item)
    },
    // 点到时间了
    startAudioPlaySpan (e, item) {
      this.startAudioPlay(e.target.parentNode, item)
    },
    // 语音转文字
    voiceToTextfunc (item) {
      if (item.text) {
        item.text = ''
        return
      }
      let url = item.content
      axios
        .post(baseURL.path + '/api/v1/util/voiceToWord', {
          voice_url: url
        })
        .then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$set(item, 'text', res.data.data.text)
          } else {
            this.$message.warning('语音转化失败!')
          }
        })
    },
    chooseChatInfo () {
      this.info_show = 'allpeople'
    },
    chooseManageChatInfo () {
      this.info_show = 'manager'
    }
  },
  components: {
    contextMenuRight,
    RoomBombUserInfo,
    RoomBombExitRoom
  },
  mounted () {
    // 点击的时候关闭右键菜单
    document.addEventListener('click', () => {
      this.mousePosition = ['close']
    })

    this.showRoomChatList = []
  }
}
</script>

<style lang="less" scoped>
.room-section-center-msg-info-wrap {
  // width: 100%;
  background-color: #f5f5f7;
  display: flex;
  flex-direction: column;
  .room-section-center-msg-info-header {
    height: 29px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    line-height: 29px;
    border-radius: 4px;
    span {
      width: 60px;
      display: inline-block;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: #999;
      line-height: 29px;

      &.onchoose {
        background-color: rgba(245, 245, 247, 1);
        font-size: 14px;
        color: #000;
      }
    }

    span:nth-child(1) {
      padding: 0 8px;
      cursor: context-menu;
    }

    span:nth-child(2),
    span:nth-child(3) {
      padding: 0 8px;
      border-radius: 2px;
      cursor: pointer;
    }

    span:last-child {
      margin-right: 20px;
    }
  }
  // 房间消息区域
  .room-section-center-msg-info-content {
    overflow-y: auto;
    flex: 1;
    cursor: context-menu;
    // 公告
    .room-section-center-msg-info-content-notice {
      margin: 20px 10px;
      word-break: break-all;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .room-section-center-msg-info-show-more {
      text-align: center;
      span {
        display: inline-block;
        border: 1px solid #ccc;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        border-radius: 5px;
        background-color: #fff;
        padding: 0 10px;
        line-height: 30px;
        height: 30px;
      }
    }
    // 我发送的消息
    .room-section-center-msg-info-content-sendByMyself {
      // 消息时间
      .room-section-center-msg-info-content-sendTime {
        text-align: center;
        margin-top: 10px;
      }
      // @别人时  "对" 的样式
      .towards {
        display: inline-block;
        box-sizing: border-box;
        padding: 9px 10px 0 0;
        font-size: 13px;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
      }
      // 消息
      .room-section-center-msg-info-content-sendInfo {
        width: 100%;
        text-align: right;
        // 用户信息
        .room-section-center-msg-info-content-user {
          margin: 5px 10px;
          // 马甲
          img {
            width: 16px;
            height: 16px;
          }
        }
        // 消息区域
        .room-section-center-msg-info-content-content {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
          // 显示更多的按钮的样式

          // 发送的语音消息
          .room-section-center-msg-info-content-audio {
            display: inline-block;
            width: 123px;
            height: 40px;
            margin-right: 10px;
            margin-top: 16px;
            background-color: #38eeb1;
            border-radius: 30px 0px 30px 30px;
            cursor: pointer;
            .audioTime {
              display: inline-block;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              margin-right: 15px;
              margin-top: 10px;
            }
            .voice_img {
              width: 20px;
              height: 20px;
              margin-top: -5px;
            }
            .voiceToText {
              width: 20px;
              height: 20px;
              margin-right: 30px;
              margin-top: -4px;
            }
          }
          // 头像
          .room-section-center-msg-info-content-avatar {
            height: 32px;
            border-radius: 50%;
            margin-right: 10px;
          }
          // 消息内容
          .msg_content {
            display: inline-block;
            text-align: left;
            padding: 10px;
            max-width: 500px;
            padding: 10px 15px 10px 18px;
            line-height: 20px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            border-radius: 30px 0px 30px 30px;
            color: #000000;
            background-color: #38eeb1;
            margin-right: 10px;
            margin-top: 16px;
            word-break: break-all;
          }
          // 发送的图片消息
          .room-section-center-msg-info-content-sendIMG {
            // min-width: 20px;
            max-width: 300px;
            max-height: 600px;
            margin-right: 10px;
          }
        }
        // 语音转换文字区域
        .voiceToTextContent,
        .voiceToTextContentToSomeone {
          display: inline-block;
          padding: 10px;
          max-width: 500px;
          padding: 10px;
          line-height: 20px;
          font-size: 13px;
          font-family: MicrosoftYaHei;
          color: rgba(48, 48, 51, 1);
          background-color: #38eeb1;

          border-radius: 20px;
          text-align: left;
        }
        .voiceToTextContent {
          margin-right: 52px;
        }
        // 语音转文字单聊消息
        .voiceToTextContentToSomeone {
          margin-right: 117px;
        }
      }
    }
    // 别人发送的消息
    .room-section-center-msg-info-content-sendByOthers {
      // 消息时间
      .room-section-center-msg-info-content-sendTime {
        text-align: center;
      }
      // @别人时  "对" 的样式
      .towards {
        display: inline-block;
        box-sizing: border-box;
        padding: 9px 0 0 10px;
        font-size: 13px;
        font-size: 13px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
      }
      // 消息
      .room-section-center-msg-info-content-sendInfo {
        width: 100%;
        text-align: left;
        // 用户信息
        .room-section-center-msg-info-content-user {
          margin-left: 10px;
          // 马甲
          img {
            width: 16px;
            height: 16px;
          }
        }
        // 消息区域
        .room-section-center-msg-info-content-content {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 10px;
          // 接受的语音消息
          .room-section-center-msg-info-content-audio {
            display: inline-block;
            width: 123px;
            height: 40px;
            margin-left: 10px;
            margin-top: 16px;
            background: rgba(255, 255, 255, 1);
            border-radius: 0 30px 30px 30px;
            cursor: pointer;
            .audioTime {
              display: inline-block;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              margin-left: 15px;
              margin-top: 10px;
            }
            .voice_img {
              width: 20px;
              height: 20px;
              margin-top: -5px;
              margin-left: 10px;
            }
            .voiceToText {
              width: 20px;
              height: 20px;
              margin-left: 110px;
              margin-top: -37px;
            }
          }
          // 头像
          .room-section-center-msg-info-content-avatar {
            margin-left: 10px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }
          // 消息内容
          .msg_content {
            display: inline-block;
            margin-left: 10px;
            margin-top: 16px;
            padding: 10px;
            max-width: 500px;
            padding: 10px 15px 10px 18px;
            line-height: 20px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            border-radius: 0 30px 30px 30px;
            background: rgba(255, 255, 255, 1);
            font-size: 13px;
            font-family: MicrosoftYaHei;
            color: rgba(48, 48, 51, 1);
            word-break: break-all;
          }
          // 发送的图片消息
          .room-section-center-msg-info-content-sendIMG {
            // min-width: 20px;
            max-width: 300px;
            max-height: 600px;
            margin-left: 10px;
            margin-top: 10px;
          }
        }
        // 语音转换文字区域
        // 语音转文字单聊消息
        .voiceToTextContent,
        .voiceToTextContentToSomeone {
          display: inline-block;
          padding: 10px;
          max-width: 500px;
          padding: 10px;
          line-height: 20px;
          font-size: 13px;
          font-family: MicrosoftYaHei;
          color: rgba(48, 48, 51, 1);
          background: rgba(255, 255, 255, 1);

          border-radius: 20px;
        }
        .voiceToTextContent {
          margin: 0 0 10px 52px;
        }
        // 语音转文字单聊消息
        .voiceToTextContentToSomeone {
          margin: 0 0 10px 117px;
        }
      }
    }
    // 进入房间提示
    .room-section-center-msg-info-content-enterMessage {
      p {
        margin: 20px 0;
        display: flex;
        align-items: center;
        cursor: context-menu;
        img {
          margin: 0 15px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .user_nickname {
          margin: 0 10px;
          font-size: 14px;
          color: #4e4afc;
        }
      }
    }
  }
}
</style>