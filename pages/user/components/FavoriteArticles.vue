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
          <el-link type="primary" @click="viewArticle(scope.row.articleId)">
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120">
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
            @click="cancelCollect(scope.row.articleId)">取消收藏
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
  created() {
    this.getFavoriteArticles()
  },
  methods: {
    // 获取收藏的文章
    getFavoriteArticles() {
      this.loading = true
      
      // 模拟数据
      setTimeout(() => {
        const mockFavorites = [
          {
            id: 1,
            articleId: 101,
            title: '《CLANNAD》：催泪神作的魅力解析',
            author: '岡崎朋也',
            createTime: this.formatDate(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: 2,
            articleId: 102,
            title: '《Steins;Gate》：命运石之门的科学设定',
            author: '冈部伦太郎',
            createTime: this.formatDate(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            id: 3,
            articleId: 103,
            title: '《樱花庄的宠物女孩》：青春校园的浪漫',
            author: '空太',
            createTime: this.formatDate(new Date().getTime() - 15 * 24 * 60 * 60 * 1000)
          }
        ]
        
        this.favoriteArticles = mockFavorites
        this.total = mockFavorites.length
        this.loading = false
      }, 800)
    },

    // 取消收藏
    cancelCollect(articleId) {
      this.$confirm('确认取消收藏吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        
        // 模拟取消收藏
        setTimeout(() => {
          this.favoriteArticles = this.favoriteArticles.filter(item => item.articleId !== articleId)
          this.total = this.favoriteArticles.length
          this.$message.success('取消收藏成功')
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
      this.getFavoriteArticles()
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
</style>
