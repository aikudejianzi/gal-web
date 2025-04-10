import request from '@/utils/request'

/**
 * 保存用户的游戏生涯喜好表
 * @param {Array} gridList 喜好表数据列表
 * @param {Number} userId 用户ID
 * @returns {Promise} 请求结果
 */
export function saveUserGameGridAPI(gridList, userId) {
  return request({
    url: '/game-grid/save',
    method: 'post',
    params: {
      userId
    },
    data: gridList
  })
}

/**
 * 获取用户的游戏生涯喜好表
 * @param {Number} userId 用户ID
 * @returns {Promise} 请求结果
 */
export function getUserGameGridAPI(userId) {
  return request({
    url: `/game-grid/user/${userId}`,
    method: 'get'
  })
}

/**
 * 获取所有用户的游戏生涯喜好表
 * @returns {Promise} 请求结果
 */
export function getAllUserGameGridsAPI() {
  return request({
    url: '/game-grid/all',
    method: 'get'
  })
}

/**
 * 获取与当前用户相似度最高的用户
 * @param {Number} userId 用户ID
 * @returns {Promise} 请求结果
 */
export function getSimilarUserAPI(userId) {
  return request({
    url: `/game-grid/similar-user/${userId}`,
    method: 'get'
  })
} 