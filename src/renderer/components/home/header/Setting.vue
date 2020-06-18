<template>
  <div class="header-setting-wrap">
    <!-- 暂时没有皮肤功能 -->
    <!-- <div class="block">
      <el-image :src="face"></el-image>
    </div>-->
    <div @mouseenter="footprintEnter" @mouseleave="footprintLeave" class="block footprint">
      <!-- <el-image :src="time"></el-image> -->
      <el-popover placement="bottom" popper-class="footprint-popover" trigger="hover" width="300">
        <ul class="footprint-list" v-show="computeFootprintList.length>0">
          <li :key="index" @click="goRoom(item.channel_no)" v-for="(item,index) in footsprintArr">
            <img
              :class="['footprint-item-avatar',{'footprint-item-avatar-center':item.tag.length===0}]"
              :src="item.avatar"
              alt
            />
            <div class="footprint-item-text">
              <p class="footprint-item-name">{{item.name}}</p>
              <p class="footprint-item-tags" v-show="item.tag.length > 0">{{item.tag}}</p>
              <!-- {{item.tags.join("/")}} -->
              <p class="footprint-item-hot">
                <img :src="ic_hot" alt />
                <span>{{item.hots}}</span>
              </p>
            </div>
            <p class="date-title">{{item.time}}</p>
          </li>
        </ul>
        <div class="default-page" v-show="computeFootprintList.length===0">
          <p>
            <img :src="footprint_default" alt />
            <span>您最近访问空空如也</span>
            <span>先去逛逛吧</span>
          </p>
        </div>
        <el-image :src="time" slot="reference"></el-image>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { getCurrentLoginType } from '../../../common'
export default {
  name: 'Setting',
  data () {
    return {
      // footprintList: [],
      timeArr: [],
      tagsArr: [],
      tagsList: [],
      footsprintArr: [],
      time: require('@/assets/img/home/time.png'),
      face: require('@/assets/img/home/cface.png'),
      ic_hot: require('@/assets/img/home/ic_hot.png'),
      footprint_default: require('@/assets/img/home/footprint_default.png')
    }
  },
  computed: {
    computeFootprintList () {
      return this.$store.state.home.setFootprintList
    }
  },
  watch: {
    computeFootprintList: {
      handler (newValue, oldValue) {
        if (newValue.length === 0) {
          this.footsprintArr = []
        }
        this.footsprintArr = Object.assign([], newValue)
        this.footsprintArr.map((item, index) => {
          item.time = this.transformTime(item.access_time_stamp)
          this.tagsArr = []
          if (item.tags && item.tags.length > 0) {
            for (let i = 0; i < item.tags.length; i++) {
              this.tagsArr.push(item.tags[i].name)
            }
            item.tag = this.tagsArr.join('/')
          } else {
            item.tag = ''
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    ipcRenderer.on('get-footprint-list-res', this.getFootprintListRes)
  },
  mounted () {},
  methods: {
    getFootprintListRes (event, params) {
      console.log('get-footprint-list-res: ', params)
      if (params.data.code === 0) {
        if (!params.data.data.list || params.data.data.list.length === 0) {
          // SetFootprintList
          this.$store.dispatch('SetFootprintList', [])
          // this.footprintList = []
        } else {
          // this.footprintList = params.data.data.list
          this.$store.dispatch('SetFootprintList', params.data.data.list)
        }
      }
    },
    footprintEnter () {
      let data = {
        page: 1,
        limit: 5
      }
      ipcRenderer.send('get-footprint-list', data)
    },
    footprintLeave () {},
    // 进入房间
    goRoom (channelNo) {
      ipcRenderer.send('is-room-window', channelNo)
      // let url =
      //   window.location.href +
      //   `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
      // ipcRenderer.send('request-new-win', url)
    },
    // 把时间戳转换成时间
    transformTime (timestamp) {
      // console.log(timestamp)
      // let footprintDate = new Date(timestamp * 1000)
      let date = new Date().getTime()
      let time = date - timestamp * 1000
      // 3600000 一小时
      // 86400000  一天
      // 604800000  七天

      if (time < 3600000) {
        // 一小时
        return '刚刚'
      } else if (time >= 3600000 && time < 86400000) {
        // 1小时～24小时
        return parseInt(time / 3600000) + '小时前'
        // 显示几小时前
      } else if (time >= 86400000 && time < 604800000) {
        // 24小时～7天
        // 显示几天前
        return parseInt(time / 86400000) + '天前'
      }
    }
    // formatNumber (n) {
    //   n = n.toString()
    //   return n[1] ? n : '0' + n
    // }
  }
}
</script>
<style lang="less" scoped>
.header-setting-wrap {
  display: inline-flex;
  flex-direction: row;
  .d-line {
    padding: 0;
    align-self: center;
    height: 35px;
  }
  .block {
    align-self: center;
    width: 18px;
    height: 18px;
    margin: 0 10px;
    cursor: pointer;
  }
}
.footprint-list {
  // padding: 15px;
  width: 300px;
  li {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: pointer;
    .footprint-item-avatar {
      margin-top: 9px;
      margin-left: 20px;
      width: 25px;
      height: 25px;
      border-radius: 13px;
    }
    .footprint-item-avatar-center {
      margin-top: 17.5px;
    }
    .footprint-item-text {
      padding: 5px 0 5px 4px;
      height: 50px;
      font-size: 12px;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .footprint-item-name {
        height: 18px;
        line-height: 18px;
        color: #000000;
      }
      .footprint-item-tags {
        height: 14px;
        line-height: 14px;
        color: #999999;
      }
      .footprint-item-hot {
        height: 18px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 12px;
          height: 12px;
        }
        span {
          margin-left: 3px;
          height: 18px;
          line-height: 18px;
          color: #999999;
        }
      }
    }
    .date-title {
      position: absolute;
      bottom: 8px;
      right: 20px;
      height: 14px;
      font-size: 12px;
      line-height: 14px;
      color: #666666;
    }
  }
  li:hover {
    background-color: #f5f5f5;
  }
}
.default-page {
  width: 300px;
  height: 318px;
  p {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 166px;
      height: 120px;
    }
    span:nth-of-type(1) {
      padding-top: 20px;
      font-size: 16px;
      color: #cccccc;
      height: 21px;
      line-height: 21px;
    }
    span:nth-of-type(2) {
      padding-top: 10px;
      font-size: 14px;
      color: #999999;
      height: 19px;
      line-height: 19px;
    }
  }
}
// /deep/.el-popover {
//   padding-left: 0 !important;
//   padding-right: 0 !important;
// }
</style>
