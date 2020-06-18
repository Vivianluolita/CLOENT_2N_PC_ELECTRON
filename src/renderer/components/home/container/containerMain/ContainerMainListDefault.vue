<template>
  <div class="container-main-channel-default-wrap">
    <img :src="channel_list_default" alt />
    <span>暂无符合结果的频道</span>
    <span>去大厅逛逛吧</span>
  </div>
</template>

<script>
export default {
  name: 'ContainerMainListDefault',
  data () {
    return {
      // channel_list_default
      channel_list_default: require('@/assets/img/home/channel_list_default.png')
    }
  }
}
</script>

<style lang="less" scoped>
.container-main-channel-default-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 116px;
    height: 127px;
  }
  span {
    height: 19px;
    font-size: 14px;
    color: #999999;
    line-height: 19px;
  }
  span:nth-of-type(1) {
    padding: 20px 0 10px;
    font-size: 16px;
    color: #cccccc;
  }
}
</style>