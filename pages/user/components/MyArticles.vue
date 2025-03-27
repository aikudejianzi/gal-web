<template>
  <div class="articles-container">
    <h2>我的文章</h2>
    <el-table
      v-loading="loading"
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        min-width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="viewArticle(scope.row.id)">
            {{ scope.row.title }}
          </el-link>
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
        prop="likes"
        label="点赞数"
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
            @click="editArticle(scope.row.id)">编辑
          </el-button>
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
  created() {
    this.getArticles()
  },
  methods: {
    // 获取我的文章列表
    getArticles() {
      this.loading = true
      
      // 模拟数据
      setTimeout(() => {
        // 生成模拟数据
        const mockArticles = [
          {
            id: 1,
            title: '《CLANNAD》：人生的悲欢离合与重生',
            createTime: this.formatDate(new Date().getTime() - 24 * 60 * 60 * 1000),
            views: 356,
            likes: 89,
            comments: 32
          },
          {
            id: 2,
            title: '《命运石之门》：穿越时空的蝴蝶效应',
            createTime: this.formatDate(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
            views: 521,
            likes: 120,
            comments: 45
          },
          {
            id: 3,
            title: '《Angel Beats!》：青春与遗憾的故事',
            createTime: this.formatDate(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            views: 423,
            likes: 95,
            comments: 38
          }
        ]
        
        this.articles = mockArticles
        this.total = 3
        this.loading = false
      }, 800)
    },

    // 查看文章
    viewArticle(id) {
      this.$router.push(`/article/${id}`)
    },

    // 编辑文章
    editArticle(id) {
      this.$router.push(`/article/edit/${id}`)
    },

    // 删除文章
    deleteArticle(id) {
      this.$confirm('确认删除这篇文章吗？删除后不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        
        // 模拟删除
        setTimeout(() => {
          this.articles = this.articles.filter(item => item.id !== id)
          this.total = this.articles.length
          this.$message.success('文章删除成功')
          this.loading = false
        }, 800)
      }).catch(() => {})
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.page = val
      this.getArticles()
    },

    // 格式化日期
    formatDate(timestamp) {
      if(!timestamp) return ''
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
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
