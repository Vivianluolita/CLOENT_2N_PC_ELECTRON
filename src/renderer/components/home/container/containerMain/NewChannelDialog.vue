<template>
  <div class="new-Channel-wrap">
    <!-- <el-button @click="onCreateChannelBtnCick" class="header-btn el-icon-plus" size="mini">创建频道</el-button> -->
    <el-dialog
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="newChannelDialogVisible"
      @open="onOpenDia"
      class="dialog"
      style="border-radius: 8px;"
      width="666px"
    >
      <!-- title -->
      <div class="dialog-header" slot="title">
        <span class="title">填写频道基本资料</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="comment">{{'(你还可以创建'+createNum+'个频道)'}}</span>
      </div>
      <nn-new-channel @closeDialog="closeDialog" ref="newChannel"></nn-new-channel>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import NewChannel from '../../ChannelManagement/NewChannel'
import { Storage } from '../../../../../main/db/dbStore'
export default {
  name: 'NewChannelDialog',
  data () {
    return {
      // token: '',
      createNum: 0
    }
  },
  components: {
    'nn-new-channel': NewChannel
  },
  destroyed () {
    ipcRenderer.removeListener(
      'create-channel-num-res',
      this.createChannelNumRes
    )
  },
  created () {
    ipcRenderer.on('create-channel-num-res', this.createChannelNumRes)
  },
  mounted () {
    this.$store.dispatch('NewChannelBtnClick', false)
  },
  computed: {
    newChannelDialogVisible () {
      return this.$store.state.home.changeNewChannelDiaVisible
    }
    // getCookie () {
    //   return this.$store.state.public.token
    // }
  },
  methods: {
    createChannelNumRes (event, params) {
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        this.createNum = params.data.data.remain_num
      }
    },
    // 打开dialog初始化的时候执行
    onOpenDia () {
      // this.createNum = 3
      this.getCreateChannelNun()
    },
    // dialog关闭的时候执行
    handleClose () {
      this.$refs.newChannel.cleanData()
      this.$store.dispatch('NewChannelBtnClick', false)
    },
    // 在子组件关闭dialog
    closeDialog () {
      this.$store.dispatch('NewChannelBtnClick', false)
    },
    // 获取创建频道个数
    getCreateChannelNun () {
      ipcRenderer.send('create-channel-num')
    }
  }
}
</script>
<style lang="less" scoped>
.new-Channel-wrap {
  .header-btn {
    font-size: 14px;
    color: #ffffff;
    border-radius: 30px;
    background-image: linear-gradient(#4444fc, #8e79fe);
    border: none;
  }
  .dialog {
    /deep/.el-dialog {
      border-radius: 10px;
    }
    /deep/.el-dialog__header {
      padding: 10px 20px 10px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    }
    .dialog-header {
      height: 40px;
      line-height: 40px;
      .title {
        font-size: 16px;
      }
    }
  }
}
</style>