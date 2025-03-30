import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.size - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @param {number|string} params.category - 文章分类(0-游戏评测 1-游戏攻略 2-行业新闻 3-讨论交流)
 * @param {number} params.sort - 排序方式(0-最新 1-最多阅读 2-最多评论 3-最多收藏)
 * @returns {Promise} 请求结果
 */
export function getArticleListAPI(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
} 


export function getSelectedArticlesAPI() {
  return request({
    url: '/article/selectedArticles',
    method: 'get'
  })
}

/**
 * 获取文章详情
 * @param {string|number} id - 文章ID
 * @returns {Promise} 请求结果
 */
export function getArticleDetailAPI(id) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

/**
 * 获取文章评论列表
 * @param {string|number} articleId - 文章ID
 * @returns {Promise} 请求结果
 */
export function getArticleCommentsAPI(articleId) {
  return request({
    url: `/comment/${articleId}`,
    method: 'get'
  })
}

/**
 * 检查用户是否已收藏文章
 * @param {string|number} articleId - 文章ID
 * @returns {Promise} 请求结果
 */
export function checkIsFavoriteAPI(articleId) {
  return request({
    url: `/favorite/check/${articleId}`,
    method: 'get'
  })
}

/**
 * 收藏文章
 * @param {string|number} articleId - 文章ID
 * @returns {Promise} 请求结果
 */
export function addFavoriteAPI(articleId) {
  return request({
    url: '/favorite/add',
    method: 'post',
    data: { articleId }
  })
}

/**
 * 取消收藏文章
 * @param {string|number} articleId - 文章ID
 * @returns {Promise} 请求结果
 */
export function cancelFavoriteAPI(articleId) {
  return request({
    url: '/favorite/cancel',
    method: 'post',
    data: { articleId }
  })
}