<template>
  <div class="contain-main-wrap">
    <!-- 广告位 -->
    <nn-contain-carousel class="cantain-main-carousel" v-show="channelTypeTagVisible"></nn-contain-carousel>
    <!-- 头部 -->
    <nn-contain-header class="cantain-main-header" v-show="channelTypeTagVisible"></nn-contain-header>
    <!-- 频道列表 -->
    <nn-channel-list class="cantain-main-list"></nn-channel-list>
    <!-- 加载更多 -->
    <!-- <nn-more class="cantain-main-more"></nn-more> -->
  </div>
</template>

<script>
import Header from './containerMain/ContainerMainHeader'
import ChannelList from './containerMain/ContainerMainList'
import ContainerMainCarousel from './containerMain/ContainerMainCarousel'
// import More from './containerMain/More'
export default {
  name: 'ContainerMain',
  data () {
    return {}
  },
  components: {
    'nn-contain-header': Header,
    'nn-channel-list': ChannelList,
    'nn-contain-carousel': ContainerMainCarousel
    // 'nn-more': More
  },
  computed: {
    channelTypeTagVisible () {
      return this.$store.state.home.channelSortTypeVisible
    }
  }
}
</script>
<style lang="less" scoped>
.contain-main-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .cantain-main-carousel {
    margin-top: 10px;
    padding: 0 20px;
    width: 100%;
    height: 200px;
    box-sizing: border-box;
  }
  .cantain-main-header {
    padding: 20px 0 7px;
    width: 100%;
    height: 26px;
  }
  .cantain-main-list {
    // padding-top: 7px;
    // padding-bottom: 50px;
    margin-bottom: 40px;
    flex: 1;
  }
}
</style>