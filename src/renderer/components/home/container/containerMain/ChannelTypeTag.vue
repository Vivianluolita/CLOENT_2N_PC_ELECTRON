<template>
  <div class="channel-type-tag-wrap">
    <p>{{categoryListOption.name}}</p>
    <span :class="{isShow:sortType === 1}" @click="optionType(1)">人气频道</span>
    <span :class="{isShow:sortType === 2}" @click="optionType(2)">最新上线</span>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ChannelTypeTag',
  data () {
    return {}
  },
  computed: {
    // 获取左侧列表的全部信息
    categoryListArr () {
      return this.$store.state.home.categoryListArr
    },
    // 左侧当前被选中的项
    categoryListOption () {
      let categoryListArr = this.$store.state.home.categoryListArr
      let option = this.$store.state.home.containerLeftListOption
      let optionArr = []
      categoryListArr.map((item, i) => {
        if (item.id === option) {
          optionArr = JSON.parse(JSON.stringify(item))
        }
      })
      return optionArr
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
    // 获取最后一项的房间id
    getLastChannelId () {
      return this.$store.state.home.lastChannelId
    }
  },
  created () {
    // ipcRenderer.on('channel-info-res', (event, params) => {
    //   console.log('vue title: ', params)
    //   if (params.data.code === 0) {
    //     this.$store.dispatch('SetChannelInfoList', params.data.data.list)
    //     // 还需要加有没有更多的判断
    //     // this.channel_info_list = params.data.data.list
    //   }
    // })
  },
  mounted () {},
  methods: {
    // 请求列表数据
    getChannelInfo () {
      let infoData = {}
      // infoData.page = 1
      infoData.limit = 40
      infoData.category_id = this.stringToNumber(this.active)
      infoData.sort_type = this.stringToNumber(this.sortType)
      infoData.last_id = this.stringToNumber(this.getLastChannelId)
      ipcRenderer.send('channel-info', infoData)
    },
    optionType (num) {
      // SelectChannelSortType
      console.log(num)
      this.$store.dispatch('SelectChannelSortType', num)
      // 显示数量重新变成40
      this.$store.dispatch('SetChannelListLimit', 40)
      // last_id还原
      this.$store.dispatch('SetLastChannelId', 0)
      this.getChannelInfo()
    },
    // 字符串转数字
    stringToNumber (data) {
      if (typeof data === 'number') {
        return data
      } else if (typeof data === 'string') {
        return parseInt(data)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.channel-type-tag-wrap {
  width: 360px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  p {
    padding-left: 22px;
    height: 26px;
    font-size: 20px;
    line-height: 26px;
  }
  span {
    width: 75px;
    height: 26px;
    font-size: 12px;
    text-align: center;
    color: #666666;
    line-height: 24px;
    border: 1px solid #cccccc;
    border-radius: 16px;
    box-sizing: border-box;
    cursor: pointer;
  }
  span:nth-of-type(1) {
    margin: 0 10px 0 20px;
  }
  span:hover {
    color: #6236ff;
    border: 1px solid #6236ff;
  }
  .isShow {
    color: #6236ff;
    border: 1px solid #6236ff;
  }
}
</style>