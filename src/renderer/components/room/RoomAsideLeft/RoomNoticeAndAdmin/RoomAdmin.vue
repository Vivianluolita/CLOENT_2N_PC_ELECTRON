<template>
  <!-- 房间管理员列表 -->
  <div class="room-admin-wrap" v-if="onlineManagerList">
    <li :key="index" class="all-user-list" v-for="(item,index) in onlineManagerList">
      <div
        :class="['all-user-list-li',{'onchoose':item.onchoose === true}]"
        @click="chooseManager(item)"
      >
        <span class="itemId">{{(index+1) + '.'}}</span>
        <img :src="item.roleIcon" alt class="user-cloth" />
        <span>
          <el-tooltip :content="item.nickname" effect="light" placement="right-start">
            <span class="user-nickname">{{item.nickname}}</span>
          </el-tooltip>
        </span>
      </div>
    </li>
  </div>
</template>

<script>
import contextMenu from '../../contextMenu/contextMenu'
export default {
  data () {
    return {
      onlineManagerList: []
    }
  },
  watch: {
    roomInfo: {
      handler (newValue, oldValue) {
        if (newValue) {
          let list = []
          JSON.parse(JSON.stringify(newValue)).list.map(e => {
            if (e.users) {
              e.users.map(i => {
                if (i.role <= 4) {
                  list.push(i)
                }
              })
            }
          })
          console.log(list)
          let roleList = JSON.parse(
            JSON.stringify(this.$store.state.room.roomClothesList)
          )
          list.map(e => {
            this.$set(e, 'onchoose', false)
            roleList.map(i => {
              if (e.role === i.id) {
                if (e.gender === 1) {
                  e.roleIcon = i.icon_male
                } else if (e.gender === 2) {
                  e.roleIcon = i.icon_female
                }
              }
            })
          })
          this.onlineManagerList = [...list]
        }
      },
      deep: true
    }
  },
  computed: {
    roomInfo () {
      return JSON.parse(JSON.stringify(this.$store.state.room.roomInfo))
    }
  },
  methods: {
    chooseManager (item) {
      console.log(item)
      this.onlineManagerList.map(e => {
        e.onchoose = false
      })
      item.onchoose = true
    }
  }
}
</script>

<style lang="less" scoped>
.room-admin-wrap {
  padding-top: 10px;
  .all-user-list {
    height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .itemId {
      display: inline-block;
      font-size: 14px;
      margin: 0 5px 0 13px;
      height: 34px;
      line-height: 34px;
    }
    .all-user-list-li {
      width: 100%;
      .user-status {
        line-height: 22px;
        padding: 10px 15px 0 10px;
      }
      .user-cloth {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        margin-top: -3px;
      }
      .user-nickname {
        display: inline-block;
        vertical-align: middle;
        max-width: 125px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        margin-top: -3px;
      }
    }
  }

  .onchoose {
    background-color: #e3e6e8;
  }
}
</style>