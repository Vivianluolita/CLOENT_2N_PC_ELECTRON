<template>
  <div class="NnImage-wrap">
    <el-card>
      <el-image :src="avatar" class="avatar" fit="fill" for="uploads"></el-image>
      <div class="container">
        <label class="btn btn-orange" for="uploads">选择图片</label>
        <input
          :value="imgFile"
          @change="uploadImg($event, 1)"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          id="uploads"
          style="position:absolute; clip:rect(0 0 0 0);"
          type="file"
        />
      </div>
    </el-card>
    <el-dialog
      :before-close="handleClose"
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
            </div>
            <br />
            <div class="preview-info">
              <span class="title" style="ß">预 览</span>
              <p class="info">{{ _width }} x {{ _height }}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <div>
            <label class="btn btn-orange" for="uploads">选择图片</label>
            <input
              :value="imgFile"
              @change="uploadImg($event, 1)"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              id="uploads"
              style="position:absolute; clip:rect(0 0 0 0);"
              type="file"
            />
            <input @click="changeScale(1)" class="oper" title="放大" type="button" value="+" />
            <input @click="changeScale(-1)" class="oper" title="缩小" type="button" value="-" />
            <input @click="rotateLeft" class="oper" title="左旋转" type="button" value="↺" />
            <input @click="rotateRight" class="oper" title="右旋转" type="button" value="↻" />
            <input @click="down('blob')" class="oper" title="下载" type="button" value="↓" />
          </div>
        </div>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false" size="mini">关 闭</el-button>
        <el-button @click="finish('blob')" size="mini" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
// import NN_UTILS from '@/common/js/common.js'
// 接口url配置文件
// import Api from '@/js/api.js'

export default {
  data () {
    return {
      previews: {},
      loading: false,
      avatar:
        'https://static.nn.com/image/2019/11/4/10/5/36/fc9dd6f91da9543f493677fe0db1c63f.png',
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
      downImg: '#',
      imgFile: '',
      // 上传后的图片的地址（不带服务器域名）
      uploadImgRelaPath: ''
    }
  },
  props: {
    _width: Number,
    _height: Number
  },
  components: {
    VueCropper
  },
  // mounted () {
  //   this.NN_MSG('hello', 'info')
  // },
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
          this.$http
            .post(this._url, formData, {
              // .post('', formData, {
              contentType: false,
              processData: false,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => {
              var res = response.data
              if (res.success === 1) {
                _this.imgFile = ''
                // 完整路径
                _this.headImg = res.realPathList[0]
                // 非完整路径
                _this.uploadImgRelaPath = res.relaPathList[0]
                // 把地址传出去
                this.$emit('afterUpload', _this.headImg)
                _this.$message({
                  // element-ui的消息Message消息提示组件
                  type: 'success',
                  message: '上传成功'
                })
              }
            })
            .catch(e => {})
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
      console.log('实时预览')
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
      if (!/\.(|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$notify({
          title: '提示',
          message: '图片类型必须是,jpeg,jpg,png,bmp中的一种',
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
.NnImage-wrap {
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
    color: #888;
    cursor: pointer;
    display: inline-block;
    width: 70px;
    padding: 0;
    text-align: center;
    line-height: 28px;
  }
  .btn-orange:hover {
    color: #333;
  }
  .el-card {
    width: 200px;
  }
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  .container {
    text-align: center;
    margin-top: 10px;
  }
  .cropper-avatar {
    width: 180px;
    float: left;
    text-align: center;
    // margin-left: 30px;
  }
  .show-preview {
    width: 150px;
    height: 150px;
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
    margin-left: 30px;
  }
  .oper {
    height: 20px;
    width: 23px;
    font-size: 20px;
    margin: 3px 5px;
  }
}
</style>
