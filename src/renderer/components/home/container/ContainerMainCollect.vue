<template>
  <div class="container-main-collect-wrap">
    <div class="collect-title">我收藏的频道</div>
    <!-- 频道列表 -->
    <nn-channel-list class="cantain-main-list"></nn-channel-list>
  </div>
</template>

<script>
import ChannelList from './containerMain/ContainerMainList'
export default {
  name: 'ContainerMainCollect',
  data () {
    return {}
  },
  components: {
    'nn-channel-list': ChannelList
  }
}
</script>

<style lang="less" scoped>
.container-main-collect-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .collect-title {
    margin-left: 22px;
    padding: 20px 0 7px 0;
    width: 100%;
    height: 26px;
    line-height: 26px;
    color: #333333;
    text-align: left;
    font-size: 20px;
  }
  .cantain-main-list {
    flex: 1;
    // padding-bottom: 50px;
    margin-bottom: 40px;
  }
}
</style>