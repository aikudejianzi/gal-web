// 1.导入
import axios from 'axios'
import { Message, Loading } from 'element-ui'

// 创建loading实例的变量
let loadingInstance = null
// 请求计数器
let requestCount = 0

// 显示loading
function showLoading() {
  if (requestCount === 0 && !loadingInstance) {
    // 创建loading实例，全屏模式
    loadingInstance = Loading.service({
      fullscreen: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    })
  }
  requestCount++
}

// 隐藏loading
function hideLoading() {
  requestCount--
  if (requestCount === 0 && loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
  }
}

// 2.创建axios实例
const request = axios.create({
  // 设置请求基础路径
  baseURL: 'http://localhost:8080',
  // 设置请求超时时间
  timeout: 1000000,
  // 允许携带cookie (对于Session鉴权非常重要)
  withCredentials: true
})

// 3.请求拦截器
request.interceptors.request.use(function (config) {
  // 显示loading
  showLoading()
  // 在发送请求之前，无需添加特殊的认证信息，因为cookie会自动带上
  return config
}, function (error) {
  // 隐藏loading
  hideLoading()
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 4.响应拦截器
request.interceptors.response.use(function (res) {
    // 隐藏loading
    hideLoading()
    
    // 在响应拦截器中处理登录状态
    if(res.data.code !== 1 && res.data.msg === 'nologin'){
        // 打印日志
        console.log('用户未登录, 跳转登录页面')
        
        // 清除localStorage中的用户信息
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('userInfo')
        }
        
        // 跳转登录页面
        window.top.location.href = '/login'
        
        // 返回拒绝的Promise
        return Promise.reject(new Error('用户未登录'))
    }else if(res.data.code !== 1){
        // 处理其他错误情况
        Message.error(res.data.msg || '操作失败')
        return Promise.reject(new Error(res.data.msg || '操作失败'))
    }else{
        // 成功情况
        return res.data
    }
}, function (error) {
  // 隐藏loading
  hideLoading()
  
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  Message.error(error.message || '服务器异常')
  return Promise.reject(error)
})

// 5.导出配置后的实例
export default request
