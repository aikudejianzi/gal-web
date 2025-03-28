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