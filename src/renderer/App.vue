<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'NN',
  mounted () {
    // 友盟系统里面取一个js代码
    const script = document.createElement('script')
    script.src =
      'https://v1.cnzz.com/z_stat.php?id=1278271539&web_id=1278271539'
    script.language = 'JavaScript'
    document.body.appendChild(script)
  }
}
</script>

<style>
/* CSS */
#app {
  width: 100%;
  height: 100%;
}
</style>
