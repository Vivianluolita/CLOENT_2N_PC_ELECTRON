<template>
  <div class="container-left-wrap">
    <div class="pug-collect">
      <nn-game-collect-channel></nn-game-collect-channel>
    </div>
    <div class="left-type-list">
      <el-menu
        :collapse="isCollapse"
        :default-active="active"
        @select="handleSelect"
        active-text-color="#23F3AD"
        class="el-menu-vertical"
        text-color="#F5F5F5"
      >
        <nn-game-category-item
          :active="active"
          :arrLength="channelCategroy.length"
          :data="item"
          :num="index"
          v-bind:key="item.id"
          v-for="(item,index) in channelCategroy"
        ></nn-game-category-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import GameCategoryItem from './gameCategory/GameCategoryItem'
import { ipcRenderer } from 'electron'
import GameCollectAndChannel from './gameCategory/GameCollectAndChannel'
export default {
  name: 'ContainerLeft',
  data () {
    return {
      isCollapse: false,
      // active: '0',
      container_left_bg: require('@/assets/img/home/channel_left_bg.png')
    }
  },
  components: {
    'nn-game-category-item': GameCategoryItem,
    'nn-game-collect-channel': GameCollectAndChannel
  },
  destroyed () {
    ipcRenderer.removeListener('channel-info-res', this.channelInfoRes)
  },
  created () {
    ipcRenderer.on('channel-info-res', this.channelInfoRes)
  },
  mounted () {
    console.log(this.channelCategroy)
    this.getChannelInfo()
  },
  computed: {
    channelCategroy () {
      return this.$store.state.home.categoryListArr
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
  // watch: {
  //   // active: {
  //   //   handler (newValue, oldValue) {
  //   //     this.getChannelInfo()
  //   //   },
  //   //   deep: true
  //   // },
  //   sortType: {
  //     handler (newValue, oldValue) {
  //       this.getChannelInfo()
  //     },
  //     deep: true
  //   },
  //   getLimit: {
  //     handler (newValue, oldValue) {
  //       this.getChannelInfo()
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    channelInfoRes (event, params) {
      console.log('我是左侧列表')
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        if (params.data.data.has_more === true) {
          this.$store.dispatch('SetMoreBtnText', '加载更多')
        } else {
          this.$store.dispatch('SetMoreBtnText', '没有更多了')
        }
        // if (!params.data.data.list || params.data.data.list.length === 0) {
        //   this.$store.dispatch('SetChannelInfoList', '')
        // } else {
        //   this.$store.dispatch('SetChannelInfoList', params.data.data.list)
        // }
        // 通过last_id 来判断是加载更多还是首次加载
        if (params.data.data.last_id === 0) {
          if (!params.data.data.list || params.data.data.list.length === 0) {
            this.$store.dispatch('SetChannelInfoList', '')
          } else {
            this.$store.dispatch('SetChannelInfoList', params.data.data.list)
          }
        } else {
          if (!(!params.data.data.list || params.data.data.list.length === 0)) {
            let newList = Object.assign(
              [],
              this.$store.state.home.channelInfoList
            )
            this.$store.dispatch(
              'SetChannelInfoList',
              newList.concat(params.data.data.list)
            )
          }
        }
        // 变更last_id，方便做加载更多
        if (params.data.data.next_id) {
          this.$store.dispatch('SetLastChannelId', params.data.data.next_id)
        }
        // 还需要加有没有更多的判断
        // this.channel_info_list = params.data.data.list
      }
    },
    // 请求列表数据
    getChannelInfo () {
      let infoData = {}
      // 页码(需要使用vueX)
      // infoData.page = 1
      infoData.limit = 40
      infoData.category_id = this.stringToNumber(this.active)
      infoData.sort_type = this.stringToNumber(this.sortType)
      infoData.last_id = this.stringToNumber(this.getLastChannelId)
      ipcRenderer.send('channel-info', infoData)
    },
    // 选中的回调
    handleSelect (index) {
      // this.active = index
      // 清除搜索框的value
      this.$store.dispatch('GetSearchValue', '')
      // // 关闭搜索框的历史列表
      // this.$store.dispatch('ShowSearchHistory', false)
      // 左侧列表的选中项
      this.$store.dispatch('SelectContainerLeftList', parseInt(index))
      // 开启排序
      this.$store.dispatch('ShowChannelSortType', true)
      // 排序默认为人气
      this.$store.dispatch('SelectChannelSortType', 1)
      // 显示数量重新变成40
      this.$store.dispatch('SetChannelListLimit', 40)
      // last_id还原
      this.$store.dispatch('SetLastChannelId', 0)
      // 选择房间列表显示的类型
      this.$store.dispatch('SetChannelListTpye', 0)
      this.getChannelInfo()
      console.log(this.$store.state.home.containerLeftListOption)
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
.container-left-wrap {
  width: 160px;
  height: 100%;
  background-image: url('../../../assets/img/home/channel_left_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .pug-collect {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 5px;
  }
  .left-type-list {
    width: 100%;
    flex: 1;
    .el-menu-vertical {
      border: none;
      background-color: transparent;
    }
  }
}
</style>