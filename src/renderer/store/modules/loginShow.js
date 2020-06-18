const state = {
  // 登录框是否显示和显示什么
  isLoginShow: 0
}

const mutations = {
  SHOWLOGINPAGE (state, data) {
    state.isLoginShow = data
  }
}

const actions = {
  loginBtnClick ({ commit }, params) {
    commit('SHOWLOGINPAGE', params)
  }
}

export default {
  state,
  mutations,
  actions
}
