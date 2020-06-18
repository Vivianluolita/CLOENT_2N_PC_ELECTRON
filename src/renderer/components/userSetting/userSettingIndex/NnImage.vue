<template>
  <div class="nn-image-wrap">
    <div class="imgDialog">
      <div class="imgBody">
        <img :src="avatar" alt class="avatar" />
        <label class="container" for="userSettingUploads" v-if="isShow">
          <div class="dialogBox">
            <div class="el-icon-camera" />
            <span class="btn btn-orange">更换头像</span>
          </div>
          <input
            :value="imgFile"
            @change="uploadImg($event, 1)"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            id="userSettingUploads"
            style="position:absolute; clip:rect(0 0 0 0);"
            type="file"
          />
        </label>
      </div>
      <el-dialog
        :before-close="handleClose"
        :modal-append-to-body="false"
        :visible.sync="dialogVisible"
        v-loading="loading"
        width="650px"
      >
        <div>
          <div class="body">
            <div class="cropper">
              <vueCropper
                :autoCrop="option.autoCrop"
                :autoCropHeight="_height"
                :autoCropWidth="_width"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :fixedBox="option.fixedBox"
                :full="option.full"
                :img="option.img"
                :info="true"
                :original="option.original"
                :outputSize="option.size"
                :outputType="option.outputType"
                @imgLoad="imgLoad"
                @realTime="realTime"
                ref="cropper"
              ></vueCropper>
            </div>
            <div class="cropper-avatar">
              <br />
              <div class="show-preview">
                <div :style="previews.div" class="preview">
                  <img :src="previews.url" :style="previews.img" />
                </div>
                <!-- <div class="preview" :style="previews.div" style="width: 150px; height: 150px">
                  <img :src="previews.url" style="width: 150px; height: 150px" />
                </div>-->
              </div>
              <br />
              <div class="preview-info">
                <span class="title" style="ß">预 览</span>
                <p class="info">150 x 150</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <div>
              <label class="btn btn-orange choose" for="userSettingUploads">选择图片</label>
              <input
                :value="imgFile"
                @change="uploadImg($event, 1)"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                id="userSettingUploads"
                style="position:absolute; clip:rect(0 0 0 0);"
                type="file"
              />
              <el-button @click="changeScale(1)" class="oper el-icon-plus mleft" title="放大" />
              <el-button @click="changeScale(-1)" class="oper el-icon-minus" title="缩小" />
              <el-button @click="rotateLeft" class="oper el-icon-refresh-left" title="左旋转" />
              <el-button @click="rotateRight" class="oper el-icon-refresh-right" title="右旋转" />
              <el-button @click="down('blob')" class="oper el-icon-bottom" title="下载" />
            </div>
          </div>
        </div>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false" size="mini">关 闭</el-button>
          <el-button @click="finish('blob')" size="mini" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { ipcRenderer, remote, session } from 'electron'
import BASEURL from '../../../../../src/main/api/baseURL'
import axios from '../../../../../src/main/api/axios'
// import NN_UTILS from '@/common/js/common.js'
// 接口url配置文件
// import Api from '@/js/api.js'

export default {
  data () {
    return {
      previews: {},
      loading: false,
      avatar: '',
      dialogVisible: false,
      headImg: '',
      // 剪切图片上传
      // crap: false,
      // 配置参数
      option: {
        img: '',
        // 剪切后的图片质量（0.1-1）
        outputSize: 1,
        // 输出原图比例截图 props名full
        full: false,
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // autoCropWidth: this._width,
        // autoCropHeight: this._height,
        fixedBox: true
      },
      // 本机文件地址
      fileName: '',
      myFile: null,
      downImg: '#',
      imgFile: '',
      // 上传后的图片的地址（不带服务器域名）
      uploadImgRelaPath: ''
    }
  },
  props: {
    isShow: false,
    _width: String,
    _height: String,
    userImg: String
  },
  watch: {
    userImg (val, old) {
      console.log('4444444444444', val)
      if (val !== undefined) {
        this.avatar = val
      }
    }
  },
  components: {
    VueCropper
  },
  created () {
    ipcRenderer.on('upload-image-res', (event, params) => {
      if (params.code === 0) {
      } else {
        this.$message({
          message: params.msg,
          type: 'error'
        })
      }
    })
  },
  mounted () {
    // this.NN_MSG('hello', 'info')
  },
  methods: {
    // 关闭弹窗
    handleClose () {
      console.log('dialog closed')
    },
    // 放大/缩小
    changeScale (num) {
      console.log('缩放')
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 左旋转
    rotateLeft () {
      console.log('旋转')
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRight () {
      console.log('右旋转')
      this.$refs.cropper.rotateRight()
    },
    // 上传图片
    finish (type) {
      this.dialogVisible = false
      console.log('上传图片')
      let _this = this
      let formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.avatar = window.URL.createObjectURL(data)
          let img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          formData.append('file', data, this.fileName)
          axios({
            url: 'http://192.168.3.69:8082/upload/image',
            method: 'post',
            data: formData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then(response => {
              console.log('4444444444444444444', response)
              var res = response.data
              if (res.code === 0) {
                ipcRenderer.send('user-setting-updata-uesr-info', {
                  avatar: res.data.url
                })
              }
            })
            .catch(e => {
              console.log('33333333333333333', e)
            })
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 实时预览
    realTime (data) {
      console.log('77777', data)
      this.previews = data
    },
    // 下载
    down (type) {
      console.log('下载')
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data
          aLink.href = data
          aLink.click()
        })
      }
    },
    // 选择本地图片
    uploadImg (e, num) {
      console.log('选择本地图片')
      var _this = this
      // 上传图片
      var file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$notify({
          title: '提示',
          message: '图片类型必须是jpeg，jpg，png中的一种',
          type: 'info'
        })
        return false
      }
      let size = file.size / 1024 / 1024
      if (size > 1) {
        this.$notify({
          title: '提示',
          message: '图片大小不能大于1M',
          type: 'info'
        })
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
          //
          this.dialogVisible = true
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    imgLoad (msg) {
      console.log('imgLoad')
      console.log(msg)
    }
  }
}
</script>

<style lang="less" scoped>
.nn-image-wrap {
  .imgDialog {
    /deep/ .v-modal {
      z-index: -1 !important;
    }
    .choose {
      width: 50px;
      height: 28px;
      line-height: 28px;
      border: 1px solid #ddd;
      border-radius: 3px;
      color: #333 !important;
      margin-right: 8px;
    }
    .btn {
      padding: 6px 2px;
    }
    .imgBody {
      margin-top: 5px;
      position: relative;
    }
    .cropper {
      width: 400px;
      height: 300px;
      float: left;
    }
    .body {
      width: 100%;
      height: 300px;
      background-color: #eee;
    }
    .footer {
      width: 100%;
      height: 50px;
      margin-top: 20px;
    }
    .preview {
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid #cccccc;
    }
    .btn-orange {
      color: #fff;
      cursor: pointer;
      display: inline-block;
      width: 70px;
      padding: 0;
      text-align: center;
      //   line-height: 28px;
    }
    .btn-orange:hover {
      color: #fff;
    }
    .el-card {
      width: 200px;
    }
    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }
    .container {
      width: 70px;
      height: 70px;
      //   line-height: 70px;
      border-radius: 35px;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      font-size: 12px;
      color: white;
      position: absolute;
      top: 0px;
      left: 5px;
      .dialogBox {
        height: 70px;
        line-height: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .btn {
          width: auto;
        }
      }
    }
    .cropper-avatar {
      width: 180px;
      float: left;
      text-align: center;
      // margin-left: 30px;
    }
    .show-preview {
      width: 200px;
      height: 200px;
      margin-left: 30px;
    }
    .title {
      font-size: 16px;
      color: #666;
    }
    .info {
      color: #666;
    }
    .preview-info {
      margin-left: 60px;
    }
    .oper {
      height: 30px;
      width: 50px;
      font-size: 14px;
      padding: 0 !important;
    }
  }
}
</style>
