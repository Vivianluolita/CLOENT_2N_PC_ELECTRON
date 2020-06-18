<template>
  <!-- 房间头部个人中心 -->
  <div class="room-header-personal-center-wrap">
    <img :src="userInfo.avatar" @click="openStting" />
    <UserSetting />
  </div>
</template>

<script>
import UserSetting from '../../userSetting/userSettingIndex/userSettingIndex'
export default {
  data () {
    return {
      // loginedAvatar: require('@/assets/img/room/icon/pic.png')
    }
  },
  components: {
    UserSetting
  },
  methods: {
    openStting () {
      this.$store.dispatch('userSettingClick')
    }
  },
  computed: {
    userInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.userInfo))
    }
  }
}
</script>

<style lang="less" scoped>
.room-header-personal-center-wrap {
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(234, 236, 239, 1);
  }
}
</style>