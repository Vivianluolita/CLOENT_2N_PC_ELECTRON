<template>
  <div class="new-channel-wrap">
    <el-container>
      <el-aside width="150px">
        <!-- 用户头像 -->
        <el-image :src="imageUrl" @click="onClick" class="avatar" fit="cover"></el-image>
        <br />
        <br />
        <el-button @click="editChannelImg" class="channel-icon" size="mini">更换频道形象</el-button>
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
            <nn-image-cropper
              :_fnToparent="changeImageType"
              :_height="Image_height"
              :_review="false"
              :_width="Image_width"
              @imageUrlCallback="imageUrlCallback"
            ></nn-image-cropper>
          </el-form-item>
          <el-form-item class="channel-name" label="频道名称" prop="name_channel">
            <el-input
              @keydown.native.enter="sendMsg"
              class="channel-name-input"
              placeholder="起一个个性化的名字更能够吸引小伙伴的加入"
              type="textarea"
              v-model="form.name_channel"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item class="channel-cover" label="频道封面图">
            <el-image :src="coverUrl" @click="onClick" class="cover" fit="cover"></el-image>
            <br />
            <nn-image-cropper
              :_fnToparent="changeImageType"
              :_height="Image_height"
              :_review="false"
              :_width="Image_width"
              @imageUrlCallback="imageUrlCallback"
            ></nn-image-cropper>
          </el-form-item>-->
          <!-- 频道分类-->
          <el-form-item
            class="channel-type"
            label="频道类型"
            prop="type_channel"
            style="text-align: left;"
          >
            <el-radio-group @change="onChannelTypeChange" v-model="form.type_channel">
              <el-radio-button :label="0" class="nn-el-radio-btn radio-default" size="mini">默认频道</el-radio-button>
              <el-radio-button
                :key="item.id"
                :label="item.index"
                class="nn-el-radio-btn"
                size="mini"
                v-for="item in typeChannelList"
                v-show="item.index!=0 && item.allow_user"
              >{{item.name}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- 频道标签 -->
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
              <!-- <el-checkbox-group
              :key="channel_type_item.index"
              @change="onChannelTags"
              v-for="channel_type_item in typeChannelList"
              v-model="selected_tags_text"
              v-show="form.type_channel==channel_type_item.index"
              >-->
              <el-checkbox
                :key="item.name"
                :kid="item.kind_id"
                :label="item.id"
                size="mini"
                v-for="item in channel_type_item.menu"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 已选标签 -->
          <el-form-item
            class="channel-label-show"
            label
            style="text-align: left;"
            v-show="!isDefaultChannel"
          >
            <el-card class="card">
              <!-- <el-tag
                :key="item.id"
                :t_id="item.id"
                :t_kid="item.kindid"
                class="channel-label-selected"
                size="mini"
                v-for="item in selected_tags_all"
              >{{item.name}}</el-tag>-->
              <el-tag
                :key="item.id"
                :t_id="item.id"
                class="channel-label-selected"
                size="mini"
                v-for="item in selectTagsName"
              >{{item.name}}</el-tag>
            </el-card>
          </el-form-item>
          <br />
          <el-form-item class="footer">
            <el-button
              :loading="buttonLoading"
              @click="onSubmit('ruleForm')"
              class="confirm-btn"
              size="small"
              type="primary"
            >确定</el-button>&nbsp;&nbsp;
            <el-button @click="closeDialog" class="cancel-btn" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="imgEditorDialogVisible"
      style="font-size: 12px;"
      width="565px"
    >
      <!-- content -->
      <div class="dialog-avatar-wrap" style="height: auto;">
        <el-container>
          <el-aside style="height: 335px;" width="150px">
            <img
              :src="imageUrl"
              class="avatar"
              style="width: 100px;height: 100px;margin-top: 20px;border-radius: 5px;display: inline-block;"
              v-if="imageUrl"
            />
            <br />
            <br />
            <image-cropper
              :_fnToparent="'imageUrlName'"
              :_height="150"
              :_review="false"
              :_width="150"
              @imageUrlCallback="imageUrlCallback"
            >自定义头像</image-cropper>
          </el-aside>
          <el-main class="avatar-main">
            <div class="avatar-container">
              <span class="avatar-info">系统头像</span>
              <br />
              <el-image
                :key="index"
                :src="item.image"
                :title="item.name"
                @click="setSysavaatr(item.image)"
                class="sys_avatar"
                fit="cover"
                v-for="(item, index) in sysAvatar"
              ></el-image>
            </div>
          </el-main>
        </el-container>
      </div>
      <!-- title -->
      <div class="dialog-footer" slot="title" style="text-align: left;">
        <span style="font-size: 16px;">更换频道形象</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import NnImageCropper from '../../common/ImageCropper'
import { Storage } from '../../../../main/db/dbStore'
import util from '../../../utils/util'
// import ImageCropper from '../../common/ImageCropper'
export default {
  name: 'NewChannel',
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
      console.log(this.selected_tags_all)
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
      //
      // tags: [],
      // selected_tags: [],
      // 所有已选的标签
      selected_tags_all: [],
      // 已选的标签
      // selected_tags_text: [],
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
    // 判断是在那里修改图片 头像还是背景图
    changeImageType () {
      if (this.imgEditorDialogVisible) {
        this.Image_height = 150
        this.Image_width = 150
        return 'imageUrlName'
      } else {
        this.Image_height = 100
        this.Image_width = 220
        return 'coverUrlName'
      }
    },

    // 频道类别信息
    typeChannelList () {
      let arr = Object.assign([], this.$store.state.home.categoryListArr)
      return arr
    },
    // 默认频道标识
    isDefaultChannel () {
      return this.form.type_channel.toString() === '0'
    },
    // 系统头像
    sysAvatar () {
      let defaultAvatar = Storage.get('configInfo').channel_avatar
      // return this.$store.state.home.pageConfigArr
      return defaultAvatar
    },
    buttonLoading () {
      return this.$store.state.isNewChannelDiaLoading
    },
    // 监听selected_tags_all的变化
    selectTagsName () {
      let selectTagsName = []
      for (let j = 0; j < this.typeChannelList.length; j++) {
        if (this.typeChannelList[j].menu) {
          this.typeChannelList[j].menu.map((item, index) => {
            for (let i = 0; i < this.selected_tags_all.length; i++) {
              if (item.id === this.selected_tags_all[i]) {
                let obj = {}
                obj.id = item.id
                obj.name = item.name
                selectTagsName.push(obj)
              }
            }
          })
        }
      }
      console.log(selectTagsName)
      return selectTagsName
    }
  },
  components: {
    'nn-image-cropper': NnImageCropper,
    'image-cropper': NnImageCropper
  },
  destroyed () {
    ipcRenderer.removeListener('add-channel-res', this.addChannelRes)
  },
  created () {
    ipcRenderer.on('add-channel-res', this.addChannelRes)
  },
  mounted () {},
  methods: {
    addChannelRes (event, params) {
      console.log('vue title: ', params)
      if (params.data.code === 0) {
        this.cleanData()
        this.getChannelInfo()
        this.$notify({
          title: '',
          message: '创建频道成功',
          type: 'success'
        })
      } else {
        if (params.data.msg) {
          this.$notify.error({
            title: '-_-',
            // message: '似乎发生了一些错误~'
            message: params.data.msg
          })
        }
      }
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
      this.$store.dispatch('NewChannelBtnClick', false)
      // 清除form表单验证
      this.$refs['ruleForm'].resetFields()
    },
    // 设置系统头像
    setSysavaatr (src) {
      this.img_file = src
      this.imageUrl = src
      this.form.avatar = src
    },
    // 频道标签的change事件
    onChannelTags (param) {
      // for (let i = 0; i < param.length; i++) {
      //   // console.info(Array.isArray(this.option), 1)
      //   this.option.forEach(item => {
      //     // console.info(Array.isArray(item.menu), 2)
      //     if (Array.isArray(item.menu)) {
      //       item.menu.forEach(_item => {
      //         if (_item.id === param[i]) {
      //           _item.cheched = true
      //           this.selected_tags_all.push(_item)
      //         } else {
      //           _item.cheched = false
      //           // console.info(Array.isArray(this.selected_tags_all), 3)
      //           this.selected_tags_all.forEach(__item => {
      //             if (
      //               __item.id === _item.id &&
      //               param.toString().indexOf(_item.id) === -1
      //             ) {
      //               this.selected_tags_all.splice(
      //                 this.selected_tags_all.findIndex(
      //                   ___item => ___item.id === __item.id
      //                 ),
      //                 1
      //               )
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       console.info('该频道下没有配置子菜单')
      //     }
      //   })
      // }
      // if (param.length === 0) {
      //   // 该频道类型下全部取消选择
      //   console.info(Array.isArray(this.option), 4)
      //   this.option.forEach(item => {
      //     if (item.id === this.form.type_channel) {
      //       console.info(Array.isArray(item.menu), 5)
      //       item.menu.forEach(_item => {
      //         console.info(Array.isArray(this.selected_tags_all), 6)
      //         this.selected_tags_all.forEach(__item => {
      //           if (__item.id === _item.id) {
      //             this.selected_tags_all.splice(
      //               this.selected_tags_all.findIndex(
      //                 ___item => ___item.id === __item.id
      //               ),
      //               1
      //             )
      //           }
      //         })
      //       })
      //     }
      //   })
      // }
      // // 去重
      // const res = new Map()
      // this.selected_tags_all = this.selected_tags_all.filter(
      //   a => !res.has(a) && res.set(a, 1)
      // )
    },
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
    // 提交表单信息
    onSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let tags = []
          // 提交的时候如果是默认频道，不传标签
          // if (this.form.type_channel.toString() !== '0') {
          //   this.selected_tags_all.forEach(item => {
          //     tags.push(item.id)
          //   })
          // }
          if (this.form.type_channel.toString() !== '0') {
            tags = this.selected_tags_all
          }
          if (tags.length === 0 && this.form.type_channel.toString() !== '0') {
            this.$notify({
              title: '-_-',
              message: '非默认类型的频道请至少选择一个标签',
              type: 'info'
            })
          } else {
            // this.$store.dispatch('NewChannelBtnClick', false)
            let channelData = {
              avatar: this.img_file,
              cover: this.cover_file,
              // user_id: 1,
              // style: 0,
              name: this.form.name_channel,
              // notice: '默认公告内容',
              // bind_id: 0,
              tags: tags
            }
            ipcRenderer.send('add-channel', channelData)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存已选的头像
    onSaveImg () {
      this.imgEditorDialogVisible = false
    },
    // 头像上传成功
    handleAvatarSuccess (res, file) {
      this.img_file = res.data.url
      this.imageUrl = res.data.url
      this.form.avatar = res.data.url
    },
    // 封面上传成功
    handleCoverSuccess (res, file) {
      this.cover_file = res.data.url
      this.coverUrl = res.data.url
      this.form.cover = res.data.url
    },
    // 头像上传前
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG，JPEG和PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return (isJPG || isPNG) && isLt1M
    },
    // 封面上传前
    beforeCoverUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG，JPEG和PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return (isJPG || isPNG) && isLt1M
    },
    // 关闭新建频道页面
    closeDialog () {
      this.cleanData()
      this.$store.dispatch('NewChannelBtnClick', false)
    },
    // textarea禁止回车
    sendMsg (e) {
      e.preventDefault()
    },
    // 剪切头像图片的返回值
    imageUrlCallback (data, funcName) {
      console.log('imageUrlCallback')
      if (data === '图片上传失败') {
        this.$message({
          type: 'error',
          message: '图片上传失败'
        })
      } else {
        if (funcName === 'coverUrlName') {
          this.coverUrl = data
          this.cover_file = data
        } else if (funcName === 'imageUrlName') {
          this.imageUrl = data
          this.img_file = data
        }
      }
    },
    coverUrlCallback (data, funcName) {
      console.log('coverUrlCallback')
      if (data === '图片上传失败') {
        this.$message({
          type: 'error',
          message: '图片上传失败'
        })
      } else {
        if (funcName === 'coverUrlName') {
          this.coverUrl = data
        } else if (funcName === 'imageUrlName') {
          this.imageUrl = data
        }
      }
    },
    // 请求列表数据
    getChannelInfo () {
      // if (this.$store.state.home.containerLeftListOption === -1) {
      //   // 左侧列表和头部类型选择失效状态
      //   let channelListType = this.$store.state.home.channelListType
      //   // 0是选择左侧列表的类型，1是我的频道的类型， 2是我的收藏的类型
      //   if (channelListType === 1) {
      //     // 我创建的频道的右边频道列表
      //     let limit = this.$store.state.home.channelListLimitNum
      //     const data = {
      //       page: 1,
      //       // 现在只能创建三个频道,需要修改
      //       limit: 3
      //     }
      //     ipcRenderer.send('my-channel-list', data)
      //     // 我管理的频道右边频道列表
      //     const manageData = {
      //       page: 1,
      //       limit: limit
      //     }
      //     ipcRenderer.send('manage-channel-list', data)
      //   } else if (channelListType === 2) {
      //     // 我收藏的频道的右边频道列表
      //     let limit = this.$store.state.home.channelListLimitNum
      //     const data = {
      //       page: 1,
      //       limit: limit
      //     }
      //     ipcRenderer.send('get-my-collect-list', data)
      //   } else {
      //     // 如果是搜索
      //     let limit = this.$store.state.home.channelListLimitNum
      //     let searchValue = this.$store.state.home.searchValue
      //     let searchData = {
      //       // 页码(需要使用vueX)
      //       page: 1,
      //       limit: limit,
      //       // 输入信息
      //       keyword: searchValue
      //     }
      //     ipcRenderer.send('search-info', searchData)
      //   }
      // } else {
      //   let Option = this.$store.state.home.containerLeftListOption
      //   let limit = this.$store.state.home.channelListLimitNum
      //   let sortType = this.$store.state.home.channelSortType
      //   let infoData = {
      //     page: 1,
      //     limit: this.stringToNumber(limit),
      //     category_id: this.stringToNumber(Option),
      //     sort_type: this.stringToNumber(sortType)
      //   }

      //   ipcRenderer.send('channel-info', infoData)
      // }
      util.getChannelInfo()
      // 加载左侧下拉的数据
      if (this.$store.state.home.isShowMyChannelList) {
        let data = {
          page: 1,
          limit: 3
        }
        ipcRenderer.send('get-my-channel', data)
      } else if (this.$store.state.home.isShowMyCollectList) {
        let data = {
          page: 1,
          limit: 3
        }
        ipcRenderer.send('get-my-collect', data)
      }
    }
    // 字符串转数字
    // stringToNumber (data) {
    //   if (typeof data === 'number') {
    //     return data
    //   } else if (typeof data === 'string') {
    //     return parseInt(data)
    //   }
    // }
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
  .channel-type {
    /deep/.el-radio-button__inner:hover {
      color: #6236ff;
    }
  }
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
    /deep/.el-textarea__inner:focus {
      border-color: #4444fc;
    }
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