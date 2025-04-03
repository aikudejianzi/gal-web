import request from '@/utils/request'

/**
 * 检查用户登录状态
 * @returns {Promise} 请求结果
 */
export function checkAuthAPI() {
  return request({
    url: '/user/checkAuth',
    method: 'get'
  })
}

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

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise} 请求结果
 */
export function updateUserAPI(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

/**
 * 上传图片
 * @param {FormData} formData - 包含图片的FormData对象
 * @returns {Promise} 请求结果
 */
export function uploadImageAPI(formData) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
