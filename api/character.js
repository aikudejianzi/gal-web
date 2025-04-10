import request from '@/utils/request'

/**
 * 获取角色详情
 * @param {number} id 角色ID
 * @returns {Promise} 响应Promise对象
 */
export function getCharacterDetailAPI(id) {
  return request({
    url: `/character/${id}`,
    method: 'get'
  })
} 
 
 
 