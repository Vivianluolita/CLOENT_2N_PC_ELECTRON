<template>
  <div class="header-nav-wrap">
    <div class="nav-left">
      <div>
        <a href="http://map.nn.com" target="_blank">雷神科技</a>
      </div>
      <div>
        <a href="http://www.nn.com/" target="_blank">NN</a>
      </div>
      <div>
        <a href="https://www.leigod.com/" target="_blank">NN加速器</a>
      </div>
      <div>
        <a href="https://n.nn.com/" target="_blank">N站</a>
      </div>
    </div>
    <div class="nav-right">
      <div>
        <a style="cursor:default;"></a>
      </div>
      <div>
        <a>注销登录</a>
      </div>
      <div>
        <a>立即登录</a>
      </div>
      <div>
        <a>新手指引</a>
      </div>
      <div>
        <a>帮助中心</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderNav',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.header-nav-wrap {
  display: flex;
  flex-direction: row;
  height: 35px;
  background: #333;
  justify-content: space-between;
  align-items: center;
  color: white;
  .nav-left,
  .nav-right {
    display: flex;
    > div {
      padding: 0 15px;
      font-size: 12px;
      font-weight: 400;
      a {
        color: rgba(255, 255, 255, 1);
        text-decoration: none;
        line-height: 35px;
        cursor: pointer;
      }
    }
  }
}
</style>
