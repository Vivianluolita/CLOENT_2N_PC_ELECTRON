<template>
  <div class="syetemHeader-wrap">
    <div>设置</div>
    <div @click="closeSet" class="close">
      <i class="el-icon-close" style="color:#ffffff"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    closeSet () {
      this.$store.commit('isSettingClick')
    }
  }
}
</script>

<style lang="less" scoped>
.syetemHeader-wrap {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 5px 5px -3px #eee;
  color: #fff;
  background-image: linear-gradient(
    to right,
    rgba(70, 77, 248, 1),
    rgba(142, 126, 251, 1)
  );
  .close {
    cursor: pointer;
  }
}
</style>