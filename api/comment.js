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
