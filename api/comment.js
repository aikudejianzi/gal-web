import request from '@/utils/request'

// 获取文章评论列表 
export function getArticleCommentListAPI(articleId) {
    return request({
      url: '/comment/getCommentList',
      method: 'get',
      params: { articleId }
    })
  }

// 添加评论
export function addCommentAPI(articleId, userId, content) {
    return request({
      url: '/comment/addComment',
      method: 'post',
      data: { articleId, userId, content }
    })
}

// 删除评论
export function deleteCommentAPI(commentId) {
    return request({
      url: '/comment/deleteComment',
      method: 'delete',
      params: { commentId }
    })
}

/**
 * 获取用户评论列表
 * @param {Object} params - 查询参数
 * @param {number|string} params.userId - 用户ID
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页显示数量
 * @returns {Promise} 包含分页评论列表的Promise
 */
export function getUserCommentsAPI(params) {
  return request({
    url: '/comment/userComments',
    method: 'get',
    params
  })
}
