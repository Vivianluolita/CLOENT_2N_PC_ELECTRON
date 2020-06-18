<template>
  <div class="im-window-warp">
    <!-- 聊天窗口 -->
    <div class="window" v-bind:class="{ miniWindow: mode === 'mini' }">
      <!-- 左侧边栏 -->
      <div class="container-bar" key="1">
        <!-- 小把手 -->
        <div
          v-bind:class="{
            container: true,
            expand: mode === 'mini' ? false : true
          }"
        >
          <el-badge :is-dot="unreadCountTotal?true:false" class="item" v-show="status != 'msg'">
            <el-image :fit="fit" :src="url_msg" @click="toggle('active-msg')" class="icon icon-1"></el-image>
          </el-badge>
          <el-badge :is-dot="unreadCountTotal?true:false" class="item" v-show="status === 'msg'">
            <el-image :fit="fit" :src="url_msg_active" @click="toggle('mini')" class="icon icon-1"></el-image>
          </el-badge>
          <div class="hr"></div>
          <el-badge :is-dot="isRequest" class="item" v-show="status != 'contact'">
            <el-image
              :fit="fit"
              :src="url_contact"
              @click="toggle('active-contact')"
              class="icon icon-2"
            ></el-image>
          </el-badge>
          <el-badge :is-dot="isRequest" class="item" v-show="status === 'contact'">
            <el-image
              :fit="fit"
              :src="url_contact_active"
              @click="toggle('mini')"
              class="icon icon-2"
            ></el-image>
          </el-badge>
        </div>
      </div>
      <!-- 右侧主窗体 -->
      <div class="container-body" key="2" v-show="mode != 'mini'">
        <!-- 顶部搜索栏-msg -->
        <div class="top" v-show="status === 'msg'">
          <div class="search-container-msg">
            <el-input
              @input="onSearch"
              class="top-search"
              placeholder="搜索最近联系人"
              size="mini"
              suffix-icon="el-icon-search"
              v-model="search_words_chat"
              v-on:keyup.native.delete="onSearch"
            ></el-input>
          </div>
        </div>
        <!-- 顶部搜索栏-contact -->
        <div class="top" v-show="status === 'contact'">
          <div class="search-container-contact">
            <el-input
              @input="onSearchContact"
              class="top-search"
              placeholder="搜索好友"
              size="mini"
              suffix-icon="el-icon-search"
              v-model="search_words_contact"
              v-on:keyup.native.enter="onSearchContact"
            ></el-input>
          </div>
          <el-image
            :fit="fit"
            :src="url_search_user_btn"
            @click="onUserSeartchBtnClick"
            class="icon-search-user"
          ></el-image>
        </div>
        <!-- 顶部搜索栏-search -->
        <div class="top" v-show="status === 'search'">
          <el-image
            :fit="fit"
            :src="url_back_btn"
            @click="onBackBtnClick"
            class="icon-back-contact"
          ></el-image>
          <div class="search-container-search">
            <el-input
              class="top-search"
              placeholder="昵称/ID"
              size="mini"
              suffix-icon="el-icon-search"
              v-model="search_user_words"
              v-on:keyup.native.enter="onSearchUser"
            ></el-input>
          </div>
        </div>
        <!-- 最近会话列表容器 -->
        <div class="contact-list-container" v-show="status === 'msg'">
          <div class="msg-default" v-show="chat_box.length == []">
            <div class="msg-default-img">
              <el-image :fit="fit" :src="url_msg_default" style="width: 162px; height: 132px;"></el-image>
            </div>
            <div class="msg-default-info-1">消息列表为空</div>
            <div class="msg-default-info-2">快去找小姐姐聊聊天吧</div>
          </div>
          <div
            :key="item.id"
            @click="click2Chat(item)"
            @contextmenu="e => span_oncontextmenu(item, e, 'chat')"
            class="contact-list"
            v-for="item in chat_box"
            v-show="chat_box != []"
          >
            <div class="container-left">
              <el-badge :value="!item.unread_count?'':item.unread_count" class="item">
                <el-image :fit="fit" :src="item.avatar" class="avatar"></el-image>
              </el-badge>
            </div>
            <div class="container-right">
              <div class="right-top">
                <div
                  :title="item.remark"
                  class="nick-name nn-text-overflow"
                >{{ item.friend_info?item.friend_info.friend_remark: item.nickname }}</div>
                <div class="chat-date">
                  <span>{{ item.time }}</span>
                </div>
              </div>
              <div class="right-footer nn-text-overflow">
                <span>{{ item.last_msg }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 联系人列表容器 -->
        <div class="contact-list-container" v-show="status === 'contact'">
          <!-- 折叠面板 -->
          <el-collapse
            @change="handleChange"
            class="nn-im-mainwinow nn-collapse"
            v-model="activePanels"
          >
            <el-collapse-item name="1" title="新的朋友">
              <div
                :key="item.id"
                class="contact-list"
                v-for="item in new_contact_box"
                v-show="new_contact_box != []"
              >
                <div class="container-left">
                  <el-image :fit="fit" :src="item.avatar" class="avatar"></el-image>
                </div>
                <div class="container-right">
                  <div class="right-top">
                    <div
                      :title="item.nickname"
                      class="nick-name nn-text-overflow"
                    >{{ item.friend_info?item.friend_info.friend_remark: item.nickname }}</div>
                    <div class="chat-date">
                      <el-image
                        :fit="fit"
                        :src="src_icon_ignore"
                        @click.stop="onIgnoreBtnClick(item.nn_id)"
                        style="width: 15px; height: 15px;top: -16px;margin-left: 37px;"
                      ></el-image>
                    </div>
                  </div>
                  <div class="right-footer">
                    <span>请求添加你为好友</span>
                    <el-button
                      @click="agreeFriendsRequest(item.nn_id)"
                      round
                      size="mini"
                      style="float: right; margin-right: 10px;"
                      type="primary"
                    >同意</el-button>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div
            style="width: 100%; height: 40px; background-color: #f0f0f0;font-size: 14px;line-height: 40px;padding-left: 10px;font-weight: 500;color: #999999; cursor: ponter;margin-top: 1px;margin-bottom: 1px;"
          >
            <span>联系人</span>
          </div>
          <div style="width: 100%; height: calc(100vh - 203px); background-color:#fff;">
            <!-- 缺省页 -->
            <div class="msg-default" v-if="contact_box.length == []">
              <div class="msg-default-img">
                <el-image
                  :fit="fit"
                  :src="url_user_search_default"
                  style="width: 162px; height: 132px;"
                ></el-image>
              </div>
              <div class="msg-default-info-1">未搜索到该用户</div>
              <div class="msg-default-info-2">去房间里找找吧</div>
            </div>
            <div v-show="contact_box.length != []">
              <div
                :key="item.id"
                @click="onFriendClick(item)"
                @contextmenu="e => span_oncontextmenu(item, e, 'friend')"
                class="contact-list"
                v-for="item in contact_box"
                v-show="contact_box != []"
              >
                <div class="container-left">
                  <el-image :fit="fit" :src="item.avatar" class="avatar"></el-image>
                </div>
                <div class="container-right">
                  <div class="right-top">
                    <div
                      :title="item.remark"
                      class="nick-name nn-text-overflow"
                    >{{ item.friend_info?item.friend_info.friend_remark: item.nickname}}</div>
                    <div class="chat-date">
                      <span>{{ item.nn_id }}</span>
                    </div>
                  </div>
                  <div class="right-footer">
                    <span>{{ item.intro?item.intro:'' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--搜索好友结果列表容器 -->
        <div class="contact-list-container" v-show="status === 'search'">
          <!-- 缺省页 -->
          <div class="msg-default" v-show="user_search_res_box.length == []">
            <div class="msg-default-img">
              <el-image
                :fit="fit"
                :src="url_user_search_default"
                style="width: 162px; height: 132px;"
              ></el-image>
            </div>
            <div class="msg-default-info-1">未搜索到该用户</div>
            <div class="msg-default-info-2">去房间里找找吧</div>
          </div>
          <div class="seatch-res-info" v-show="user_search_res_box.length != []">
            <p>为你找到 {{ user_search_count }} 位相关用户</p>
          </div>
          <div
            :key="item.id"
            @click="onSearchedUserClick(item)"
            class="contact-list"
            v-for="item in user_search_res_box"
            v-show="user_search_res_box.length != []"
          >
            <div class="container-left">
              <el-image :fit="fit" :src="item.avatar" class="avatar"></el-image>
            </div>
            <div class="container-right">
              <div class="right-top">
                <div
                  :title="item.nickname"
                  class="nick-name nn-text-overflow"
                >{{ (item.friend_info)?item.friend_info.friend_remark: item.nickname }}</div>
              </div>
              <div class="right-footer">
                <span>ID {{ item.nn_id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 用户详情弹窗 -->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="userDetailVisible"
      class="searched-user-detail"
      width="340px"
    >
      <div class="searched-user-detail-container">
        <div class="top">
          <!-- 用户头像 -->
          <el-image
            :fit="fit"
            :src="user_detail.avatar ? user_detail.avatar : avatar_demo"
            style="float: left;width: 50px; height: 50px;border-radius: 25px;"
          ></el-image>
          <div style="width: calc(100% - 70px); height: 50px;float: left;margin-left: 20px;">
            <div style="width: 100%;height: 30px;">
              <!-- 昵称 -->
              <span style="font-size: 14px; line-height: 14px;color: #333;">
                {{
                user_detail.friend_info&&user_detail.friend_info.friend_remark ? user_detail.friend_info.friend_remark : user_detail.nickname
                }}
              </span>
            </div>
            <div style="width: 100%;height: 20px;">
              <!-- NN ID -->
              <span
                style="font-size: 12px; color: #999999;"
              >ID {{ user_detail.nn_id ? user_detail.nn_id : '' }}</span>
              &nbsp;
              <!-- 性别 -->
              <span style="font-size: 12px; color: #999999;">
                {{
                user_detail.gender === 1 ? '男' : '女'
                }}
              </span>
              &nbsp;
              <!-- 星座 -->
              <span style="font-size: 12px; color: #ccc;">
                {{
                user_detail.birthday | xingzuo
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="sign">
          <!-- 签名 -->
          <p>
            {{
            user_detail.intro
            ? user_detail.intro
            : '这个人很懒，什么也没有留下。'
            }}
          </p>
        </div>
        <div class="info">
          <!-- 备注名 -->
          <span
            style="font-szie:14px; color: #666;line-height: 30px;"
            v-show="user_detail.friend_info"
          >备注名</span>
          &nbsp;&nbsp;
          <span
            style="font-szie:14px; color: #333;line-height: 20px;"
            v-show="user_detail.friend_info && !editMarkNameMode"
          >
            {{
            user_detail.friend_info
            ? user_detail.friend_info.friend_remark
            : user_detail.nickname
            }}
          </span>
          <i
            @click="editRemarkName"
            class="el-icon-edit"
            style="cursor: pointer;"
            v-show="!editMarkNameMode && user_detail.friend_info"
          ></i>
          <el-input
            maxlength="15"
            minlength="1"
            show-word-limit
            size="mini"
            style="width: 170px;"
            v-model="edit_remark_name"
            v-show="editMarkNameMode"
          ></el-input>&nbsp;
          <el-button @click="updateRemarkName" size="mini" type="text" v-show="editMarkNameMode">保存</el-button>
          <el-button
            @click="cancelRemarkName"
            size="mini"
            style="margin-left: 0;"
            type="text"
            v-show="editMarkNameMode"
          >取消</el-button>
          <br />
          <!-- 昵称 -->
          <span style="font-szie:14px; color: #666;">昵称&nbsp;&nbsp;&nbsp;</span>
          &nbsp;&nbsp;
          <span
            style="font-szie:14px; color: #333;"
          >{{ user_detail.nickname ? user_detail.nickname : '' }}</span>
          <br />
          <!-- 地区 -->
          <span style="font-szie:14px; color: #666;">地区&nbsp;&nbsp;&nbsp;</span>
          &nbsp;&nbsp;
          <span style="font-szie:14px; color: #333;">
            {{ user_detail.region1 ? user_detail.region1 : '' }}
            {{ user_detail.region2 ? user_detail.region2 : '' }}
          </span>
          <br />
          <!-- ID -->
          <span style="font-szie:14px; color: #666;">ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          &nbsp;&nbsp;
          <span
            style="font-szie:14px; color: #333;"
          >{{ user_detail.nn_id ? user_detail.nn_id : '' }}</span>
          <br />
        </div>
        <div class="footer">
          <el-button
            @click="onDelFriend(user_detail.nn_id)"
            class="user-detail-btn-add"
            size="mini"
            style="width: 120px;"
            type="danger"
            v-show="user_detail.friend_info"
          >删除好友</el-button>
          <el-button
            @click="addFriend(user_detail.nn_id)"
            class="user-detail-btn-add"
            size="mini"
            style="width: 120px;"
            type="primary"
            v-show="!user_detail.friend_info"
          >添加好友</el-button>&nbsp;&nbsp;&nbsp;
          <el-button
            @click="click2Chat(user_detail)"
            class="user-detail-btn-msg"
            size="mini"
            style="width: 120px;"
            type="info"
          >发消息</el-button>
        </div>
      </div>
    </el-dialog>
    <contextMenuRight
      :mouse="mousePosition"
      :pop-items="popItems"
      @ListItemClick="contextMenuItemClick"
    />
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { Storage } from '../../../../main/db/dbStore'
// eslint-disable-next-line node/no-deprecated-api
import { log } from 'util'
import utils from '../../../utils/util.js'
import contextMenuRight from '../../room/contextMenu/contextMenu'
const AVATAR_DEMO_SRC =
  'https://static.nn.com/image/2019/11/4/10/5/36/fc9dd6f91da9543f493677fe0db1c63f.png'
export default {
  data () {
    return {
      // im面板显示模式
      mode: 'mini',
      // 窗口状态 会话状态：msg, 联系人列表状态：contact,搜索-添加好友状态：search
      status: '',
      // 图片自适应模式
      fit: 'fill',
      // 会话icon
      url_msg: require('@/components/im/imgs/msg.png'),
      // 会话icon 激活
      url_msg_active: require('@/components/im/imgs/msg-active.png'),
      // 联系人icon
      url_contact: require('@/components/im/imgs/contact.png'),
      // 联系人icon 激活
      url_contact_active: require('@/components/im/imgs/contact-active.png'),
      // 输入的会话搜索关键词
      search_words_chat: '',
      // 输入的好友搜索关键词
      search_words_contact: '',
      // 示例图像
      avatar_demo:
        'https://static.nn.com/image/2019/11/4/10/5/36/fc9dd6f91da9543f493677fe0db1c63f.png',
      // 搜索用户的关键词
      search_user_words: '陈',
      // 搜索用户返回的结果数量
      user_search_count: 0,
      // 会话列表数据
      chat_box: [],
      // {
      //   id: 1,
      //   avatar: AVATAR_DEMO_SRC,
      //   time: '11:08',
      //   last_msg: '啥时候一起去撸串儿？',
      //   nickname: '陈二饼'
      // }
      // 会话列表数据副本
      _chat_box: [],
      // 联系人列表数据
      contact_box: [],
      /*
      {
        id: 1,
        avatar: AVATAR_DEMO_SRC,
        time: '11:08',
        sign: '喝最烈的酒，日最野的狗。',
        nn_id: '87898',
        nickname: '陈二饼'
      }
      */
      // 联系人列表数据副本
      _contact_box: [],
      // 新的朋友数据
      new_contact_box: [],
      /*
      {
        id: 1,
        avatar: AVATAR_DEMO_SRC,
        time: '15:08',
        sign: '来世做春风，潇洒又自由。',
        nn_id: '12222',
        nickname: '陈四饼'
      }
      */
      // 搜索用户返回的结果
      user_search_res_box: [],
      /*
      {
        id: 1,
        avatar: AVATAR_DEMO_SRC,
        time: '15:08',
        sign: '来世做春风，潇洒又自由。',
        nn_id: '12222',
        nickname: '陈四饼'
      },
      */
      // 搜索用户按钮图片
      url_search_user_btn: require('@/components/im/imgs/search-friend-btn-2x.png'),
      // 返回联系人列表按钮
      url_back_btn: require('@/components/im/imgs/back-2x.png'),
      // 会话列表缺省页图片
      url_msg_default: require('@/components/im/imgs/default-msg-2x.png'),
      // 搜索用户缺省页面图片
      url_user_search_default: require('@/components/im/imgs/default-no-sear-result.png'),
      // 展开的面板
      activePanels: ['1'],
      // 用户详情页面显示标识
      userDetailVisible: false,
      // 用户详情数据
      user_detail: {
        nn_id: 10026,
        special_nn_id: 0,
        nickname: '用户8',
        avatar: '609d1a246451c88f179b6e4033ccdf8.png',
        gender: 0,
        intro: '这个人太懒了....',
        birthday: '2014-11-17',
        region1: '',
        region2: '',
        friend_verification_type: 1,
        friend_info: {
          friend_remark: '备注',
          friend_from: 1
        }
      },
      // 修改备注功能启用标识
      editMarkNameMode: false,
      // 编辑的备注名
      edit_remark_name: '',
      // 当前选中右键菜单信息
      currentContextmenuItem: {},
      // 右键菜单的位置
      mousePosition: [],
      // 右键菜单的选项
      popItems: [],
      contextMenuMode: 'chat',
      // 忽略角标
      src_icon_ignore: require('@/components/im/imgs/icon-close.png'),
      unreadCountTotal: 0, // 新消息
      isRequest: false, // 新好友
      newMegNum: ''
    }
  },
  components: {
    // 右键菜单
    contextMenuRight
  },
  computed: {
    // 用户token
    token () {
      return this.$store.state.public.token
    }
  },
  watch: {
    // 如果token发生改变，视作用户登出行为
    token: function (newVal, oldVal) {
      this.NN_IM_LOG('token变化', newVal + oldVal)
      this.handleLoginOut()
      if (!newVal) {
        this.isRequest = false
        this.unreadCountTotal = 0
      } else {
        // 刷新会话列表
        this.refreshChatList()
        // 刷新好友列表
        this.refreshFriendList()
        // 刷新新的好友列表
        let data = {
          type: 1,
          is_deal_with: false,
          limit: 100
        }
        this.new_contact_box = []
        ipcRenderer.send('im-new-friends-list', data)
      }
    }
  },
  mounted () {
    // 处理右键菜单关闭逻辑
    this.handleContextMenuClose()
  },
  methods: {
    // 登出逻辑
    handleLoginOut () {
      console.log('用户登出')
      // 关闭所有的聊天窗口
      ipcRenderer.send('im-close-all-chat-winodw')
      // 最小化im窗口
      this.mode = 'mini'
    },
    // 点击的时候关闭右键菜单
    handleContextMenuClose () {
      document.addEventListener('click', () => {
        this.mousePosition = ['close']
      })
    },
    // 会话/好友点击切换事件
    toggle (val) {
      // 每次点击小把手时判断登录状态 未登录时提示用户去登陆 已登录时初始化ws
      let token = this.$store.state.public.token
      if (token) {
        switch (val) {
          case 'mini':
            if (this.mode === 'mini') {
              this.mode = 'big'
              console.info('big mode')
            } else {
              this.mode = 'mini'
            }
            break
          // 打开会话
          case 'active-msg':
            this.mode = 'big'
            this.status = 'msg'
            break
          // 打开联系人
          case 'active-contact':
            this.mode = 'big'
            this.status = 'contact'
            break
          default:
            break
        }
        // 聊天面板展开时 刷新列表信息
        if (this.mode === 'big') {
          // 刷新会话列表
          this.chat_box = []
          this._chat_box = []
          ipcRenderer.send('im-chat-list', {})
          // 刷新好友列表
          this.contact_box = []
          this._contact_box = []
          ipcRenderer.send('im-friends-list', {})
          // 刷新新的好友列表
          this.refreshFriendList()
        }
      } else {
        this.NN_MSG('你似乎还没有登录，请先登录吧', 'info')
        this.NN_IM_LOG('token不存在，用户未登录')
      }
    },
    // 查看用户详情
    showUserDetail (id) {
      let data = {
        id: id
      }
      ipcRenderer.send('user-detail', data)
    },
    // 搜索会话
    onSearch () {
      let keyword = this.search_words_chat
      if (keyword.trim() !== '') {
        let arr = []
        this.chat_box.forEach(item => {
          if (item.nickname.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            arr.push(item)
          }
        })
        this.chat_box = arr
      } else {
        this.chat_box = this._chat_box
      }
    },
    // 搜索好友列表
    onSearchContact () {
      let keyword = this.search_words_contact
      if (keyword.trim() !== '') {
        let arr = []
        this.contact_box.forEach(item => {
          if (item.nickname.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            arr.push(item)
          }
        })
        this.contact_box = arr
        // 收起新的好友列表
        this.activePanels = []
      } else {
        this.contact_box = this._chat_box
      }
    },
    // 搜索用户
    onSearchUser () {
      // TODO 输入内容校验
      // 封装参数
      let data = {
        keyword: this.search_user_words,
        limit: 100,
        page: 1
      }
      this.user_search_count = 0
      ipcRenderer.send('user-search', data)
    },
    // 搜索用户按钮点击事件
    onUserSeartchBtnClick () {
      this.status = 'search'
      // 重置搜索框状态
      this.user_search_res_box = []
      this.search_user_words = ''
    },
    // 搜索用户面板返回按钮
    onBackBtnClick () {
      this.status = 'contact'
    },
    // 面板折叠事件
    handleChange (val) {
      if (val.toString().indexOf(1) > -1) {
        // 新的好友展开 刷新的好友列表
        console.log('refresh new friends')
        let data = {
          type: 1,
          is_deal_with: false,
          limit: 100
        }
        this.new_contact_box = []
        ipcRenderer.send('im-new-friends-list', data)
      }
    },
    // 打开聊天窗口
    click2Chat (item) {
      // TODO 调用已读接口 将该会话设为已读
      // 获取当前登录用户信息
      let userInfo = this.$store.state.public.publicUserInfo
      if (userInfo) {
        let url =
          window.location.href + `im?chatterInfo=${JSON.stringify(item)}`
        url += `&userInfo=${JSON.stringify(userInfo)}`
        let data = {
          id: item.nn_id,
          remark: item.friend_info
            ? item.friend_info.friend_remark
            : item.nickname,
          url: url
        }
        ipcRenderer.send('show-chat-window', data)
        this.unreadCountTotal -= item.unread_count
        item.unread_count = ''
        this.NN_IM_LOG('打开聊天窗口，参数', data)
      } else {
        this.NN_MSG('你似乎还没登录，请先登录', 'info')
      }
    },
    // 删除会话
    onDelChat (id) {
      ipcRenderer.send('im-del-chat', { nn_id: id })
    },
    // 搜索到的用户列表点击事件
    onSearchedUserClick (item) {
      this.showUserDetail(item.nn_id)
    },
    // 打开用户详情窗口
    openUserDetailWindow () {
      this.userDetailVisible = true
    },
    // 关闭用户详情弹窗前
    handleClose (done) {
      this.editMarkNameMode = false
      done()
    },
    // 好友列表点击事件
    onFriendClick (item) {
      this.showUserDetail(item.nn_id)
    },
    // 发送添加好友请求
    addFriend (id) {
      ipcRenderer.send('im-send-add-friend-msg', { nn_id: id })
      this.userDetailVisible = false
    },
    // 删除好友点击事件
    onDelFriend (id) {
      // 确认弹窗
      this.$confirm('是否删除该好友?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteFriend(id)
        })
        .catch(() => {
          console.log('取消删除好友')
        })
    },
    // 删除好友
    deleteFriend (id) {
      ipcRenderer.send('im-del-friend', { nn_id: id })
      this.userDetailVisible = false
    },
    // 同意添加好友
    agreeFriendsRequest (id) {
      ipcRenderer.send('im-agree-add-friend', { nn_id: id })
    },
    // 忽略好友请求
    onIgnoreBtnClick (id) {
      ipcRenderer.send('im-ignore-add-friend', { nn_id: id })
    },
    // 修改备注名
    editRemarkName () {
      this.editMarkNameMode = true
      console.log(this.user_detail.nickname)
      this.edit_remark_name =
        this.user_detail.friend_info &&
        this.user_detail.friend_info.friend_remark
          ? this.user_detail.friend_info.friend_remark
          : this.user_detail.nickname
    },
    // 保存修改的备注名
    updateRemarkName () {
      if (this.edit_remark_name.trim() !== '') {
        let data = {
          friend_id: this.user_detail.nn_id,
          remark: this.edit_remark_name
        }
        ipcRenderer.send('im-update-friend-remark', data)
      } else {
        this.NN_MSG('备注名不能为空', 'info')
      }
    },
    // 取消编辑备注名
    cancelRemarkName () {
      this.editMarkNameMode = false
    },
    // 点击右键菜单中的选项
    contextMenuItemClick (index) {
      var _this = this
      // 会话
      if (this.contextMenuMode === 'chat') {
        switch (index) {
          case 0:
            this.click2Chat(this.currentContextmenuItem)
            break
          case 1:
            this.showUserDetail(this.currentContextmenuItem.nn_id)
            break
          case 2:
            if (this.popItems.length === 4) {
              this.addFriend(this.currentContextmenuItem.nn_id)
            } else {
              this.onDelChat(this.currentContextmenuItem.nn_id)
            }
            break
          case 3:
            this.onDelChat(this.currentContextmenuItem.nn_id)
            break
        }
      } else {
        // 好友
        switch (index) {
          case 0:
            this.click2Chat(this.currentContextmenuItem)
            break
          case 1:
            this.showUserDetail(this.currentContextmenuItem.nn_id)

            break
          case 2:
            this.onDelFriend(this.currentContextmenuItem.nn_id)
            break
        }
      }
    },
    // 打开右键菜单
    span_oncontextmenu (item, e, type) {
      if (type === 'chat') {
        // 会话列表点击右键
        this.contextMenuMode = 'chat'
        if (!item.isFriend) {
          this.popItems = [
            {
              txt: '发送消息'
            },
            {
              txt: '查看信息'
            },
            {
              txt: '添加好友'
            },
            {
              txt: '删除会话'
            }
          ]
        } else {
          this.popItems = [
            {
              txt: '发送消息'
            },
            {
              txt: '查看信息'
            },
            {
              txt: '删除会话'
            }
          ]
        }
      } else {
        // 好友列表点击右键
        this.contextMenuMode = 'friend'
        this.popItems = [
          {
            txt: '发送消息'
          },
          {
            txt: '查看信息'
          },
          {
            txt: '删除好友'
          }
        ]
      }
      this.$set(item, 'onchoose', true)
      this.currentContextmenuItem = item
      // console.log('this.user_detail=', this.user_detail)
      // console.log('item=', item)
      this.user_detail = {
        nn_id: item.nn_id,
        special_nn_id: '',
        nickname: item.nickname,
        avatar: item.avatar,
        gender: item.gender,
        intro: item.intro,
        birthday: 'xxxx-xx-xx',
        region1: item.region1,
        region2: item.region2,
        friend_verification_type: 1,
        friend_info: {
          friend_remark: item.remark,
          friend_from: 1
        }
      }
      let x = e.pageX
      let y = e.pageY
      let clientY =
        document.documentElement.clientHeight || document.body.clientHeight
      if (clientY - e.pageY <= 250) {
        y = clientY - 260
      }
      this.mousePosition = [x, y]
    },
    // 刷新好友列表
    refreshFriendList () {
      this.contact_box = []
      this._contact_box = []
      ipcRenderer.send('im-friends-list', {})
    },
    // 刷新会话列表
    refreshChatList () {
      this.chat_box = []
      this._chat_box = []
      ipcRenderer.send('im-chat-list', {})
    },
    // 刷新新的好友列表
    refreshNewFriendList () {
      let data = {
        type: 1,
        is_deal_with: false,
        limit: 100
      }
      this.new_contact_box = []
      ipcRenderer.send('im-new-friends-list', data)
    },
    // 处理语音通话请求
    handleCall (params) {
      // let _params = {
      //   friend: {
      //     avatar:
      //       'https://static.nn.com/image/2019/11/1/18/0/14/7216446a42c4351442264b5bccb6a97a.png',
      //     gender: 1,
      //     is_guest: false,
      //     nickname: '陈二饼',
      //     nn_id: 100575
      //   },
      //   friend_from: 5,
      //   status: 1
      // }
      // 收到语音电话请求的广播后 唤醒语音电话窗口
      // 获取当前登录用户信息
      let userInfo = this.$store.state.public.publicUserInfo
      let chatterInfo = {
        avatar: params.friend.avatar,
        friend_info: {
          friend_remark: params.friend.nickname
        },
        friend_verification_type: 1,
        gender: 1,
        last_msg: '',
        nickname: params.friend.nickname,
        nn_id: params.friend.nn_id,
        special_nn_id: 0,
        time: '15:39',
        unread_count: 0
      }
      // =======================================
      let url = ' http://' + window.location.host + '/#/phone'
      url += `?userInfo=${JSON.stringify(userInfo)}`
      url += `&chatterInfo=${JSON.stringify(chatterInfo)}`
      // isCaller: 是否是拨打电话的窗口 为false时表示接听电话的窗口
      url += `&isCaller=false`
      let data = {
        userId: userInfo.nn_id,
        chatterId: this.currentWindowId,
        remark: chatterInfo.nickname,
        url: url
      }
      ipcRenderer.send('show-voice-call-window', data)
      this.NN_IM_LOG('接收到电话请求 打开电话窗口，参数', data)
      this.NN_IM_LOG('window.location.href=', window.location.href)
      // =======================================a)
    },
    // 挂断电话或者拒接电话
    handleHangup (params) {
      this.NN_IM_LOG('TODO 处理挂断电话的逻辑')
    }
  },
  created () {
    /* hppt请求结果的回调 */
    // 搜索用户
    ipcRenderer.on('on-user-search', (event, params) => {
      let _this = this
      _this.NN_IM_LOG('搜索用户', params)
      let userInfo = _this.$store.state.public.publicUserInfo
      let userInfoObj = userInfo
      if (params.data.code === 0) {
        let resArray = params.data.data.list
        _this.user_search_res_box = []
        if (Array.isArray(resArray)) {
          resArray.forEach(item => {
            if (item.nn_id !== userInfo.nn_id) {
              let _item = {
                nn_id: item.nn_id,
                special_nn_id: 0,
                nickname: item.nickname,
                avatar: item.avatar,
                gender: item.gender,
                intro: item.intro,
                birthday: 'xxxx-xx-xx',
                region1: '',
                region2: '',
                friend_verification_type: 1,
                friend_info: item.friend_info
                  ? item.friend_info
                  : { friend_remark: item.nickname }
              }
              if (_item.friend_info.friend_remark.trim() === '') {
                _item.friend_info.friend_remark = item.nickname
              }
              _this.user_search_res_box.push(_item)
            }
          })
          this.user_search_count = resArray.length
          if (resArray.length === 100) {
            this.NN_MSG('输入完整的NN号/昵称搜索结果会更准确哦', 'info')
          }
          if (resArray.length === 0) {
            this.NN_MSG('没有找到符合条件的用户', 'info')
          }
        } else {
          this.NN_MSG('没有找到符合条件的用户', 'info')
        }
      } else {
        _this.NN_IM_LOG('搜索用户错误')
      }
    })
    // 刷新好友列表
    ipcRenderer.on('on-friends-list', (event, params) => {
      let _this = this
      this.NN_IM_LOG('好友列表', params)
      if (params.data.code === 0) {
        let resArray = params.data.data
        if (Array.isArray(resArray) && resArray.length > 0) {
          resArray.forEach(item => {
            _this.contact_box.push({
              nn_id: item.nn_id,
              special_nn_id: 0,
              nickname: item.nickname,
              avatar: item.avatar,
              gender: item.gender,
              intro: item.intro,
              birthday: item.birthday,
              region1: item.region1,
              region2: item.region2,
              friend_verification_type: 1,
              friend_info: {
                friend_remark: item.remark ? item.remark : item.nickname,
                friend_from: 1
              }
            })
          })
          _this._contact_box = Object.assign([], _this.contact_box)
        } else {
          this.NN_IM_LOG('接口返回的好友个数为0')
        }
      } else {
        this.NN_IM_LOG('刷新好友列表失败')
      }
    })
    // 刷新会话列表
    ipcRenderer.on('on-chat-list', (event, params) => {
      let _this = this
      this.NN_IM_LOG('会话列表', params)
      if (params.data.code === 0) {
        let resArray = params.data.data
        let unreadCountTotal = 0
        if (Array.isArray(resArray) && resArray.length > 0) {
          resArray.forEach(item => {
            let _item = {
              nn_id: item.nn_id,
              special_nn_id: 0,
              nickname: item.nickname,
              avatar: item.avatar,
              gender: item.gender,
              intro: item.intro,
              birthday: item.birthday,
              region1: item.region1,
              region2: item.region2,
              friend_verification_type: 1,
              friend_info: item.friend_info
                ? item.friend_info
                : { friend_remark: item.nickname },
              last_msg: item.content,
              unread_count: item.unread_count,
              time: utils.timeStampToTime(item.timestamp)
            }
            unreadCountTotal += item.unread_count
            if (_item.friend_info.friend_remark.trim() === '') {
              _item.friend_info.friend_remark = item.nickname
            }
            _this.chat_box.push(_item)
          })
          _this.unreadCountTotal = unreadCountTotal
          _this._chat_box = Object.assign([], _this.chat_box)
        } else {
          this.NN_IM_LOG('接口返回的会话个数为0')
        }
      } else {
        this.NN_IM_LOG('刷新会话列表失败')
      }
    })
    // 刷新新的好友列表
    ipcRenderer.on('on-new-friends-list', (event, params) => {
      let _this = this
      this.NN_IM_LOG('新的好友列表', params)
      if (params.data.code === 0) {
        let resArray = params.data.data.list
        resArray.length > 0 ? (this.isRequest = true) : (this.isRequest = false)
        if (Array.isArray(resArray) && resArray.length > 0) {
          resArray.forEach(item => {
            _this.new_contact_box.push({
              nn_id: item.add_friend_info.from_user.nn_id,
              special_nn_id: 0,
              nickname: item.add_friend_info.from_user.nickname,
              avatar: item.add_friend_info.from_user.avatar,
              gender: item.add_friend_info.from_user.gender,
              intro: '',
              birthday: '',
              region1: '',
              region2: '',
              friend_verification_type: 1,
              friend_info: null
            })
          })
        } else {
          // 有新的好友
        }
      } else {
        this.NN_IM_LOG('刷新新的好友列表失败')
      }
    })
    // 修改好友备注
    ipcRenderer.on('on-update-friend-remark', (event, params) => {
      console.log('修改好友备注-----------------------------------------')
      console.log(params)
      if (params.data.code === 0) {
        this.NN_MSG('修改成功', 'success')
        this.editMarkNameMode = false
        this.userDetailVisible = false
        // 刷新好友列表
        this.contact_box = []
        this._contact_box = []
        ipcRenderer.send('im-friends-list', {})
        // 刷新会话列表
        this.chat_box = []
        this._chat_box = []
        ipcRenderer.send('im-chat-list', {})
      }
    })
    // 获取用户详情
    ipcRenderer.on('on-get-user-detail', (event, params) => {
      this.NN_IM_LOG('用户详情', params)
      if (params.data.code === 0) {
        this.user_detail = params.data.data
        this.openUserDetailWindow()
      }
    })
    // 接受文字图片消息
    ipcRenderer.on('ws-msg-repsonse', (event, params) => {
      this.NN_IM_LOG('主窗口也接收到了单聊消息 params=', params)
      // 刷新会话列表
      this.refreshChatList()
    })
    // ipcRenderer.on('hide-chat-window-accept', (event, params) => {
    //   this.NN_IM_LOG('窗口最小话后仍接收消息', params)
    // })
    /* ws回执 */
    // 好友关系处理的回执
    ipcRenderer.on('ws-friends-repsonse', (event, params) => {
      this.NN_IM_LOG('好友关系操作回执', params)
      if (params.code === 0) {
        switch (params.data.status) {
          case 1:
            // 发送添加好友请求成功
            this.NN_MSG('发送添加好友请求成功', 'success')
            break
          case 2:
            // 已同意添加好友的请求
            this.NN_MSG('已同意添加好友的请求', 'success')
            // 刷新好友列表
            this.refreshFriendList()
            // 刷新会话列表
            this.refreshChatList()
            break
          case 3:
            // 已拒绝添加好友的请求
            this.NN_MSG('已拒绝添加好友的请求', 'success')
            break
          case 4:
            // 已忽略添加好友的请求
            this.NN_MSG('已忽略添加好友的请求', 'success')
            break
          default:
            break
        }
        // 刷新好友列表
        this.refreshFriendList()
        // 刷新会话列表
        this.refreshChatList()
        // 刷新新的好友列表
        this.refreshNewFriendList()
      } else {
        this.NN_IM_LOG('好友关系操作失败')
        this.NN_MSG(params.msg, 'success')
      }
    })
    // 删除好友的回执
    ipcRenderer.on('on-del-friends', (event, params) => {
      this.NN_IM_LOG('删除好友回执', params)
      if (params.code === 0) {
        this.NN_MSG('好友删除成功', 'success')
        // 刷新好友列表
        this.refreshFriendList()
        // 刷新会话列表
        this.refreshChatList()
      }
    })
    // 删除会话的回执
    ipcRenderer.on('on-del-chat', (event, params) => {
      this.NN_IM_LOG('删除会话', params)
      if (params.code === 0) {
        this.NN_MSG('已删除该会话', 'success')
        // 刷新会话列表
        this.refreshChatList()
      }
    })
    /* ws广播 */
    // 好友关系操作之后的广播
    ipcRenderer.on('ws-agree-friends-repsonse', (event, params) => {
      this.NN_IM_LOG('好友关系操作之后的广播', params)
      // 获取当前登录用户的id
      let userInfo = this.$store.state.public.publicUserInfo
      if (userInfo.nn_id) {
        // 判断当前登录用户是否是好友关系操作的发起者
        let isSponsor = params.from_user.nn_id === userInfo.nn_id
        switch (params.status) {
          case 1:
            // 请求好友
            this.NN_MSG(
              isSponsor ? '对方已收到你的好友请求' : '收到一个好友请求',
              'success'
            )
            break
          case 2:
            // 同意请求
            this.NN_MSG(
              isSponsor ? '对方已同意你的好友请求' : '你新增了一位好友',
              'success'
            )
            break
          case 3:
            // 拒绝请求
            this.NN_MSG(
              isSponsor ? '对方拒绝了你的好友请求' : '你已拒绝添加对方为好友',
              'success'
            )
            break
          case 4:
            // 忽略请求
            this.NN_MSG(
              isSponsor ? '对方忽略了你的好友请求' : '你已忽略对方的好友请求',
              'success'
            )
            break

          default:
            break
        }
        // 刷新好友列表
        this.refreshFriendList()
        // 刷新会话列表
        this.refreshChatList()
        // 刷新新的好友列表
        this.refreshNewFriendList()
      } else {
        this.NN_IM_LOG('无法获取到当前登录用户的nn_id')
      }
    })
    // 发送语音通话请求之后的广播
    ipcRenderer.on('ws-send-call-broadcast', (event, params) => {
      this.NN_IM_LOG('语音通话请求的广播', JSON.stringify(params))
      switch (params.status) {
        case 1:
          // 语音通话请求
          this.NN_IM_LOG('主窗口接收到语音通话请求的参数', params)
          this.handleCall(params)
          break
        case 9:
          // 挂断，拒接语音通话请求
          this.handleHangup(params)
          break

        default:
          break
      }
    })
  },
  filters: {
    // 星座过滤器
    xingzuo: function (value) {
      if (!value) return ''
      value = value.toString()
      return utils.getHoroByBirth(value)
    }
  },
  beforeDestroy () {
    this.NN_IM_LOG('ImWindow组件销毁')
  }
}
</script>

<style lang="less" scoped>
@import '../../../common/less/common.less';
.im-window-warp {
  .nn-text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 20em;
  }
  .window {
    position: relative;
    width: 305px;
    height: auto;
  }
  .miniWindow {
    width: 50px;
  }
  .container-bar {
    position: relative;
    float: left;
    width: 50px;
    @{bgc}: rgba(0, 0, 0, 0);
    height: 100%;
  }
  .container-body {
    position: relative;
    float: left;
    width: 255px;
    @{bgc}: @nn-base-white;
    height: 100%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  }
  .container {
    position: relative;
    @{bgc}: @nn-base-white;
    width: 50px;
    height: 100px;
    @{bdr}: 25px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    text-align: center;
  }
  .expand {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .hr {
    position: relative;
    width: 40px;
    height: 1px;
    border-top: 1px #eee solid;
    margin: auto;
    margin-top: 5px;
  }
  .icon {
    cursor: pointer;
  }
  .icon-1 {
    width: 27px;
    height: 29px;
    margin-top: 10px;
  }
  .icon-2 {
    width: 27px;
    height: 29px;
    margin-top: 10px;
  }
  .top {
    position: relative;
    width: 100%;
    height: 46px;
    @{bgc}: @nn-base-white;
    padding-top: 14px;
  }
  .search-container-msg {
    width: 235px;
    height: 32px;
    @{bgc}: @nn-light-gray;
    @{bdr}: 16px;
    margin-left: 10px;
    .top-search {
      width: 235px;
      line-height: 32px;
    }
  }
  .search-container-contact {
    width: 205px;
    height: 32px;
    @{bgc}: @nn-light-gray;
    @{bdr}: 16px;
    float: left;
    margin-left: 10px;
    .top-search {
      width: 205px;
      line-height: 32px;
    }
  }
  .search-container-search {
    width: 205px;
    height: 32px;
    @{bgc}: @nn-light-gray;
    @{bdr}: 16px;
    float: left;
    margin-left: 10px;
    .top-search {
      width: 205px;
      line-height: 32px;
    }
  }
  .icon-search-user {
    width: 22px;
    height: 22px;
    float: left;
    margin-left: 10px;
    margin-top: 6px;
    cursor: pointer;
  }
  .icon-back-contact {
    width: 10px;
    height: 19px;
    float: left;
    margin-left: 10px;
    margin-top: 6px;
    cursor: pointer;
    padding-left: 5px;
    padding-right: 5px;
  }
  .contact-list-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 115px);
    overflow-y: auto;
  }
  .contact-list {
    width: 255px;
    height: 71px;
    @{bgc}: @nn-base-white;
    cursor: pointer;
    border-bottom: 1px #eee solid;
  }
  .contact-list:hover {
    @{bgc}: rgba(240, 240, 240, 1);
  }
  .container-left {
    position: relative;
    float: left;
    width: 60px;
    height: 100%;
    text-align: center;
  }
  .avatar {
    width: 44px;
    height: 44px;
    line-height: 60px;
    margin-top: 14px;
    border-radius: 22px;
  }
  .container-right {
    position: relative;
    float: left;
    width: 195px;
    height: 100%;
  }
  .right-top {
    position: relative;
    width: 195px;
    height: 30px;
    margin-top: 6px;
  }
  .right-footer {
    position: relative;
    width: 195px;
    height: 30px;
  }
  .nick-name {
    position: relative;
    float: left;
    width: 140px;
    height: 100%;
    font-size: 16px;
    color: #303033;
    line-height: 36px;
  }
  .chat-date {
    position: relative;
    float: left;
    width: 55px;
    height: 100%;
    font-size: 12px;
    color: #909399;
    line-height: 40px;
    text-align: center;
  }
  .chat-del {
    color: rgba(0, 0, 0, 0);
    font-size: 16px;
    padding-left: 3px;
    padding-right: 3px;
    padding-bottom: 1px;
    position: relative;
    line-height: 16px;
    top: -17px;
    border-radius: 3px;
  }
  .delBtnActive {
    color: #fff;
    background-color: #ccc;
  }
  .chat-del:hover {
    background-color: #bbb;
  }
  .right-footer {
    font-size: 12px;
    color: #909399;
    line-height: 26px;
  }
  .msg-default {
    width: 100%;
    height: 100%;
  }
  .msg-default-img {
    width: 164px;
    height: 132px;
    margin: auto;
    margin-top: 25vh;
  }
  .msg-default-info-1 {
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #ccc;
  }
  .msg-default-info-2 {
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #999999;
  }
  .seatch-res-info {
    width: 100%;
    height: 12px;
    text-align: left;
    margin-bottom: 10px;
    p {
      line-height: 12px;
      color: #666;
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .searched-user-detail-container {
    width: 300px;
    height: 300px;
    .top {
      width: 100%;
      height: 50px;
      padding: 0;
      margin-top: 10px;
    }
    .sign {
      width: 100%;
      height: 30px;
      color: #999999;
      font-size: 12px;
      padding-top: 15px;
    }
    .info {
      width: 100%;
      height: 110px;
      line-height: 26px;
      margin-top: 5px;
    }
    .footer {
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      margin-top: 10px;
    }
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    right: 8px;
    top: 15px;
  }
}
/deep/ .el-badge__content.is-fixed {
  top: 15px;
  right: 15px;
}
</style>
