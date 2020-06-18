<template>
  <div>
    <ChatWindow />
  </div>
</template>

<script>
import ChatWindow from '../components/im/chat/ChatWindow'

export default {
  name: 'im',
  components: {
    ChatWindow
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.im-mini {
  position: relative;
}
</style>
