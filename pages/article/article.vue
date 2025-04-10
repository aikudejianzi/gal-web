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
      :commentList="commentList" 
      :userInfo="userInfo" 
      @addComment="addComment"
      @deleteComment="deleteComment"
    />
  </div>
</template>

<script>
import ArticleContent from './components/ArticleContent.vue'
import ArticleComments from './components/ArticleComments.vue'
import { getArticleDetailAPI, increaseViewCountAPI } from '@/api/article'  
import { getArticleCommentListAPI, addCommentAPI, deleteCommentAPI } from '@/api/comment'
import { checkIsFavoriteAPI, toggleFavoriteAPI } from '@/api/favorite'
import { getCurrentUserAPI } from '@/api/user'

export default {
  name: 'Article',
  components: {
    ArticleContent,
    ArticleComments
  },
  head() {
    // 确保文章数据存在
    if (!this.article) {
      return {}
    }

    return {
      title: `${this.article.title} - 兰州大学Galgame同好会`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.summary || this.article.content.substring(0, 150)
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": this.article.title,
            "image": this.article.coverImage ? `https://aiwujiegal.top${this.article.coverImage}` : 'https://aiwujiegal.top/default-article-cover.png',
            "author": {
              "@type": "Person",
              "name": this.article.authorName
            },
            "publisher": {
              "@type": "Organization",
              "name": "兰州大学Galgame同好会",
              "logo": {
                "@type": "ImageObject",
                "url": "https://aiwujiegal.top/logo.png"
              }
            },
            "datePublished": this.article.createTime,
            "dateModified": this.article.updateTime || this.article.createTime,
            "description": this.article.summary || this.article.content.substring(0, 150),
            "url": `https://aiwujiegal.top/article/${this.article.id}`
          }
        }
      ]
    }
  },
  async asyncData({ params, error }) {
    try {
      const articleId = params.id
      
      // 获取文章详情和评论
      const [articleRes, commentsRes] = await Promise.all([
        getArticleDetailAPI(articleId),
        getArticleCommentListAPI(articleId)
      ])
      
      // 检查文章详情响应
      if (!articleRes || !articleRes.data) {
        return error({ statusCode: 404, message: '您访问的页面不存在' })
      }
      
      // 设置页面标题
      const article = articleRes.data
      
      // 获取评论列表
      const commentList = commentsRes.data
      
      return {
        articleId,
        article,
        commentList
      }
    } catch (err) {
      console.error('获取文章详情失败', err)
      return error({ statusCode: 404, message: '您访问的页面不存在' })
    }
  },
  data() {
    return {
      // 用户信息
      userInfo: null,
      isFavorite: false
    }
  },
  async mounted() {
    // 获取当前登录用户信息
    await this.fetchUserInfo()
    
    // 增加文章浏览量
    await this.increaseViewCount()
  },
  methods: {
    // 增加文章浏览量
    async increaseViewCount() {
      try {
        const articleId = this.$route.params.id
        await increaseViewCountAPI(articleId)
        // 更新本地文章对象浏览量
        this.article.views += 1
      } catch (error) {
        console.error('增加浏览量失败', error)
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await getCurrentUserAPI()
        this.userInfo = res.data
        
        // 用户已登录，检查是否收藏
        if (this.userInfo) {
          const articleId = this.$route.params.id
          const res = await checkIsFavoriteAPI(articleId, this.userInfo.id)
          this.isFavorite = res.data
        }
      } catch (error) {
        // 请求失败说明用户未登录或登录已过期
        this.userInfo = null
        this.isFavorite = false
      }
    },
    
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
    },

    // 获取文章评论列表
    async getArticleCommentList() {
      // 从路径中获取文章id
      const articleId = this.$route.params.id
      // 调用getArticleCommentListAPI
      const res = await getArticleCommentListAPI(articleId)
      // 设置文章评论列表
      this.commentList = res.data
    },

    // 添加评论
    async addComment(commentContent) {
      // 从路径中获取文章id
      const articleId = this.$route.params.id
      // 调用addCommentAPI 添加评论
      await addCommentAPI(articleId, this.userInfo.id, commentContent)
      // 重新获取文章评论列表
      this.getArticleCommentList()
    },

    // 删除评论
    async deleteComment(commentId) {
      // 从路径中获取文章id
      const articleId = this.$route.params.id
      // 调用deleteCommentAPI 删除评论
      await deleteCommentAPI(commentId)
      // 重新获取文章评论列表
      this.getArticleCommentList()
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