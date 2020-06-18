<template>
  <div class="intl-tel-input allow-dropdown">
    <div class="flag-container">
      <div
        :title="currentData.name + ': +' + currentData.dialCode"
        @click="openWin"
        class="selected-flag"
      >
        <!-- 去掉国旗 -->
        <!-- <div :class="'iti-flag ' + currentData.code"></div> -->
        <div class="iti-checked">+{{currentData.dialCode}}</div>
        <div class="iti-arrow"></div>
        <!-- <img class="iti-arrow" src="iconImg" />> -->
      </div>
      <ul class="country-list" v-show="!hideSubMenu">
        <li
          :class="'country ' + (item.code == currentCode ? 'highlight' : '')"
          :key="item.id"
          @click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
          v-for="item in frontCountriesArray"
        >
          <!-- <div class="flag-box">
            <div :class="'iti-flag ' + item.code"></div>
          </div>-->
          <span class="country-name">{{ item.name }}</span>
          <span class="dial-code">+{{ item.dialCode }}</span>
        </li>
        <li class="divider"></li>
        <li
          :class="'country ' + (item.code == currentCode ? 'highlight' : '')"
          :key="item.id"
          @click="currentCode = item.code; hideSubMenu = true; setCountry(item);"
          v-for="item in countriesArray"
        >
          <!-- <div class="flag-box">
            <div :class="'iti-flag ' + item.code"></div>
          </div>-->
          <span class="country-name">{{ item.name }}</span>
          <span class="dial-code">+{{ item.dialCode }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import countries from './countryList'
import './intl.css'
export default {
  props: {
    toFront: {
      type: Array,
      default: () => {
        return []
      },
    },
    countryCode: {
      type: String,
      default: Object.keys(countries)[0],
      validator(code) {
        var clearCode = String(code).toLowerCase()
        return !!countries[clearCode]
      },
    },
  },

  data() {
    return {
      currentCode: this.countryCode,
      hideSubMenu: true,
      // iconImg: require('@/assets/img/login/login_down.png'),
    }
  },

  computed: {
    currentData() {
      return countries[this.currentCode]
    },
    frontCountriesArray() {
      const toFrontCodes = {}
      this.toFront.forEach(code => {
        const stringCode = String(code)
        const needObj = countries[stringCode]

        if (needObj) {
          toFrontCodes[stringCode] = needObj
        }
      })
      return toFrontCodes
    },
    countriesArray() {
      const countryCopie = { ...countries }
      this.toFront.forEach(code => {
        delete countryCopie[code]
      })
      return countryCopie
    },
  },

  watch: {
    countryCode(newCode) {
      this.setCountry(countries[newCode])
    },
    hideSubMenu(newData) {
      if (!newData) {
        // addEventListener
        document.addEventListener('click', this.windClick)
      } else {
        // removeEventListener
        document.removeEventListener('click', this.windClick)
      }
    },
  },

  methods: {
    setCountry(item) {
      this.currentCode = item.code
      this.toFront.push(String(item.code))
      this.$emit('excountry', item)
    },
    openWin() {
      event.stopPropagation()
      this.hideSubMenu = !this.hideSubMenu
    },
    windClick() {
      this.hideSubMenu = true
    },
  },

  mounted() {
    this.$emit('excountry', countries[this.countryCode])
  },
}
</script>


<style lang="less" scoped>
// @import "./intl.css";
.intl-tel-input {
  height: 36px;
  color: #666;
  font-size: 14px;
  .country-list {
    z-index: 899;
    width: 293px;
    height: 170px;
    margin-top: 2px;
    left: 6px;
    border: none;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}
</style>
