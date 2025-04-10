export default ({ app }) => {
  // 添加组织信息
  app.head.script = app.head.script || []
  app.head.script.push({
    type: 'application/ld+json',
    json: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "兰州大学Galgame同好会",
      "url": "https://aiwujiegal.top",
      "logo": "https://aiwujiegal.top/logo.png",
      "description": "兰州大学Galgame同好会是一个专注于Galgame的爱好者社区",
      "sameAs": [
        "https://weibo.com/lzugal",
        "https://space.bilibili.com/lzugal"
      ]
    }
  })

  // 添加网站信息
  app.head.script.push({
    type: 'application/ld+json',
    json: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "兰州大学Galgame同好会",
      "url": "https://aiwujiegal.top",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://aiwujiegal.top/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  })
} 