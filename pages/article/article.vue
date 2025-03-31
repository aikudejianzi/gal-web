<template>
  <div class="article-detail-container">
    <!-- 文章内容区 -->
    <ArticleContent 
      :article="article"
      :userInfo="userInfo"
      :isFavorite="isFavorite"
      @toggleFavorite="toggleFavorite"
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
  checkIsFavoriteAPI,
  toggleFavoriteAPI
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
      
      // 获取文章详情和评论
      const [articleRes, commentsRes] = await Promise.all([
        getArticleDetailAPI(articleId),
        getArticleCommentsAPI(articleId)
      ])
      
      // 检查文章详情响应
      if (!articleRes || !articleRes.data) {
        return error({ statusCode: 404, message: '您访问的页面不存在' })
      }
      
      // 设置页面标题
      const article = articleRes.data
      
      // 获取评论列表
      const comments = commentsRes.data
      
      return {
        articleId,
        article,
        comments
      }
    } catch (err) {
      console.error('获取文章详情失败', err)
      return error({ statusCode: 404, message: '您访问的页面不存在' })
    }
  },
  data() {
    return {
      // 用户信息
      userInfo: {},
      isFavorite: false
    }
  },
  async mounted() {
    //从localStorage中获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')

    //用户已登录
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr)
      //从路径中获取文章id
      const articleId = this.$route.params.id
      //检查用户是否收藏了该文章
      const res = await checkIsFavoriteAPI(articleId, this.userInfo.id)
      this.isFavorite = res.data
    }



  },
  methods: {
    // 切换收藏状态
    async toggleFavorite() {
      // 从路径中获取文章id 
      const articleId = this.$route.params.id
      // 调用toggleFavoriteAPI
      const res = await toggleFavoriteAPI(articleId, this.userInfo.id)
      // 设置收藏状态 
      this.isFavorite = res.data
      // 获取文章详情, 因为文章收藏数量改变了, 所以需要重新获取文章详情 
      this.getArticleDetail()
    },

    // 获取文章详情
    async getArticleDetail() {
      // 从路径中获取文章id
      const articleId = this.$route.params.id
      // 调用getArticleDetailAPI
      const res = await getArticleDetailAPI(articleId)
      // 设置文章详情 
      this.article = res.data
    }
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