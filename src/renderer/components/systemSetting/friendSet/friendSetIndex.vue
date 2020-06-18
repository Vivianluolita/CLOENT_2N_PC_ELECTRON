<template>
  <div class="friendSet-wrap">
    <div class="friendSet-item">
      <div class="friendSet-item-title">好友验证</div>
      <el-radio-group @change="checkChange" v-model="info.friend_verification_type">
        <el-radio :key="i" :label="item.value" v-for="(item, i) in friendCheck">{{item.title}}</el-radio>
      </el-radio-group>
    </div>
    <!-- <div class="friendSet-item">
            <div class="friendSet-item-title">好友消息提醒</div>
            <el-radio-group v-model="remindValue">
                <el-radio
                    :label="item.value"
                    v-for="(item, i) in remindList"
                    :key='i'>
                    {{item.title}}</el-radio>
            </el-radio-group>
    </div>-->
    <!-- <div class="friendSet-item">
            <div class="friendSet-item-title">好友状态分享</div>
            <div class="friendSet-item-Box">
                <div class="left">向好友共享当前频道</div>
                <el-switch class='right' v-model="shareRoom" />
            </div>
            <div class="friendSet-item-Box">
                <div class="left">向好友共享所玩的游戏</div>
                <el-switch class='right' v-model="shareGame" />
            </div>
    </div>-->
  </div>
</template>

<script>
import { ipcRenderer, remote, session } from 'electron'
export default {
  data () {
    return {
      friendCheck: [
        {
          title: '允许任何人添加',
          value: 1
        },
        {
          title: '需要验证身份',
          value: 2
        },
        {
          title: '拒绝任何人添加',
          value: 3
        }
      ],
      remindList: [
        {
          title: '自动在系统托盘处闪动提醒',
          value: 1
        },
        {
          title: '直接弹出到任务栏进行提醒',
          value: 2
        }
      ],
      // checkValue: '',
      remindValue: '',
      shareRoom: false,
      shareGame: false
    }
  },
  props: {
    info: Object
  },
  created () {
    // this.checkValue = this.info.friend_verification_type
  },
  mounted () {},
  methods: {
    checkChange (e) {
      let data = {
        friend_verification_type: e
      }
      ipcRenderer.send('system-setting-updata-extend-info', data)
    }
  }
  // watch: {
  //   info: {
  //     handler (newValue, oldValue) {
  //       this.checkValue = newValue.friend_verification_type
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style lang="less" scoped>
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #4e4afc;
  background: #4e4afc;
}
.friendSet-wrap {
  .friendSet-item {
    margin-bottom: 20px;
    /deep/ .el-radio {
      width: 100%;
      margin-bottom: 15px;
      .el-radio__label {
        font-size: 14px;
        color: #333;
      }
    }
    .friendSet-item-title {
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      margin-bottom: 20px;
    }
    .friendSet-item-Box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      .left {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>