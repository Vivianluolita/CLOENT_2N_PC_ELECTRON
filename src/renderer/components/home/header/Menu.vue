<template>
  <div class="header-menu-wrap">
    <div class="block">
      <img :src="refreshImg" @click="refreshBtn" class="refresh-button" />
    </div>
    <div class="block">
      <input
        :class="['search-input',{'search-input-focus':showSearchHistory}]"
        @blur="searchBlur"
        @focus="searchFocus"
        @keyup.enter="search()"
        placeholder="频道/分类/陪玩"
        type="text"
        v-model="searchValue"
      />
      <img :src="showSearchHistory?searchFocusImg:searchImg" @click="search" class="search-button" />
      <ul class="search-history-list" v-show="searchHistory.length > 0 && showSearchHistory">
        <li
          @mousedown="historyClick(item)"
          v-bind:key="index"
          v-for="(item,index) in searchHistory"
        >{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import util from '../../../utils/util'
export default {
  name: 'Menu',
  data () {
    return {
      // search_input: '',
      // @/assets/img/home/search_focus.png
      searchImg: require('@/assets/img/home/search.png'),
      searchFocusImg: require('@/assets/img/home/search_focus.png'),
      refreshImg: require('@/assets/img/home/refresh.png'),
      showSearchHistory: false
      //
    }
  },
  computed: {
    searchValue: {
      get () {
        return this.$store.state.home.searchValue
      },
      set (val) {
        this.$store.dispatch('GetSearchValue', val)
      }
    },
    // 搜索缓存的历史记录
    searchHistory () {
      return this.$store.state.home.searchListHistory
    }
  },
  destroyed () {
    ipcRenderer.removeListener('search-info-res', this.searchInfoRes)
  },
  created () {
    ipcRenderer.on('search-info-res', this.searchInfoRes)
  },
  mounted () {},
  methods: {
    searchInfoRes (event, params) {
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        if (params.data.data.has_more === true) {
          this.$store.dispatch('SetMoreBtnText', '加载更多')
        } else {
          this.$store.dispatch('SetMoreBtnText', '没有更多了')
        }
        // 刷新列表数据
        // this.$store.dispatch('SetChannelInfoList', params.data.data.list)
        if (!params.data.data.list || params.data.data.list.length === 0) {
          this.$store.dispatch('SetChannelInfoList', '')
        } else {
          this.$store.dispatch('SetChannelInfoList', params.data.data.list)
        }
        // 在请求的时候做
        // // 关闭排序
        // this.$store.dispatch('ShowChannelSortType', false)
        // // 左侧列表显示为一个都不选中
        // this.$store.dispatch('SelectContainerLeftList', -1)
        // this.$store.dispatch('SetChannelListLimit', 100)
      }
    },
    // 搜索
    search () {
      if (this.searchValue) {
        // this.showSearchHistory = false
        // // 关闭搜索历史显示
        // this.$store.dispatch('ShowSearchHistory', false)
        // 请求40条数据
        this.$store.dispatch('SetChannelListLimit', 40)
        // 左侧列表显示为一个都不选中
        this.$store.dispatch('SelectContainerLeftList', -1)
        // last_id还原
        this.$store.dispatch('SetLastChannelId', 0)
        // 关闭排序
        this.$store.dispatch('ShowChannelSortType', false)
        // 选择房间列表显示的类型
        this.$store.dispatch('SetChannelListTpye', 0)
        let limit = this.$store.state.home.channelListLimitNum
        let searchData = {
          // 页码(需要使用vueX)
          page: 1,
          limit: limit,
          // 输入信息
          keyword: this.searchValue
        }
        ipcRenderer.send('search-info', searchData)
        this.setsearchHistory(this.searchValue)
      } else {
        this.refreshHome()
      }
    },
    // 刷新按钮
    refreshBtn () {
      // 清除搜索框的value
      // this.$store.dispatch('GetSearchValue', '')
      // 请求100条数据
      this.$store.dispatch('SetChannelListLimit', 40)
      // // 左侧列表显示为一个都不选中
      // this.$store.dispatch('SelectContainerLeftList', 0)
      // // 打开排序
      // this.$store.dispatch('ShowChannelSortType', true)
      // // 排序默认为人气
      // this.$store.dispatch('SelectChannelSortType', 1)
      // ------------------
      // this.search()
      this.$store.dispatch('SetLastChannelId', 0)
      util.getChannelInfo()
    },
    // 存储搜索信息
    setsearchHistory (value) {
      // this.$store.dispatch('GetSearchListHistory', [])
      let arr = Object.assign([], this.searchHistory)
      arr.push(value)
      let setArr = [...new Set(arr)]
      if (setArr.length === 6) {
        // 删除数组的第0项
        setArr.splice(0, 1)
      }
      this.$store.dispatch('GetSearchListHistory', setArr)
    },
    // 点击历史记录
    historyClick (value) {
      this.$store.dispatch('GetSearchValue', value)
      // this.showSearchHistory = false
      // this.$store.dispatch('ShowSearchHistory', false)
      this.search()
    },
    // 搜索框聚焦的时候，显示搜索列表
    searchFocus () {
      // this.$store.dispatch('ShowSearchHistory', true)
      this.showSearchHistory = true
    },
    searchBlur () {
      // this.$store.dispatch('ShowSearchHistory', false)
      this.showSearchHistory = false
    },
    // 刷新首页
    refreshHome () {
      // // // 清空足迹
      // // this.$store.dispatch('SetFootprintList', [])
      // // 清除搜索框的value
      // this.$store.dispatch('GetSearchValue', '')
      // // 关闭搜索框的历史列表
      // this.$store.dispatch('ShowSearchHistory', false)
      // // 左侧列表的选中项
      // this.$store.dispatch('SelectContainerLeftList', 0)
      // // 开启排序
      // this.$store.dispatch('ShowChannelSortType', true)
      // // 排序默认为人气
      // this.$store.dispatch('SelectChannelSortType', 1)
      // // 显示数量重新变成100
      // this.$store.dispatch('SetChannelListLimit', 100)
      // // 选择房间列表显示的类型
      // this.$store.dispatch('SetChannelListTpye', 0)
      // // 加载右侧数据
      // let infoData = {}
      // infoData.page = 1
      // infoData.limit = this.$store.state.home.channelListLimitNum
      // infoData.category_id = this.$store.state.home.containerLeftListOption
      // infoData.sort_type = this.$store.state.home.channelSortType
      // ipcRenderer.send('channel-info', infoData)
      // 把主页还原到最开始的状态
      util.homeRestore()
    }
  }
}
</script>

<style lang="less" scoped>
.header-menu-wrap {
  display: inline-flex;
  flex-direction: row;
  .block {
    position: relative;
    align-self: center;
    padding: 0 10px;
    .refresh-button {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .search-input {
      padding: 0 32px 0 18px;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      width: 150px;
      border: none;
      background: #dddddd;
      border-radius: 32px;
    }
    .search-input-focus::-webkit-input-placeholder {
      color: #222222;
    }
    .search-button {
      width: 15px;
      height: 15px;
      margin-left: -30px;
      margin-top: -3px;
      padding: 0;
      cursor: pointer;
    }
    .search-history-list {
      position: absolute;
      left: 10px;
      top: 30px;
      width: 200px;
      max-height: 200px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      z-index: 99;
      li {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #999999;
        border-radius: 5px;
        cursor: pointer;
      }
      li:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
