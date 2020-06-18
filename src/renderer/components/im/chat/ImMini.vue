<template>
  <div class="container">
    <el-image
      :fit="fit"
      :src="url_msg"
      @click="toggle('msg')"
      class="icon icon-1"
      v-show="status != 'msg'"
    ></el-image>
    <el-image :fit="fit" :src="url_msg_active" class="icon icon-1" v-show="status === 'msg'"></el-image>
    <div class="hr"></div>
    <el-image
      :fit="fit"
      :src="url_contact"
      @click="toggle('contact')"
      class="icon icon-2"
      v-show="status != 'contact'"
    ></el-image>
    <el-image
      :fit="fit"
      :src="url_contact_active"
      class="icon icon-2"
      v-show="status === 'contact'"
    ></el-image>
  </div>
</template>

<script>
// eslint-disable-next-line node/no-deprecated-api
import { log } from 'util'
export default {
  data () {
    return {
      // msg, contact
      status: 'msg',
      fit: 'fill',
      url_msg: require('@/components/im/imgs/msg.png'),
      url_msg_active: require('@/components/im/imgs/msg-active.png'),
      url_contact: require('@/components/im/imgs/contact.png'),
      url_contact_active: require('@/components/im/imgs/contact-active.png')
    }
  },
  methods: {
    toggle (mode) {
      switch (mode) {
        case 'msg':
          console.log('mode=msg')
          this.status = 'msg'
          break
        case 'contact':
          console.log('mode=contact')
          this.status = 'contact'
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../common/less/common.less';

.container {
  position: relative;
  @{bgc}: @nn-base-white;
  width: 50px;
  height: 100px;
  @{bdr}: 25px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.hr {
  position: relative;
  width: 40px;
  height: 1px;
  border-top: 1px #eee solid;
  margin: auto;
  margin-top: 5px;
}
.icon {
  cursor: pointer;
}
.icon-1 {
  width: 27px;
  height: 29px;
  margin-top: 10px;
}
.icon-2 {
  width: 27px;
  height: 29px;
  margin-top: 10px;
}
</style>
