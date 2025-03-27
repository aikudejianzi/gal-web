<template>
  <div class="comments-container">
    <h2>我的评论</h2>
    <el-table
      v-loading="loading"
      :data="comments"
      style="width: 100%">
      <el-table-column
        prop="content"
        label="评论内容"
        min-width="300">
      </el-table-column>
      <el-table-column
        prop="articleTitle"
        label="文章标题"
        min-width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="viewArticle(scope.row.articleId)">
            {{ scope.row.articleTitle }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="评论时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteComment(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 暂无评论 -->
    <el-empty v-if="comments.length === 0" description="暂无评论"></el-empty>
    <!-- 分页 -->
    <div class="pagination-container" v-if="comments.length > 0">
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
  name: 'MyComments',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      comments: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getComments()
  },
  methods: {
    // 获取我的评论
    getComments() {
      this.loading = true
      
      // 模拟数据
      setTimeout(() => {
        const mockComments = [
          {
            id: 1,
            content: '这篇文章写得真好，对CLANNAD的分析很到位！',
            articleId: 101,
            articleTitle: '《CLANNAD》：人生的悲欢离合与重生',
            createTime: this.formatDate(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            content: '命运石之门是我最喜欢的作品之一，这篇分析很精彩',
            articleId: 102,
            articleTitle: '《命运石之门》：穿越时空的蝴蝶效应',
            createTime: this.formatDate(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: 3,
            content: 'Angel Beats确实是一部令人感动的作品，看完有种说不出的感觉',
            articleId: 103,
            articleTitle: '《Angel Beats!》：青春与遗憾的故事',
            createTime: this.formatDate(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)
          }
        ]
        
        this.comments = mockComments
        this.total = mockComments.length
        this.loading = false
      }, 800)
    },

    // 删除评论
    deleteComment(id) {
      this.$confirm('确认删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        
        // 模拟删除
        setTimeout(() => {
          this.comments = this.comments.filter(item => item.id !== id)
          this.total = this.comments.length
          this.$message.success('评论删除成功')
          this.loading = false
        }, 800)
      }).catch(() => {})
    },

    // 查看文章
    viewArticle(id) {
      this.$router.push(`/article/${id}`)
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.page = val
      this.getComments()
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

.el-empty {
  padding: 40px 0;
}

/* 通用样式 */
.comments-container h2 {
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
