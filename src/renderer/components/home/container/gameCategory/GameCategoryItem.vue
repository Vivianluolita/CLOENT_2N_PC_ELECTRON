<template>
  <div class="game-category-item-wrap">
    <el-menu-item
      :class="['item-li-wrap',{'item-li-wrap-show':isShow}]"
      :index="data.id?data.id.toString():'0'"
    >
      <div class="item-title">
        <img :src="isShow?data.icon:data.no_icon" alt class="item-title-img" />
        <p :class="['item-title-text',{'item-title-text-active':active == data.id}]">{{data.name}}</p>
        <p class="animation-wrap" v-show="isShow">
          <span></span>
          <span></span>
          <span></span>
        </p>
      </div>
      <div class="item-type-list">
        <p
          :class="{'item-type-text-show':isShow}"
          v-bind:key="index"
          v-for="(item,index) in data.menu"
        >{{item.name}}</p>
      </div>
    </el-menu-item>
    <p style="height: 1px; margin: 0 20px;background-color: #000000;" v-if="isLast"></p>
  </div>
</template>

<script>
export default {
  name: 'GameCategoryItem',
  data () {
    return {
      // imgArr: [
      //   {
      //     normal: require('../../../../assets/img/home/icon-popular.png'),
      //     active: require('../../../../assets/img/home/icon-popular-active.png')
      //   },
      //   {
      //     normal: require('../../../../assets/img/home/icon-game.png'),
      //     active: require('../../../../assets/img/home/icon-game-active.png')
      //   },
      //   {
      //     normal: require('../../../../assets/img/home/icon-celebrity.png'),
      //     active: require('../../../../assets/img/home/icon-celebrity-active.png')
      //   },
      //   {
      //     normal: '',
      //     active: ''
      //   }
      // ]
    }
  },
  props: ['data', 'active', 'num', 'arrLength'],
  computed: {
    // 选中还是未选中
    isShow () {
      if (this.active === this.data.id.toString()) {
        return true
      } else {
        return false
      }
    },
    // 判断是否最后一个
    isLast () {
      if (parseInt(this.num) === this.arrLength - 1) {
        return false
      } else {
        return true
      }
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.game-category-item-wrap {
  height: auto;
  background-color: transparent;
  .item-li-wrap {
    padding-right: 15px;
    padding-bottom: 16px;
    width: 100%;
    height: auto;
  }
  .item-li-wrap-show {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .item-li-wrap:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .item-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .item-title-img {
      width: 20px;
      height: 20px;
    }
    .item-title-text {
      padding-left: 10px;
    }
    .item-title-text-active {
      color: #23f3ad;
    }
  }
  .animation-wrap {
    padding-left: 10px;
    width: 10px;
    height: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    span {
      width: 2px;
      background-color: #23f3ad;
      border-radius: 2px;
      animation: select 0ms -800ms linear infinite alternate;
    }
  }
  @keyframes select {
    0% {
      height: 2px;
    }

    100% {
      height: 8px;
    }
  }
  .animation-wrap span:nth-child(1) {
    /* height: 4px; */
    animation-duration: 474ms;
  }
  .animation-wrap span:nth-child(2) {
    /* height: 6px; */
    animation-duration: 433ms;
  }
  .animation-wrap span:nth-child(3) {
    /* height: 8px; */
    animation-duration: 407ms;
  }
  .item-type-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    p {
      margin: 0 4px 4px 0;
      width: 58px;
      height: 24px;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      color: #cccccc;
      background-color: rgba(216, 216, 216, 0.1);
    }
    .item-type-text-show {
      color: #ffffff;
    }
  }
}
</style>