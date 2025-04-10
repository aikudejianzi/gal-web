import request from '@/utils/request'

/**
 * 获取制作人员详情
 * @param {number} id 制作人员ID
 * @returns {Promise} 响应Promise对象
 */
export function getPersonDetailAPI(id) {
  return request({
    url: `/person/${id}`,
    method: 'get'
  })
}

/**
 * 获取制作人员参与的游戏列表
 * @param {number} personId 制作人员ID
 * @returns {Promise} 响应Promise对象
 */
export function getPersonGamesAPI(personId) {
  return request({
    url: `/person/games/${personId}`,
    method: 'get'
  })
}

/**
 * 获取制作人员列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.keyword 搜索关键词
 * @returns {Promise} 响应Promise对象
 */
export function getPersonListAPI(params) {
  return request({
    url: '/person/list',
    method: 'get',
    params
  })
} 