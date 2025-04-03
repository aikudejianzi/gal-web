import request from '@/utils/request'

/**
 * 检查用户是否收藏了特定文章
 * @param {number|string} articleId - 文章ID
 * @param {number|string} userId - 用户ID
 * @returns {Promise} 包含检查结果的Promise，data为true表示已收藏，false表示未收藏
 */
export function checkIsFavoriteAPI(articleId, userId) {
    return request({
      url: '/favorite/checkIsFavorite',
      method: 'get',
      params: { articleId, userId }
    })
  }
  
  /**
   * 切换文章的收藏状态（收藏/取消收藏）
   * @param {number|string} articleId - 文章ID
   * @param {number|string} userId - 用户ID
   * @returns {Promise} 包含操作结果的Promise，data为true表示收藏成功，false表示取消收藏成功
   * @description 后端设置两张表：用户收藏表记录用户收藏关系，文章收藏表记录文章被收藏次数
   */
  export function toggleFavoriteAPI(articleId, userId) {
    return request({
      url: '/favorite/toggleFavorite',
      method: 'put',
      data: { articleId, userId }
    })
  }

  /**
   * 获取用户收藏的文章列表
   * @param {Object} params - 查询参数
   * @param {number|string} params.userId - 用户ID，指定要获取哪个用户的收藏列表
   * @param {number} params.page - 当前页码
   * @param {number} params.pageSize - 每页显示数量
   * @returns {Promise} 包含分页收藏列表的Promise，data.records为收藏记录数组，data.total为总记录数
   */
  export function getFavoriteArticlesAPI(params) {
    return request({
      url: '/favorite/list',
      method: 'get',
      params
    })
  }

  /**
   * 取消收藏文章
   * @param {number|string} articleId - 文章ID
   * @param {number|string} userId - 用户ID
   * @returns {Promise} 包含操作结果的Promise，code为1表示取消成功
   */
  export function cancelFavoriteAPI(articleId, userId) {
    return request({
      url: '/favorite/cancel',
      method: 'delete',
      params: { articleId, userId }
    })
  }