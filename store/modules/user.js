const state = () => ({
  userInfo: null
})

const mutations = {
  // 设置用户信息
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  // 登录成功后保存用户信息
  saveUserInfo({ commit }, userInfo) {
    // 保存到本地存储（仅在客户端执行）
    if (process.client) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
    // 提交mutation更新状态
    commit('SET_USER_INFO', userInfo)
  },
  
  // 退出登录
  logout({ commit }) {
    // 清除本地存储（仅在客户端执行）
    if (process.client) {
      localStorage.removeItem('userInfo')
    }
    // 提交mutation更新状态
    commit('SET_USER_INFO', null)
  },
  
  // 初始化用户信息（从本地存储读取）
  initUserInfo({ commit }) {
    // 仅在客户端执行
    if (process.client) {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          commit('SET_USER_INFO', userInfo)
        } catch (error) {
          localStorage.removeItem('userInfo')
          commit('SET_USER_INFO', null)
        }
      }
    }
  }
}

const getters = {
  // 获取用户信息
  userInfo: state => state.userInfo,
  // 判断是否已登录
  isLoggedIn: state => !!state.userInfo,
  // 获取用户名
  username: state => state.userInfo ? state.userInfo.username : '',
  // 获取用户头像
  avatar: state => state.userInfo ? state.userInfo.avatar : ''
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
