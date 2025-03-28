import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

// 创建store
export default () => {
  return new Vuex.Store({
    modules: {
      user
    },
    state: () => ({
      // 全局状态在这里定义
    }),
    mutations: {
      // 全局mutations在这里定义
    },
    actions: {
      // 在Nuxt应用初始化时恢复状态（服务端）
      nuxtServerInit({ dispatch }, { req }) {
        // 服务端无法访问localStorage，所以这里只做基本初始化
        console.log('nuxtServerInit被调用')
      }
    },
    getters: {
      // 全局getters在这里定义
    }
  })
}
