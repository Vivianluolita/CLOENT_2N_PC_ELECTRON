<template>
  <div class="contain-header-wrap">
    <nn-channel-type-tag></nn-channel-type-tag>
    <!-- <nn-new-channel-dialog class="new-channel-dialog"></nn-new-channel-dialog> -->
    <el-button @click="onCreateChannelBtnCick" class="new-channel-dialog" size="mini">创建频道</el-button>
  </div>
</template>

<script>
// import NewChannelDialog from './NewChannelDialog'
import ChannelTypeTag from './ChannelTypeTag'
export default {
  name: 'ContainerMainHeader',
  data () {
    return {}
  },
  components: {
    // 'nn-new-channel-dialog': NewChannelDialog,
    'nn-channel-type-tag': ChannelTypeTag
  },
  computed: {
    getCookie () {
      return this.$store.state.public.token
    }
  },
  methods: {
    onCreateChannelBtnCick () {
      // 关闭搜索历史列表
      // this.$store.dispatch('ShowSearchHistory', false)
      // 判断有没有token
      if (this.getCookie) {
        this.$store.dispatch('NewChannelBtnClick', true)
        // } else {
      } else {
        this.$store.dispatch('loginBtnClick', 1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contain-header-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .new-channel-dialog {
    position: absolute;
    right: 21px;
    top: 19px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 30px;
    background-image: linear-gradient(#4444fc, #8e79fe);
    border: none;
  }
}
</style>