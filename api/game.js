import request from '@/utils/request'

/**
 * 获取游戏列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.size - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.sortBy - 排序方式(rating-按评分排序 date-按发售日期排序)
 * @returns {Promise} 请求结果
 */
export function getGameListAPI(params) {
  return request({
    url: '/game/list',
    method: 'get',
    params
  })
}

/**
 * 获取游戏详情
 * @param {number} id 游戏ID
 * @param {number} [userId] 用户ID（可选）
 * @returns {Promise} 响应Promise对象
 */
export function getGameDetailAPI(id, userId) {
  return request({
    url: `/game/${id}`,
    method: 'get',
    params: userId ? { userId } : {}
  })
}

/**
 * 获取游戏角色列表
 * @param {number|string} gameId - 游戏ID
 * @returns {Promise} 请求结果
 */
export function getGameCharactersAPI(gameId) {
  return request({
    url: `/game/characters/${gameId}`,
    method: 'get'
  })
}

/**
 * 获取游戏制作人员列表
 * @param {number|string} gameId - 游戏ID
 * @returns {Promise} 请求结果
 */
export function getGamePersonsAPI(gameId) {
  return request({
    url: `/game/persons/${gameId}`,
    method: 'get'
  })
}

/**
 * 获取游戏评分
 * @param {number|string} gameId - 游戏ID
 * @returns {Promise} 请求结果
 */
export function getGameRatingsAPI(gameId) {
  return request({
    url: `/rating/game/${gameId}`,
    method: 'get'
  })
}

/**
 * 获取游戏评分统计数据
 * @param {number|string} gameId - 游戏ID
 * @returns {Promise} 请求结果
 */
export function getGameRatingStatsAPI(gameId) {
  return request({
    url: `/rating/stats/${gameId}`,
    method: 'get'
  })
}

/**
 * 为游戏评分
 * @param {Object} data 评分数据
 * @param {number} data.gameId 游戏ID
 * @param {number} data.userId 用户ID
 * @param {number} data.rating 评分（0-100）
 * @returns {Promise} 响应Promise对象
 */
export function rateGameAPI(data) {
  return request({
    url: '/game/rate',
    method: 'post',
    data
  })
}

/**
 * 获取游戏的所有短评
 * @param {Number} gameId 游戏ID
 * @returns {Promise} 请求结果
 */
export function getGameShortCommentsAPI(gameId) {
  return request({
    url: `/game/short-comments/${gameId}`,
    method: 'get'
  })
}

/**
 * 获取用户对游戏的短评
 * @param {Number} gameId 游戏ID
 * @param {Number} userId 用户ID
 * @returns {Promise} 请求结果
 */
export function getUserGameShortCommentAPI(gameId, userId) {
  return request({
    url: `/game/short-comments/${gameId}/user/${userId}`,
    method: 'get'
  })
}

/**
 * 添加短评
 * @param {Object} data 短评数据
 * @returns {Promise} 请求结果
 */
export function addShortCommentAPI(data) {
  return request({
    url: '/game/short-comments',
    method: 'post',
    data
  })
}

/**
 * 删除短评
 * @param {Number} gameId 游戏ID
 * @param {Number} userId 用户ID
 * @returns {Promise} 请求结果
 */
export function deleteShortCommentAPI(gameId, userId) {
  return request({
    url: `/game/short-comments/${gameId}/user/${userId}`,
    method: 'delete'
  })
}

/**
 * 获取评分最高的10款游戏
 * @returns {Promise} 请求结果
 */
export function getTopRatedGamesAPI() {
  return request({
    url: '/game/topRated',
    method: 'get'
  })
}

/**
 * 根据关键字搜索游戏
 * @param {string} keyword 搜索关键字
 * @returns {Promise} 请求结果
 */
export function searchGamesAPI(keyword) {
  return request({
    url: '/game/search',
    method: 'get',
    params: { keyword }
  })
} 