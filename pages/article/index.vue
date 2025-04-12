<template>
      <div class="app" id="app">
      <!-- 主要内容区 -->
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

            <!-- 投稿按钮 - 根据登录状态显示不同内容 -->
            <el-col :span="4" style="text-align: right;"> 
              <el-button 
                type="primary" 
                icon="el-icon-edit" 
                @click="handleSubmit">
                {{ userInfo ? '投稿' : '登录后投稿' }}
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 文章列表 -->
        <div class="article-list">
          <el-card v-for="article in articleList" :key="article.id" class="article-item" shadow="hover" @click.native="$router.push(`/article/${article.id}`)">
            <el-row :gutter="20">
              <!-- 文章图片容器 -->
              <el-col :span="6" class="article-image-container">
                <div class="article-image" :style="{backgroundImage: `url(${article.cover})`}"></div>
              </el-col>
              <!-- 文章内容 -->
              <el-col :span="18" class="article-content">
                <!-- 文章标题 -->
                <h2 class="article-title">{{ article.title }}</h2>
                
                <!-- 文章元数据 -->
                <div class="article-meta">
                  <span class="author">
                    <i class="el-icon-user"></i> {{ article.username }}
                  </span>

                  <span class="date">
                    <i class="el-icon-date"></i> {{ article.createTime }}
                  </span>

                  <span class="category">
                    <i class="el-icon-collection-tag"></i> {{ article.categoryName }}
                  </span>

                  <span class="views">
                    <i class="el-icon-view"></i> {{ article.views }} 阅读
                  </span>

                  <span class="comments">
                    <i class="el-icon-chat-dot-round"></i> {{ article.comments }} 评论
                  </span>

                  <span class="favorites">
                    <i class="el-icon-star-off"></i> {{ article.favorites }} 收藏
                  </span>
                  
                </div>
                <!-- 文章摘要 -->
                <p class="article-excerpt">{{ article.excerpt }}</p>

                <!-- 文章标签 -->
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
            :page-sizes="[5, 10, 15, 20 ]"
            :page-size="listQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
        

      </div>
    </div>
</template>

<script>
import { getArticleListAPI } from '@/api/article'
import { getCurrentUserAPI } from '@/api/user'
import dayjs from 'dayjs'

// 提取公共方法到组件外部
const processArticleData = (articles, getCategoryName) => {
  return articles.map(article => ({
    ...article,
    tags: article.tags ? article.tags.split(',').filter(tag => tag) : [],
    createTime: dayjs(article.createTime).format('YYYY-MM-DD'),
    categoryName: getCategoryName(article.category)
  }));
};

// 分类映射关系，提取为常量
const CATEGORY_MAP = {
  '0': '游戏评测',
  '1': '游戏攻略',
  '2': '行业新闻',
  '3': '讨论交流'
};

export default {
  name: 'ArticleIndex', // 添加名称以便于keep-alive匹配
  
  // 启用数据缓存
  fetchOnServer: false, // 仅在客户端获取数据，避免服务端和客户端状态不一致
  
  data () {
    return {
      // 文章列表
      articleList: [],

      // 文章总数
      total: 0,

      // 用户信息
      userInfo: null,

      // 列表查询条件
      listQuery: {
        // 当前页码 
        page: 1,
        // 每页条数
        size: 5,
        // 搜索关键词
        keyword: '',
        // 文章分类
        category: '',
        // 排序方式
        sort: '0'
      },

      // 文章分类选项
      categoryOptions: [
        {value: '', label: '全部分类'},
        {value: '0', label: '游戏评测'},
        {value: '1', label: '游戏攻略'},
        {value: '2', label: '行业新闻'},
        {value: '3', label: '讨论交流'}
      ],

      // 排序选项
      sortOptions: [
        {value: '0', label: '最新发布'},
        {value: '1', label: '最多阅读'},
        {value: '2', label: '最多评论'},
        {value: '3', label: '最多收藏'}
      ],
      
      // 首次加载标记
      isFirstLoad: true
    }
  },

  async asyncData() {
    try {
      // 初始查询条件
      const listQuery = {
        page: 1,
        size: 5,
        keyword: '',
        category: '',
        sort: '0'
      };
      
      const res = await getArticleListAPI(listQuery);
      
      if (res.code === 1) {
        const articles = res.data.records;
        const total = res.data.total;
        
        // 获取分类名称的函数
        const getCategoryName = category => CATEGORY_MAP[category] || '未知分类';
        
        // 处理文章数据
        const processedArticles = processArticleData(articles, getCategoryName);
        
        return { 
          articleList: processedArticles,
          total: total,
          listQuery // 返回初始查询条件
        };
      } else {
        return { 
          articleList: [],
          total: 0
        };
      }
    } catch (err) {
      console.error('获取数据失败:', err);
      return { 
        articleList: [],
        total: 0
      };
    }
  },

  // 在mounted阶段获取用户登录状态
  async mounted() {
    if (process.client) {
      await this.fetchUserInfo();
      
      // 仅在首次加载时获取文章列表
      if (this.isFirstLoad) {
        await this.getArticleList();
        this.isFirstLoad = false;
      }
    }
  },
  
  // keep-alive激活时调用
  activated() {
    // 页面被重新激活时，不需要重新加载数据
    console.log('文章列表页面被激活，保持当前页码:', this.listQuery.page);
  },

  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await getCurrentUserAPI();
        if (res && res.code === 1 && res.data) {
          this.userInfo = res.data;
        } else {
          this.userInfo = null;
        }
      } catch (error) {
        // 请求失败说明用户未登录或登录已过期
        this.userInfo = null;
      }
    },

    // 处理投稿按钮点击
    handleSubmit() {
      if (this.userInfo) {
        // 已登录，直接跳转投稿页
        this.$router.push('/article/submit');
      } else {
        // 未登录，先提示然后跳转登录页
        this.$message.info('请先登录后再投稿');
        this.$router.push('/login');
      }
    },

    // 获取文章列表
    async getArticleList () {
      try {
        const res = await getArticleListAPI(this.listQuery)

        if (res.code === 1) {
          const articles = res.data.records
          this.total = res.data.total
          
          // 处理文章列表数据，使用共享方法
          this.articleList = processArticleData(articles, this.getCategoryName);
        } else {
          this.$message.error(res.msg || '获取文章列表失败')
        }
      } catch (err) {
        console.error('获取数据失败:', err)
        this.$message.error('获取数据失败')
      }
    },

    // 获取分类名称
    getCategoryName(category) {
      return CATEGORY_MAP[category] || '未知分类'
    },

    // 处理搜索
    handleSearch () {
      this.listQuery.page = 1
      this.getArticleList()
    },

    // 处理每页显示数量变化
    handleSizeChange (val) {
      this.listQuery.size = val
      this.getArticleList()
    },

    // 处理页码变化 
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getArticleList()
    },

    // 处理筛选条件变化
    handleFilter () {
      this.listQuery.page = 1
      this.getArticleList()
    }
  }
}
</script>

<style scoped>
      /* 应用容器整体样式 */
      .app {
        background-color: #f5f7fa;
        min-height: 100vh;
      }

      /* 文章区域容器样式 */
      .article-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      /* 筛选区域样式 */
      .filter-container {
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
        width: 100%;
      }

      /* 文章列表样式 */
      .article-list {
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
        width: 90%;
        margin: 0 auto;
        margin-bottom: 20px;
      }
      
      /* 文章卡片样式 */
      .article-item {
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .article-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      }
      
      /* 文章图片容器样式 */
      .article-image-container {
        height: 200px;
        overflow: hidden;
      }
      
      /* 文章图片样式 */
      .article-image {
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 4px;
      }
      
      /* 文章内容样式 */
      .article-content {
        padding: 10px;
      }
      
      /* 文章标题样式 */
      .article-title {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: bold;
        color: #303133;
      }
      
      /* 文章元数据样式 */
      .article-meta {
        margin-bottom: 10px;
        font-size: 14px;
        color: #909399;
      }
      
      .article-meta span {
        margin-right: 20px;
      }
      
      /* 文章摘要样式 */
      .article-excerpt {
        margin: 10px 0;
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
      }
      
      /* 文章标签样式 */
      .article-tags {
        margin-top: 10px;
      }
      
      .article-tags .el-tag {
        margin-right: 8px;
      }
      
      /* 写文章按钮样式 */
      .write-button {
        position: fixed;
        right: 50px;
        bottom: 50px;
        width: 60px;
        height: 60px;
        padding: 0;
        font-size: 24px;
      }

      /* 分页容器样式 */
      .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px 0;
        width: 90%;
        margin: 0 auto;
        margin-top: 20px;
      }

      /* 响应式布局 */
      @media screen and (max-width: 768px) {
        .article-container {
          padding: 10px;
        }
        
        .article-list,
        .pagination-container {
          width: 95%;
          padding: 15px;
        }
      }
    </style>