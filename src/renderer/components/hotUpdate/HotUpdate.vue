<template>
  <div class="hot-update">
    <el-dialog
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
    >
      <!-- 提示更新-->
      <div v-if="updateType===1">
        <div class="hot-mian">
          <img alt class="hot-logo-pic" src="@/assets/img/hotUpdate/updateLogo.png" />
          <p>
            <img alt src="@/assets/img/hotUpdate/updateLogoName.png" style="width:120px" />
          </p>
          <div>
            <button @click="onUpdateStart" class="hot-btn btn-reset">立即更新</button>
          </div>
        </div>
      </div>
      <!-- TODO更新中-->
      <!-- <div v-if="updateType===2">
        <div class="hot-mian">
          <img alt class="hot-logo-pic" src="@/assets/img/hotUpdate/updateLogo.png" />
          <p class="hot-tip-font">更新中，请耐心等待…</p>
        </div>
        <div class="hot-progress">
          <p>软件正在更新中</p>
          <el-progress :color="customColor" :percentage="percentage"></el-progress>
        </div>
      </div>-->
    </el-dialog>
    <!-- 退出提示 -->
    <el-dialog :visible.sync="tiperr" append-to-body class="hot-append" title="提示" width="376">
      <div class="hot-tip-close">
        <div class="hot-tip-info">
          <P>退出更新程序将无法使用最新功能</P>
          <P>确认退出？</P>
        </div>
        <div class="dialog-footer" slot="footer">
          <button @click="closeDialog" class="btn-reset hot-sure-btn">确 定</button>
          <button @click="tiperr = false" class="btn-reset hot-cancel-btn">取 消</button>
        </div>
      </div>
    </el-dialog>
    <!-- 更新报错 -->
    <el-dialog :visible.sync="innerVisible" append-to-body class="hot-append" title="提示">
      <div class="hot-tip-err">
        <div class="hot-tip-info">
          <P class="hot-err-title">
            <img
              alt
              src="@/assets/img/hotUpdate/icon-err.png"
              style="width:21px;height:19px;vertical-align: middle;"
            />
            <span style="vertical-align: middle;">网络链接中断</span>
          </P>
          <P>请检测网络是否连接正常</P>
        </div>
        <div class="dialog-footer" slot="footer">
          <button class="btn-reset hot-sure-btn" style="margin-right:0">重新检测</button>
        </div>
      </div>
    </el-dialog>
    <!-- TODO -->
    <!-- 更新完成 -->
    <!-- <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="updeteSuccess"
    >
      <div class="hot-mian">
        <img alt class="hot-logo-pic" src="@/assets/img/hotUpdate/updateLogo.png" />
        <p class="hot-tip-font">更新完成</p>
        <button @click="updeteSuccess = false" class="hot-btn btn-reset">立即体验</button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      dialogVisible: false, // 更新框
      updateType: 1, // 1提示更新/2更新
      percentage: 0, // 进度值
      updeteSuccess: false, // 更新成功
      innerVisible: false, // 更新报错
      tiperr: false, // 退出提示
      customColor: '#7D6DFE'
    }
  },
  created () {
    // 软件版本更新
    ipcRenderer.on('download-update', (event, params) => {
      this.updateType = 1
      this.dialogVisible = true
    })
    // 更新报错
    ipcRenderer.on('update-err', (event, params) => {
      console.log('更新报错信息：', params)
      this.dialogVisible = false
      this.innerVisible = true
    })
    // TODO
    // // 更新进度条
    // ipcRenderer.on('download-progress', (event, params) => {
    //   console.log('进度条参数', params)
    //   this.percentage = params.percent
    // })
    // // 更新完成
    // ipcRenderer.on('update-end', (event, params) => {
    //   console.log('更新完成', params)
    //   this.updeteSuccess = true
    // })
  },
  methods: {
    onUpdateStart () {
      console.log('发送下载事件')
      ipcRenderer.send('download-update-start')
    },
    // // 关闭错误提示框
    handleClose (done) {
      this.tiperr = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.tiperr = false
    }
    // TODO
    // onUpdate () {
    //   this.dialogVisible = false
    // }
  }
}
</script>

<style lang="less">
.hot-update {
  .el-dialog {
    width: 600px;
    height: 400px;
  }
}
.hot-append {
  .el-dialog {
    width: 376px;
    height: 234px;
  }
}
</style>
<style lang='less' scoped>
.btn-reset {
  border: none;
  outline: none;
}
.hot-mian {
  text-align: center;
}
.hot-logo-pic {
  width: 116px;
  height: 102px;
  margin-bottom: 5px;
}
.hot-tip-font {
  margin-top: 25px;
  font-size: 20px;
  color: rgba(125, 109, 254, 1);
}
.hot-progress {
  width: 80%;
  margin: 60px auto;
}
.hot-btn {
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
  width: 224px;
  height: 50px;
  background: url('../../assets/img/hotUpdate/btnBac.png') no-repeat center;
  background-size: 100% 100%;
  margin-top: 40px;
  &:hover {
    background: url('../../assets/img/hotUpdate/btnBacHover.png') no-repeat
      center;
    background-size: 100% 100%;
  }
}
.hot-tip-close {
  text-align: center;
}
.hot-tip-info {
  // margin-top: 40px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  line-height: 30px;
}
.dialog-footer {
  padding-top: 35px;
}
.hot-sure-btn {
  width: 133px;
  height: 44px;
  background: url('../../assets/img/hotUpdate/errBtn.png') no-repeat center;
  background-size: 100% 100%;
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
  margin-right: 15px;
  &:hover {
    background: url('../../assets/img/hotUpdate/errBtnHover.png') no-repeat
      center;
    background-size: 100% 100%;
  }
}
.hot-cancel-btn {
  width: 110px;
  height: 36px;
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
  background: #fff;
  border: 1px solid rgba(153, 153, 153, 1);
  border-radius: 5px;
  &:hover {
    background: #f1f1f1;
  }
}
.hot-tip-err {
  text-align: center;
}
.hot-err-title {
  font-size: 16px;
  color: #333333;
}
</style>
