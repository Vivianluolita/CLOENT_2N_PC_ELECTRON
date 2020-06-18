<template>
  <div @click="loadMore" class="contain-main-more-wrap">{{moreBtnText}}</div>
</template>

<script>
import { ipcRenderer } from 'electron'
import util from '../../../../utils/util'
export default {
  name: 'More',
  data () {
    return {}
  },
  computed: {
    channelListLimit () {
      return this.$store.state.home.channelListLimitNum
    },
    // 分类ID
    active () {
      if (typeof this.$store.state.home.containerLeftListOption === 'number') {
        return this.$store.state.home.containerLeftListOption.toString()
      } else if (
        typeof this.$store.state.home.containerLeftListOption === 'string'
      ) {
        return this.$store.state.home.containerLeftListOption
      }
      // return this.$store.state.home.containerLeftListOption
    },
    // 排序类型
    sortType () {
      return this.$store.state.home.channelSortType
    },
    // 每页数量
    getLimit () {
      return this.$store.state.home.channelListLimitNum
    },
    moreBtnText () {
      return this.$store.state.home.moreBtnText
    }
  },
  created () {},
  mounted () {},
  methods: {
    loadMore () {
      let limit = this.channelListLimit + 40
      this.$store.dispatch('SetChannelListLimit', limit)
      this.getChannelInfo()
    },
    // 请求列表数据
    getChannelInfo () {
      util.getChannelInfo()
    }
    // 字符串转数字
    // stringToNumber (data) {
    //   if (typeof data === 'number') {
    //     return data
    //   } else if (typeof data === 'string') {
    //     return parseInt(data)
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.contain-main-more-wrap {
  width: 100%;
  height: 19px;
  line-height: 19px;
  font-size: 14px;
  text-align: center;
  color: #999999;
  cursor: pointer;
}
</style>