<template>
  <div class="container">
    <el-card class="editor-card">
      <div slot="header" class="clearfix">
        <span class="title">游戏生涯喜好表编辑器</span>
        <div class="action-buttons">
          <el-button type="primary" size="small" @click="saveGrid" :loading="saveLoading">保存</el-button>
        </div>
      </div>
      
      <div class="grid-editor">
        <div class="search-box">
          <div class="search-tip">搜索游戏，如果有多条符合结果的记录, 最多显示10条结果</div>
          <el-input
            v-model="searchQuery"
            placeholder="输入游戏名称搜索"
            prefix-icon="el-icon-search"
            clearable
            ref="searchInput"
            @clear="clearSearch"
            @keyup.enter.native="selectHighlightedGame"
            @keydown.down.prevent.native="highlightNextGame"
            @keydown.up.prevent.native="highlightPrevGame"
            @blur="performSearch"
          ></el-input>
          <div class="search-results" v-if="searchQuery && searchResults.length > 0">
            <div class="search-result-count">找到 {{ searchResults.length }} 条结果 (使用↑↓键选择，回车添加)</div>
            <div 
              v-for="(game, index) in searchResults" 
              :key="game.id" 
              class="search-result-item"
              :class="{ 'result-highlighted': highlightedIndex === index }"
              @mouseenter="highlightedIndex = index"
              @mousedown="selectGame(game)"
            >
              <img :src="game.cover || defaultCover" class="result-cover">
              <div class="result-info">
                <div class="result-name">{{ game.nameCn || game.name }}</div>
                <div class="result-rating" v-if="game.avgRating">
                  <span class="rating-score">{{ Math.round(game.avgRating) }}分</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid-container">
          <div class="grid-header">
            <div class="grid-title">我的游戏生涯喜好表</div>
            <div class="grid-subtitle">点击格子, 在搜索框搜索, 添加游戏; 拖动已添加的游戏调整位置</div>
          </div>
          
          <div class="game-grid">
            <div
              v-for="(cell, index) in gridCells"
              :key="index"
              class="grid-cell"
              @click="showSearch(index)"
              :class="{ 'cell-selected': selectedCellIndex === index }"
            >
              <div v-if="cell.game" class="game-card" draggable="true" @dragstart="dragStart($event, index)" @dragover.prevent @drop="drop($event, index)">
                <div class="remove-icon" @click.stop="removeGame(index)">×</div>
                <img :src="cell.game.cover || defaultCover" class="game-cover">
                <div class="cell-label">{{ cell.label }}</div>
              </div>
              <div v-else class="cell-content" @dragover.prevent @drop="drop($event, index)">
                <div class="cell-label">{{ cell.label }}</div>
                <div class="cell-placeholder">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <el-dialog
      title="操作结果"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <span>{{ dialogMessage }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGameListAPI, searchGamesAPI } from '@/api/game'
import { saveUserGameGridAPI, getUserGameGridAPI } from '@/api/gameGrid'
import { getCurrentUserAPI } from '@/api/user'
import { debounce } from 'lodash'

export default {
  layout: 'default',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedCellIndex: null,
      highlightedIndex: 0,
      gridCells: [
        { label: '最佳剧情', game: null },
        { label: '最佳画面', game: null },
        { label: '最佳配乐', game: null },
        { label: '最喜欢配音', game: null },
        { label: '最治愈', game: null },
        { label: '最致郁', game: null },
        { label: '最被低估', game: null },
        { label: '最被高估', game: null },
        { label: '玩的第一款', game: null },
        { label: '最想安利', game: null },
        { label: '最喜欢结局', game: null },
        { label: '我咋回喜欢这个', game: null }
      ],
      defaultCover: '/images/default-game-cover.jpg',
      saveLoading: false,
      loadLoading: false,
      dialogVisible: false,
      dialogMessage: '',
      debouncedSearch: null,
      isLoggedIn: false,
      userId: null
    }
  },
  async created() {
    this.debouncedSearch = debounce(this.performSearch, 300)
    await this.checkUserLogin()
    if (this.isLoggedIn && this.userId) {
      await this.loadMyGrid(false)
    }
  },
  watch: {
    searchQuery(val) {
      if (val) {
        this.debouncedSearch()
      } else {
        this.searchResults = []
      }
    }
  },
  methods: {
    // 检查用户登录状态
    async checkUserLogin() {
      try {
        const res = await getCurrentUserAPI()
        if (res && res.code === 1 && res.data) {
          this.isLoggedIn = true
          this.userId = res.data.id
        } else {
          this.isLoggedIn = false
          this.userId = null
          this.$message.warning('请先登录')
          this.$router.push('/login?redirect=/activity/game-grid/editor')
        }
      } catch (error) {
        this.isLoggedIn = false
        this.userId = null
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/activity/game-grid/editor')
      }
    },
    async performSearch() {
      if (!this.searchQuery) return
      
      try {
        const res = await searchGamesAPI(this.searchQuery)
        if (res.code === 1) {
          this.searchResults = res.data || []
          this.highlightedIndex = this.searchResults.length > 0 ? 0 : -1
        } else {
          this.$message.error(`搜索失败: ${res.msg}`)
          this.searchResults = []
        }
      } catch (err) {
        console.error('搜索游戏失败:', err)
        this.$message.error('搜索游戏失败，请稍后重试')
        this.searchResults = []
      }
    },
    clearSearch() {
      this.searchQuery = ''
      this.searchResults = []
      this.highlightedIndex = 0
    },
    selectHighlightedGame() {
      if (this.searchResults.length > 0 && this.highlightedIndex >= 0 && this.highlightedIndex < this.searchResults.length) {
        this.selectGame(this.searchResults[this.highlightedIndex])
      }
    },
    highlightNextGame() {
      if (this.searchResults.length > 0) {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.searchResults.length
        this.scrollToHighlighted()
      }
    },
    highlightPrevGame() {
      if (this.searchResults.length > 0) {
        this.highlightedIndex = (this.highlightedIndex - 1 + this.searchResults.length) % this.searchResults.length
        this.scrollToHighlighted()
      }
    },
    scrollToHighlighted() {
      this.$nextTick(() => {
        const container = document.querySelector('.search-results')
        const highlightedItem = document.querySelector('.result-highlighted')
        if (container && highlightedItem) {
          const containerRect = container.getBoundingClientRect()
          const itemRect = highlightedItem.getBoundingClientRect()
          
          if (itemRect.bottom > containerRect.bottom) {
            container.scrollTop += (itemRect.bottom - containerRect.bottom)
          } else if (itemRect.top < containerRect.top) {
            container.scrollTop -= (containerRect.top - itemRect.top)
          }
        }
      })
    },
    selectGame(game) {
      if (this.selectedCellIndex !== null) {
        // 立即更新UI
        this.$set(this.gridCells[this.selectedCellIndex], 'game', game)
        
        // 增加视觉反馈
        const selectedCell = this.selectedCellIndex
        setTimeout(() => {
          // 短暂延迟后重置状态，以便用户能看到添加效果
          this.selectedCellIndex = null
          this.searchQuery = ''
          this.searchResults = []
        }, 100)
      }
    },
    showSearch(index) {
      this.selectedCellIndex = index
      // 使用nextTick确保DOM更新后再聚焦
      this.$nextTick(() => {
        this.$refs.searchInput.focus()
      })
    },
    removeGame(index) {
      this.gridCells[index].game = null
    },
    dragStart(event, index) {
      // 只有当单元格有游戏时才允许拖拽
      if (this.gridCells[index].game) {
        event.dataTransfer.setData('text/plain', index)
      } else {
        // 如果单元格没有游戏，阻止拖拽
        event.preventDefault()
      }
    },
    drop(event, targetIndex) {
      const sourceIndex = event.dataTransfer.getData('text/plain')
      if (sourceIndex !== targetIndex && sourceIndex !== '') {
        // 获取源单元格和目标单元格的游戏数据
        const sourceGame = this.gridCells[sourceIndex].game
        const targetGame = this.gridCells[targetIndex].game
        
        // 交换两个单元格的游戏数据
        this.gridCells[sourceIndex].game = targetGame
        this.gridCells[targetIndex].game = sourceGame
      }
    },
    async saveGrid() {
      // 检查是否登录
      if (!this.isLoggedIn || !this.userId) {
        this.showDialog('请先登录后再保存喜好表')
        this.$router.push('/login?redirect=/activity/game-grid/editor')
        return
      }
      
      // 检查所有格子是否都填写了游戏
      const emptyGrids = this.gridCells.filter(cell => !cell.game)
      if (emptyGrids.length > 0) {
        this.showDialog(`请填写所有格子的游戏！以下分类尚未填写：${emptyGrids.map(cell => cell.label).join('、')}`)
        return
      }
      
      // 构建保存数据
      const gridList = this.gridCells.map((cell, index) => {
        return {
          userId: this.userId,
          gameId: cell.game.id,
          position: index,
          label: cell.label,   // 发送label字段，但它不会被保存到数据库
          relation: cell.label // 后端会保存relation字段到数据库
        }
      })
      
      this.saveLoading = true
      
      try {
        const res = await saveUserGameGridAPI(gridList, this.userId)
        if (res.code === 1) {
          this.showDialog('保存成功！')
        } else {
          this.showDialog(`保存失败: ${res.msg}`)
        }
      } catch (err) {
        console.error('保存失败:', err)
        this.showDialog('保存失败，请稍后重试')
      } finally {
        this.saveLoading = false
      }
    },
    async loadMyGrid(showMessage = true) {
      // 检查是否登录
      if (!this.isLoggedIn || !this.userId) {
        this.showDialog('请先登录后再加载喜好表')
        this.$router.push('/login?redirect=/activity/game-grid/editor')
        return
      }
      
      this.loadLoading = true
      
      try {
        const res = await getUserGameGridAPI(this.userId)
        if (res.code === 1 && res.data && res.data.length > 0) {
          // 重置现有格子
          this.gridCells.forEach(cell => {
            cell.game = null
          })
          
          // 填充从服务器获取的数据
          res.data.forEach(item => {
            if (item.position >= 0 && item.position < this.gridCells.length) {
              this.gridCells[item.position].game = {
                id: item.game.id,
                name: item.game.name || item.gameName,
                nameCn: item.game.nameCn || item.gameNameCn,
                cover: item.game.cover || item.gameCover,
                avgRating: item.game.avgRating
              }
            }
          })
          
          if (showMessage) {
            this.showDialog('加载成功！')
          }
        } else if (res.code === 1 && (!res.data || res.data.length === 0)) {
          if (showMessage) {
            this.showDialog('你还没有保存过喜好表')
          }
        } else {
          this.showDialog(`加载失败: ${res.msg}`)
        }
      } catch (err) {
        console.error('加载失败:', err)
        this.showDialog('加载失败，请稍后重试')
      } finally {
        this.loadLoading = false
      }
    },
    showDialog(message) {
      this.dialogMessage = message
      this.dialogVisible = true
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

.editor-card {
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.grid-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-tip {
  font-size: 13px;
  color: #909399;
  margin-bottom: 5px;
}

.search-result-count {
  padding: 8px 10px;
  font-size: 12px;
  color: #606266;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f5f7fa;
}

.result-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 3px;
}

.result-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.result-rating {
  display: flex;
  align-items: center;
}

.rating-score {
  color: #ff9900;
  font-weight: bold;
  font-size: 14px;
}

.grid-container {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 20px;
}

.grid-header {
  text-align: center;
  margin-bottom: 20px;
}

.grid-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.grid-subtitle {
  color: #909399;
  font-size: 14px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.grid-cell {
  aspect-ratio: 2/3;
  background-color: #fff;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.grid-cell:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cell-selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.5);
}

.cell-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

.cell-placeholder {
  font-size: 24px;
  color: #c0c4cc;
  margin-top: 10px;
}

.game-card {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.remove-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s;
}

.game-card:hover .remove-icon {
  opacity: 1;
}

.game-cover {
  width: 100%;
  height: 85%;
  object-fit: cover;
}

.result-highlighted {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 