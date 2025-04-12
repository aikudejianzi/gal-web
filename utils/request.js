// 1.导入
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import config from '@/config'

// loading实例
let loadingInstance = null

// 2.创建axios实例
const request = axios.create({
  // 设置请求基础路径
  // baseURL: 'http://localhost:8080',
  baseURL: config.apiBaseUrl,
  // 设置请求超时时间
  timeout: 1000000,
  // 允许携带cookie
  withCredentials: true
})

// 3.请求拦截器
request.interceptors.request.use(function (config) {
   // 在发送请求之前做些什么
   // 打开loading
   loadingInstance = Loading.service({
     fullscreen: true,
     text: '加载中...'
   })
   
  return config
}, function (error) {
  // 对请求错误做些什么
  // 关闭loading
  if (loadingInstance) loadingInstance.close()
  return Promise.reject(error)
})

// 4.响应拦截器
request.interceptors.response.use(function (res) {
    // 关闭loading
    if (loadingInstance) loadingInstance.close()
    
    console.log('响应拦截器拦截到的内容: ', res.data)
    if(res.data.code !== 1 && res.data.msg === 'nologin'){
        // 打印日志
        console.log('用户未登录, 跳转登录页面')

        // 跳转登录页面
        window.top.location.href = '/login'
    }else if(res.data.code !== 1){
        //ELement-ui 打印错误信息
        Message.error(res.data.msg || '操作失败')
        return Promise.reject(new Error(res.data.msg || '操作失败'))
    }else{
        return res.data
    }
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 关闭loading
  if (loadingInstance) loadingInstance.close()
  
  Message.error(error.message || '服务器异常')
  return Promise.reject(error)
})

// 5.导出配置后的实例
export default request
