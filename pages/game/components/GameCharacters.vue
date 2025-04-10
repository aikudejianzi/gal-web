<template>
  <div class="game-characters">
    <h3 class="section-title">相关角色</h3>
    
    <!-- 角色列表 -->
    <el-row :gutter="20" v-if="characters.length > 0">
      <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="4" 
             v-for="character in displayedCharacters" 
             :key="character.id" 
             class="character-item">
        <el-card shadow="hover" class="character-card" @click.native="goToCharacterDetail(character.id)">
          <div class="character-image">
            <img 
              :src="getCharacterImage(character.images)" 
              :alt="character.nameCn || character.name"
              @error="handleImageError($event, character)"
            >
            <div class="image-fallback" v-if="!character.validImage">
              <span class="fallback-text">{{ getNameInitial(character.nameCn || character.name) }}</span>
            </div>
          </div>
          <div class="character-info">
            <h4 class="character-name">{{ character.nameCn || character.name }}</h4>
            <div class="character-relation" v-if="character.relation">{{ character.relation }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 展开/折叠按钮 -->
    <div class="show-more-container" v-if="characters.length > initialDisplayCount">
      <el-button 
        type="text" 
        @click="toggleCharactersDisplay" 
        class="show-more-btn"
        :icon="showAllCharacters ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
      >
        {{ showAllCharacters ? '收起角色列表' : '显示更多角色' }}
      </el-button>
    </div>
    
    <!-- 没有角色时显示 -->
    <el-empty v-if="characters.length === 0" description="暂无角色信息"></el-empty>
  </div>
</template>

<script>
import { getGameCharactersAPI } from '@/api/game'

export default {
  name: 'GameCharacters',
  props: {
    gameId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      characters: [],
      loading: false,
      showAllCharacters: false,
      initialDisplayCount: 12 // 初始显示的角色数量
    }
  },
  computed: {
    // 根据展开/折叠状态展示角色
    displayedCharacters() {
      if (this.showAllCharacters) {
        return this.characters;
      } else {
        return this.characters.slice(0, this.initialDisplayCount);
      }
    }
  },
  created() {
    this.fetchCharacters()
  },
  methods: {
    // 获取角色图片
    getCharacterImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images)
          // 优先使用small尺寸图片
          return imagesObj.small || imagesObj.grid || imagesObj.medium || imagesObj.common || imagesObj.large
        }
      } catch (error) {
        console.error('解析角色图片JSON失败:', error)
      }
      // 默认图片
      return ''
    },
    
    // 获取角色列表数据
    async fetchCharacters() {
      try {
        this.loading = true
        const res = await getGameCharactersAPI(this.gameId)
        
        if (res && res.code === 1) {
          // 添加validImage属性到每个角色对象
          this.characters = (res.data || []).map(character => {
            return { ...character, validImage: true }
          })
        } else {
          console.error('获取角色列表失败:', res.msg)
        }
      } catch (error) {
        console.error('获取角色列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 切换显示全部/部分角色
    toggleCharactersDisplay() {
      this.showAllCharacters = !this.showAllCharacters;
    },
    
    // 跳转到角色详情页
    goToCharacterDetail(characterId) {
      this.$router.push(`/character/${characterId}`)
    },

    handleImageError(event, character) {
      console.error(`图片加载失败: ${character.nameCn || character.name}`, event)
      character.validImage = false
    },

    getNameInitial(name) {
      return name.substring(0, 1).toUpperCase()
    }
  }
}
</script>

<style scoped>
.game-characters {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.character-item {
  margin-bottom: 20px;
}

.character-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s;
}

.character-card:hover {
  transform: translateY(-5px);
}

.character-image {
  position: relative;
  text-align: center;
  margin-bottom: 10px;
  height: 180px;
  overflow: hidden;
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.image-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.fallback-text {
  font-size: 36px;
  font-weight: bold;
  color: #909399;
}

.character-info {
  padding: 0 8px;
  margin-bottom: 10px;
}

.character-name {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
  line-height: 1.3;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.character-relation {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.show-more-container {
  text-align: center;
  margin: 10px 0 20px;
  padding-top: 10px;
  border-top: 1px dashed #EBEEF5;
}

.show-more-btn {
  font-size: 14px;
  padding: 8px 20px;
  color: #409EFF;
}

@media (max-width: 768px) {
  .character-image {
    height: 160px;
  }
}
</style> 