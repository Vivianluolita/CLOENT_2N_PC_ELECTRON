<template>
  <div class="game-channel-collect-wrap">
    <div class="channel-collect">
      <div :class="isShowChannelList ? 'active-green' : ''" @click="toggleChannel" class="channel">
        频道
        <!-- <i class="el-icon-arrow-down up-down-arrow" v-if="isShowChannelUpArrow"></i> -->
        <i class="el-icon-arrow-down up-down-arrow" v-if="isShowChannelList"></i>
        <i class="el-icon-arrow-up up-down-arrow" v-else></i>
      </div>
      <div :class="isShowCollectList ? 'active-green' : ''" @click="toggleCollect" class="collect">
        收藏
        <!-- <i class="el-icon-arrow-down up-down-arrow" v-if="isShowCollectUpArrow"></i> -->
        <i class="el-icon-arrow-down up-down-arrow" v-if="isShowCollectList"></i>
        <i class="el-icon-arrow-up up-down-arrow" v-else></i>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="loginContain" v-if="!getCookie">
      <i class="el-icon-caret-top left-arrow" v-show="isShowChannelList"></i>
      <i class="el-icon-caret-top right-arrow" v-show="isShowCollectList"></i>
      <img alt="electron-vue" class="join-NN-logo" src="~@/assets/img/home/join-NN-logo.png" />
      <span class="text1">加入NN频道</span>
      <span class="text2">海量精彩内容</span>
      <div @click="goLogin" class="loginBtn">登录</div>
    </div>
    <!-- 登录了判断是我的频道还是收藏 -->
    <div class="itemList" v-else v-show="isShowChannelList || isShowCollectList">
      <!-- <div class="channeltListContain"></div> -->
      <i class="el-icon-caret-top left-arrow" v-show="isShowChannelList"></i>
      <i class="el-icon-caret-top right-arrow" v-show="isShowCollectList"></i>
      <div class="collectListContain">
        <span
          :key="index"
          @click="goRoom(item.channel_no)"
          class="collectItem"
          v-for="(item,index) in downList.slice(0,3)"
          v-show="downList.length > 0"
        >
          <span class="avatar-contain">
            <img :src="item.avatar" alt class="collect-avatar" />
          </span>
          <span class="right-contain">
            <span class="name">
              <img :src="roleImg[index]" alt v-show="isShowChannelList" />
              <span>{{item.name}}</span>
            </span>
            <span class="tag" v-if="item.tags && item.tags.length > 0">{{item.tags[0].name}}</span>
          </span>
        </span>
        <p class="channelListDefault" v-show="downList.length === 0 && isShowChannelList">
          <img :src="defalutImg" alt />
          <span>暂无频道</span>
          <span>拥有红马以上权限</span>
          <span @click="getAllCollectList">查看全部></span>
        </p>
        <p class="collectListDefault" v-show="downList.length === 0 && isShowCollectList">
          <img :src="defalutImg" alt />
          <span>暂无收藏的频道</span>
        </p>
        <span @click="getAllCollectList" class="see-all" v-show="downList.length > 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Storage } from '../../../../../main/db/dbStore'
import { ipcRenderer } from 'electron'
import { getCurrentLoginType } from '../../../../common'
export default {
  name: 'GameCategoryItem',
  data () {
    return {
      downList: [],
      isGetAll: false,
      defalutImg: require('@/assets/img/home/left_list_default.png'),
      // 马甲
      channel_role: []
    }
  },
  props: ['data', 'active', 'num', 'arrLength'],
  computed: {
    // 获取token
    getCookie () {
      let flag = false
      if (this.$store.state.public.token && getCurrentLoginType() === 1) {
        flag = true
      }
      return flag
    },
    // 是否选中我的频道
    isShowChannelList () {
      return this.$store.state.home.isShowMyChannelList
    },
    // 是否选中我的收藏
    isShowCollectList () {
      return this.$store.state.home.isShowMyCollectList
    },
    // 获取性别
    gender () {
      return this.$store.state.public.publicUserInfo.gender
    },
    // 显示马甲
    roleImg () {
      let roleImgArr = []
      if (this.isShowChannelList) {
        for (let i = 0; i < this.downList.length; i++) {
          this.channel_role.map((item, index) => {
            if (item.id === this.downList[i].role) {
              if (this.gender === 1) {
                // 男
                roleImgArr.push(item.icon_male)
              } else {
                // 女
                roleImgArr.push(item.icon_female)
              }
            }
          })
        }
      }
      return roleImgArr
    }
    // this.$store.dispatch('IsShowMyChannelList', '没有更多了')
    // this.$store.dispatch('IsShowMyCollectList', '没有更多了')
  },
  watch: {
    // isToken: {
    //   handler (newValue, oldValue) {
    //     if (newValue) {
    //       this.isLogin = true
    //     } else {
    //       this.isLogin = false
    //     }
    //   },
    //   deep: true
    // }
    // loginBox: {
    // handler (newValue, oldValue) {
    //   if (newValue === 0) {
    //     if (Storage.get('token')) {
    //       this.isLogin = true
    //     } else {
    //       this.isLogin = false
    //     }
    //   }
    // },
    // deep: true
    // }
    getCookie: {
      handler (newValue, oldValue) {
        // 加载左侧下拉的数据
        if (this.$store.state.home.isShowMyChannelList) {
          let data = {
            page: 1,
            limit: 3
          }
          ipcRenderer.send('get-my-channel', data)
        } else if (this.$store.state.home.isShowMyCollectList) {
          let data = {
            page: 1,
            limit: 3
          }
          ipcRenderer.send('get-my-collect', data)
        }
      },
      deep: true,
      immediate: true
    }
  },
  destroyed () {
    // 收藏的左边下拉列表
    ipcRenderer.removeListener('get-my-collect-res', this.getMyCollectRes)
    // 收藏的右边频道列表
    ipcRenderer.removeListener(
      'get-my-collect-list-res',
      this.getMyCollectListRes
    )
    // 我的频道的左边下拉列表
    ipcRenderer.removeListener('get-my-channel-res', this.getMyChannelRes)
    // 我创建的频道右侧列表
    ipcRenderer.removeListener('my-channel-list-res', this.myChannelListRes)
    // 我管理的频道右侧列表
    ipcRenderer.removeListener(
      'manage-channel-list-res',
      this.manageChannelListRes
    )
  },
  created () {
    // this.judgeLogin()
    // 收藏的左边下拉列表
    ipcRenderer.on('get-my-collect-res', this.getMyCollectRes)
    // 收藏的右边频道列表
    ipcRenderer.on('get-my-collect-list-res', this.getMyCollectListRes)
    // 我的频道的左边下拉列表
    ipcRenderer.on('get-my-channel-res', this.getMyChannelRes)
    // 我创建的频道右侧列表
    ipcRenderer.on('my-channel-list-res', this.myChannelListRes)
    // 我管理的频道右侧列表
    ipcRenderer.on('manage-channel-list-res', this.manageChannelListRes)
  },
  mounted () {
    // // 判断是否登录
    // if (Storage.get('token')) {
    //   this.isLogin = true
    // }
    this.channel_role = Storage.get('configInfo').channel_role
    console.log(this.channel_role)
  },
  methods: {
    getMyCollectRes (event, params) {
      console.log('get-my-collect-res: ', params)
      if (params.data.code === 0) {
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.downList = []
        } else {
          this.downList = params.data.data.list
        }
      }
    },
    getMyCollectListRes (event, params) {
      console.log('get-my-collect-list-res: ', params)
      if (params.data.code === 0) {
        if (params.data.data.has_more === true) {
          this.$store.dispatch('SetMoreBtnText', '加载更多')
        } else {
          this.$store.dispatch('SetMoreBtnText', '没有更多了')
        }
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.$store.dispatch('SetChannelInfoList', '')
        } else {
          this.$store.dispatch('SetChannelInfoList', params.data.data.list)
        }
        // this.isShowCollectList = !this.isShowCollectList
        this.$store.dispatch('IsShowMyCollectList', true)
        // this.isShowChannelList = false
        this.$store.dispatch('IsShowMyChannelList', false)
      }
    },
    getMyChannelRes (event, params) {
      console.log('get-my-channel-res: ', params)
      if (params.data.code === 0) {
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.downList = []
        } else {
          this.downList = params.data.data.list
        }
        // this.isShowChannelList = !this.isShowChannelList
        this.$store.dispatch('IsShowMyChannelList', true)
        // this.isShowCollectList = false
        this.$store.dispatch('IsShowMyCollectList', false)
      }
    },
    myChannelListRes (event, params) {
      console.log('my-channel-list-res: ', params)
      if (params.data.code === 0) {
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.$store.dispatch('SetMyChannelInfoList', '')
        } else {
          this.$store.dispatch('SetMyChannelInfoList', params.data.data.list)
        }
      }
    },
    manageChannelListRes (event, params) {
      console.log('manage-channel-list-res: ', params)
      if (params.data.code === 0) {
        // 判断还有没有加载更多
        if (params.data.data.has_more === true) {
          this.$store.dispatch('SetMoreBtnText', '加载更多')
        } else {
          this.$store.dispatch('SetMoreBtnText', '没有更多了')
        }
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.$store.dispatch('SetChannelInfoList', '')
        } else {
          this.$store.dispatch('SetChannelInfoList', params.data.data.list)
        }
      }
    },
    // 进入房间
    goRoom (channelNo) {
      ipcRenderer.send('is-room-window', channelNo)
      // let url =
      //   window.location.href +
      //   `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
      // ipcRenderer.send('request-new-win', url)
    },
    getAllCollectList () {
      // 清除搜索框的value
      this.$store.dispatch('GetSearchValue', '')
      // // 关闭搜索框的历史列表
      // this.$store.dispatch('ShowSearchHistory', false)
      // 请求40条数据
      this.$store.dispatch('SetChannelListLimit', 40)
      // 左侧列表显示为一个都不选中
      this.$store.dispatch('SelectContainerLeftList', -1)
      // last_id还原
      this.$store.dispatch('SetLastChannelId', 0)
      if (this.isShowChannelList) {
        // 是我的频道下面的列表
        this.$store.dispatch('SetChannelListTpye', 1)
        // 我创建的频道的右边频道列表
        let limit = this.$store.state.home.channelListLimitNum
        const data = {
          page: 1,
          // 现在只能创建三个频道,需要修改
          limit: 3
        }
        ipcRenderer.send('my-channel-list', data)
        // 我管理的频道右边频道列表
        const manageData = {
          page: 1,
          limit: limit
        }
        ipcRenderer.send('manage-channel-list', manageData)
      } else if (this.isShowCollectList) {
        // 收藏的右边频道列表
        this.$store.dispatch('SetChannelListTpye', 2)
        let limit = this.$store.state.home.channelListLimitNum
        const data = {
          page: 1,
          limit: limit
        }
        ipcRenderer.send('get-my-collect-list', data)
      }
      // this.$store.dispatch('SelectContainerLeftList', '-1')
    },
    // 下拉的时候请求收藏数据
    getCollectList () {
      const data = {
        page: 1,
        limit: 3
      }
      ipcRenderer.send('get-my-collect', data)
    },
    // 下拉的时候请求我的频道数据
    getChannelList () {
      const data = {
        page: 1,
        limit: 3
      }
      ipcRenderer.send('get-my-channel', data)
    },
    // 未登录呼起登录框
    goLogin () {
      this.$store.dispatch('loginBtnClick', 1)
    },
    // 我的频道的下拉列表
    toggleChannel () {
      this.$store.dispatch('IsShowMyCollectList', false)
      this.$store.dispatch('IsShowMyChannelList', true)
      // this.isShowChannelList = !this.isShowChannelList
      // this.isShowCollectList = false
      this.getChannelList()
      // this.isShowChannelUpArrow = !this.isShowChannelUpArrow
    },
    // 收藏的下拉列表
    toggleCollect () {
      // this.isShowCollectList = !this.isShowCollectList
      this.$store.dispatch('IsShowMyCollectList', true)
      // this.isShowChannelList = false
      this.$store.dispatch('IsShowMyChannelList', false)
      this.getCollectList()
      // this.isShowCollectUpArrow = !this.isShowCollectUpArrow
    }
  }
}
</script>
<style lang="less" scoped>
.game-channel-collect-wrap {
  height: auto;
  background-color: transparent;
  .channel-collect {
    display: flex;
    justify-content: center;
    width: 100%;
    .channel,
    .collect {
      width: 70px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #ffffff;
      background: rgba(216, 216, 216, 0.1);
      border-radius: 15px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      cursor: pointer;
      user-select: none;
      .up-down-arrow {
        font-size: 10px;
      }
    }
    .active-green {
      color: rgba(35, 243, 173, 1);
    }
    .collect {
      margin-left: 4px;
    }
  }

  .loginContain {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 144px;
    height: 162px;
    background: rgba(255, 255, 255, 0.05);
    margin: 12px 8px 20px;
    position: relative;
    .join-NN-logo {
      margin-top: 20px;
      width: 50px;
      height: 50px;
    }
    .text1 {
      margin-top: 6px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }
    .text2 {
      margin-top: 2px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(204, 204, 204, 1);
    }
    .loginBtn {
      width: 80px;
      height: 28px;
      margin-top: 10px;
      background: rgba(35, 243, 173, 0.2);
      border-radius: 28px;
      border: 1px solid rgba(35, 243, 173, 1);
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(35, 243, 173, 1);
      line-height: 28px;
      text-align: center;
      cursor: pointer;
    }
    .loginBtn:hover {
      background: rgba(35, 243, 173, 0.4);
    }
    .left-arrow {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.05);
      position: absolute;
      top: -11px;
      left: 24px;
    }
    .right-arrow {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.05);
      position: absolute;
      top: -11px;
      right: 24px;
    }
  }
  .itemList {
    background: rgba(255, 255, 255, 0.05);
    margin: 12px 8px 20px;
    position: relative;
    .left-arrow {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.05);
      position: absolute;
      top: -11px;
      left: 24px;
    }
    .right-arrow {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.05);
      position: absolute;
      top: -11px;
      right: 24px;
    }
    .collectListContain {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      justify-content: center;
      padding: 6px 0 12px;
      .collectItem {
        display: flex;
        justify-content: center;
        height: 40px;
        cursor: pointer;
        align-items: center;
        .avatar-contain {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          overflow: hidden;
          .collect-avatar {
            width: 25px;
            height: 25px;
            background-size: 100%;
          }
        }
        .right-contain {
          width: 96px;

          height: 30px;
          display: flex;
          flex-direction: column;
          margin-left: 6px;
          .name {
            width: 100%;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            font-family: MicrosoftYaHei;
            color: rgba(245, 245, 245, 1);
            display: flex;
            align-items: center;
            img {
              width: 16px;
              height: 16px;
            }
            span {
              flex: 1;
              height: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          .tag {
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
      .see-all {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: rgba(204, 204, 204, 1);
        text-align: center;
        cursor: pointer;
        user-select: none;
        margin-top: 6px;
      }
      .see-all:hover {
        color: rgba(35, 243, 173, 0.5);
      }
      .channelListDefault,
      .collectListDefault {
        width: 144px;
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 56px;
          height: 60px;
        }
        span {
          height: 16px;
          font-size: 12px;
          color: #999999;
          line-height: 16px;
        }
      }
      .channelListDefault {
        span:nth-of-type(1) {
          padding-top: 14px;
        }
        span:nth-of-type(3) {
          padding-top: 10px;
          color: #ffffff;
          cursor: pointer;
        }
      }
      .collectListDefault {
        span:nth-of-type(1) {
          padding-top: 15px;
        }
      }
    }
  }
}
</style>