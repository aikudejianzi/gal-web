<template>
  <div class="comment-management">
    <h2>评论管理</h2>
    
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索评论内容"
        class="search-input"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      
      <el-select v-model="searchArticle" placeholder="文章标题" clearable filterable remote
        :remote-method="searchArticles"
        :loading="articleLoading"
        @change="handleSearch">
        <el-option
          v-for="item in articleOptions"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    
    <!-- 评论列表 -->
    <el-table
      v-loading="loading"
      :data="commentList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="articleTitle"
        label="文章标题"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="username"
        label="评论用户"
        width="120">
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        min-width="300">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="评论时间"
        width="180">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        fixed="right">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import { getCommentListAPI, deleteCommentAPI } from '@/api/admin'

export default {
  name: 'CommentManagement',
  data() {
    return {
      // 搜索相关
      searchKeyword: '',
      searchArticle: '',
      articleOptions: [],
      articleLoading: false,
      
      // 列表相关
      commentList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.loadCommentList()
  },
  methods: {
    // 加载评论列表
    async loadCommentList() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchKeyword,
          articleId: this.searchArticle
        }
        const res = await getCommentListAPI(params)
        if (res.code === 1) {
          this.commentList = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取评论列表失败')
        }
      } catch (error) {
        this.$message.error('获取评论列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 搜索文章
    async searchArticles(query) {
      if (query !== '') {
        this.articleLoading = true
        try {
          // 这里需要调用搜索文章的API
          // const res = await searchArticlesAPI(query)
          // this.articleOptions = res.data || []
        } catch (error) {
          this.$message.error('搜索文章失败')
        } finally {
          this.articleLoading = false
        }
      } else {
        this.articleOptions = []
      }
    },
    
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.loadCommentList()
    },
    
    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageSize = val
      this.loadCommentList()
    },
    
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadCommentList()
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    
    // 处理删除
    handleDelete(comment) {
      this.$confirm('确定要删除这条评论吗？此操作不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteCommentAPI(comment.id)
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.loadCommentList()
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
.comment-management {
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
</style> 
 