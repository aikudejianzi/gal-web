<template>
  <div class="article-container">
    <!-- 文章筛选和搜索 -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 文章分类 -->
          <el-select v-model="listQuery.category" placeholder="文章分类" clearable @change="handleFilter">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
          
        <!-- 排序方式 -->
        <el-col :span="6">
          <el-select v-model="listQuery.sort" placeholder="排序方式" @change="handleFilter">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <!-- 根据文章标题搜索 -->
        <el-col :span="8">
          <el-input
            placeholder="搜索文章标题 / 内容"
            v-model="listQuery.keyword"
            clearable
            @keyup.enter.native="handleSearch"
            class="search-input">
            <!-- 搜索按钮 --> 
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>

        <!-- 投稿按钮 -->
        <el-col :span="4" style="text-align: right;"> 
          <!-- 如果用户已登录，显示投稿按钮 -->
          <el-button type="primary" icon="el-icon-edit" @click="$router.push('/article/submit')" v-if="userInfo.id">投稿</el-button>
          <!-- 如果用户未登录，显示登录后投稿按钮 -->
          <el-button type="primary" icon="el-icon-edit" @click="$router.push('/login')" v-else>登录后投稿</el-button>
        </el-col>
      </el-row>
    </div>
    
    <!-- 文章列表 -->
    <div class="article-list">
      <!-- 文章列表项,使用v-for遍历articleList,生成文章列表项  -->                                          
    },
      <el-card v-for="article in articleList" :key="article.id" class="article-item" shadow="hover" @click.native="$router.push(`/article/${article.id}`)">
        <el-row :gutter="20">
          <!-- 文章图片容器 -->
          <el-col :span="6" class="article-image-container">
            <!-- 显示文章图片 --> 
            <div class="article-image" 
                 :style="{backgroundImage: article.imageLoaded ? `url(${article.coverUrl})` : ''}"
                 :class="{'image-loading': !article.imageLoaded}">
              <img :src="article.coverUrl" 
                   style="display: none" 
                   @load="handleArticleImageLoad(article)">
            </div>
          </el-col>
          <!-- 文章内容 -->
          <el-col :span="18" class="article-content">
            <!-- 文章标题 -->
            <h2 class="article-title">{{ article.title }}</h2>
            
            <!-- 文章元数据 -->
            <div class="article-meta">
              <!-- 作者,返回的数据中只有作者id,需要根据作者id获取作者信息  -->
              <span class="author">
                <i class="el-icon-user"></i> {{ article.author }}
              </span>

              <!-- 发布时间 -->
              <span class="date">
                <i class="el-icon-date"></i> {{ article.createTime }}
              </span>
              <!-- 文章分类 -->

              <span class="category">
                <i class="el-icon-collection-tag"></i> {{ article.category }}
              </span>

              <!-- 阅读量 -->
              <span class="views">
                <i class="el-icon-view"></i> {{ article.views }} 阅读
              </span>

              <!-- 评论量 -->
              <span class="comments">
                <i class="el-icon-chat-dot-round"></i> {{ article.comments }} 评论
              </span>
            </div>
            <!-- 文章摘要,返回数据中只有文章内容,需要截取前100个字符作为摘要 -->
            <p class="article-excerpt">{{ article.content }}</p>

            <!-- 文章标签,只在有标签时显示 -->
            <div class="article-tags" v-if="article.tags && article.tags.length > 0">
              <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
            </div>
          </el-col>
        </el-row>
      </el-card>
      
      <!-- 暂无数据 -->
      <el-empty v-if="articleList.length === 0" description="暂无文章数据"></el-empty>
    </div>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    
    <!-- 写文章按钮 -->
    <el-button 
      v-if="userInfo.id"
      type="primary" 
      class="write-button" 
      icon="el-icon-edit" 
      circle 
      @click="$router.push('/article/submit')">
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ArticleIndex',
  head() {
    return {
      title: '兰州大学GalGame同好会 - 文章中心'
    }
  },
  data() {
    return {
      // 用户信息
      userInfo: {},

      // 文章列表
      articleList: [],

      // 文章总数
      total: 0, 

      // 列表查询条件
      listQuery: {
        // 当前页码 
        page: 1, 
        // 每页条数
        limit: 10, 
        // 搜索关键词
        keyword: '', 
        // 文章分类
        category: '', 
        // 排序方式
        sort: 'newest' 
      },

      // 文章分类选项
      categoryOptions: [
        { value: '', label: '全部分类' },
        { value: 'review', label: '游戏评测' },
        { value: 'guide', label: '游戏攻略' },
        { value: 'news', label: '行业新闻' },
        { value: 'discussion', label: '讨论交流' }
      ],

      // 排序选项
      sortOptions: [
        { value: 'newest', label: '最新发布' },
        { value: 'hottest', label: '最多阅读' },
        { value: 'comments', label: '最多评论' }
      ]
    }
  },
  
  mounted() {
    // 页面创建时获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    
    // 如果用户信息存在，则解析并赋值给userInfo
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr)
    }
    
    // 获取文章列表
    this.getArticleList()
  },

  methods: {

    

    
    // 获取文章列表（模拟数据）
    async getArticleList() {
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 设置文章总数
        this.total = 23
        
        // 模拟文章数据
        const mockArticles = [
          {
            id: 1,
            title: '《Clannad》：为何Key社的催泪之作让无数玩家魂牵梦萦?',
            author: '游戏评论家',
            userId: 101,
            createTime: '2023-03-15',
            category: '游戏评测',
            views: 2541,
            comments: 126,
            content: 'CLANNAD是由Key社制作的一部催泪神作，它的每一个画面、每一段剧情都蕴含着深刻的人生哲理。游戏中的台词"人生中有些重要的，无可替代的东西，只有在失去后才能够了解"将会引发你的深思。游戏中渚与朋也的感情经历了无数困难和考验，但却始终坚持着，这段跨越不同世界线的真挚感情打动了无数玩家。',
            tags: ['Key社', '催泪', '恋爱', '人生'],
            coverUrl: '/banner1.png',
            imageLoaded: false
          },
          {
            id: 2,
            title: '《命运石之门》：穿越世界线的科学冒险',
            author: '科技宅',
            userId: 102,
            createTime: '2023-04-02',
            category: '游戏评测',
            views: 1856,
            comments: 84,
            content: '《命运石之门》是一部将科学与人文完美结合的作品，以独特的视角探讨了时间旅行的可能性和伦理问题。主角冈部伦太郎的内心挣扎和成长过程让人印象深刻。尤其是他为了拯救助手椎名真由理而不断尝试各种可能性，经历了无数痛苦与绝望，最终找到了那个"命运石之门"的选择。',
            tags: ['科学幻想', 'SERN', '时间旅行'],
            coverUrl: '/banner1.png',
            imageLoaded: false
          },
          {
            id: 3,
            title: '《白色相簿2》：青春的痛与美',
            author: '青春文学家',
            userId: 103,
            createTime: '2023-05-21',
            category: '游戏评测',
            views: 1342,
            comments: 97,
            content: '《白色相簿2》以其真实的人物刻画和复杂的情感纠葛，向我们展示了青春期爱情的美好与残酷。在这个故事中，没有真正的坏人，只有各自追求幸福的年轻人。主角北原春希在冬马和纱与小木曾雪菜之间的感情抉择，以及三人最终的成长与和解，构成了一个让人心碎却又温暖的故事。',
            tags: ['三角恋', '青春', '音乐'],
            coverUrl: '/banner1.png',
            imageLoaded: false
          },
          {
            id: 4,
            title: '《蔷薇少女》系列：哥特式美学与人形美学的完美结合',
            author: '人偶艺术家',
            userId: 104,
            createTime: '2023-06-10',
            category: '游戏评测',
            views: 986,
            comments: 65,
            content: '《蔷薇少女》系列以其独特的哥特式美学和人偶主题，创造了一个既美丽又忧伤的世界。游戏中关于人与人偶的界限、生命的意义等哲学思考，以及角色间复杂的羁绊，都让人沉思。尤其是薔薇水晶与雪华绮晶的姐妹关系，以及她们与制造者罗森梅登的纠葛，构成了一个既唯美又悲伤的故事。',
            tags: ['哥特风', '人偶', '哲学'],
            coverUrl: '/banner1.png',
            imageLoaded: false
          },
          {
            id: 5,
            title: '《寒蝉鸣泣之时》：循环与救赎的恐怖悬疑',
            author: '悬疑大师',
            userId: 105,
            createTime: '2023-07-15',
            category: '游戏评测',
            views: 1623,
            comments: 112,
            content: '《寒蝉鸣泣之时》以其循环的叙事结构和多层次的谜题设计，创造了一个深刻的悬疑恐怖故事。游戏中关于信任、救赎和命运的主题，通过前原圭一与竜宮レナ等人在雛見沢村的经历生动展现。每一个章节都揭示了事件的不同面向，最终拼凑成一个完整的真相，而这个过程本身就是对人性的深刻探索。',
            tags: ['悬疑', '恐怖', '循环'],
            coverUrl: '/banner1.png',
            imageLoaded: false
          }
        ]
        
        // 随机延迟模拟图片加载
        setTimeout(() => {
          mockArticles.forEach(article => {
            article.imageLoaded = true
          })
        }, 800)
        
        // 设置文章列表
        this.articleList = mockArticles
      } catch (err) {
        console.error('获取数据失败:', err)
        this.$message.error('获取数据失败')
      }
    },
    
    // 处理搜索
    handleSearch() {
      // 重置页码
      this.listQuery.page = 1
      // 获取文章列表
      this.getArticleList()
    },
    
    // 处理每页显示数量变化
    handleSizeChange(val) { 
      // 设置每页显示数量
      this.listQuery.limit = val
      // 获取文章列表
      this.getArticleList()
    },
    
    // 处理页码变化 
    handleCurrentChange(val) {
      // 设置当前页码
      this.listQuery.page = val
      // 获取文章列表
      this.getArticleList()
    },
    
    // 处理筛选条件变化
    handleFilter() {
      // 重置页码
      this.listQuery.page = 1
      // 重新加载文章列表
      this.getArticleList()
    },

    // 处理文章图片加载完成
    handleArticleImageLoad(article) {
      // 使用数组和对象扩展运算符更新状态
      const updatedArticles = [...this.articleList]
      const index = updatedArticles.findIndex(item => item.id === article.id)
      if (index !== -1) {
        updatedArticles[index] = {
          ...updatedArticles[index],
          imageLoaded: true
        }
        this.articleList = updatedArticles
      }
    },

    // 格式化日期
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    // 处理文章内容，移除HTML标签和转换HTML实体
    processContent(content) {
      if (!content) return ''
      return content
        .replace(/<[^>]+>/g, '') // 移除HTML标签
        .replace(/&nbsp;/g, ' ') // 替换空格
        .replace(/&emsp;/g, '    ') // 替换全角空格
        .replace(/&amp;/g, '&') // 替换&
        .replace(/&lt;/g, '<') // 替换<
        .replace(/&gt;/g, '>') // 替换>
        .replace(/&quot;/g, '"') // 替换"
        .replace(/&#39;/g, "'") // 替换'
        .replace(/&ldquo;/g, '"') // 替换中文左双引号
        .replace(/&rdquo;/g, '"') // 替换中文右双引号
        .replace(/&hellip;/g, '...') // 替换省略号
        .replace(/&mdash;/g, '—') // 替换破折号
        .replace(/\s+/g, ' ') // 合并多个空格
        .trim() // 移除首尾空格
    }
  }
}
</script>

<style scoped>
/* 文章容器 */
.article-container {
  position: relative;
  padding: 20px 0;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

/* 筛选和搜索区域 */
.filter-container {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
}

/* 文章列表 */
.article-list {
  margin-bottom: 30px;
}

.article-item {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.article-item:hover {
  transform: translateY(-5px);
}

.article-image-container {
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.article-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 4px;
  transition: background-image 0.3s ease-in-out;
}

.article-item:hover .article-image {
  transform: scale(1.05);
}

.article-content {
  padding: 10px 0;
}

.article-title {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.article-meta span {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.article-meta i {
  margin-right: 5px;
}

.article-excerpt {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.article-tags .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

/* 分页 */
.pagination-container {
  text-align: center;
  margin-top: 30px;
}

/* 写文章按钮 */
.write-button {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 60px;
  height: 60px;
  font-size: 24px;
  z-index: 999;
}

/* 图片加载动画 */
.image-loading {
  background-color: #f5f7fa;
  position: relative;
}

.image-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-image-container {
    height: 120px;
  }
  
  .write-button {
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>