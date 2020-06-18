<template>
  <div class="header-logo-wrap">
    <!-- <el-image :src="logo" class="logo" fit="fill"></el-image>
    <div class="title">
      <p class="t1">
        <span>NN</span>
        <span>.com</span>
      </p>
      <p class="t2">全球游戏社交平台</p>
    </div>-->
  </div>
</template>

<script>
export default {
  naem: 'Logo',
  data () {
    return {
      logo: require('@/assets/img/home/logo.png')
    }
  }
}
</script>

<style lang="less" scoped>
// .header-logo-wrap {
//   width: 159px;
//   color: #333;
//   display: inline-flex;
//   flex-direction: row;
//   justify-content: center;
//   .logo {
//     width: 52px;
//     height: 52px;
//     align-self: center;
//   }
//   .title {
//     align-self: center;
//     margin-left: 0px;
//     .t1 {
//       font-size: 18px;
//       font-weight: 600;
//       letter-spacing: 1px;
//     }
//     .t2 {
//       letter-spacing: 1px;
//       font-size: 12px;
//     }
//     p {
//       margin: 0;
//       padding: 0;
//     }
//   }
// }
.header-logo-wrap {
  margin-top: 9.5px;
  margin-left: 6px;
  width: 126px;
  height: 36px;
  background-image: url('../../../assets/img/home/header_logo_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
