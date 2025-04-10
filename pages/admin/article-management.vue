<template>
  <div class="article-management">
    <h2>文章管理</h2>
    
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文章标题或内容"
        class="search-input"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      
      <el-select v-model="searchCategory" placeholder="文章分类" clearable @change="handleSearch">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      
      <el-select v-model="searchStatus" placeholder="文章状态" clearable @change="handleSearch">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    
    <!-- 文章列表 -->
    <el-table
      v-loading="loading"
      :data="articleList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        width="120">
        <template slot-scope="scope">
          {{ getCategoryLabel(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
            {{ scope.row.status === 1 ? '已通过' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="views"
        label="浏览量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="favorites"
        label="收藏数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="comments"
        label="评论数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handlePreview(scope.row)">预览</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    
    <!-- 预览对话框 -->
    <el-dialog
      title="文章预览"
      :visible.sync="previewVisible"
      width="80%"
      top="5vh">
      <div v-if="currentArticle" class="preview-content">
        <h1>{{ currentArticle.title }}</h1>
        <div class="article-meta">
          <span>作者：{{ currentArticle.username }}</span>
          <span>分类：{{ getCategoryLabel(currentArticle.category) }}</span>
          <span>创建时间：{{ currentArticle.createTime }}</span>
        </div>
        <div class="article-content" v-html="currentArticle.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleListAPI, deleteArticleAPI } from '@/api/admin'
import dayjs from 'dayjs'

export default {
  name: 'ArticleManagement',
  data() {
    return {
      // 搜索相关
      searchKeyword: '',
      searchCategory: '',
      searchStatus: '',
      categoryOptions: [
        { value: 0, label: '游戏评测' },
        { value: 1, label: '游戏攻略' },
        { value: 2, label: '行业新闻' },
        { value: 3, label: '讨论交流' }
      ],
      statusOptions: [
        { value: 0, label: '待审核' },
        { value: 1, label: '已通过' }
      ],
      
      // 列表相关
      articleList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      
      // 预览相关
      previewVisible: false,
      currentArticle: null
    }
  },
  created() {
    this.loadArticleList()
  },
  methods: {
    // 加载文章列表
    async loadArticleList() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchKeyword,
          category: this.searchCategory,
          status: this.searchStatus
        }
        const res = await getArticleListAPI(params)
        if (res.code === 1) {
          this.articleList = res.data.records

          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取文章列表失败')
        }
      } catch (error) {
        this.$message.error('获取文章列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.loadArticleList()
    },
    
    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageSize = val
      this.loadArticleList()
    },
    
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadArticleList()
    },
    
    // 获取分类标签
    getCategoryLabel(category) {
      const option = this.categoryOptions.find(item => item.value === category)
      return option ? option.label : '未知'
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    },
    
    // 处理预览
    handlePreview(article) {
      this.currentArticle = article
      this.previewVisible = true
    },
    
    // 处理删除
    handleDelete(article) {
      this.$confirm('确定要删除这篇文章吗？此操作不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteArticleAPI(article.id)
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.loadArticleList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          this.$message.error('删除失败，请稍后重试')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style>
.article-management {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.preview-content {
  padding: 20px;
}

.article-meta {
  margin: 20px 0;
  color: #666;
}

.article-meta span {
  margin-right: 20px;
}

.article-content {
  line-height: 1.8;
}
</style> 