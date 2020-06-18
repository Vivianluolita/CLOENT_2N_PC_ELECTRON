<template>
  <div class="container-main-channel-wrap">
    <div class="channel-title">我创建的频道</div>
    <!-- 频道列表 -->
    <nn-channel-list :_repeat="true" class="cantain-main-list"></nn-channel-list>
    <div class="channel-title manage-channel-title">我管理的频道</div>
    <!-- 频道列表 -->
    <nn-channel-list class="cantain-main-list manage-channel-list"></nn-channel-list>
    <nn-disband-channel></nn-disband-channel>
    <el-dialog
      :before-close="editHandleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="editChannelDialogVisible"
      class="editdialog"
      style="border-radius: 8px;"
      width="666px"
    >
      <!-- title -->
      <div class="dialog-header" slot="title">
        <span class="title">编辑频道基本资料</span>
      </div>
      <!-- <nn-edit-channel @closeDialog="editcloseDialog" ref="editChannel"></nn-edit-channel> -->
      <nn-edit-channel ref="editChannel"></nn-edit-channel>
    </el-dialog>
    <el-dialog
      :before-close="watchHandleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="watchChannelDialogVisible"
      class="watchdialog"
      style="border-radius: 8px;"
      width="666px"
    >
      <!-- title -->
      <div class="dialog-header" slot="title">
        <span class="title">查看频道基本资料</span>
      </div>
      <!-- <nn-watch-channel @closeDialog="watchcloseDialog" ref="editChannel"></nn-watch-channel> -->
      <nn-watch-channel ref="watchChannel"></nn-watch-channel>
    </el-dialog>
  </div>
</template>

<script>
import ChannelList from './containerMain/ContainerMainList'
import DisbandChannel from '../ChannelManagement/DisbandChannel'
import EditChannel from '../ChannelManagement/EditChannel'
import WatchChannel from '../ChannelManagement/WatchChannel'
export default {
  name: 'ContainerMainChannel',
  data () {
    return {}
  },
  components: {
    'nn-channel-list': ChannelList,
    'nn-disband-channel': DisbandChannel,
    'nn-edit-channel': EditChannel,
    'nn-watch-channel': WatchChannel
  },
  computed: {
    editChannelDialogVisible () {
      return this.$store.state.home.changeEditChannelDiaVisible
    },
    watchChannelDialogVisible () {
      return this.$store.state.home.changeWatchChannelDiaVisible
    }
  },
  mounted () {},
  methods: {
    // 在子组件关闭dialog
    // editcloseDialog () {
    //   this.$store.dispatch('editChannelBtnClick', false)
    // },
    // watchcloseDialog () {
    //   this.$store.dispatch('watchChannelBtnClick', false)
    // }
    // dialog关闭的时候执行
    editHandleClose () {
      this.$refs.editChannel.cleanData()
      this.$store.dispatch('editChannelBtnClick', false)
    },
    watchHandleClose () {
      this.$refs.watchChannel.cleanData()
      this.$store.dispatch('watchChannelBtnClick', false)
    }
  }
}
</script>

<style lang="less" scoped>
.container-main-channel-wrap {
  position: relative;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .channel-title {
    margin-left: 22px;
    padding: 20px 0 7px 0;
    width: 100%;
    height: 26px;
    line-height: 26px;
    color: #333333;
    text-align: left;
    font-size: 20px;
  }
  .manage-channel-title {
    padding-top: 8px;
  }
  .cantain-main-list {
    // padding-bottom: 50px;
  }
  .manage-channel-list {
    flex: 1;
    margin-bottom: 40px;
  }
  .header-btn {
    font-size: 14px;
    color: #ffffff;
    border-radius: 30px;
    background-image: linear-gradient(#4444fc, #8e79fe);
    border: none;
  }
  .editdialog,
  .watchdialog {
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