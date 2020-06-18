export const utils = {
  methods: {
    /*
    全局消息提示
    msg(String) 提示语
    type(String) 消息类型 success/warning/info/error
    */
    NN_MSG (msg, type) {
      this.$notify({
        title: '',
        message: msg,
        type: type
      })
    },
    /*
    全局调试日志
    */
    NN_IM_LOG (key, value) {
      console.group('%c┏ IM模块 (●ﾟωﾟ●) --------------', 'color: cornflowerblue;font-size:10px')
      if (value) {
        console.log('%c' + key + ':', 'color: dodgerblue;font-size:12px', value)
      } else {
        console.log('%c' + key, 'color: dodgerblue;font-size: 12px;')
      }
      console.log('%c时间:' + this.getTime(), 'color: #888;')
      console.log('%c---------------------------- ┛', 'color: cornflowerblue;font-size:10px')
      console.groupEnd()
    },
    // 通过时间戳获取时间
    getTime () {
      let time = new Date()
      let hour = time.getHours()
      let min = time.getMinutes()
      let sec = time.getSeconds()
      if (hour < 10) hour = '0' + hour
      if (min < 10) min = '0' + min
      let DateTime = hour + ':' + min + ':' + sec
      return DateTime
    }
  }
}
