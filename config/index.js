// 根据环境变量判断当前环境
const isProd = process.env.NODE_ENV === 'production'

// 开发环境配置
const devConfig = {
  // 网站域名
  domain: 'http://localhost:3000',
  
  // API基础URL
  apiBaseUrl: 'http://localhost:8080',
  
  // 图片下载URL
  imageDownloadUrl: 'http://localhost:8080/common/download',
  
  // 图片上传URL
  imageUploadUrl: 'http://localhost:8080/common/upload',
}

// 生产环境配置
const prodConfig = {
  // 网站域名
  domain: 'https://aiwujiegal.top',
  
  // API基础URL
  apiBaseUrl: 'https://aiwujiegal.top/api',
  
  // 图片下载URL
  imageDownloadUrl: 'https://aiwujiegal.top/api/common/download',
  
  // 图片上传URL
  imageUploadUrl: 'https://aiwujiegal.top/api/common/upload',
}

// 根据环境选择配置
const envConfig = isProd ? prodConfig : devConfig

// 导出配置
export default {
  ...envConfig,
  
  // 默认图片 (开发和生产环境相同)
  defaultImages: {
    gameCover: '/default-game-cover.png',
    articleCover: '/default-article-cover.png',
    logo: '/logo.png'
  },
  
  // 其他全局配置项可以在此添加
} 