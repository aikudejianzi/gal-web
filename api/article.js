import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.size - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @param {number|string} params.category - 文章分类(0-游戏评测 1-游戏攻略 2-行业新闻 3-讨论交流)
 * @param {number} params.sort - 排序方式(0-最新 1-最多阅读 2-最多评论 3-最多收藏)
 * @returns {Promise} 请求结果
 */
export function getArticleListAPI(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
} 


export function getSelectedArticlesAPI() {
  return request({
    url: '/article/selectedArticles',
    method: 'get'
  })
}

/**
 * 获取文章详情
 * @param {string|number} id - 文章ID
 * @returns {Promise} 请求结果
 */
export function getArticleDetailAPI(id) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

/**
 * 发布文章
 * @param {Object} data - 文章数据
 * @param {string} data.title - 文章标题
 * @param {string} data.category - 文章分类
 * @param {Array<string>} data.tags - 文章标签
 * @param {string} data.cover - 文章封面图片URL
 * @param {string} data.content - 文章内容
 * @returns {Promise} 请求结果
 */
export function addArticleAPI(data) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data
  })
}

/**
 * 删除文件
 * @param {string} filename - 文件名称
 * @returns {Promise} 请求结果
 */
export function deleteFileAPI(filename) {
  return request({
    url: `/common/delete/${filename}`,
    method: 'delete'
  })
}

/**
 * 更新文章
 * @param {Object} data - 文章数据
 * @param {number|string} data.id - 文章ID
 * @param {string} data.title - 文章标题
 * @param {string} data.category - 文章分类
 * @param {string} data.tags - 文章标签，逗号分隔的字符串
 * @param {string} data.cover - 文章封面图片URL
 * @param {string} data.content - 文章内容
 * @returns {Promise} 请求结果
 */
export function updateArticleAPI(data) {
  return request({
    url: `/article/updateArticle`,
    method: 'put',
    data
  })
}

/**
 * 上传并解析Word文档
 * @param {FormData} formData - 包含Word文档的表单数据
 * @returns {Promise} 请求结果 - 返回解析后的HTML内容
 */
export function parseWordDocAPI(formData) {
  return request({
    url: '/common/parseWord',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取用户的文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise} 请求结果
 */
export function getMyArticlesAPI(params) {
  return request({
    url: '/article/myArticles',
    method: 'get',
    params
  })
}

/**
 * 删除文章
 * @param {number} id - 文章ID
 * @returns {Promise} 请求结果
 */
export function deleteArticleAPI(id) {
  return request({
    url: `/article/${id}`,
    method: 'delete'
  })
}

/**
 * 增加文章浏览量
 * @param {string|number} id - 文章ID
 * @returns {Promise} 请求结果
 */
export function increaseViewCountAPI(id) {
  return request({
    url: `/article/increaseViewCount/${id}`,
    method: 'put'
  })
}





