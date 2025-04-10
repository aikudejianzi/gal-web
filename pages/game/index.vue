<template>
  <div class="game-list-container">
    <!-- 顶部筛选和搜索区域 -->
    <div class="filter-section">
      <div class="left-section">
        <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
          <el-radio-button label="rating">按评分排序</el-radio-button>
          <el-radio-button label="date">按时间排序</el-radio-button>
        </el-radio-group>
      </div>
      <div class="right-section">
        <el-input
          placeholder="搜索游戏名称"
          v-model="searchQuery"
          class="search-input"
          suffix-icon="el-icon-search"
          @keyup.enter.native="handleSearch"
          :disabled="loading"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" :loading="loading"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 游戏列表 -->
    <div class="game-list" v-loading="loading" element-loading-text="加载中...">
      <el-card v-for="(game, index) in gameList" :key="game.id" class="game-card" shadow="hover" @click.native="handleGameClick(game.id)">
        <div class="game-card-content">
          <!-- 排名 -->
          <div class="game-rank" :class="{'top-three': index < 3}">
            {{ (currentPage - 1) * pageSize + index + 1 }}
          </div>
          <!-- 游戏封面图 -->
          <div class="game-cover">
            <img :src="getGameImage(game.images)" :alt="game.name" class="cover-image">
          </div>
          <!-- 游戏信息 -->
          <div class="game-info">
            <h3 class="game-title">{{ game.nameCn || game.name }}</h3>
            <p class="game-original-name" v-if="game.nameCn && game.name !== game.nameCn">{{ game.name }}</p>
            <p class="game-date">发售日期: {{ formatDate(game.date) }}</p>
          </div>
          <!-- 游戏评分 -->
          <div class="game-rating">
            <div class="rating-wrapper">
              <span class="rating-label">平均分: </span>
              <span class="rating-score" :class="getRatingColorClass(game.avgRating || 0)">{{ Math.round(game.avgRating || 0) }}</span>
            </div>
            <el-rate
              v-model="game.ratingValue"
              disabled
              show-score
              :colors="getRatingColors(game.avgRating || 0)"
              score-template=""
            ></el-rate>
            <div class="rating-count">{{ game.ratingCount || 0 }}人评分</div>
          </div>
        </div>
      </el-card>
      
      <!-- 无数据时显示 -->
      <el-empty v-if="gameList.length === 0" description="暂无游戏数据"></el-empty>
    </div>

    <!-- 底部分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="loading"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getGameListAPI } from '@/api/game'

export default {
  name: 'GameList',
  data() {
    return {
      searchQuery: '',
      sortBy: 'rating',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      gameList: [],
      loading: false
    }
  },
  methods: {
    // 根据评分返回对应的颜色数组
    getRatingColors(rating) {
      if (rating >= 80) {
        return ['#67C23A', '#67C23A', '#67C23A'] // 优秀 - 绿色
      } else if (rating >= 60) {
        return ['#E6A23C', '#E6A23C', '#E6A23C'] // 良好 - 橙色
      } else if (rating >= 40) {
        return ['#F56C6C', '#F56C6C', '#F56C6C'] // 一般 - 红色
      } else {
        return ['#909399', '#909399', '#909399'] // 较差 - 灰色
      }
    },
    // 根据评分返回对应的CSS类名
    getRatingColorClass(rating) {
      if (rating >= 80) {
        return 'rating-excellent'
      } else if (rating >= 60) {
        return 'rating-good'
      } else if (rating >= 40) {
        return 'rating-average'
      } else {
        return 'rating-poor'
      }
    },
    // 日期格式化
    formatDate(date) {
      if (!date) return '未知'
      return dayjs(date).format('YYYY-MM-DD')
    },
    // 搜索处理
    handleSearch() {
      this.currentPage = 1
      this.fetchGameList()
    },
    // 排序方式改变
    handleSortChange(value) {
      this.currentPage = 1
      this.fetchGameList()
    },
    // 页大小改变
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchGameList()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchGameList()
    },
    // 游戏点击处理
    handleGameClick(id) {
      console.log('游戏点击:', id)
      this.$router.push(`/game/${id}`)
    },
    // 获取游戏列表数据
    async fetchGameList() {
      try {
        this.loading = true
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchQuery,
          sortBy: this.sortBy
        }
        
        const res = await getGameListAPI(params)
        
        this.gameList = res.data.records || []
        this.total = res.data.total || 0
        
        // 计算星级评分值
        this.gameList.forEach(game => {
          game.ratingValue = (game.avgRating || 0) / 20
        })
      } catch (error) {
        console.error('获取游戏列表失败:', error)
        this.$message.error('获取游戏列表失败')
      } finally {
        this.loading = false
      }
    },
    // 获取游戏图片
    getGameImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images);
          // 优先使用small尺寸，如果没有则依次尝试其他尺寸
          return imagesObj.small || imagesObj.grid || imagesObj.medium || imagesObj.common || imagesObj.large;
        }
      } catch (error) {
        console.error('解析图片JSON失败:', error);
      }
      // 默认图片
      return 'https://lain.bgm.tv/r/200/pic/cover/l/c5/1c/13_tQxwM.jpg';
    }
  },
  // 服务端获取数据
  async asyncData() {
    try {
      const params = {
        page: 1,
        size: 20,
        sortBy: 'rating'
      }
      
      const res = await getGameListAPI(params)
      
      const gameList = res.data.records || []
      // 计算星级评分值
      gameList.forEach(game => {
        game.ratingValue = (game.avgRating || 0) / 20
      })
      
      return {
        gameList,
        total: res.data.total || 0
      }
    } catch (error) {
      console.error('获取游戏列表失败:', error)
      return {
        gameList: [],
        total: 0
      }
    }
  },
  // 客户端挂载后更新数据
  mounted() {
    if (process.client && (!this.gameList || this.gameList.length === 0)) {
      this.fetchGameList()
    }
  },
  head() {
    return {
      title: '游戏列表 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.game-list-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 250px;
}

.game-list {
  margin-bottom: 30px;
}

.game-card {
  margin-bottom: 15px;
  transition: transform 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-card-content {
  display: flex;
  align-items: center;
}

.game-cover {
  flex: 0 0 100px;
  margin-right: 20px;
}

.cover-image {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
}

.game-info {
  flex: 1;
}

.game-title {
  margin: 0 0 5px;
  font-size: 18px;
  color: #303133;
}

.game-original-name {
  margin: 0 0 5px;
  font-size: 14px;
  color: #606266;
}

.game-date {
  margin: 5px 0;
  font-size: 14px;
  color: #909399;
}

.game-rating {
  flex: 0 0 140px;
  text-align: center;
  padding: 0 10px;
}

.rating-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.rating-label {
  font-size: 14px;
  color: #606266;
  margin-right: 4px;
}

.rating-score {
  font-size: 24px;
  font-weight: bold;
  color: #ff9900;
}

.rating-count {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.game-rank {
  flex: 0 0 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #909399;
}

.game-rank.top-three {
  color: #ff9900;
  font-size: 22px;
}

.pagination-container {
  text-align: center;
  margin-top: 30px;
}

/* 评分颜色类 */
.rating-excellent {
  color: #67C23A; /* 绿色 - 优秀 */
}
.rating-good {
  color: #E6A23C; /* 橙色 - 良好 */
}
.rating-average {
  color: #F56C6C; /* 红色 - 一般 */
}
.rating-poor {
  color: #909399; /* 灰色 - 较差 */
}
</style> 