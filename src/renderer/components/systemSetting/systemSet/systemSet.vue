<template>
  <div class="systemSet-wrap">
    <div class="systemSet-item">
      <div class="left">开机时自动启动NN语音</div>
      <el-switch @change="saveTurnOn" class="right" v-model="isOpenTurnON" />
    </div>
    <div class="systemSet-item">
      <div class="left">开启自动登录</div>
      <el-switch @change="isOpen" class="right" v-model="isOpenNN" />
    </div>
    <div class="last-item">
      <div class="title">关闭主面板时:</div>
      <el-radio-group @change="radioChange" v-model="closePanel">
        <el-radio :label="1">最小化到任务栏通知区域，不退出程序</el-radio>
        <el-radio :label="2">退出程序</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { Storage } from '../../../../main/db/dbStore'
import { ipcRenderer, remote, session } from 'electron'
export default {
  data () {
    return {
      isOpenTurnON: true,
      isOpenNN: true,
      closePanel: 1
    }
  },
  created () {
    let data = JSON.parse(Storage.get(`${Storage.get('nn_id')}`))
    console.log('storage save', data)
    if (data.isOpenTurnON !== undefined) {
      this.isOpenTurnON = data.isOpenTurnON
    }
    if (data.isOpenNN !== undefined) {
      this.isOpenNN = data.isOpenNN
    }
    if (data.closePanel !== undefined) {
      this.closePanel = data.closePanel
    }
  },
  methods: {
    saveTurnOn (e) {
      let param = {
        key: Storage.get('nn_id'),
        name: 'isOpenTurnON',
        val: e
      }
      this.$store.commit('SYSTEMSET', param)
      Storage.set('isOpenTurnON', e)

      if (e) {
        ipcRenderer.send('changeAutoStart-open')
      } else {
        ipcRenderer.send('changeAutoStart-closed')
      }
    },
    isOpen (e) {
      let param = {
        key: Storage.get('nn_id'),
        name: 'isOpenNN',
        val: e
      }
      this.$store.commit('SYSTEMSET', param)
      Storage.set('isOpenNN', e)
    },
    radioChange (e) {
      let param = {
        key: Storage.get('nn_id'),
        name: 'isOpenTurnON',
        val: e
      }
      this.$store.commit('SYSTEMSET', param)
      // Storage.set('closePanel', e)
    }
  }
}
</script>

<style lang="less" scoped>
.systemSet-wrap {
  /deep/ .el-switch.is-checked .el-switch__core {
    border-color: #4e4afc;
    background-color: #4e4afc;
  }
  .systemSet-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    .left {
      font-size: 14px;
      color: #333;
    }
  }
  .last-item {
    .title {
      font-size: 14px;
      color: #333;
      margin-bottom: 18px;
    }
    /deep/ .el-radio {
      width: 100%;
      margin-bottom: 10px;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner {
      border-color: #4e4afc;
      background: #4e4afc;
    }
    /deep/ .el-radio__input.is-checked + .el-radio__label {
      color: #333;
    }
  }
}
</style>
