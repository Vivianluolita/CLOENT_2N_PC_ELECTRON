<template>
  <div class="new-channel-wrap">
    <el-container>
      <el-aside width="150px">
        <!-- 用户头像 -->
        <el-image :src="imageUrl" @click="onClick" class="avatar" fit="cover"></el-image>
      </el-aside>
      <el-main>
        <!-- form -->
        <el-form
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="100px"
          ref="ruleForm"
          size="mini"
        >
          <el-form-item class="channel-cover" label="频道封面图">
            <el-image :src="coverUrl" @click="onClick" class="cover" fit="cover"></el-image>
          </el-form-item>
          <el-form-item class="channel-name" label="频道名称" prop="name_channel">
            <el-input
              :disabled="true"
              @keydown.native.enter="sendMsg"
              class="channel-name-input"
              placeholder="起一个个性化的名字更能够吸引小伙伴的加入"
              type="textarea"
              v-model="form.name_channel"
            ></el-input>
          </el-form-item>
          <!-- 已选标签 -->

          <el-form-item
            class="channel-type"
            label="频道类型"
            prop="type_channel"
            style="text-align: left;"
          >
            <el-radio-group @change="onChannelTypeChange" v-model="form.type_channel">
              <el-radio-button
                :disabled="true"
                :label="0"
                class="nn-el-radio-btn radio-default"
                size="mini"
              >默认频道</el-radio-button>
              <el-radio-button
                :disabled="true"
                :key="item.id"
                :label="item.index"
                class="nn-el-radio-btn"
                size="mini"
                v-for="item in typeChannelList"
                v-show="item.index!=0&& item.allow_user"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            class="channel-label"
            label="频道标签"
            prop="radio_tags"
            style="text-align: left;"
            v-show="!isDefaultChannel"
          >
            <el-checkbox-group
              :key="channel_type_item.index"
              :required="true"
              @change="onChannelTags"
              v-for="channel_type_item in typeChannelList"
              v-model="selected_tags_all"
              v-show="form.type_channel==channel_type_item.index"
            >
              <el-checkbox
                :disabled="true"
                :key="item.name"
                :kid="item.kind_id"
                :label="item.id"
                size="mini"
                v-for="item in channel_type_item.menu"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- <el-form-item class="channel-label-show" label style="text-align: left;">
            <el-card class="card">
              <el-tag
                :key="item.id"
                :t_id="item.id"
                class="channel-label-selected"
                size="mini"
                v-for="item in selectTagsName"
              >{{item.name}}</el-tag>
            </el-card>
          </el-form-item>-->
          <br />
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import NnImageCropper from '../../common/ImageCropper'
export default {
  name: 'WatchChannel',
  data () {
    const validateName = (rule, value, callback) => {
      let str = value.replace(/[\r\n\s]/g, '')
      if (value != null && value !== '') {
        if (str === '') {
          callback(new Error('不能只输入回车和空格'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const radio = (rule, value, callback) => {
      if (this.selected_tags_all.length > 3) {
        return callback(new Error('最多只能选择三个'))
      } else {
        callback()
      }
    }
    return {
      // 截取图片的宽高,
      Image_height: Number,
      Image_width: Number,
      // 表单
      form: {
        // 频道头像
        avatar: '',
        // 频道名称
        name_channel: '',
        // 频道类别
        type_channel: '0'
      },
      // 校验规则
      rules: {
        name_channel: [
          { required: true, message: '请输入频道名称', trigger: 'blur' },
          {
            min: 3,
            max: 40,
            message: '长度在 3 到 40 个字符',
            trigger: 'blur'
          },
          { validator: validateName, trigger: 'blur' }
        ],
        radio_tags: [{ type: 'array', validator: radio, trigger: 'change' }]
      },
      imageUrl:
        'https://static.nn.com/image/2019/11/14/17/50/2/f1af7f4f50e95c5937821707773204c1.png',
      // 封面图地址
      coverUrl:
        'http://static.nn.com/image/2019/11/14/15/15/35/e7def2ef0d3785446c4263c7a226045d.png',
      // 更换频道形象窗口标识
      imgEditorDialogVisible: false,
      // 所有已选的标签
      selected_tags_all: [],
      // 已选配置的json对象
      option: [],
      header: { 'Content-Type': 'application/json' },
      // 上传后返回的图片地址
      img_file:
        'https://static.nn.com/image/2019/11/14/17/50/2/f1af7f4f50e95c5937821707773204c1.png',
      // 封面图上传返回的图片地址
      cover_file:
        'http://static.nn.com/image/2019/11/14/15/15/35/e7def2ef0d3785446c4263c7a226045d.png'
    }
  },
  computed: {
    // 频道类别信息
    typeChannelList () {
      let arr = Object.assign([], this.$store.state.home.categoryListArr)
      return arr
    },
    // 默认频道标识
    isDefaultChannel () {
      return this.form.type_channel.toString() === '0'
    },
    buttonLoading () {
      return this.$store.state.isNewChannelDiaLoading
    }
    // 监听selected_tags_all的变化
    // selectTagsName () {
    //   let selectTagsName = []
    //   for (let j = 0; j < this.typeChannelList.length; j++) {
    //     if (this.typeChannelList[j].menu) {
    //       this.typeChannelList[j].menu.map((item, index) => {
    //         for (let i = 0; i < this.selected_tags_all.length; i++) {
    //           if (item.id === this.selected_tags_all[i]) {
    //             let obj = {}
    //             obj.id = item.id
    //             obj.name = item.name
    //             selectTagsName.push(obj)
    //           }
    //         }
    //       })
    //     }
    //   }
    //   console.log(selectTagsName)
    //   return selectTagsName
    // }
  },
  components: {
    'nn-image-cropper': NnImageCropper,
    'image-cropper': NnImageCropper
  },
  destroyed () {
    ipcRenderer.removeListener(
      'get-watch-channel-info-res',
      this.getWatchChannelInfoRes
    )
  },
  created () {
    ipcRenderer.on('get-watch-channel-info-res', this.getWatchChannelInfoRes)
  },
  mounted () {},
  methods: {
    getWatchChannelInfoRes (event, params) {
      console.log('vue title: ', params)
      if (params.data && params.data.code === 0) {
        console.log(params.data.data)
        this.imageUrl = params.data.data.avatar
        this.coverUrl = params.data.data.cover
        this.form.name_channel = params.data.data.name
        this.form.avatar = params.data.data.avatar
        if (params.data.data.tags) {
          // this.selected_tags_all = params.tags
          params.data.data.tags.map((item, index) => {
            this.selected_tags_all.push(item.id)
            if (this.form.type_channel === '0') {
              this.form.type_channel = this.channeltpye(item).toString()
            }
          })
        }
      }
    },
    // 判断是频道类型
    channeltpye (e) {
      let type = 0
      this.typeChannelList.map((item, index) => {
        for (let i = 0; i < item.menu.length; i++) {
          if (item.menu[i].id === e.id && type === 0) {
            type = item.index
          }
        }
      })
      return type
    },
    // 重置表单数据
    cleanData () {
      this.form = {
        // 频道头像
        avatar: '',
        // 频道名称
        name_channel: '',
        // 频道类别
        type_channel: '0'
      }
      this.imageUrl =
        'https://static.nn.com/image/2019/11/14/17/50/2/f1af7f4f50e95c5937821707773204c1.png'
      this.coverUrl =
        'http://static.nn.com/image/2019/11/14/15/15/35/e7def2ef0d3785446c4263c7a226045d.png'
      // 所有已选的标签
      this.selected_tags_all = []
      // 已选的标签
      // this.selected_tags_text = []
      // 回复按钮状态
      this.$store.dispatch('editChannelBtnClick', false)
      // 清除form表单验证
      this.$refs['ruleForm'].resetFields()
    },
    // 频道标签的change事件
    onChannelTags (param) {},
    // 用户头像点击事件
    onClick () {},
    // 更换频道形
    editChannelImg () {
      this.imgEditorDialogVisible = true
    },
    // 频道类别的change事件
    onChannelTypeChange (val) {
      this.option = Object.assign([], this.typeChannelList)
    },
    // 关闭新建频道页面
    closeDialog () {
      this.cleanData()
      this.$store.dispatch('watchChannelBtnClick', false)
    },
    // textarea禁止回车
    sendMsg (e) {
      e.preventDefault()
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-avatar-wrap {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-main {
    padding-right: 0;
    height: 335px;
    .sys_avatar {
      width: 54px;
      height: 54px;
      margin-right: 10px;
      margin-top: 15px;
      border-radius: 4px;
    }
    .sys_avatar:hover {
      cursor: pointer;
    }
  }
  .avatar-container {
    width: 100%;
    text-align: left;
    padding-left: 0px;
  }
  .avatar-info {
    font-size: 14px;
  }
}
.new-channel-wrap {
  position: relative;
  width: 100%;
  height: 539px;
  .el-aside {
    /* background-color: #E9EEF3; */
    color: #333;
    text-align: center;
    height: 539px;
    border-bottom-left-radius: 10px;
  }
  .channel-icon {
    position: absolute;
    left: 23px;
    top: 130px;
    height: 30px;
    border-radius: 4px;
  }
  .channel-icon:hover {
    color: #6236ff;
    border-color: #6236ff;
    background-color: #ffffff;
  }
  .channel-name,
  .channel-type,
  .channel-label,
  .channel-label-show,
  .channel-cover {
    /* width: 100% !important; */
    font-weight: bold;
    /deep/.el-form-item__label {
      width: 100% !important;
    }
    /deep/.el-form-item__content {
      text-align: left;
      margin-left: 0 !important;
    }
  }
  .channel-cover {
    /deep/.el-form-item__content {
      width: 436px;
      height: 100px;
      position: relative;
      overflow: hidden;
      .cover {
        position: absolute;
        left: 0;
        top: 0;
      }
      .common-image-cropper-wrap {
        position: absolute;
        left: 240px;
        top: 0;
      }
    }
  }
  .channel-name {
    /deep/.el-form-item__content textarea {
      width: 423px;
      height: 68px !important;
      font-size: 14px;
      resize: none;
    }
  }
  .channel-type {
    /deep/.el-radio-button {
      height: 32px;
    }
  }
  .channel-type {
    /deep/.el-radio-button__inner {
      padding-top: 10px;
      padding-bottom: 10px;
      border-radius: 0;
    }
  }
  .channel-type {
    /deep/.radio-default {
      margin-right: -1px;
    }
  }
  // .channel-type {
  //   /deep/.el-radio-button__inner:hover {
  //     color: #6236ff;
  //   }
  // }
  .channel-type {
    /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fff !important;
      border-color: #4444fc;
      background-color: #fff;
      background-image: linear-gradient(to bottom, #4444fc, #8e79fe);
      box-shadow: -1px 0 0 0 #4444fc;
    }
  }
  .channel-label {
    /deep/.el-checkbox-group {
      width: 370px;
    }
  }
  .channel-label {
    /deep/.is-checked .el-checkbox__inner {
      background-color: #6236ff;
      border-color: #6236ff;
    }
  }
  .channel-label {
    /deep/.el-checkbox__inner:hover {
      border-color: #6236ff;
    }
  }
  .channel-label {
    /deep/.el-checkbox__inner:focus {
      outline-color: #6236ff;
    }
  }
  .channel-label {
    /deep/.is-focus .el-checkbox__inner {
      border-color: #6236ff;
    }
  }
  .channel-label {
    /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
      color: #6236ff;
    }
  }
  .channel-name-input {
    margin-left: 0 !important;
    font-weight: 400;
  }
  .el-main {
    color: #333;
    text-align: center;
    height: 539px;
    padding-top: 10px !important;
    overflow: auto;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .channel-label-selected {
    padding: 0 6px;
    height: 22px;
    line-height: 20px;
    color: #666666;
    background-color: #fff;
    border-radius: 0;
    border: 1px solid #cccccc;
  }
  .cover {
    width: 220px;
    height: 100px;
  }
  .channel-cover-btn {
    width: 104px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #c0c4cc;
  }
  .channel-cover-btn:hover {
    color: #6236ff;
    border-color: #6236ff;
    background-color: #ffffff;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 25px;
    line-height: 25px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .nn-tag {
    cursor: pointer;
  }
  .nn-tag:hover {
    background-color: darkgrey;
    color: #fff;
  }
  .nn-el-radio-btn {
    margin-bottom: 10px !important;
  }
  .avatar {
    width: 100px;
    height: 100px;
    margin-top: 20px;
    border-radius: 5px;
    display: inline-block;
  }
  .card {
    width: 372px;
    height: 80px;
    overflow: auto;
    border-radius: 0;
    border: 1px solid #cccccc;
    box-shadow: 0 0 0 0;
    /deep/.el-card__body {
      padding: 10px 5px;
    }
  }
  .confirm-btn,
  .cancel-btn {
    width: 120px;
    height: 40px;
    font-size: 16px;
    color: #999999;
    border-radius: 3px;
    border: 1px solid #cccccc;
  }
  .footer {
    text-align: left;
    padding-bottom: 39px;
    /* padding-left: 15% */
    /deep/.el-button--primary {
      color: #6236ff !important;
      background: #ffffff;
      border-color: #6236ff !important;
    }
    /deep/.el-form-item__content {
      margin-left: 0 !important;
    }
    /deep/.el-button:hover {
      color: #6236ff;
      background-color: #ffffff;
      border-color: #6236ff;
    }
  }
  .avatar-footer {
    width: 100%;
    text-align: center;
  }
}
</style>