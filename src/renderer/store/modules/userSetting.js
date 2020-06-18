const state = {
  isShow: false,
  systemSetting: false
}

const mutations = {
  SHOWUSERSETTING (state) {
    state.isShow = !state.isShow
  },
  isSettingClick (state) {
    state.systemSetting = !state.systemSetting
  }
}

const actions = {
  userSettingClick ({ commit }) {
    commit('SHOWUSERSETTING')
  }
}

export default {
  state,
  mutations,
  actions
}
