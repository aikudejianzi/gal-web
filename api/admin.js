import request from '@/utils/request'

/**
 * 获取用户列表（管理员接口）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {string} params.keyword - 搜索关键词（用户名或邮箱）
 * @param {number} params.status - 用户状态筛选(0-禁用 1-可用)
 * @returns {Promise} 请求结果
 */
export function getUserListAPI(params) {
  return request({
    url: '/admin/users',
    method: 'get',
    params
  })
}

/**
 * 更新用户状态（管理员接口）
 * @param {Object} data - 更新数据
 * @param {number} data.userId - 用户ID
 * @param {number} data.status - 用户状态(0-禁用 1-可用)
 * @returns {Promise} 请求结果
 */
export function updateUserStatusAPI(data) {
  return request({
    url: '/admin/user/status',
    method: 'put',
    data
  })
}

/**
 * 获取待审核文章列表（管理员接口）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {string} params.keyword - 搜索关键词（标题）
 * @returns {Promise} 请求结果
 */
export function getPendingArticlesAPI(params) {
  return request({
    url: '/admin/articles/pending',
    method: 'get',
    params
  })
}

/**
 * 审核文章（管理员接口）
 * @param {Object} data - 审核数据
 * @param {number} data.articleId - 文章ID
 * @param {number} data.status - 审核状态(1-通过)
 * @returns {Promise} 请求结果
 */
export function reviewArticleAPI(data) {
  return request({
    url: '/admin/articles/review',
    method: 'put',
    data
  })
}

/**
 * 获取文章列表（管理员接口）
 * @param {Object} params 查询参数
 * @returns {Promise} 请求结果
 */
export function getArticleListAPI(params) {
  return request({
    url: '/admin/articles',
    method: 'get',
    params
  })
}

/**
 * 删除文章（管理员接口）
 * @param {Number} id 文章ID
 * @returns {Promise} 请求结果
 */
export function deleteArticleAPI(id) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'delete'
  })
}

/**
 * 获取未使用的图片列表（管理员接口）
 * @returns {Promise} 请求结果
 */
export function getUnusedImagesAPI() {
  return request({
    url: '/image-gc/unused',
    method: 'get'
  })
}

/**
 * 手动触发图片垃圾回收（管理员接口）
 * @returns {Promise} 请求结果
 */
export function cleanupImagesAPI() {
  return request({
    url: '/image-gc/cleanup',
    method: 'delete'
  })
}

/**
 * 获取评论列表（管理员接口）
 * @param {Object} params 查询参数
 * @returns {Promise} 请求结果
 */
export function getCommentListAPI(params) {
  return request({
    url: '/admin/comments',
    method: 'get',
    params
  })
}

/**
 * 删除评论（管理员接口）
 * @param {Number} id 评论ID
 * @returns {Promise} 请求结果
 */
export function deleteCommentAPI(id) {
  return request({
    url: `/admin/comments/${id}`,
    method: 'delete'
  })
} 