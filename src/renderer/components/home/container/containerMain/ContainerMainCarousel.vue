<template>
  <div @mouseenter="enter" @mouseleave="leave" class="container-main-carousel-wrap">
    <!-- <el-carousel :interval="4000" arrow="always" height="200px" type="card">
      <el-carousel-item
        :key="index"
        @click.native="openWin(index)"
        class="banner-image-wrap"
        v-for="(item,index) in banner_list"
      >
        <img :src="item.icon" alt />
      </el-carousel-item>
    </el-carousel>-->
    <p @click="leftBtnClick" class="left-btn"></p>
    <p @click="rightBtnClick" class="right-btn"></p>
    <div class="bottom_btn_list">
      <p
        :class="['bottom_btn_item',{is_active:index === num}]"
        :key="index"
        @click="bottomBtnClick(index)"
        v-for="(item,index) in banner_list"
      ></p>
    </div>
    <div class="carousel" v-if="banner_list.length !== 0">
      <!-- <div
        :key="index"
        @click.native="openWin(index)"
        :class="['banner-image-wrap',{}]"
        v-for="(item,index) in banner_list"
      >
        <img :src="item.icon" alt />
      </div>-->
      <p>
        <span></span>
        <img :src="banner_list[prev_num].icon" alt />
      </p>
      <p @click="openWin()">
        <img :src="banner_list[num].icon" alt />
      </p>
      <p>
        <span></span>
        <img :src="banner_list[next_num].icon" alt />
      </p>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
export default {
  name: 'ContainerMainCarousel',
  data () {
    return {
      banner_list: [],
      prev_num: 2,
      num: 0,
      next_num: 1,
      timer: ''
    }
  },
  components: {},
  destroyed () {
    ipcRenderer.removeListener('banner-list-res', this.bannerListRes)
  },
  created () {
    ipcRenderer.on('banner-list-res', this.bannerListRes)
  },
  mounted () {
    this.getBannerList()
    this.imgMove()
  },
  computed: {},
  methods: {
    bannerListRes (event, params) {
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        this.banner_list = params.data.data.list
      }
    },
    getBannerList () {
      let data = {
        page: 1,
        limit: 10
      }
      ipcRenderer.send('banner-list', data)
    },
    openWin () {
      let url = this.banner_list[this.num].url
      console.log(url)
      if (url.indexOf('http') !== -1) {
        window.open(url)
      } else {
        // 后期可能还要加判断
        // window.open('http://' + url)
        if (url.indexOf('channel/enter') !== -1) {
          let channelNo = url.split('?channel_no=')[1]
          ipcRenderer.send('is-room-window', channelNo)
          // let jumpUrl =
          //   window.location.href +
          //   `room?roomid=${channelNo}&token=${this.$store.state.public.token}&nn_id=${this.$store.state.public.publicUserInfo.nn_id}`
          // ipcRenderer.send('request-new-win', jumpUrl)
        }
      }
      // window.open('http://' + url)
    },
    enter () {
      clearInterval(this.timer)
    },
    leave () {
      this.imgMove()
    },
    imgMove () {
      this.timer = setInterval(() => {
        this.rightBtnClick()
      }, 2000)
    },
    leftBtnClick () {
      this.num = this.num - 1
      this.num = this.judgeNum(this.num)
      this.prev_num = this.judgeNum(this.num - 1)
      this.next_num = this.judgeNum(this.num + 1)
    },
    rightBtnClick () {
      this.num = this.num + 1
      this.num = this.judgeNum(this.num)
      this.prev_num = this.judgeNum(this.num - 1)
      this.next_num = this.judgeNum(this.num + 1)
    },
    bottomBtnClick (index) {
      this.num = index
      this.prev_num = this.judgeNum(index - 1)
      this.next_num = this.judgeNum(index + 1)
    },
    judgeNum (n) {
      if (n > this.banner_list.length - 1) {
        n = 0
      } else if (n < 0) {
        n = this.banner_list.length - 1
      }
      return n
    }
  }
}
</script>
<style lang="less" scoped>
// .container-main-carousel-wrap {
//   width: 100%;
//   height: 100%;
//   // display: flex;
//   // justify-content: center;
//   /deep/.el-carousel--horizontal {
//     margin: 0 auto;
//     width: 1200px;
//     overflow-x: visible;
//   }
//   .banner-image-wrap {
//     width: 600px;
//     height: 200px;
//     background-color: #ffffff;
//     border-radius: 5px;
//   }
//   /deep/.el-carousel__arrow {
//     width: 44px;
//     height: 44px;
//   }
//   /deep/.el-carousel__arrow:hover {
//     background-color: rgb(35, 243, 173);
//   }
//   /deep/.el-icon-arrow-right {
//     width: 44px;
//     height: 44px;
//     line-height: 44px;
//     font-size: 28px;
//   }
//   /deep/.el-icon-arrow-left {
//     width: 44px;
//     height: 44px;
//     line-height: 44px;
//     font-size: 28px;
//   }
//   /deep/.el-carousel__indicators--outside {
//     position: absolute;
//     left: 0;
//     bottom: 5px;
//     width: 100%;
//     height: 26px;
//     .is-active {
//       .el-carousel__button {
//         background-color: rgb(35, 243, 173);
//       }
//     }
//   }
//   /deep/.el-carousel__button {
//     width: 10px;
//     height: 10px;
//     border-radius: 5px;
//     background-color: #cccccc;
//   }
// }
.container-main-carousel-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  // min-width: 1050px;
  .left-btn,
  .right-btn {
    position: absolute;
    top: 78px;
    width: 44px;
    height: 44px;
    z-index: 99;
    display: none;
  }
  .left-btn {
    left: 40px;
    background-image: url('../../../../assets/img/home/banner_left_btn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .right-btn {
    right: 40px;
    background-image: url('../../../../assets/img/home/banner_right_btn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .left-btn:hover {
    background-image: url('../../../../assets/img/home/banner_left_btn_active.png');
  }
  .right-btn:hover {
    background-image: url('../../../../assets/img/home/banner_right_btn_active.png');
  }
  .bottom_btn_list {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    height: 10px;
    z-index: 999;
    display: flex;
    justify-content: center;
    .bottom_btn_item {
      margin: 0 4px;
      width: 10px;
      height: 10px;
      background-color: #cccccc;
      border-radius: 5px;
      cursor: pointer;
    }
    .bottom_btn_item:hover {
      background-color: #23f3ad;
    }
    .is_active {
      background-color: #23f3ad;
    }
  }
  .carousel {
    width: 100%;
    height: 100%;
    position: relative;
    p:nth-of-type(1),
    p:nth-of-type(3) {
      position: absolute;
      top: 50%;
      width: 540px;
      height: 180px;
      transform: translate(0, -50%);
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      span {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        opacity: 0.5;
        border-radius: 5px;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    p:nth-of-type(1) {
      left: 0;
    }
    p:nth-of-type(3) {
      right: 0;
    }
    p:nth-of-type(2) {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 200px;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      z-index: 9;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }
    // p:nth-of-type(3) {
    //   position: absolute;
    //   top: 50%;
    //   right: 0;
    //   width: 540px;
    //   height: 180px;
    //   transform: translate(0, -50%);
    //   border-radius: 5px;
    //   background-color: rgba(0, 0, 0, 0.5);
    //   span {
    //     position: absolute;
    //     left: 0;
    //     right: 0;
    //     width: 100%;
    //     height: 100%;
    //     background-color: #000000;
    //     opacity: 0.5;
    //     border-radius: 5px;
    //   }
    //   img {
    //     width: 100%;
    //     height: 100%;
    //     border-radius: 5px;
    //   }
    // }
  }
}
.container-main-carousel-wrap:hover {
  .left-btn,
  .right-btn {
    display: block;
  }
}
</style>