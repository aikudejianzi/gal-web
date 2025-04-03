// 需要登录权限的路由路径
export const authRoutes = [
  '/user',
  '/user/profile',
  '/user/articles',
  '/user/favorites',
  '/user/comments',
  '/article/submit',
  '/article/edit'
]

/**
 * 检查路径是否需要登录权限
 * @param {string} path - 要检查的路径
 * @returns {boolean} - 是否需要登录权限
 */
export function isAuthRequired(path) {
  // 检查路径是否在authRoutes数组中或者以authRoutes中的路径开始
  return authRoutes.some(route => {
    // 完全匹配
    if (route === path) return true
    // 路径以'/'结尾的前缀匹配 (例如: /article/edit/123 匹配 /article/edit)
    if (route.endsWith('/')) {
      return path.startsWith(route)
    }
    // 路径不以'/'结尾的精确前缀匹配 (例如: /article/edit/123 匹配 /article/edit)
    return path.startsWith(route + '/')
  })
} 