<template>
  <div class="article-detail-container">
    <!-- 文章内容区 -->
    <el-card class="article-content">
      <!-- 文章标题 -->
      <h1 class="article-title">{{article.title}}</h1>
      
      <!-- 文章元信息 -->
      <div class="article-meta">
        <div class="meta-row">
          <!-- 作者信息 -->
          <div class="info-item author-info">
            <el-avatar :size="40" :src="article.authorAvatar" fit="cover" :shape="'square'"></el-avatar>
            <span class="author-name">{{article.author}}</span>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <i class="el-icon-date"></i>
            <span>{{article.createTime}}</span>
          </div>

          <div class="info-item">
            <i class="el-icon-collection-tag"></i>
            <span>{{article.category}}</span>
          </div>

          <div class="info-item">
            <i class="el-icon-view"></i>
            <span>{{article.views}} 阅读</span>
          </div>

          <div class="info-item">
            <el-button 
              type="text" 
              :class="{'is-liked': isLiked}"
              @click="handleLike">
              <i :class="isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
              {{article.likes}} 收藏
            </el-button>
          </div>
        </div>
      </div>

      <!-- 文章标签 -->
      <div class="article-tags" v-if="article.tags">
        <el-tag 
          v-for="tag in tagList" 
          :key="tag" 
          size="small" 
          effect="light"
          type="info"
          style="margin-right: 10px;">
          <i class="el-icon-price-tag"></i> {{tag}}
        </el-tag>
      </div>

      <!-- 文章内容 -->
      <div class="article-content" v-html="article.content"></div>
    </el-card>

    <!-- 评论区 -->
    <el-card class="comment-section">
      <div slot="header">
        <span>评论区</span>
        <span class="comment-count">({{comments.length}}条评论)</span>
      </div>

      <!-- 发表评论 -->
      <div class="comment-form" v-if="userInfo.id">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="写下你的评论..."
          v-model="commentContent"
          maxlength="500"
          show-word-limit>
        </el-input>
        <div style="margin-top: 10px; text-align: right;">
          <el-button type="primary" @click="submitComment">发表评论</el-button>
        </div>
      </div>
      <div v-else class="login-tip">
        <el-button type="text" @click="$router.push('/login')">登录后发表评论</el-button>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-wrapper">
            <el-avatar :size="40" :src="comment.userAvatar" fit="cover"></el-avatar>
            <div class="comment-main">
              <div class="comment-info">
                <span class="comment-author">{{comment.username}}</span>
                <span class="comment-time">{{comment.createTime}}</span>
                <!-- 删除按钮 -->
                <el-button 
                  v-if="userInfo.id === comment.userId"
                  type="text" 
                  class="delete-btn"
                  @click="handleDeleteComment(comment.id)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
              <div class="comment-content">{{comment.content}}</div>
            </div>
          </div>
        </div>
        <!-- 暂无评论 -->
        <el-empty v-if="comments.length === 0" description="暂无评论"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Article',
  head() {
    return {
      title: `文章详情 - 兰州大学GalGame同好会`
    }
  },
  data() {
    return {
      // 文章ID
      articleId: null,
      // 文章详情
      article: {
        title: '',
        content: '',
        author: '',
        authorAvatar: '',
        createTime: '',
        category: '',
        views: 0,
        likes: 0,
        tags: ''
      },
      // 用户信息
      userInfo: {},
      // 是否已收藏
      isLiked: false,
      // 评论内容
      commentContent: '',
      // 评论列表
      comments: []
    }
  },
  computed: {
    // 处理标签字符串为数组
    tagList() {
      return this.article.tags ? this.article.tags.split(',').filter(tag => tag.trim()) : []
    }
  },
  mounted() {
    // 从路由参数获取文章ID
    this.articleId = this.$route.params.id
    
    // 获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr)
    }
    
    // 初始化页面数据
    this.initPageData()
  },
  methods: {
    // 初始化页面数据
    async initPageData() {
      // 获取文章详情（模拟数据）
      this.getArticleDetail()
      // 获取评论列表（模拟数据）
      this.getComments()
      // 检查是否已收藏
      if (this.userInfo.id) {
        this.checkIfLiked()
      }
    },

    // 增加浏览量
    increaseViews() {
      // 模拟增加浏览量
      if (this.article.views !== undefined) {
        this.article.views++
      }
    },

    // 处理头像路径
    processAvatarUrl(avatar) {
      if (!avatar) {
        // 如果没有头像，返回默认头像
        return '/banner1.png'
      }
      // 如果头像路径已经包含完整URL，直接返回
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar
      }
      // 使用相对路径访问图片
      return avatar
    },

    // 获取文章详情（模拟数据）
    getArticleDetail() {
      // 模拟API请求延迟
      setTimeout(() => {
        // 文章详情模拟数据
        const articleData = {
          id: this.articleId,
          title: '《Clannad》：Key社的催泪神作与人生的意义',
          content: `<p>CLANNAD是由Key社制作的一部催泪神作，它的每一个画面、每一段剧情都蕴含着深刻的人生哲理。</p>
          <p>游戏中的台词"人生中有些重要的，无可替代的东西，只有在失去后才能够了解"将会引发你的深思。游戏中渚与朋也的感情经历了无数困难和考验，但却始终坚持着，这段跨越不同世界线的真挚感情打动了无数玩家。</p>
          <p>在CLANNAD中，朋也经历了从叛逆少年到成为负责任父亲的转变，这种成长过程极其真实而感人。特别是After Story篇章中，当他独自抚养渚香时的艰辛与成长，让人深刻体会到家庭与责任的意义。</p>
          <p>游戏中的"光玉"设定也十分巧妙，它象征着人们在生活中积累的善意与幸福。正是这些看似微不足道的小事，最终汇聚成改变命运的力量，让朋也和渚获得了奇迹般的第二次机会。</p>
          <p>CLANNAD的核心主题是"家庭"。从朋也与父亲的和解，到他与渚建立自己的家庭，再到古河家庭的温暖氛围，游戏始终在传达一个信息：无论生活多么艰难，家人的爱与支持是我们前行的最大动力。</p>`,
          userId: 101,
          author: '游戏评论家',
          authorAvatar: '/banner1.png',
          createTime: '2023-03-15',
          category: '游戏评测',
          views: 2541,
          likes: 156,
          tags: 'Key社,催泪,恋爱,人生',
          comments: 3
        }
        
        // 设置文章详情
        this.article = articleData
        
        // 增加浏览量
        this.increaseViews()
        
      }, 300)
    },
    
    // 获取评论列表（模拟数据）
    getComments() {
      // 模拟API请求延迟
      setTimeout(() => {
        // 评论列表模拟数据
        const commentsData = [
          {
            id: 1,
            articleId: this.articleId,
            userId: 102,
            username: '催泪玩家',
            userAvatar: '/banner1.png',
            content: '《CLANNAD》是我人生中遇到的最感人的游戏，渚和朋也的爱情故事让我流下了太多眼泪。特别是After Story的结局，实在是太震撼了！',
            createTime: '2023-03-16 14:32'
          },
          {
            id: 2,
            articleId: this.articleId,
            userId: 103,
            username: 'Key社粉丝',
            userAvatar: '/banner1.png',
            content: 'Key社的作品总是能够触动人心，CLANNAD、AIR、Kanon都是经典中的经典。但我认为CLANNAD的世界观构建和人物刻画是最完善的，特别是小镇上的各种人物故事，都非常感人。',
            createTime: '2023-03-17 09:48'
          },
          {
            id: 3,
            articleId: this.articleId,
            userId: 101,
            username: '游戏评论家',
            userAvatar: '/banner1.png',
            content: '感谢大家的评论！CLANNAD确实是一部超越了游戏本身的作品，它教会了我们珍惜身边的人，活在当下的道理。如果你还没玩过CLANNAD，强烈推荐一定要体验一下！',
            createTime: '2023-03-18 16:05'
          }
        ]
        
        // 设置评论列表
        this.comments = commentsData
      }, 500)
    },
    
    // 检查是否已收藏（模拟功能）
    checkIfLiked() {
      // 模拟检查收藏状态
      this.isLiked = false
    },
    
    // 处理收藏/取消收藏
    handleLike() {
      if (!this.userInfo.id) {
        this.$message.warning('请先登录')
        return
      }
      
      // 模拟收藏/取消收藏操作
      this.isLiked = !this.isLiked
      this.article.likes += this.isLiked ? 1 : -1
      this.$message.success(this.isLiked ? '收藏成功' : '取消收藏成功')
    },
    
    // 提交评论
    submitComment() {
      if (!this.commentContent.trim()) {
        this.$message.warning('请输入评论内容')
        return
      }
      
      // 模拟提交评论
      const newComment = {
        id: this.comments.length + 1,
        articleId: this.articleId,
        userId: this.userInfo.id,
        username: this.userInfo.username || '当前用户',
        userAvatar: this.userInfo.avatar || '/banner1.png',
        content: this.commentContent.trim(),
        createTime: new Date().toLocaleString()
      }
      
      // 添加到评论列表
      this.comments.unshift(newComment)
      
      // 清空评论内容
      this.commentContent = ''
      
      // 更新评论数
      this.article.comments++
      
      this.$message.success('评论成功')
    },
    

    
    // 处理删除评论
    async handleDeleteComment(commentId) {
      try {
        await this.$confirm('确定要删除这条评论吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 模拟删除评论
        this.comments = this.comments.filter(item => item.id !== commentId)
        
        // 更新评论数
        this.article.comments--
        
        this.$message.success('删除成功')
      } catch (error) {
        // 用户取消删除，不做处理
      }
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

.article-detail-container > .el-card {
  width: 100%;
  min-height: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.article-detail-container .article-content {
  width: 100%;
  min-height: 800px;
  line-height: 1.8;
  font-size: 16px;
  color: #34495e;
  padding: 20px 0;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #2c3e50;
  line-height: 1.4;
}

.article-meta {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info .el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
  flex-shrink: 0;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.info-divider {
  width: 1px;
  height: 20px;
  background-color: #dcdfe6;
}

.info-item i {
  margin-right: 6px;
  font-size: 16px;
}

.info-item .el-button {
  padding: 0;
  font-size: 14px;
  font-weight: normal;
  height: auto;
}

.article-tags {
  margin: 25px 0;
}

.article-tags .el-tag {
  margin: 5px 10px 5px 0;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
  border-radius: 14px;
  transition: all 0.3s;
}

.article-tags .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-tags .el-tag i {
  margin-right: 4px;
}

.comment-section {
  width: 100%;
  min-height: 200px;
  margin-top: 40px;
  border-radius: 8px;
}

.comment-section .el-card__header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.comment-count {
  color: #909399;
  margin-left: 10px;
  font-size: 14px;
  font-weight: normal;
}

.comment-list {
  width: 100%;
  min-height: 100px;
}

.comment-form {
  width: 100%;
  margin: 25px 0 35px;
}

.comment-form .el-textarea__inner {
  width: 100%;
  min-height: 100px;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  resize: vertical;
}

.login-tip {
  text-align: center;
  padding: 30px;
  color: #909399;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-item {
  padding: 25px 15px;
  border-bottom: 1px solid #ebeef5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-wrapper {
  display: flex;
  gap: 15px;
}

.comment-main {
  flex-grow: 1;
  min-width: 0;
}

.comment-info {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
  margin-right: 15px;
}

.comment-time {
  color: #909399;
  font-size: 13px;
}

.comment-content {
  color: #34495e;
  line-height: 1.8;
  font-size: 14px;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.is-liked {
  color: #409EFF !important;
}

.is-liked i {
  animation: like-animation 0.3s ease-in-out;
}

@keyframes like-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.delete-btn {
  color: #F56C6C;
  padding: 0;
  margin-left: auto;
}

.delete-btn:hover {
  color: #f78989;
}

.delete-btn i {
  font-size: 16px;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .article-detail-container {
    width: 100%;
    margin: 15px auto;
    padding: 15px;
  }
  
  .article-detail-container > .el-card {
    min-height: 300px;
    padding: 15px;
  }
  
  .article-detail-container .article-content {
    min-height: 200px;
  }
  
  .article-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .meta-row {
    gap: 15px;
  }
  
  .info-item {
    font-size: 13px;
  }
  
  .info-item i {
    font-size: 14px;
  }
  
  .comment-item {
    padding: 20px 10px;
  }

  .comment-wrapper {
    gap: 15px;
  }

  .comment-author {
    font-size: 14px;
    margin-right: 10px;
  }

  .comment-time {
    font-size: 12px;
  }

  .comment-content {
    font-size: 13px;
    line-height: 1.6;
  }
}

/* 文章内容中的图片样式 */
:deep(.article-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>