<template>
  <div class="userInfo-wrap">
    <div v-if="showBasic">
      <div class="userInfo-headerBox" v-if="showBasic">
        <div class="userInfo-headerBox-title">基本资料</div>
        <div @click="editPersonal" class="userInfo-headerBox-rightBox userInfo-headerBox-rightBtn">
          <i class="el-icon-edit"></i>
          <div>编辑资料</div>
        </div>
      </div>
      <div class="userInfo-container">
        <div :key="i" class="userInfo-container-item" v-for="(item, i) in info">
          <div class="userInfo-container-item-left">{{item.title}}:</div>
          <div class="userInfo-container-item-right">{{item.value}}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="userInfo-headerBox" v-if="!showBasic">
        <div class="userInfo-headerBox-title">基本资料</div>
        <div class="userInfo-headerBox-rightBox">
          <el-button @click="cancelBtn" class="userInfo-headerBox-rightBox-cancel" plain>取消</el-button>
          <el-button @click="save" class="userInfo-headerBox-rightBox-save">保存</el-button>
        </div>
      </div>
      <el-form :model="form" :rules="rules" label-position="left" label-width="80px" ref="form">
        <!-- 昵称 -->
        <el-form-item label="昵称:" prop="nickname">
          <el-input class="nick-name" v-model.trim="form.nickname"></el-input>（15个字以内）
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="form.gender">
            <el-radio label="2">女</el-radio>
            <el-radio label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户ID:">{{form.nn_id}}</el-form-item>
        <!-- 个性签名 -->
        <el-form-item label="个性签名:" prop="intro">
          <el-input class="personal-sign" type="textarea" v-model.trim="form.intro"></el-input>
        </el-form-item>
        <!-- 所在地 -->
        <el-form-item label="所在地:" prop="region2">
          <!-- 所在省 -->
          <el-select
            @change="provinceChange"
            placeholder="选择省份"
            style="width:140px;"
            v-model="form.region1"
          >
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.name"
              v-for="item in provinceList"
            ></el-option>
          </el-select>
          <!-- 所在市 -->
          <el-select
            collapse-tags
            placeholder="选择市"
            style="margin-left: 16px;width:140px;"
            v-model="form.region2"
          >
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.name"
              v-for="item in cityList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日:" prop="birthday">
          <el-date-picker
            :picker-options="pickerOptionsBirthday"
            placeholder="选择日期"
            type="date"
            v-model="form.birthday"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote, session } from 'electron'
import axios from '../../../../../src/main/api/axios'
import BASEURL from '../../../../main/api/baseURL'
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else {
        if (value.length > 15 || value.length < 1) {
          return callback(new Error('长度在15个字符以内'))
        } else {
          let data = { nickname: value }
          axios({
            url: `${BASEURL.path}/api/v1/passport/nickname/exist`,
            method: 'post',
            data: data
          })
            .then(response => {
              var res = response.data
              if (res.code === 0) {
                if (res.data.exist) {
                  if (
                    value === this.$store.state.public.publicUserInfo.nickname
                  ) {
                    callback()
                  } else {
                    return callback(new Error('该昵称已被使用'))
                  }
                } else {
                  callback()
                }
              }
            })
            .catch(e => {})
        }
      }
    }
    return {
      pickerOptionsBirthday: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      showBasic: true,
      cityList: [],
      form: {
        nickname: '',
        gender: '2',
        nn_id: '',
        intro: '',
        region1: '', // 省
        region2: '', // 市
        birthday: ''
      },
      rules: {
        nickname: [
          { validator: checkName, trigger: ['change', 'blur'] }
          // { min: 1, max: 15, message: '长度在15个字符以内', trigger: 'blur' }
        ],
        intro: [
          {
            required: false
          },
          { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ]
      },
      userInfoData: {},
      info: [
        {
          key: 'nickname',
          title: '昵称',
          value: ''
        },
        {
          key: 'gender', // 1男 2女
          title: '性别',
          value: ''
        },
        {
          key: 'nn_id',
          title: '用户ID',
          value: ''
        },
        {
          key: 'intro',
          title: '个性签名',
          value: ''
        },
        {
          key: 'address',
          title: '所在地',
          value: ''
        },
        {
          key: 'birthday',
          title: '生日',
          value: undefined
        }
      ]
    }
  },
  props: {
    userInfo: Object,
    provinceList: Array,
    isUpdataOk: Boolean
  },
  computed: {
    province () {
      return this.form.region1
    },
    watchClose () {
      return this.$store.state.userSetting.isShow
    }
  },
  watch: {
    userInfo (val, old) {
      this.info.forEach(res => {
        res.value = val[res.key]
        if (res.key === 'gender') {
          if (res.value === 1) {
            res.value = '男'
          } else {
            res.value = '女'
          }
        }
        if (res.key === 'intro') {
          if (res.value === '') {
            res.value = '这家伙很懒，什么也没留下'
          }
        }
        if (res.key === 'address') {
          res.value = `${this.userInfo['region1']}-${this.userInfo['region2']}`
        }
      })

      for (let key in this.form) {
        this.form[key] = val[key] || ''
        if (key === 'gender') {
          this.form[key] = val[key].toString()
        }
      }
    },
    isUpdataOk (v, old) {
      if (v) {
        this.showBasic = true
        this.$emit('changeIsOk', false)
      }
    },
    showBasic (val) {
      if (val) {
        for (let key in this.form) {
          this.form[key] = this.userInfo[key] || ''
          if (key === 'gender') {
            this.form[key] = this.userInfo[key].toString()
          }
        }
      }
    },
    province (val) {
      if (val) {
        let aa = this.provinceList.filter(val => val.name === val)[0]
        if (aa && aa.citys) {
          this.cityList = aa.citys
        }
      }
    },
    watchClose (val) {
      if (!val) {
        this.showBasic = true
      }
    }
  },
  created () {},
  mounted () {
    if (JSON.stringify(this.userInfo) !== '{}') {
      this.info.forEach(res => {
        res.value = this.userInfo[res.key]
        if (res.key === 'gender') {
          if (res.value === 1) {
            res.value = '男'
          } else {
            res.value = '女'
          }
        }
        if (res.key === 'intro') {
          if (res.value === '') {
            res.value = '这家伙很懒，什么也没留下'
          }
        }
        if (res.key === 'address') {
          res.value = `${this.userInfo['region1']}-${this.userInfo['region2']}`
        }
      })
      for (let key in this.form) {
        this.form[key] = this.userInfo[key] || ''
        if (key === 'gender') {
          this.form[key] = this.userInfo[key].toString()
        }
        if (this.userInfo['region1']) {
          this.cityList = this.provinceList.filter(
            val => val.name === this.userInfo['region1']
          )[0]
            ? this.provinceList.filter(
              val => val.name === this.userInfo['region1']
            )[0].citys
            : []
        }
      }
    }
  },
  methods: {
    editPersonal () {
      this.showBasic = false
    },
    cancelBtn () {
      this.showBasic = true
    },
    provinceChange (e) {
      this.form.region2 = ''
      this.cityList = this.provinceList.filter(val => val.name === e)[0].citys
    },
    save () {
      let data = { ...this.form }
      data.gender = parseInt(data.gender)
      this.$refs['form'].validate(valid => {
        if (valid) {
          let isChange = false
          for (let i in data) {
            if (data[i] === null) {
              data[i] = ''
            }
          }
          for (let i in data) {
            if (data[i] !== this.$store.state.public.publicUserInfo[i]) {
              isChange = true
            }
          }
          if (isChange) {
            ipcRenderer.send('user-setting-updata-uesr-info', data)
          } else {
            this.$message({
              message: '信息暂无修改， 请确认提交',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 15px;
}
.userInfo-wrap {
  width: 100%;
  height: 100%;
  .userInfo-headerBox {
    width: 100%;
    padding: 17px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .userInfo-headerBox-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .userInfo-headerBox-rightBtn {
      width: 90px;
      height: 30px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgb(200, 200, 200);
      border-radius: 4px;
    }
    .userInfo-headerBox-rightBox {
      font-size: 14px;
      color: #666;
      display: flex;
      cursor: pointer;
      .el-icon-edit {
        margin-right: 5px;
      }
      .userInfo-headerBox-rightBox-cancel {
        padding: 0;
        width: 90px;
        height: 30px;
      }
      .userInfo-headerBox-rightBox-save {
        padding: 0;
        width: 90px;
        height: 30px;
        border: 1px solid #4e4afc;
        color: #4e4afc;
      }
    }
  }
  .nick-name {
    width: 300px;
  }
  .userInfo-container {
    .userInfo-container-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      font-size: 14px;

      .userInfo-container-item-left {
        width: 80px;
        color: #303033;
      }
      .userInfo-container-item-right {
        color: #888;
      }
    }
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
}
</style>