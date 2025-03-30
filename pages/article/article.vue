<template>
  <div class="article-detail-container">
    <!-- 文章内容区 -->
    <ArticleContent 
      :article="article"
      :isFavorite="isFavorite"
    />

    <!-- 评论区 -->
    <ArticleComments 
      :articleId="articleId" 
      :comments="comments" 
      :userInfo="userInfo" 
    />
  </div>
</template>

<script>
import ArticleContent from './components/ArticleContent.vue'
import ArticleComments from './components/ArticleComments.vue'
import { 
  getArticleDetailAPI, 
  getArticleCommentsAPI,
  checkIsFavoriteAPI
} from '@/api/article'

export default {
  name: 'Article',
  components: {
    ArticleContent,
    ArticleComments
  },
  head() {
    return {
      title: `文章详情 - 兰州大学GalGame同好会`
    }
  },
  async asyncData({ params, error }) {
    try {
      const articleId = params.id
      
      // 并行请求
      const [articleRes, commentsRes, isFavoriteRes] = await Promise.all([
        getArticleDetailAPI(articleId),
        getArticleCommentsAPI(articleId),
        checkIsFavoriteAPI(articleId)
      ])
      
      // 检查文章详情响应
      if (!articleRes || !articleRes.data) {
        return error({ statusCode: 404, message: '您访问的页面不存在' })
      }
      
      // 设置页面标题
      const article = articleRes.data
      
      // 获取评论列表
      const comments = commentsRes.data

      //发送请求查看当前文章用户是否已经收藏了
      const isFavorite = false
      if(isFavoriteRes.data === true){
        isFavorite = true
      }


      
      return {
        articleId,
        article,
        comments,
        isFavorite
      }
    } catch (err) {
      return error({ statusCode: 404, message: '您访问的页面不存在' })
    }
  },
  data() {
    return {
      // 用户信息
      userInfo: {},
      //是否收藏
      isFavorite: false
    }
  },
  async mounted() {
    // 更新页面标题
    this.$nuxt.$options.head.title = `${this.article.title} - 兰州大学GalGame同好会`
    
    // 获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr)
    }



  },
  methods: {

  }
}
</script>

<style scoped>
.article-detail-container {
  width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .article-detail-container {
    width: 100%;
    margin: 15px auto;
    padding: 15px;
  }
}
</style>