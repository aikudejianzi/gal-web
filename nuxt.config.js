export default {
  // https://go.nuxtjs.dev/config-head
  head: {
    title: 'gal-web',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  // https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui'
  ],

  // https://go.nuxtjs.dev/config-components
  components: true,

  // https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // https://go.nuxtjs.dev/config-modules
  modules: [
  ],


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },

  router: {
    extendRoutes(routes, resolve) {
      //1.清除Nuxt默认生成的路由
      routes.splice(0)
      //2.自定义路由规则
      routes.push(...[
        {
          //布局组件
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            //默认子路由: 主页
            {
              path: '/',
              component: resolve(__dirname, 'pages/home/')
            },
            //文章列表
            {
              path: '/articles',
              component: resolve(__dirname, 'pages/article/')
            },
            //文章投稿
            {
              path: '/article/submit',
              component: resolve(__dirname, 'pages/article/submit.vue')
            },
            //文章详情
            {
              path: '/article/:id',
              component: resolve(__dirname, 'pages/article/article.vue')
            },

            //用户中心与子路由
            {
              path: '/user',
              component: resolve(__dirname, 'pages/user/index.vue'),
              children: [
                // 默认子路由为个人资料
                {
                  path: '',
                  component: resolve(__dirname, 'pages/user/components/UserInfo.vue')
                },
                // 个人资料
                {
                  path: 'profile',
                  component: resolve(__dirname, 'pages/user/components/UserInfo.vue')
                },
                // 账号安全
                {
                  path: 'security',
                  component: resolve(__dirname, 'pages/user/components/AccountSecurity.vue')
                },
                // 我的文章
                {
                  path: 'articles',
                  component: resolve(__dirname, 'pages/user/components/MyArticles.vue')
                },
                // 我的收藏
                {
                  path: 'favorites',
                  component: resolve(__dirname, 'pages/user/components/FavoriteArticles.vue')
                },
                // 我的评论
                {
                  path: 'comments',
                  component: resolve(__dirname, 'pages/user/components/MyComments.vue')
                }
              ]
            }
          ]
        },
        //登录页面
        {
          path: '/login',
          component: resolve(__dirname, 'pages/login/index.vue')
        }

      ])
    }
  }
}
