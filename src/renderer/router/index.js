import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      name: 'home',
      // redirect: '/room',
      component: require('@/views/home').default
    },
    {
      path: '/im',
      name: 'im',
      component: require('@/views/im').default
    },
    {
      path: '/phone',
      name: 'phone',
      component: require('@/views/phone').default
    },
    {
      path: '/room',
      name: 'room',
      component: require('@/views/room').default
    },
    {
      path: '/tray',
      name: 'tray',
      component: require('@/views/tray/tray').default
    },
    {
      path: '/state',
      name: 'state',
      component: require('@/views/tray/state').default
    },
    {
      path: '/helpCenter',
      name: 'helpCenter',
      component: require('@/views/helpCenter').default
    }
  ]
})
