import { isAuthRequired } from '~/utils/auth-routes'
import { checkAuthAPI } from '~/api/user'

export default async function ({ app, route, redirect }) {
  // 获取当前路径
  const path = route.path

  // 检查当前路径是否需要登录权限
  if (isAuthRequired(path)) {
    try {
      // 向后端发送请求，检查登录状态
      const res = await checkAuthAPI()
      
      if (res.code === 1) {
        // 已登录，更新localStorage中的用户信息
        if (process.client && res.data) {
          localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
      } else if (res.code !== 1 && res.msg === 'nologin') {
        // 未登录，清除localStorage中的用户信息并重定向到登录页面
        if (process.client) {
          localStorage.removeItem('userInfo')
        }
        return redirect('/login')
      }
    } catch (error) {
      console.error('验证登录状态失败:', error)
      // 请求失败，可能是网络问题或服务器问题，重定向到登录页
      if (process.client) {
        localStorage.removeItem('userInfo')
      }
      return redirect('/login')
    }
  }
} 