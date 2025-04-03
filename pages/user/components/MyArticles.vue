<template>
  <div class="articles-container">
    <h2>我的文章</h2>
    <el-table
      v-loading="loading"
      :data="formatTableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        min-width="200">
        <template slot-scope="scope">
          <el-link 
            v-if="scope.row.status === 1" 
            type="primary" 
            @click="viewArticle(scope.row.id)">
            {{ scope.row.title }}
          </el-link>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusText"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusType">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
        width="180">
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
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.status === 1"
            @click="editArticle(scope.row.id)">编辑
          </el-button>
          <el-tooltip 
            v-else 
            content="文章审核中，暂时无法编辑" 
            placement="top">
            <el-button
              size="mini"
              disabled>编辑
            </el-button>
          </el-tooltip>
          <el-button
            size="mini"
            type="danger"
            @click="deleteArticle(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getMyArticlesAPI, deleteArticleAPI } from '@/api/article'
import dayjs from 'dayjs'

export default {
  name: 'MyArticles',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      articles: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    // 格式化表格数据
    formatTableData() {
      return this.articles.map(article => {
        return {
          ...article,
          createTime: article.createTime ? dayjs(article.createTime).format('YYYY-MM-DD HH:mm') : '',
          statusText: article.status === 0 ? '待审核' : '已发布',
          statusType: article.status === 0 ? 'warning' : 'success'
        }
      })
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    // 获取我的文章列表
    async getArticles() {
      this.loading = true
      
      try {
        const res = await getMyArticlesAPI({
          page: this.page,
          pageSize: this.pageSize
        })
        
        if (res && res.code === 1) {
          this.articles = res.data.records || []
          this.total = res.data.total || 0
        } else {
          this.$message.error('获取文章列表失败')
        }
      } catch (error) {
        console.error('获取文章列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 查看文章
    viewArticle(id) {
      this.$router.push(`/article/${id}`)
    },

    // 编辑文章
    editArticle(id) {
      // 获取要编辑的文章
      const article = this.articles.find(item => item.id === id);
      
      // 检查文章状态，只有已发布的文章才能编辑
      if (article && article.status === 1) {
        this.$router.push(`/article/edit/${id}`);
      } else {
        this.$message.warning('只有审核通过的文章才能编辑');
      }
    },

    // 删除文章
    deleteArticle(id) {
      this.$confirm('确认删除这篇文章吗？删除后不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        
        try {
          const res = await deleteArticleAPI(id)
          
          if (res && res.code === 1) {
            this.$message.success('文章删除成功')
            
            // 计算当前页的数据条数（删除前）
            const currentPageSize = this.articles.length
            
            // 如果当前页只有一条数据且不是第一页，删除后自动返回上一页
            if (currentPageSize === 1 && this.page > 1) {
              this.page -= 1
            }
            
            // 重新获取列表
            this.getArticles()
          } else {
            this.$message.error(res.msg || '删除失败')
            this.loading = false
          }
        } catch (error) {
          console.error('删除文章失败:', error)
          this.loading = false
        }
      }).catch(() => {})
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.page = val
      this.getArticles()
    }
  }
}
</script>

<style scoped>
.pagination-container {
  text-align: center;
  margin-top: 20px;
}

/* 通用样式 */
.articles-container h2 {
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.el-table {
  margin-bottom: 20px;
}
</style>
