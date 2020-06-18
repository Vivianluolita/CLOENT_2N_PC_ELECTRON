import store from '../store'
import { ipcRenderer } from 'electron'
// 工具方法
let utils = {
  getLocation () {
    let local = window.location.origin

    let arr = local.split(':')
    if (arr[0] === 'file') {
      arr[0] = 'https'
      return arr.join(':')
    }
    return local
  },
  // 通过时间戳获取时间
  timeStampToTime (timeStamp) {
    let time = new Date(timeStamp)
    let hour = time.getHours()
    let min = time.getMinutes()
    let sec = time.getSeconds()
    if (hour < 10) hour = '0' + hour
    if (min < 10) min = '0' + min
    let DateTime = hour + ':' + min
    return DateTime
  },
  // 时间戳转日期
  stampToTime (timeStamp) {
    let time = new Date(timeStamp)
    let year = time.getFullYear()
    let month = time.getMonth()
    let day = time.getDate()
    let hour = time.getHours()
    let min = time.getMinutes()
    let sec = time.getSeconds()
    if (hour < 10) hour = '0' + hour
    if (min < 10) min = '0' + min
    let DateTime = hour + ':' + min + ' ' + month + '/' + day
    return DateTime
  },
  // 获取cookie
  getCookie (key) {
    if (process.client) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
    }
    return ''
  },
  // 访问粘贴板
  copyValue (val) {
    // 如果这里换为 input 则不支持换行
    var temp = document.createElement('textarea')
    temp.value = val
    document.body.appendChild(temp)
    temp.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    temp.style.display = 'none'
  },
  // 全局静态资源路径处理
  handleStaticUrl (url) {
    let _url
    if (url.indexOf('https') > -1) {
      // 绝对路径
      _url = url
    } else {
      _url = 'https://static.nn.com/' + url
    }
    return _url
  },
  // 生成GUID
  GUID () {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    )
  },
  // 根据生日获取星座
  getHoroByBirth (birthDay) {
    if (birthDay) {
      let m = birthDay.substr(5, 2)
      let d = birthDay.substr(8, 2)
      return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'
        .substr(m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2, 2)
        .concat('座')
    } else {
      return ''
    }
  },
  // 判断对象是否为空
  judgeObj (obj) {
    for (var item in obj) {
      return true
    }
    return false
  },
  // uuid生成
  uuid (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
      ''
    )
    var uuid = []
    var i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      var r

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  },
  // 主页刷新
  homeRestore () {
    // 清除搜索框的value
    store.dispatch('GetSearchValue', '')
    // // 关闭搜索框的历史列表
    // store.dispatch('ShowSearchHistory', false)
    // 左侧列表的选中项
    store.dispatch('SelectContainerLeftList', 0)
    // 开启排序
    store.dispatch('ShowChannelSortType', true)
    // 排序默认为人气
    store.dispatch('SelectChannelSortType', 1)
    // 显示数量重新变成100
    store.dispatch('SetChannelListLimit', 40)
    // 选择房间列表显示的类型
    store.dispatch('SetChannelListTpye', 0)
    // 加载右侧数据
    let infoData = {}
    // infoData.page = 1
    infoData.last_id = store.state.home.lastChannelId
    // infoData.limit = store.state.home.channelListLimitNum
    infoData.limit = 40
    infoData.category_id = store.state.home.containerLeftListOption
    infoData.sort_type = store.state.home.channelSortType
    ipcRenderer.send('channel-info', infoData)
  },
  // 字符串转数字
  stringToNumber (data) {
    if (typeof data === 'number') {
      return data
    } else if (typeof data === 'string') {
      return parseInt(data)
    }
  },
  // 请求列表数据
  getChannelInfo () {
    if (store.state.home.containerLeftListOption === -1) {
      // 左侧列表和头部类型选择失效状态
      let channelListType = store.state.home.channelListType
      // 0是选择左侧列表的类型，1是我的频道的类型， 2是我的收藏的类型
      if (channelListType === 1) {
        // 我创建的频道的右边频道列表
        let limit = store.state.home.channelListLimitNum
        const data = {
          page: 1,
          // 现在只能创建三个频道,需要修改
          limit: 3
        }
        ipcRenderer.send('my-channel-list', data)
        // 我管理的频道右边频道列表
        const manageData = {
          page: 1,
          limit: limit
        }
        ipcRenderer.send('manage-channel-list', data)
      } else if (channelListType === 2) {
        // 我收藏的频道的右边频道列表
        let limit = store.state.home.channelListLimitNum
        const data = {
          page: 1,
          limit: limit
        }
        ipcRenderer.send('get-my-collect-list', data)
      } else {
        // 如果是搜索
        let limit = store.state.home.channelListLimitNum
        let searchValue = store.state.home.searchValue
        let searchData = {
          // 页码(需要使用vueX)
          page: 1,
          limit: limit,
          // 输入信息
          keyword: searchValue
        }
        ipcRenderer.send('search-info', searchData)
      }
    } else {
      let Option = store.state.home.containerLeftListOption
      // let limit = store.state.home.channelListLimitNum
      let sortType = store.state.home.channelSortType
      let lastId = store.state.home.lastChannelId
      let infoData = {
        // page: 1,
        // limit: utils.stringToNumber(limit),
        limit: 40,
        category_id: utils.stringToNumber(Option),
        sort_type: utils.stringToNumber(sortType),
        last_id: utils.stringToNumber(lastId)
      }

      ipcRenderer.send('channel-info', infoData)
    }
  }
}

export default utils
