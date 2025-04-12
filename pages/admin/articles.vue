<template>
  <div class="article-management">
    <h2>文章审核</h2>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章标题"
        prefix-icon="el-icon-search"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="handleSearch"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 文章列表表格 -->
    <el-table
      v-loading="loading"
      :data="articleList"
      border
      stripe
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
          <el-tag :type="getCategoryType(scope.row.category)">
            {{ getCategoryName(scope.row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="作者"
        width="120">
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
        width="200">
        <template slot-scope="scope">
          <div class="button-group">
            <el-button
              type="primary"
              size="mini"
              class="operation-btn"
              @click="previewArticle(scope.row)"
            >预览</el-button>
            <el-button
              type="success"
              size="mini"
              class="operation-btn"
              @click="approveArticle(scope.row)"
            >通过</el-button>
            <el-button
              type="danger"
              size="mini"
              class="operation-btn"
              @click="deleteArticle(scope.row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
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

    <!-- 文章预览对话框 -->
    <el-dialog
      title="文章预览"
      :visible.sync="previewDialogVisible"
      width="800px"
      top="5vh"
      custom-class="article-preview-dialog">
      <div v-if="currentArticle" class="article-preview">
        <h1 class="article-title">{{ currentArticle.title }}</h1>
        <div class="article-info">
          <span class="author">作者：{{ currentArticle.username }}</span>
          <span class="date">发布时间：{{ formatDateTime(currentArticle.createTime) }}</span>
          <el-tag :type="getCategoryType(currentArticle.category)" size="small">
            {{ getCategoryName(currentArticle.category) }}
          </el-tag>
        </div>
        <div class="article-content" v-html="currentArticle.content"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="success" @click="approveArticle(currentArticle)">通过审核</el-button>
        <el-button type="danger" @click="deleteArticle(currentArticle)">删除文章</el-button>
      </span>
    </el-dialog>

    <!-- 操作确认对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <span>{{ dialogMessage }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction" :loading="actionLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPendingArticlesAPI, reviewArticleAPI, deleteArticleByAdminAPI } from '@/api/admin'
import dayjs from 'dayjs'

export default {
  name: 'ArticleManagement',
  data() {
    return {
      loading: false,
      articleList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: '',
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      actionType: '',
      currentArticle: null,
      actionLoading: false,
      previewDialogVisible: false
    }
  },
  created() {
    this.fetchArticleList()
  },
  methods: {
    // 获取文章列表
    async fetchArticleList() {
      this.loading = true
      try {
        const res = await getPendingArticlesAPI({
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchQuery
        })
        
        if (res.code === 1 && res.data) {
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
    
    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchArticleList()
    },
    
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchArticleList()
    },
    
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchArticleList()
    },
    
    // 通过文章
    approveArticle(article) {
      this.dialogTitle = '审核文章'
      this.dialogMessage = `确定要通过文章"${article.title}"的审核吗？`
      this.actionType = 'approve'
      this.currentArticle = article
      this.dialogVisible = true
    },
    
    // 删除文章
    deleteArticle(article) {
      this.dialogTitle = '删除文章'
      this.dialogMessage = `确定要删除文章"${article.title}"吗？此操作不可恢复！`
      this.actionType = 'delete'
      this.currentArticle = article
      this.dialogVisible = true
    },
    
    // 预览文章
    previewArticle(article) {
      this.currentArticle = article
      this.previewDialogVisible = true
    },
    
    // 确认操作
    async confirmAction() {
      if (!this.currentArticle) return
      
      this.actionLoading = true
      try {
        let res
        
        if (this.actionType === 'approve') {
          res = await reviewArticleAPI({
            articleId: this.currentArticle.id,
            status: 1
          })
          
          if (res.code === 1) {
            this.$message.success('文章审核已通过')
            // 从列表中移除已审核的文章
            this.articleList = this.articleList.filter(item => item.id !== this.currentArticle.id)
            this.total -= 1
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } else if (this.actionType === 'delete') {
          res = await deleteArticleByAdminAPI(this.currentArticle.id)
          
          if (res.code === 1) {
            this.$message.success('文章已删除')
            // 从列表中移除已删除的文章
            this.articleList = this.articleList.filter(item => item.id !== this.currentArticle.id)
            this.total -= 1
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }
        
        // 关闭对话框
        this.dialogVisible = false
        this.previewDialogVisible = false
      } catch (error) {
        this.$message.error('操作失败，请稍后重试')
      } finally {
        this.actionLoading = false
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      return dateTimeStr ? dayjs(dateTimeStr).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    
    // 获取分类名称
    getCategoryName(category) {
      const categoryMap = {
        0: '游戏评测',
        1: '游戏攻略',
        2: '行业新闻',
        3: '讨论交流'
      }
      return categoryMap[category] || '未知分类'
    },
    
    // 获取分类对应的样式类型
    getCategoryType(category) {
      const typeMap = {
        0: 'primary',
        1: 'success',
        2: 'info',
        3: 'warning'
      }
      return typeMap[category] || ''
    }
  }
}
</script>

<style>
.article-management {
  padding: 10px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar .el-input {
  margin-right: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 文章预览样式 */
.article-preview-dialog .el-dialog__header {
  padding: 10px;
}

.article-preview-dialog .el-dialog__body {
  padding: 0;
  padding-bottom: 5px;
}

.article-preview-dialog .el-dialog__footer {
  padding: 5px 10px 10px;
}

.article-preview {
  padding: 0 10px;
  max-width: 708px;
  margin: 0 auto;
}

.article-title {
  font-size: 22px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #333;
  text-align: center;
}

.article-info {
  margin-bottom: 8px;
  color: #777;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
}

.article-content {
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-all;
}

.article-content p {
  margin-bottom: 10px;
  margin-top: 0;
}

.article-content h1, 
.article-content h2, 
.article-content h3, 
.article-content h4 {
  margin-top: 10px;
  margin-bottom: 5px;
  color: #333;
}

.article-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

.article-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

/* 操作按钮样式 */
.button-group {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.operation-btn {
  padding: 4px 8px;
  margin-left: 0 !important;
}
</style> 