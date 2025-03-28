import request from '@/utils/request'

/**
 * 发送验证码
 * @param {string} email - 邮箱地址
 * @returns {Promise} 请求结果
 */
export function sendCodeAPI(email) {
  return request({
    url: '/user/sendCode',
    method: 'get',
    params: { email }
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.email - 邮箱地址
 * @param {string} data.code - 验证码
 * @returns {Promise} 请求结果
 */
export function loginAPI(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
