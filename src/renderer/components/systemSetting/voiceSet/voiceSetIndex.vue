<template>
    <div class="voiceSetIndex-wrap">
        <div class="voiceSetIndex-item">
            <div class="top-bor" />
            <div style="width: 100%;">
                <div class="voiceSetIndex-item-top">
                    <div class="top-title">选择输入设备:</div>
                </div>
                <div class="item-select">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="item-sliderBox">
                    <span class="el-icon-microphone"></span>
                    <el-slider v-model="voiceValue"></el-slider>
                </div>
            </div>
        </div>

        <div class="voiceSetIndex-item">
            <div class="top-bor" />
            <div style="width: 100%;">
                <div class="voiceSetIndex-item-top">
                    <div class="top-title">选择输出设备:</div>
                </div>
                <div class="item-select">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="item-sliderBox">
                    <span class="el-icon-microphone"></span>
                    <el-slider v-model="voiceValue"></el-slider>
                </div>
            </div>
        </div>

        <div class="voiceSetIndex-item">
            <div class="top-bor" />
            <div style="width: 100%;">
                <div class="voiceSetIndex-item-top">
                    <div class="top-title">麦克风测试:</div>
                </div>
                <div class="voiceSetIndex-item-label">点击开始测试麦克风，我们会把麦克风收到的声音通过您的耳机/音频播放出来</div>
                <div class="item-sliderBox">
                    <div class="btn">开始测试</div>
                    <el-slider v-model="voiceValue"></el-slider>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
      data () {
        return {
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          value: '',
          voiceValue: 0
        }
      }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-select{
        flex: 1;
        margin-top: 18px;
    }
    .voiceSetIndex-wrap{
        width: 100%;
        .voiceSetIndex-item{
            width: 100%;
            display: flex;
            align-items: flex-start;
            box-sizing: border-box;
            margin-bottom: 35px;
            .top-bor{
                width: 3px;
                height: 14px;
                background:rgba(78,74,252,1);
                border-radius:2px;
                margin-right: 11px;
                margin-top: 3px;
            }
            .voiceSetIndex-item-top{
                display: flex;
                align-items: center;
                .top-title{
                    font-size: 14px;
                    color: #333;
                }
            }
            .voiceSetIndex-item-label{
                font-size: 12px;
                color: #666;
                margin-top: 10px;
                margin-bottom: 15px;
            }
            .item-select{
                width: 100%;
                display: flex;

            }
            .item-sliderBox{
                display: flex;
                align-items: center;
                /deep/ .el-slider{
                    flex: 1;
                    .el-slider__bar{
                        height: 4px;
                        background: rgba(78,74,252,1);
                    }
                    .el-slider__runway{
                        height: 4px;
                    }
                    .el-slider__button{
                        width: 10px;
                        height: 10px;
                        border-color: rgba(78,74,252,1);
                    }
                }
                span{
                    font-size: 20px;
                    color: #666;
                    margin-right: 10px;
                }
                .btn{
                    width: 90px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-right: 15px;
                    cursor: pointer;
                }
            }
        }
    }
</style>