<template>
  <div class="voicePointOut-wrap">
    <div class="voicePointOut-header">
      <div class="header-title">关闭所有声音</div>
      <el-switch @change="allChange" class="right" v-model="closeAll" />
    </div>
    <div class="voicePointOut-body">
      <div :key="i" class="body-item" v-for="(item, i) in setList">
        <div class="body-item-left">
          <div class="dian" />
          <div class="body-item-left-title">{{item.title}}</div>
        </div>
        <el-switch
          :disabled="item.disable"
          @change="oneChange(i)"
          class="right"
          v-model="item.value"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Storage } from '../../../../main/db/dbStore'
export default {
  data () {
    return {
      closeAll: false,
      setList: [
        {
          title: '系统声音提示',
          value: true,
          disable: false
        },
        {
          title: '好友消息声音提示',
          value: true,
          disable: false
        },
        {
          title: '语音视频呼叫',
          value: true,
          disable: false
        }
      ]
    }
  },
  watch: {
    setList: {
      handler (newValue, oldValue) {
        console.log(11111)
        console.log(newValue)
        if (newValue.length > 0) {
          console.log(newValue.findIndex(target => target.value === true))
          if (newValue.findIndex(target => target.value === true) === -1) {
            this.closeAll = true
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    let data = JSON.parse(Storage.get(`${Storage.get('nn_id')}`))
    console.log('{{{{{{{{', data, this.$store.state.public.allInfo)
    if (data.systemVoice !== undefined && data.systemVoice) {
      this.systemVoice = data.systemVoice
    }
    if (data.friendsVoice && data.friendsVoice !== undefined) {
      this.friendsVoice = data.friendsVoice
    }
    if (data.AudioVideoVoice && data.AudioVideoVoice !== undefined) {
      this.AudioVideoVoice = data.AudioVideoVoice
    }
  },
  methods: {
    allChange (e) {
      if (e) {
        this.setList.forEach(res => {
          res.disable = true
          res.value = false
          let a = ['systemVoice', 'friendsVoice', 'AudioVideoVoice']
          a.forEach(res => {
            let parama = {
              key: Storage.get('nn_id'),
              name: res,
              val: false
            }
            this.$store.commit('SYSTEMSET', parama)
          })
        })
      } else {
        this.setList.forEach(res => {
          res.disable = false
          res.value = true
        })
      }
    },
    oneChange (i) {
      switch (i) {
        case 0:
          let parama = {
            key: Storage.get('nn_id'),
            name: 'systemVoice',
            val: this.setList[i].value
          }
          this.$store.commit('SYSTEMSET', parama)
          // Storage.set('systemVoice', this.setList[i].value)
          break
        case 1:
          let paramb = {
            key: Storage.get('nn_id'),
            name: 'friendsVoice',
            val: this.setList[i].value
          }
          this.$store.commit('SYSTEMSET', paramb)
          // Storage.set('friendsVoice', this.setList[i].value)
          break
        case 2:
          let paramc = {
            key: Storage.get('nn_id'),
            name: 'AudioVideoVoice',
            val: this.setList[i].value
          }
          this.$store.commit('SYSTEMSET', paramc)
          // Storage.set('AudioVideoVoice', this.setList[i].value)
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-switch.is-checked .el-switch__core {
  border-color: #4e4afc;
  background: #4e4afc;
}
.voicePointOut-wrap {
  .voicePointOut-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(216, 216, 216, 1);
    padding-bottom: 30px;
    .header-title {
      font-size: 14px;
      color: rgba(48, 48, 51, 1);
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
    }
  }
  .voicePointOut-body {
    margin-top: 40px;
    .body-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      .body-item-left {
        display: flex;
        align-items: center;
        .dian {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background: #666;
          margin-right: 10px;
        }
        .body-item-left-title {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>