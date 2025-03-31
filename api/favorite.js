import request from '@/utils/request'

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