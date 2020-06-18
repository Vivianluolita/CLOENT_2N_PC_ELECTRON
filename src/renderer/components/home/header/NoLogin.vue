<template>
  <div class="alreadyLogin-wrap">
    <div class="alreadyLogin-title">登录之后可以</div>
    <div class="alreadyLogin-box">
      <div :key="i" class="alreadyLogin-item" v-for="(item, i) in doList">
        <el-image :src="item.img" fit="fill" />
        <div>{{item.title}}</div>
      </div>
    </div>
    <div class="alreadyLogin-btns">
      <el-button @click="goLogin" class="alreadyLogin-login">登录</el-button>
      <el-button @click="goPost" class="alreadyLogin-post">注册</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      doList: [
        {
          img: require('../../../assets/img/userSetting/addFriends.png'),
          title: '加好友'
        },
        {
          img: require('../../../assets/img/userSetting/upMai.png'),
          title: '上麦发言'
        },
        {
          img: require('../../../assets/img/userSetting/creatRoom.png'),
          title: '创建频道'
        }
      ]
    }
  },
  methods: {
    goLogin () {
      this.$store.dispatch('loginBtnClick', 1)
    },
    goPost () {
      this.$store.dispatch('loginBtnClick', 2)
    }
  }
}
</script>

<style lang="less" scoped>
.alreadyLogin-wrap {
  width: 276px;
  .alreadyLogin-title {
    font-size: 14px;
    color: #999;
    padding-left: 26px;
  }
  .alreadyLogin-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    margin-top: 15px;
    .alreadyLogin-item {
      width: 55px;
      text-align: center;
      img {
        width: 55px;
      }
      div {
        font-size: 12px;
        color: #333;
      }
    }
  }
  .alreadyLogin-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 22px;
    margin-top: 22px;
    margin-bottom: 10px;
    .alreadyLogin-login {
      width: 110px;
      height: 30px;
      padding: 0;
      color: #fff;
      background: linear-gradient(#8e79fe, #4444fc);
    }
    .alreadyLogin-post {
      width: 110px;
      height: 30px;
      padding: 0;
      color: #6236ff;
      border: 1px solid #6236ff;
    }
  }
}
</style>