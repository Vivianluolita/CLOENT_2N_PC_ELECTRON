<template>
  <div>
    <div :style="positionstyle" class="menu-box" ref="menu" v-if="showPop">
      <slot name="above"></slot>
      <ul class="list-unstyled">
        <li
          :key="index"
          @click="listItemClick(index,item)"
          @mouseleave="item.children_show = false"
          @mouseover="item.children_show = true"
          v-for="(item,index) in items"
        >
          <span>{{item.txt}}</span>
          <div class="list-unstyled-children" v-if="item.children && item.children_show">
            <div
              :key="index_child"
              @click="listItemChildClick(index_child,item_child)"
              v-for="(item_child,index_child) in item.children"
            >{{item_child.txt}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['popItems', 'mouse'],
  data () {
    return {
      positionstyle: '',
      showPop: false
    }
  },
  watch: {
    mouse () {
      let self = this
      let x = self.mouse[0]
      let y = self.mouse[1]
      if (x === 'close') {
        self.showPop = false
      } else {
        self.positionstyle = `left:${x}px; top:${y}px;` // 计算鼠标位置
        self.showPop = true

        if (!this.$refs.menu) {
          this.$nextTick(() => {
            const { menu } = this.$refs

            this.menu = menu
            document.body.appendChild(menu)
          })
        }
      }
    },
    showPop (showPop) {
      const { overrideOncontextmenu, resetOncontextmenu } = this

      if (showPop) {
        overrideOncontextmenu()
        this.popItems.map(e => {
          this.$set(e, 'children_show', false)
        })
        this.$emit('open')
      } else {
        resetOncontextmenu()
        this.$emit('close')
      }
    }
  },
  computed: {
    items () {
      return this.popItems
    }
  },

  methods: {
    listItemClick (it, item) {
      let self = this
      self.$emit('ListItemClick', it, item)
    },
    listItemChildClick (index, item) {
      this.$emit('ListItemChildClick', index, item)
    },
    overrideOncontextmenu () {
      document.body.oncontextmenu = preventExplorerMenu
    },

    resetOncontextmenu () {
      document.body.oncontextmenu = null
    }
  },

  destroyed () {
    this.resetOncontextmenu()
    this.menu &&
      this.menu.parentNode === document.body &&
      document.body.removeChild(this.menu)
  }
}

function preventExplorerMenu () {
  return false
}
</script>

<style scoped lang="less">
.menu-box {
  border: 1px solid #ddd;
  width: 100px;
  border-radius: 5px;
  padding: 10px 0;
  text-align: center;
  box-shadow: 2px 2px 2px #aaa;
  position: absolute;
  z-index: 10000;
  background-color: white;
  // background: linear-gradient(red, yellow, white, green);
}
.menu-box > ul {
  margin: auto;
}
.menu-box ul li {
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  position: relative;
}

.menu-box ul li span {
  display: inline-block;
  font-size: 12px;
}
.menu-box ul li .list-unstyled-children {
  position: absolute;
  width: 100px;
  top: -30px;
  left: -100px;
  border: 1px solid #ddd;
  box-shadow: 2px 2px 2px #aaa;
  text-align: center;
  background-color: white;
  // background: linear-gradient(red, yellow, white, green);
}
.menu-box ul li:hover {
  background: #eee;
}
.menu-box ul li .list-unstyled-children div:hover {
  background: #eee;
}
</style>
