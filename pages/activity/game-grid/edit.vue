<template>
  <div class="game-grid-editor">
    <div class="editor-header">
      <h1 class="editor-title">创建游戏生涯个人喜好表</h1>
      <div class="editor-actions">
        <el-button @click="goBack">返回列表</el-button>
        <el-button type="success" @click="saveGrid">保存</el-button>
      </div>
    </div>
    
    <div class="editor-content">
      <div ref="gridContainer" class="grid-container">
        <canvas ref="gridCanvas" class="grid-canvas" @click="showSelectionDialog"></canvas>
      </div>
      
      <div class="editor-instructions">
        <h3>使用说明：</h3>
        <p>1. 点击网格中的任意位置，选择你喜欢的游戏</p>
        <p>2. 完成填写后，点击"保存"按钮保存你的喜好表</p>
        <p>3. 你可以随时重新编辑你的喜好表</p>
      </div>
    </div>
    
    <!-- 游戏选择对话框 -->
    <el-dialog
      title="选择游戏"
      :visible.sync="dialogVisible"
      width="600px"
      @close="cancelSelection"
    >
      <div class="game-search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="输入游戏名称搜索"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchGames"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchGames"></el-button>
        </el-input>
      </div>
      
      <div class="game-list" v-loading="searching">
        <div v-if="searchResults.length > 0" class="search-results">
          <div 
            v-for="game in searchResults" 
            :key="game.id" 
            class="game-item"
            @click="selectGame(game)"
          >
            <div class="game-cover">
              <img :src="getGameCover(game)" :alt="game.nameCn || game.name">
            </div>
            <div class="game-title">{{ game.nameCn || game.name }}</div>
          </div>
        </div>
        <el-empty v-else-if="!searching" description="暂无结果，请尝试其他关键词"></el-empty>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelection">取消</el-button>
        <el-button type="primary" @click="confirmSelection" :disabled="!selectedGame">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentUserAPI } from '@/api/user'
import { getGameListAPI } from '@/api/game'

export default {
  name: 'GameGridEditor',
  data() {
    return {
      userId: null,
      isLoggedIn: false,
      // 对话框控制
      dialogVisible: false,
      currentGridPosition: null,
      // 搜索相关
      searchKeyword: '',
      searchResults: [],
      searching: false,
      selectedGame: null,
      // 网格数据
      gridData: {},
      // 网格配置
      gridConfig: {
        title: '个人游戏生涯喜好表',
        cols: 5,
        rows: 4,
        cellWidth: 120,
        cellHeight: 160,
        padding: 20,
        relationTypes: [
          '入坑作', '最喜欢', '看最多次', '最想安利', '最佳剧情',
          '最佳画面', '最佳配乐', '最佳配音', '最治愈', '最感动',
          '最虐心', '最被低估', '最过誉', '最离谱', '最讨厌'
        ]
      }
    }
  },
  mounted() {
    this.checkUserLogin()
    this.initCanvas()
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
          this.$message.warning('请先登录')
          this.$router.push('/login?redirect=/activity/game-grid/edit')
        }
      } catch (error) {
        this.$message.error('获取用户信息失败')
        this.$router.push('/login?redirect=/activity/game-grid/edit')
      }
    },
    
    // 初始化画布
    initCanvas() {
      const canvas = this.$refs.gridCanvas
      const ctx = canvas.getContext('2d')
      
      const { cols, rows, cellWidth, cellHeight, padding, relationTypes } = this.gridConfig
      
      // 设置画布尺寸
      const width = cols * cellWidth + padding * 2
      const height = rows * cellHeight + padding * 2
      canvas.width = width
      canvas.height = height
      
      // 清空画布
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, width, height)
      
      // 绘制网格
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1
      
      // 绘制横线
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath()
        ctx.moveTo(padding, padding + i * cellHeight)
        ctx.lineTo(width - padding, padding + i * cellHeight)
        ctx.stroke()
      }
      
      // 绘制竖线
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(padding + i * cellWidth, padding)
        ctx.lineTo(padding + i * cellWidth, height - padding)
        ctx.stroke()
      }
      
      // 绘制标题
      ctx.fillStyle = '#303133'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(this.gridConfig.title, width / 2, padding / 2)
      
      // 绘制关系类型
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const index = i * cols + j
          if (index < relationTypes.length) {
            const x = padding + j * cellWidth + cellWidth / 2
            const y = padding + i * cellHeight + cellHeight - 15
            ctx.fillText(relationTypes[index], x, y)
          }
        }
      }
      
      // 设置点击事件
      canvas.addEventListener('click', this.handleCanvasClick)
    },
    
    // 处理画布点击
    handleCanvasClick(event) {
      const canvas = this.$refs.gridCanvas
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const { cols, rows, cellWidth, cellHeight, padding, relationTypes } = this.gridConfig
      
      // 计算点击的单元格位置
      const col = Math.floor((x - padding) / cellWidth)
      const row = Math.floor((y - padding) / cellHeight)
      
      // 检查是否在有效范围内
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        const index = row * cols + col
        if (index < relationTypes.length) {
          this.currentGridPosition = {
            row,
            col,
            index,
            relation: relationTypes[index]
          }
          this.dialogVisible = true
        }
      }
    },
    
    // 搜索游戏
    async searchGames() {
      if (!this.searchKeyword.trim()) {
        this.$message.warning('请输入搜索关键词')
        return
      }
      
      this.searching = true
      try {
        const params = {
          page: 1,
          size: 10,
          keyword: this.searchKeyword.trim()
        }
        
        const res = await getGameListAPI(params)
        
        if (res.code === 1) {
          this.searchResults = res.data.records || []
        } else {
          this.$message.error(res.msg || '搜索失败')
        }
      } catch (error) {
        console.error('搜索游戏失败:', error)
        this.$message.error('搜索失败，请重试')
      } finally {
        this.searching = false
      }
    },
    
    // 获取游戏封面
    getGameCover(game) {
      if (game.cover) return game.cover
      
      try {
        if (game.images) {
          const imagesObj = JSON.parse(game.images)
          return imagesObj.small || imagesObj.medium || imagesObj.large || '/default-game-cover.jpg'
        }
      } catch (error) {
        console.error('解析游戏封面失败:', error)
      }
      
      return '/default-game-cover.jpg'
    },
    
    // 选择游戏
    selectGame(game) {
      this.selectedGame = game
    },
    
    // 显示选择对话框
    showSelectionDialog(event) {
      this.handleCanvasClick(event)
    },
    
    // 确认选择
    confirmSelection() {
      if (!this.selectedGame || !this.currentGridPosition) return
      
      const { relation } = this.currentGridPosition
      
      // 更新网格数据
      this.gridData[relation] = {
        gameId: this.selectedGame.id,
        gameName: this.selectedGame.nameCn || this.selectedGame.name,
        gameCover: this.getGameCover(this.selectedGame)
      }
      
      // 重绘画布
      this.redrawCanvas()
      
      // 关闭对话框
      this.dialogVisible = false
      this.searchKeyword = ''
      this.searchResults = []
      this.selectedGame = null
      this.currentGridPosition = null
    },
    
    // 取消选择
    cancelSelection() {
      this.dialogVisible = false
      this.searchKeyword = ''
      this.searchResults = []
      this.selectedGame = null
      this.currentGridPosition = null
    },
    
    // 重绘画布
    redrawCanvas() {
      // 首先重新初始化画布
      this.initCanvas()
      
      const canvas = this.$refs.gridCanvas
      const ctx = canvas.getContext('2d')
      
      const { cols, rows, cellWidth, cellHeight, padding, relationTypes } = this.gridConfig
      
      // 绘制已选择的游戏
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const index = i * cols + j
          if (index < relationTypes.length) {
            const relation = relationTypes[index]
            const gameData = this.gridData[relation]
            
            if (gameData) {
              const x = padding + j * cellWidth
              const y = padding + i * cellHeight
              
              // 绘制游戏名称
              ctx.fillStyle = '#303133'
              ctx.font = '12px Arial'
              ctx.textAlign = 'center'
              ctx.fillText(gameData.gameName, x + cellWidth / 2, y + 20)
              
              // 后续可以加载和绘制封面图片
            }
          }
        }
      }
    },
    
    // 保存网格
    async saveGrid() {
      // 检查是否有数据
      const hasData = Object.keys(this.gridData).length > 0
      if (!hasData) {
        this.$message.warning('请至少选择一个游戏')
        return
      }
      
      this.$message.success('保存成功')
      this.$router.push('/activity/game-grid')
    },
    
    // 返回列表
    goBack() {
      this.$router.push('/activity/game-grid')
    }
  },
  beforeDestroy() {
    // 移除事件监听
    if (this.$refs.gridCanvas) {
      this.$refs.gridCanvas.removeEventListener('click', this.handleCanvasClick)
    }
  },
  head() {
    return {
      title: '创建游戏生涯个人喜好表 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.game-grid-editor {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.editor-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.grid-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.grid-canvas {
  display: block;
  cursor: pointer;
}

.editor-instructions {
  max-width: 300px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.editor-instructions h3 {
  font-size: 18px;
  color: #303133;
  margin-top: 0;
}

.editor-instructions p {
  margin: 10px 0;
  color: #606266;
  line-height: 1.6;
}

.game-search-box {
  margin-bottom: 20px;
}

.game-list {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.game-item {
  width: calc(25% - 10px);
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s;
}

.game-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.game-cover {
  height: 120px;
  overflow: hidden;
}

.game-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-title {
  font-size: 12px;
  padding: 5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .game-grid-editor {
    padding: 0 10px;
  }
  
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .editor-actions {
    margin-top: 10px;
  }
  
  .game-item {
    width: calc(33.33% - 10px);
  }
}

@media (max-width: 576px) {
  .game-item {
    width: calc(50% - 10px);
  }
}
</style> 