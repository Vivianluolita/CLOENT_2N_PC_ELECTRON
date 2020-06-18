<template>
  <div class="userSetting-header-wrap">
    <div class="userSetting-header-topHeader">
      <div class="userSetting-header-topHeader-title">NN-个人中心</div>
      <div @click="closeDialog" class="userSetting-header-topHeader-close">
        <i class="el-icon-close" style="color:#ffffff"></i>
      </div>
    </div>
    <div class="userSetting-header-content">
      <div
        @mouseenter="isShowDialog = true"
        @mouseleave="isShowDialog = false"
        class="userSetting-header-content-imgBox"
      >
        <NnImage
          _height="200px"
          _width="200px"
          :isShow="isShowDialog"
          :userImg="imgUrl"
          @upload="upload"
        />
      </div>
      <div class="userSetting-header-content-infoBox">
        <div class="userSetting-header-content-name">
          {{info.nickname}}
          <span>(ID: {{info.nn_id}})</span>
        </div>
        <div>{{info.intro || '这家伙很懒，什么也没留下'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import NnImage from './NnImage'
export default {
  data () {
    return {
      isShowDialog: false,
      imgUrl: ''
    }
  },
  props: {
    info: Object
  },
  components: {
    NnImage
  },
  watch: {
    info (val) {
      if (val.toString() !== '{}') {
        this.imgUrl = val.avatar
      }
    }
  },
  mounted () {},
  methods: {
    upload () {},
    closeDialog () {
      this.$store.dispatch('userSettingClick')
    },
    changeImg () {
      console.log('dds')
    }
  }
}
</script>

<style lang="less" scoped>
.userSetting-header-wrap {
  width: 100%;
  height: 130px;
  box-sizing: border-box;
  padding: 10px 20px;
  background: #999999;
  box-sizing: border-box;
  background: url('../../../assets/img/userSetting/personcenter_bg.png')
    no-repeat;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  .userSetting-header-topHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    .userSetting-header-topHeader-title {
      color: white;
    }
    .userSetting-header-topHeader-close {
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
    }
  }
  .userSetting-header-content {
    display: flex;
    align-items: center;
    .userSetting-header-content-imgBox {
      width: 80px;
      height: 80px;
      text-align: center;
      border-radius: 40px;
      background: rgba(255, 255, 255, 0.1);
      margin-right: 20px;
      position: relative;
      /deep/ .v-modal {
        z-index: -1;
      }
      img {
        width: 70px;
        height: 70px;
        margin-top: 5px;
        border-radius: 35px;
      }
      .userSetting-header-content-imgBox-dialog {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 70px;
        height: 70px;
        border-radius: 35px;
        background: rgba(0, 0, 0, 0.5);
        .userSetting-dialog-text {
          font-size: 12px;
          color: white;
        }
      }
    }
    .userSetting-header-content-infoBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 80px;
      padding: 15px 0;
      box-sizing: border-box;
      font-size: 14px;
      color: white;
      .userSetting-header-content-name {
        font-size: 16px;
        span {
          font-size: 14px;
        }
      }
    }
  }
}
</style>