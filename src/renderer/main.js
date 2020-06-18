import Vue from 'vue'
import axios from '../main/api/axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '../../node_modules/element-ui/lib/theme-chalk/index.css'

import { utils } from '@/common/js/common.js'
import VueCropper from 'vue-cropper'
import '../renderer/assets/css/reset.less'
import '../renderer/assets/css/element-reset.less'
import '../renderer/assets/css/room.less'
import { DB, Storage } from '../main/db/dbStore'
import { ipcRenderer } from 'electron'

// var AutoLaunch = require('auto-launch')
// var auto = new AutoLaunch({
//   name: 'auto'
// })

if (Storage.get('isOpenTurnON') || Storage.get('isOpenTurnON') === undefined) {
  // 开机自启动
  // auto.enable()
  ipcRenderer.send('changeAutoStart-open')
} else {
  // auto.disable()
  ipcRenderer.send('changeAutoStart-closed')
}

Vue.use(VueCropper)
Vue.use(ElementUI)
Vue.mixin(utils)
Vue.db = Vue.prototype.$db = DB
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
