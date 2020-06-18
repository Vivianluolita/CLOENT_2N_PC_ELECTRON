<template>
  <!-- 底部工具栏 -->
  <div class="room-footer-wrap">
    <ul>
      <div>
        <li>
          <el-popover placement="top" trigger="click">
            <img :src="speak_type" class="speakType" slot="reference" />
            <el-radio-group @change="changeRadio" v-model="radio">
              <el-radio :label="1" class="speakTypeChange">自由说话</el-radio>
              <el-radio :label="2">按F2说话</el-radio>
            </el-radio-group>
            <el-divider style="margin:12px 0"></el-divider>
            <el-radio-group @change="changeVoice" v-model="voice">
              <el-radio :label="1">原声</el-radio>
              <el-radio :label="2">大叔</el-radio>
              <el-radio :label="3" class="girlVoice">少女</el-radio>
              <br />
              <p style="height:10px"></p>
              <el-radio :label="5">空灵</el-radio>
              <el-radio :label="4">哥布林</el-radio>
            </el-radio-group>
          </el-popover>
        </li>
        <!-- 耳返音量 -->
        <li>
          <el-popover placement="top" popper-class="soundPopover" trigger="hover">
            <!-- <i class="iconfont icon-Microphone" slot="reference"></i> -->
            <img
              :src="microphone"
              @click="stopAudio"
              class="microphone"
              slot="reference"
              v-if="audioStoped"
            />
            <img
              :src="microphoneStop"
              @click="stopAudio"
              class="microphone"
              slot="reference"
              v-if="!audioStoped"
            />
            <el-slider @change="changeValue" height="200px" v-model="value" vertical></el-slider>
          </el-popover>
        </li>
        <!-- 麦克风音量 -->
        <li>
          <el-popover placement="top" popper-class="soundPopover" trigger="hover">
            <!-- <i class="iconfont icon-Microphone" slot="reference"></i> -->
            <img
              :src="microphone_say"
              @click="stopAudio_say"
              class="microphone_say"
              slot="reference"
              v-if="audioStoped_say"
            />
            <img
              :src="microphone_say_stop"
              @click="stopAudio_say"
              class="microphone_say"
              slot="reference"
              v-if="!audioStoped_say"
            />
            <el-slider @change="changeValue_say" height="200px" v-model="value_say" vertical></el-slider>
          </el-popover>
        </li>

        <!-- 选择伴奏 -->
        <li @click="start_accompany" style="display:inline-block" v-if="isAccompanying == '伴奏' ">
          <img :src="music" class="chooseMusic" />
        </li>
        <li @click="stop_accompany" style="display:inline-block" v-if="isAccompanying == '伴奏中' ">
          <div class="chooseMusic2">
            <img :src="accompanyPlaying" alt class="playing_accompany" />
            <!-- <span>{{isAccompanying}}</span> -->
          </div>
        </li>
      </div>

      <li>
        <div class="signal level_3">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: 2,
      voice: 1,
      value: 50,
      value_say: 50,
      oldvalue: 50,
      oldvalue_say: 50,
      audioStoped: true,
      audioStoped_say: true,
      isAccompanying: '伴奏',
      speak_type: require('@/assets/img/room/icon/say.png'),
      microphone: require('@/assets/img/room/icon/audio.png'),
      microphoneStop: require('@/assets/img/room/icon/audioStop.png'),
      accompanyPlaying: require('@/assets/img/room/icon/musicActive.png'),
      music: require('@/assets/img/room/icon/music.png'),
      Voice_type: require('@/assets/img/room/icon/voice.png'),
      microphone_say: require('@/assets/img/room/icon/sound.png'),
      microphone_say_stop: require('@/assets/img/room/icon/sound_stop.png')
    }
  },
  methods: {
    changeRadio (e) {
      console.log(e)
    },
    changeVoice (e) {
      console.log(e)
      this.$emit('change_voice', e)
    },
    stopAudio () {
      this.audioStoped = !this.audioStoped
      if (this.audioStoped) {
        this.value = this.oldvalue
      } else {
        this.value = 0
      }
    },
    stopAudio_say () {
      this.audioStoped_say = !this.audioStoped_say
      if (this.audioStoped_say) {
        this.value_say = this.oldvalue_say
      } else {
        this.value_say = 0
      }
    },
    changeValue (e) {
      if (e > 0) {
        this.audioStoped = true
      } else {
        this.audioStoped = false
      }
      this.value = e
      this.oldvalue = e
    },
    changeValue_say (e) {
      if (e > 0) {
        this.audioStoped_say = true
      } else {
        this.audioStoped_say = false
      }
      this.value_say = e
      this.oldvalue_say = e
    },
    start_accompany () {
      this.isAccompanying = '伴奏中'
      this.$emit('start_accompany', 1)
    },
    stop_accompany () {
      this.isAccompanying = '伴奏'
      this.$emit('start_accompany', 0)
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.room-footer-wrap {
  // width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(229, 228, 228, 1);
  margin: 0 10px 10px 10px;
  box-sizing: border-box;
  padding: 9px 0;
  .speakType,
  .microphone,
  .chooseMusic,
  .changeVoice,
  .microphone_say {
    cursor: pointer;
    position: absolute;
    width: 22px;
    height: 22px;
  }
  .chooseMusic2 {
    cursor: pointer;
    position: absolute;
    top: -15px;
    left: 165px;
    width: 102px;
    height: 22px;
  }
  .speakType {
    top: 0;
    left: 24px;
  }
  .microphone {
    top: 0;
    left: 72px;
  }
  .microphone_say {
    top: 0;
    left: 116px;
  }
  .chooseMusic {
    top: -15px;
    left: 165px;
  }
  .playing_accompany {
    width: 25px;
    height: 25px;
    margin-bottom: 0;
  }
  ul {
    // position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li {
      // display: inline-block;
      position: relative;
    }
    .signal {
      width: 40px;
      position: absolute;
      right: 16px;
      top: 2px;
      // display: flex;
      i {
        // margin-bottom: 12px;
        display: inline-block;
        vertical-align: bottom;
        width: 3px;
        height: 16px;
        background: #cccccc;
        border-radius: 1px;
        // margin-right: 3px;
        &:nth-of-type(1) {
          height: 6px;
        }
        &:nth-of-type(2) {
          height: 9px;
        }
        &:nth-of-type(3) {
          height: 13px;
        }
      }
      &.level_1 {
        i:nth-of-type(1) {
          background: #44d7b6;
        }
      }
      &.level_2 {
        i:nth-of-type(1),
        i:nth-of-type(2) {
          background: #44d7b6;
        }
      }
      &.level_3 {
        i:nth-of-type(1),
        i:nth-of-type(2),
        i:nth-of-type(3) {
          background: #44d7b6;
        }
      }
      &.level_4 {
        i {
          background: #44d7b6;
        }
      }
    }
  }
}
.speakTypeChange {
  margin-top: 10px;
}
.girlVoice {
  margin-right: 0;
}
/deep/.el-radio__inner {
  width: 18px;
  height: 18px;
}
/deep/.el-radio {
  color: #666;
}
/deep/.el-radio__inner:hover {
  border-color: #999;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #333333;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  width: 18px;
  height: 18px;
  border-color: #dcdfe6;
  background-color: #fff;
}
/deep/.el-radio__inner::after {
  width: 10px;
  height: 10px;
  background: linear-gradient(
    360deg,
    rgba(142, 121, 254, 1) 0%,
    rgba(68, 68, 252, 1) 100%
  );
}
/deep/ .el-divider,
.el-divider--horizontal {
  margin: 15px 0 !important;
}
</style>