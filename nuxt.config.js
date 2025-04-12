// 环境判断
const isProd = process.env.NODE_ENV === 'production'

export default {
  server: {
    port: 3000,
    host: isProd ? '0.0.0.0' : 'localhost' // 生产环境使用0.0.0.0，开发环境使用localhost
  },

  // https://go.nuxtjs.dev/config-head
  head: {
    title: '兰州大学Galgame同好会 - LE Gal同好会',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。我们致力于为Galgame爱好者提供一个专业、友好的交流平台。' },
      { hid: 'keywords', name: 'keywords', content: 'Galgame,视觉小说,游戏评测,游戏攻略,兰州大学,同好会,游戏资料,角色介绍,制作人员,游戏讨论,游戏评分,游戏生涯喜好表' },
      { name: 'format-detection', content: 'telephone=no' },
      // Open Graph
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'og:title', property: 'og:title', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'og:description', property: 'og:description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。' },
      { hid: 'og:image', property: 'og:image', content: '/logo.png' },
      // Twitter Card
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'twitter:description', name: 'twitter:description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。' },
      { hid: 'twitter:image', name: 'twitter:image', content: '/logo.png' },
      // 微博
      { hid: 'weibo:card', name: 'weibo:card', content: 'summary_large_image' },
      { hid: 'weibo:title', name: 'weibo:title', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'weibo:description', name: 'weibo:description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。' },
      { hid: 'weibo:image', name: 'weibo:image', content: '/logo.png' },
      // QQ
      { hid: 'qq:card', name: 'qq:card', content: 'summary_large_image' },
      { hid: 'qq:title', name: 'qq:title', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'qq:description', name: 'qq:description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。' },
      { hid: 'qq:image', name: 'qq:image', content: '/logo.png' },
      // 微信
      { hid: 'weixin:card', name: 'weixin:card', content: 'summary_large_image' },
      { hid: 'weixin:title', name: 'weixin:title', content: '兰州大学Galgame同好会 - LE Gal同好会' },
      { hid: 'weixin:description', name: 'weixin:description', content: '兰州大学Galgame同好会是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。' },
      { hid: 'weixin:image', name: 'weixin:image', content: '/logo.png' }
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
    '@/plugins/element-ui',
    '@/plugins/structured-data'
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
              component: resolve(__dirname, 'pages/home/'),
              meta: {
                title: '首页 - 兰州大学Galgame同好会',
                description: '兰州大学Galgame同好会首页，提供最新的游戏评测、攻略、讨论交流等内容。',
                keywords: 'Galgame,视觉小说,游戏评测,游戏攻略,兰州大学,同好会'
              }
            },
            //文章列表
            {
              path: '/articles',
              component: resolve(__dirname, 'pages/article/'),
              meta: {
                title: '文章列表 - 兰州大学Galgame同好会',
                description: '浏览兰州大学Galgame同好会的所有文章，包括游戏评测、攻略、讨论等内容。',
                keywords: 'Galgame文章,游戏评测,游戏攻略,游戏讨论'
              }
            },
            //文章投稿
            {
              path: '/article/submit',
              component: resolve(__dirname, 'pages/article/submit.vue'),
              meta: {
                title: '文章投稿 - 兰州大学Galgame同好会',
                description: '在兰州大学Galgame同好会发布您的游戏评测、攻略或讨论文章。',
                keywords: '文章投稿,游戏评测,游戏攻略,游戏讨论'
              }
            },
            //文章编辑
            {
              path: '/article/edit/:id',
              component: resolve(__dirname, 'pages/article/submit.vue'),
              meta: {
                title: '文章编辑 - 兰州大学Galgame同好会',
                description: '编辑您在兰州大学Galgame同好会发布的文章。',
                keywords: '文章编辑,游戏评测,游戏攻略,游戏讨论'
              }
            },
            //文章详情
            {
              path: '/article/:id',
              component: resolve(__dirname, 'pages/article/article.vue'),
              meta: {
                title: '文章详情 - 兰州大学Galgame同好会',
                description: '查看兰州大学Galgame同好会的文章详情。',
                keywords: '文章详情,游戏评测,游戏攻略,游戏讨论'
              }
            },
            //游戏列表
            {
              path: '/games',
              component: resolve(__dirname, 'pages/game/index.vue'),
              meta: {
                title: '游戏列表 - 兰州大学Galgame同好会',
                description: '浏览兰州大学Galgame同好会的所有游戏信息。',
                keywords: '游戏列表,Galgame,视觉小说,游戏资料'
              }
            },
            //游戏详情
            {
              path: '/game/:id',
              component: resolve(__dirname, 'pages/game/detail.vue'),
              meta: {
                title: '游戏详情 - 兰州大学Galgame同好会',
                description: '查看兰州大学Galgame同好会的游戏详细信息。',
                keywords: '游戏详情,Galgame,视觉小说,游戏资料'
              }
            },
            //制作人员列表
            {
              path: '/persons',
              component: resolve(__dirname, 'pages/person/index.vue'),
              meta: {
                title: '制作人员列表 - 兰州大学Galgame同好会',
                description: '浏览兰州大学Galgame同好会的所有制作人员信息。',
                keywords: '制作人员,游戏制作,游戏开发,游戏公司'
              }
            },
            //制作人员详情
            {
              path: '/person/:id',
              component: resolve(__dirname, 'pages/person/detail.vue'),
              meta: {
                title: '制作人员详情 - 兰州大学Galgame同好会',
                description: '查看兰州大学Galgame同好会的制作人员详细信息。',
                keywords: '制作人员详情,游戏制作,游戏开发,游戏公司'
              }
            },
            //角色详情
            {
              path: '/character/:id',
              component: resolve(__dirname, 'pages/character/detail.vue'),
              meta: {
                title: '角色详情 - 兰州大学Galgame同好会',
                description: '查看兰州大学Galgame同好会的角色详细信息。',
                keywords: '角色详情,游戏角色,角色介绍'
              }
            },
            //活动列表
            {
              path: '/activities',
              component: resolve(__dirname, 'pages/activity/index.vue'),
              meta: {
                title: '活动列表 - 兰州大学Galgame同好会',
                description: '浏览兰州大学Galgame同好会的所有活动信息。',
                keywords: '活动列表,游戏活动,同好会活动'
              }
            },
            //游戏生涯喜好表活动
            {
              path: '/activity/game-grid',
              component: resolve(__dirname, 'pages/activity/game-grid/index.vue'),
              meta: {
                title: '游戏生涯喜好表 - 兰州大学Galgame同好会',
                description: '参与兰州大学Galgame同好会的游戏生涯喜好表活动。',
                keywords: '游戏生涯喜好表,游戏评分,游戏评价'
              }
            },
            //游戏生涯喜好表编辑页面
            {
              path: '/activity/game-grid/editor',
              component: resolve(__dirname, 'pages/activity/game-grid/editor.vue'),
              meta: {
                title: '编辑游戏生涯喜好表 - 兰州大学Galgame同好会',
                description: '编辑您的游戏生涯喜好表。',
                keywords: '游戏生涯喜好表,游戏评分,游戏评价'
              }
            },
            //用户中心与子路由
            {
              path: '/user',
              component: resolve(__dirname, 'pages/user/index.vue'),
              meta: {
                title: '用户中心 - 兰州大学Galgame同好会',
                description: '管理您在兰州大学Galgame同好会的个人信息和内容。',
                keywords: '用户中心,个人中心,我的文章,我的收藏,我的评论'
              },
              children: [
                // 默认子路由为个人资料
                {
                  path: '',
                  component: resolve(__dirname, 'pages/user/components/UserInfo.vue'),
                  meta: {
                    title: '个人资料 - 兰州大学Galgame同好会',
                    description: '查看和编辑您在兰州大学Galgame同好会的个人资料。',
                    keywords: '个人资料,用户信息'
                  }
                },
                // 个人资料
                {
                  path: 'profile',
                  component: resolve(__dirname, 'pages/user/components/UserInfo.vue'),
                  meta: {
                    title: '个人资料 - 兰州大学Galgame同好会',
                    description: '查看和编辑您在兰州大学Galgame同好会的个人资料。',
                    keywords: '个人资料,用户信息'
                  }
                },
                // 我的文章
                {
                  path: 'articles',
                  component: resolve(__dirname, 'pages/user/components/MyArticles.vue'),
                  meta: {
                    title: '我的文章 - 兰州大学Galgame同好会',
                    description: '管理您在兰州大学Galgame同好会发布的文章。',
                    keywords: '我的文章,文章管理'
                  }
                },
                // 我的收藏
                {
                  path: 'favorites',
                  component: resolve(__dirname, 'pages/user/components/FavoriteArticles.vue'),
                  meta: {
                    title: '我的收藏 - 兰州大学Galgame同好会',
                    description: '查看您在兰州大学Galgame同好会收藏的文章。',
                    keywords: '我的收藏,收藏文章'
                  }
                },
                // 我的评论
                {
                  path: 'comments',
                  component: resolve(__dirname, 'pages/user/components/MyComments.vue'),
                  meta: {
                    title: '我的评论 - 兰州大学Galgame同好会',
                    description: '查看您在兰州大学Galgame同好会发表的评论。',
                    keywords: '我的评论,评论管理'
                  }
                }
              ]
            }
          ]
        },
        //登录页面
        {
          path: '/login',
          component: resolve(__dirname, 'pages/login/index.vue'),
          meta: {
            title: '登录 - 兰州大学Galgame同好会',
            description: '登录兰州大学Galgame同好会，开始您的Galgame之旅。',
            keywords: '登录,用户登录,账号登录'
          }
        },
        //管理员后台
        {
          path: '/admin',
          component: resolve(__dirname, 'pages/admin/index.vue'),
          meta: {
            title: '管理员后台 - 兰州大学Galgame同好会',
            description: '兰州大学Galgame同好会管理员后台，管理网站内容和用户。',
            keywords: '管理员后台,网站管理,内容管理,用户管理'
          },
          children: [
            // 默认子路由为用户管理
            {
              path: '',
              component: resolve(__dirname, 'pages/admin/users.vue'),
              meta: {
                title: '用户管理 - 兰州大学Galgame同好会',
                description: '管理兰州大学Galgame同好会的用户信息。',
                keywords: '用户管理,用户列表,用户信息'
              }
            },
            // 用户管理
            {
              path: 'users',
              component: resolve(__dirname, 'pages/admin/users.vue'),
              meta: {
                title: '用户管理 - 兰州大学Galgame同好会',
                description: '管理兰州大学Galgame同好会的用户信息。',
                keywords: '用户管理,用户列表,用户信息'
              }
            },
            // 文章审核
            {
              path: 'articles',
              component: resolve(__dirname, 'pages/admin/articles.vue'),
              meta: {
                title: '文章审核 - 兰州大学Galgame同好会',
                description: '审核兰州大学Galgame同好会的文章内容。',
                keywords: '文章审核,内容审核,文章管理'
              }
            },
            // 文章管理
            {
              path: 'article-management',
              component: resolve(__dirname, 'pages/admin/article-management.vue'),
              meta: {
                title: '文章管理 - 兰州大学Galgame同好会',
                description: '管理兰州大学Galgame同好会的所有文章。',
                keywords: '文章管理,内容管理,文章列表'
              }
            },
            // 评论管理
            {
              path: 'comments',
              component: resolve(__dirname, 'pages/admin/comments.vue'),
              meta: {
                title: '评论管理 - 兰州大学Galgame同好会',
                description: '管理兰州大学Galgame同好会的所有评论。',
                keywords: '评论管理,内容管理,评论列表'
              }
            },
            // 图片管理
            {
              path: 'images',
              component: resolve(__dirname, 'pages/admin/images.vue'),
              meta: {
                title: '图片管理 - 兰州大学Galgame同好会',
                description: '管理兰州大学Galgame同好会的所有图片。',
                keywords: '图片管理,内容管理,图片列表'
              }
            }
          ]
        }
      ])
    }
  }
}
