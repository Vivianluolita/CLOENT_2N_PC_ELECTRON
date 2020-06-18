<template>
  <div>
    <el-input
      v-on:keyup.native.enter="search"
      size="mini"
      :style="{ width: _width }"
      :placeholder="msg"
      v-model="input"
      class="input-with-select"
    >
      <el-button
        @click="search"
        slot="append"
        icon="el-icon-search"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  },
  props: {
    // 提示信息
    msg: String,
    // 搜索框宽度
    _width: String
  },
  methods: {
    search () {
      this.$emit('onSearch', this.input)
    }
  }
}
</script>

<style scoped></style>
