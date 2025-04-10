<template>
  <div class="container">
    <el-card class="intro-card">
      <div class="intro-header">
        <h1 class="intro-title">游戏生涯喜好表</h1>
        <div class="intro-actions">
          <el-button type="primary" @click="createMyGrid">创建/编辑我的喜好表</el-button>
          <el-button type="primary" @click="findSimilarUser" :disabled="!isLoggedIn">寻找兴趣相似的用户</el-button>
        </div>
      </div>
      <div class="intro-content">
        <p>游戏生涯喜好表是一种展示你个人Galgame喜好的方式，你可以将喜欢的游戏按不同程度放入对应格子中。</p>
        <p>创建你自己的喜好表，分享给其他玩家，或者浏览其他玩家的喜好表来发现新游戏！</p>
      </div>
    </el-card>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="userGrids.length === 0" class="empty-container">
      <el-empty description="暂无用户创建喜好表" :image-size="200">
        <el-button type="primary" @click="createMyGrid">成为第一个创建者</el-button>
      </el-empty>
    </div>

    <div v-else class="grids-container">
      <h2 class="section-title">浏览用户喜好表</h2>
      <div class="grid-list">
        <el-card 
          v-for="(grid, index) in userGrids" 
          :key="index" 
          class="grid-card"
          shadow="hover"
        >
          <div class="grid-card-header">
            <div class="user-info">
              <img :src="grid.userAvatar || defaultAvatar" class="user-avatar" />
              <span class="user-name">{{ grid.username }}</span>
            </div>
            <span class="grid-date">{{ formatDate(grid.createTime) }}</span>
          </div>

          <div class="grid-preview">
            <div class="preview-grid">
              <div 
                v-for="(cell, index) in getAllPreviewCells(grid)" 
                :key="index"
                class="preview-cell"
                :class="{ 'has-game': cell.game }"
              >
                <div v-if="cell.game" 
                  class="preview-game"
                  @click="goToGameDetail(cell.game)"
                >
                  <img 
                    :src="cell.game.cover || defaultCover" 
                    :alt="`${cell.game.nameCn || cell.game.name} - ${cell.label}`"
                    class="preview-cover"
                  />
                  <div class="preview-label">
                    {{ cell.label }}
                  </div>
                </div>
                <div v-else class="preview-empty">
                  {{ cell.label }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid-footer">
            <el-button type="text" @click="viewFullGrid(grid)">查看大图</el-button>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
      title="游戏生涯喜好表详情"
      :visible.sync="dialogVisible"
      width="80%"
      center
    >
      <div v-if="selectedGrid" class="full-grid-container">
        <div class="dialog-user-info">
          <img :src="selectedGrid.userAvatar || defaultAvatar" class="dialog-user-avatar" />
          <div class="dialog-user-name">
            {{ selectedGrid.username }}的游戏生涯喜好表
          </div>
          <div class="dialog-grid-date">
            创建于 {{ formatDate(selectedGrid.createTime) }}
          </div>
        </div>

        <div class="full-grid">
          <div class="game-grid-view">
            <div
              v-for="(label, index) in getAllLabels()"
              :key="index"
              class="grid-view-cell"
            >
              <div class="cell-label">{{ label }}</div>
              <div 
                v-if="hasGameForLabel(selectedGrid, label)"
                class="game-view-card"
                @click="goToGameDetail(getGameForLabel(selectedGrid, label))"
              >
                <img 
                  :src="getGameForLabel(selectedGrid, label).cover || defaultCover" 
                  :alt="`${getGameForLabel(selectedGrid, label).nameCn || getGameForLabel(selectedGrid, label).name} - ${label}`"
                  class="game-view-cover"
                />
                <div class="game-view-name">
                  {{ getGameForLabel(selectedGrid, label).nameCn || getGameForLabel(selectedGrid, label).name }}
                </div>
              </div>
              <div v-else class="empty-cell">
                <div class="empty-placeholder">无</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <el-dialog
      title="兴趣相似的用户"
      :visible.sync="similarUserDialogVisible"
      width="30%"
      center
    >
      <div v-if="loading" class="dialog-loading">
        <el-spinner type="bounce" :size="30"></el-spinner>
        <p>正在计算相似度...</p>
      </div>
      <div v-else-if="similarUser" class="similar-user-content">
        <div class="similar-user-info">
          <img :src="similarUser.userAvatar || defaultAvatar" class="similar-user-avatar" />
          <h3 class="similar-user-name">{{ similarUser.username }}</h3>
        </div>
        <div class="similar-score">
          <p>相似度得分: <span class="score-value">{{ similarUser.score }}分</span></p>
        </div>
        <div class="score-rules">
          <h4>计算规则:</h4>
          <p>· 相同游戏: +1分</p>
          <p>· 相同游戏且标签相同: +3分</p>
        </div>
        <div class="similar-actions">
          <el-button type="primary" @click="viewSimilarUserGrid">查看TA的喜好表</el-button>
        </div>
      </div>
      <div v-else class="no-similar-user">
        <p>未找到与您喜好相似的用户，可能是您尚未创建喜好表或其他用户较少。</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUserGameGridsAPI, getUserGameGridAPI, getSimilarUserAPI } from '@/api/gameGrid'
import { getCurrentUserAPI } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'GameGridList',
  data() {
    return {
      isLoggedIn: false,
      userId: null,
      loading: false,
      userGrids: [],
      defaultAvatar: '/images/default-avatar.png',
      defaultCover: '/images/default-game-cover.jpg',
      dialogVisible: false,
      selectedGrid: null,
      similarUserDialogVisible: false,
      similarUser: null
    }
  },
  async mounted() {
    await this.checkUserLogin()
    await this.loadUserGrids()
  },
  methods: {
    // 检查用户登录状态
    async checkUserLogin() {
      try {
        const res = await getCurrentUserAPI()
        if (res && res.code === 1 && res.data) {
          this.isLoggedIn = true
          this.userId = res.data.id
        }
      } catch (error) {
        this.isLoggedIn = false
        this.userId = null
      }
    },
    
    // 加载所有用户的喜好表
    async loadUserGrids() {
      try {
        this.loading = true
        const res = await getAllUserGameGridsAPI()
        if (res.code === 1 && res.data) {
          this.userGrids = res.data
        } else {
          this.userGrids = []
        }
      } catch (error) {
        console.error('加载用户喜好表失败:', error)
        this.userGrids = []
      } finally {
        this.loading = false
      }
    },
    
    // 创建我的游戏生涯喜好表
    createMyGrid() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/activity/game-grid')
        return
      }
      
      // 跳转到编辑页面
      this.$router.push('/activity/game-grid/editor')
    },
    
    // 查找与当前用户相似度最高的用户
    async findSimilarUser() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/activity/game-grid')
        return
      }
      
      this.similarUserDialogVisible = true
      this.loading = true
      this.similarUser = null
      
      try {
        const res = await getSimilarUserAPI(this.userId)
        if (res.code === 1 && res.data) {
          this.similarUser = res.data
        }
      } catch (error) {
        console.error('获取相似用户失败:', error)
        this.$message.error('获取相似用户失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 查看相似用户的喜好表
    viewSimilarUserGrid() {
      if (this.similarUser) {
        // 查找相似用户的喜好表
        const userGrid = this.userGrids.find(grid => grid.userId === this.similarUser.userId)
        if (userGrid) {
          this.similarUserDialogVisible = false
          this.viewFullGrid(userGrid)
        }
      }
    },
    
    // 获取最喜欢的游戏
    getMostFavoriteGame(grid) {
      const games = grid.gridData || []
      return games.find(g => g.label === '最爱' && g.game)?.game
    },
    
    // 获取预览单元格
    getPreviewCells(grid) {
      const games = grid.gridData || [];
      // 只取前6个单元格进行展示
      const previewCells = [];
      
      for (let i = 0; i < 6; i++) {
        const existingCell = games.find(g => g.position === i);
        if (existingCell) {
          previewCells.push(existingCell);
        } else {
          const label = this.getAllLabels()[i];
          previewCells.push({ position: i, label, game: null });
        }
      }
      
      return previewCells;
    },
    
    // 获取所有预览单元格
    getAllPreviewCells(grid) {
      const games = grid.gridData || [];
      const allLabels = this.getAllLabels();
      // 返回所有12个单元格
      const allCells = [];
      
      for (let i = 0; i < allLabels.length; i++) {
        const label = allLabels[i];
        const existingCell = games.find(g => g.label === label);
        if (existingCell) {
          allCells.push(existingCell);
        } else {
          allCells.push({ position: i, label, game: null });
        }
      }
      
      return allCells;
    },
    
    // 获取单元格样式类
    getCellClass(row) {
      return row === 1 ? 'great-cell' : (row === 2 ? 'good-cell' : 'average-cell')
    },
    
    // 查看完整喜好表
    viewFullGrid(grid) {
      this.selectedGrid = grid
      this.dialogVisible = true
    },
    
    // 获取完整喜好表中的游戏
    getFullGridCells(grid, label) {
      return (grid.gridData || []).filter(cell => cell.label === label && cell.game)
    },
    
    // 检查是否有特定标签的游戏
    hasGameForLabel(grid, label) {
      return (grid.gridData || []).some(cell => cell.label === label && cell.game)
    },
    
    // 获取特定标签的游戏
    getGameForLabel(grid, label) {
      const cell = (grid.gridData || []).find(cell => cell.label === label && cell.game)
      return cell ? cell.game : null
    },
    
    // 跳转到游戏详情页
    goToGameDetail(game) {
      if (game && game.id) {
        this.$router.push(`/game/${game.id}`)
      }
    },
    
    // 获取所有标签
    getAllLabels() {
      return [
        '最佳剧情', 
        '最佳画面', 
        '最佳配乐',
        '最喜欢配音', 
        '最治愈', 
        '最致郁',
        '最被低估', 
        '最被高估', 
        '玩的第一款',
        '最想安利', 
        '最喜欢结局', 
        '我咋回喜欢这个'
      ]
    },
    
    // 格式化日期
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    }
  },
  head() {
    return {
      title: '游戏生涯个人喜好表 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 15px;
}

.intro-card {
  margin-bottom: 30px;
}

.intro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.intro-title {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.intro-content {
  color: #606266;
  line-height: 1.6;
}

.loading-container {
  padding: 20px;
}

.empty-container {
  padding: 40px 0;
  text-align: center;
}

.section-title {
  font-size: 20px;
  margin: 30px 0 20px;
  color: #303133;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.grid-card {
  overflow: hidden;
  transition: all 0.3s;
}

.grid-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.grid-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  color: #303133;
}

.grid-date {
  font-size: 12px;
  color: #909399;
}

.grid-preview {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.preview-cell {
  aspect-ratio: 2/3;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid #dcdfe6;
}

.preview-cell.has-game {
  cursor: pointer;
  transition: all 0.3s;
}

.preview-cell.has-game:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-game {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  font-size: 12px;
  text-align: center;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: #909399;
  padding: 5px;
  text-align: center;
}

.grid-footer {
  display: flex;
  justify-content: flex-end;
}

/* 对话框样式 */
.full-grid-container {
  padding: 20px;
}

.dialog-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.dialog-user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
}

.dialog-user-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.dialog-grid-date {
  font-size: 12px;
  color: #909399;
}

.full-grid {
  width: 100%;
}

.game-grid-view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.grid-view-cell {
  aspect-ratio: 2/3;
  background-color: #fff;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.grid-view-cell:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cell-label {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  width: 100%;
}

.game-view-card {
  position: relative;
  height: calc(100% - 36px);
  cursor: pointer;
}

.game-view-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-view-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-cell {
  height: calc(100% - 36px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.empty-placeholder {
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .grid-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .game-grid-view {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .grid-list {
    grid-template-columns: 1fr;
  }
  
  .game-grid-view {
    grid-template-columns: repeat(2, 1fr);
  }
}

.intro-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 相似用户弹窗样式 */
.similar-user-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.similar-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.similar-user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #409EFF;
}

.similar-user-name {
  font-size: 18px;
  margin: 5px 0;
  color: #303133;
}

.similar-score {
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
}

.score-value {
  font-weight: bold;
  color: #409EFF;
  font-size: 20px;
}

.score-rules {
  background-color: #f8f8f8;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 100%;
}

.score-rules h4 {
  margin-top: 0;
  color: #606266;
}

.score-rules p {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.similar-actions {
  margin-top: 10px;
}

.no-similar-user, .dialog-loading {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.dialog-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 