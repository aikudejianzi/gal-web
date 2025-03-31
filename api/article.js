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

// 获取文章评论列表 
export function getArticleCommentListAPI(articleId) {
  return request({
    url: '/comment/getCommentList',
    method: 'get',
    params: { articleId }
  })
}

// 检查用户是否收藏了该文章 
export function checkIsFavoriteAPI(articleId, userId) {
  return request({
    url: '/favorite/checkIsFavorite',
    method: 'get',
    params: { articleId, userId }
  })
}

// 切换收藏状态 , 设置两张表, 一张是用户收藏表, 一张是文章收藏表  
export function toggleFavoriteAPI(articleId, userId) {
  return request({
    url: '/favorite/toggleFavorite',
    method: 'put',
    data: { articleId, userId }
  })
}

