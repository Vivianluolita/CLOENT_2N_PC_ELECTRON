<template>
  <div class="div1" v-bind:class="{mini: isMini}">
    <div class="bar">
      <el-button @click="toggle" class="btn" size="mini" type="primary">0</el-button>
    </div>
    <div class="window" v-bind:class="{miniWindow: isMini}">
      <el-input style="width: 150px;"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isMini: false
    }
  },
  methods: {
    toggle () {
      this.isMini = !this.isMini
    }
  }
}
</script>

<style lang="less" scoped>
.div1 {
  position: relative;
  // position: absolute;
  width: 305px;
  height: 200px;
  // /* line-height: 200px; */
  // /* text-align: center; */
  transition: width 0.75s;
}
.mini {
  width: 50px;
}
.bar {
  position: absolute;
  width: 50px;
  height: 100px;
  background-color: blueviolet;
  top: 0px;
  left: 0px;
}
.window {
  position: absolute;
  width: 255px;
  height: 100%;
  background-color: steelblue;
  left: 50px;
  top: 0px;
  transition: width 0.75s;
}
.miniWindow {
  width: 0px;
}
</style>
