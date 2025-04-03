<template>
  <div class="favorites-container">
    <h2>文章收藏</h2>
    <el-table
      v-loading="loading"
      :data="favoriteArticles"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        min-width="200">
        <template slot-scope="scope">
          <el-link 
            v-if="scope.row.status === 1 || scope.row.status === undefined" 
            type="primary" 
            @click="viewArticle(scope.row.id)">
            {{ scope.row.title }}
          </el-link>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="作者"
        width="180">
        <template slot-scope="scope">
          <span class="username-cell">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="收藏时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="cancelCollect(scope.row.id)">取消收藏
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 暂无收藏 -->
    <el-empty v-if="favoriteArticles.length === 0" description="暂无收藏"></el-empty>
    <!-- 分页 -->
    <div class="pagination-container" v-if="favoriteArticles.length > 0">
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
import { getFavoriteArticlesAPI, cancelFavoriteAPI } from '@/api/favorite'
import dayjs from 'dayjs'

export default {
  name: 'FavoriteArticles',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      favoriteArticles: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    // 监听userInfo变化，当用户信息加载完成后再获取收藏列表
    userInfo: {
      handler(newVal) {
        if (newVal && newVal.id) {
          this.getFavoriteArticles();
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 如果已有用户信息则直接获取数据
    if (this.userInfo && this.userInfo.id) {
      this.getFavoriteArticles();
    }
  },
  methods: {
    // 获取收藏的文章
    async getFavoriteArticles() {
      if (!this.userInfo || !this.userInfo.id) {
        console.error('用户信息不完整')
        this.$message.error('获取用户信息失败，请刷新页面重试')
        return
      }
      
      this.loading = true
      
      try {
        const res = await getFavoriteArticlesAPI({
          userId: this.userInfo.id,
          page: this.page,
          pageSize: this.pageSize
        })
        
        if (res && res.code === 1) {
          // 格式化日期
          this.favoriteArticles = (res.data.records || []).map(item => ({
            ...item,
            createTime: this.formatDate(item.createTime)
          }))
          this.total = res.data.total || 0
        } else {
          this.$message.error(res?.msg || '获取收藏列表失败')
        }
      } catch (error) {
        console.error('获取收藏列表失败:', error)
        this.$message.error('获取收藏列表失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },

    // 取消收藏
    async cancelCollect(articleId) {
      this.$confirm('确认取消收藏吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        
        try {
          // 使用专门的取消收藏API
          const res = await cancelFavoriteAPI(articleId, this.userInfo.id)
          
          if (res && res.code === 1) {
            this.$message.success('取消收藏成功')
            // 重新获取收藏列表
            this.getFavoriteArticles()
          } else {
            this.$message.error(res.msg || '取消收藏失败')
            this.loading = false
          }
        } catch (error) {
          console.error('取消收藏失败:', error)
          this.$message.error('取消收藏失败')
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
      this.getFavoriteArticles()
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
.favorites-container .el-tabs__header {
  margin-bottom: 20px;
}

.el-empty {
  padding: 40px 0;
}

.pagination-container {
  text-align: center;
  margin-top: 20px;
}

/* 通用样式 */
.favorites-container h2 {
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.el-table {
  margin-bottom: 20px;
}

.username-cell {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
