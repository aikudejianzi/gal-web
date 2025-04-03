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
          <el-link 
            v-if="scope.row.status === 1 || scope.row.status === undefined" 
            type="primary" 
            @click="viewArticle(scope.row.articleId)">
            {{ scope.row.title }}
          </el-link>
          <span v-else>{{ scope.row.title }}</span>
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
import { getUserCommentsAPI, deleteCommentAPI } from '@/api/comment'
import dayjs from 'dayjs'

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
  watch: {
    // 监听userInfo变化，当用户信息加载完成后再获取评论列表
    userInfo: {
      handler(newVal) {
        if (newVal && newVal.id) {
          this.getComments();
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 如果已有用户信息则直接获取数据
    if (this.userInfo && this.userInfo.id) {
      this.getComments();
    }
  },
  methods: {
    // 获取我的评论
    async getComments() {
      if (!this.userInfo || !this.userInfo.id) {
        console.error('用户信息不完整')
        this.$message.error('获取用户信息失败，请刷新页面重试')
        return
      }
      
      this.loading = true
      
      try {
        const res = await getUserCommentsAPI({
          userId: this.userInfo.id,
          page: this.page,
          pageSize: this.pageSize
        })
        
        if (res && res.code === 1) {
          // 格式化日期并设置文章标题
          this.comments = (res.data.records || []).map(item => ({
            ...item,
            articleTitle: item.title, // 添加 articleTitle 属性，兼容表格显示
            createTime: this.formatDate(item.createTime)
          }))
          this.total = res.data.total || 0
        } else {
          this.$message.error(res?.msg || '获取评论列表失败')
        }
      } catch (error) {
        console.error('获取评论列表失败:', error)
        this.$message.error('获取评论列表失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    // 删除评论
    async deleteComment(commentId) {
      this.$confirm('确认删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        
        try {
          const res = await deleteCommentAPI(commentId)
          
          if (res && res.code === 1) {
            this.$message.success('评论删除成功')
            // 重新获取评论列表
            this.getComments()
          } else {
            this.$message.error(res?.msg || '删除评论失败')
            this.loading = false
          }
        } catch (error) {
          console.error('删除评论失败:', error)
          this.$message.error('删除评论失败，请检查网络连接')
          this.loading = false
        }
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
      return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
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
