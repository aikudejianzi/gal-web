import config from '@/config'

export default ({ app }, inject) => {
  // 添加全局站点结构化数据
  app.head.script = app.head.script || []
  app.head.script.push({
    hid: 'organization-schema',
    type: 'application/ld+json',
    json: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "兰州大学GalGame同好会",
      "url": config.domain,
      "logo": `${config.domain}${config.defaultImages.logo}`,
      "description": "兰州大学GalGame同好会是一个交流讨论视觉小说游戏的社团",
    }
  })
  
  // 添加全局网站搜索结构化数据
  app.head.script.push({
    hid: 'website-schema',
    type: 'application/ld+json',
    json: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "兰州大学GalGame同好会",
      "url": config.domain,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${config.domain}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  })
} 