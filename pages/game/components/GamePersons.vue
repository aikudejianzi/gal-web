<template>
  <div class="game-persons">
    <h3 class="section-title">相关制作人员/会社</h3>
    
    <!-- 制作人员列表 -->
    <div class="persons-container" v-if="persons.length > 0">
      <div v-for="person in displayedPersons" :key="person.id" class="person-item">
        <el-card shadow="hover" class="person-card" @click.native="goToPersonDetail(person.id)">
          <div class="person-image">
            <img 
              :src="getPersonImage(person.images)" 
              :alt="person.nameCn || person.name"
              @error="handleImageError($event, person)"
            >
            <div class="image-fallback" v-if="!person.validImage">
              <span class="fallback-text">{{ getNameInitial(person.nameCn || person.name) }}</span>
            </div>
          </div>
          <div class="person-info">
            <h4 class="person-name">{{ person.nameCn || person.name }}</h4>
            <div class="person-relation" v-if="getPersonRelation(person)">{{ getPersonRelation(person) }}</div>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 展开/折叠按钮 -->
    <div class="show-more-container" v-if="persons.length > initialDisplayCount">
      <el-button 
        type="text" 
        @click="togglePersonsDisplay" 
        class="show-more-btn"
        :icon="showAllPersons ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
      >
        {{ showAllPersons ? '收起人员列表' : '显示更多人员' }}
      </el-button>
    </div>
    
    <!-- 没有制作人员时显示 -->
    <el-empty v-if="persons.length === 0" description="暂无制作人员信息"></el-empty>
  </div>
</template>

<script>
import { getGamePersonsAPI } from '@/api/game'

export default {
  name: 'GamePersons',
  props: {
    gameId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      persons: [],
      loading: false,
      showAllPersons: false,
      initialDisplayCount: 12 // 初始显示的制作人员数量
    }
  },
  computed: {
    // 根据展开/折叠状态展示制作人员
    displayedPersons() {
      if (this.showAllPersons) {
        return this.persons;
      } else {
        return this.persons.slice(0, this.initialDisplayCount);
      }
    }
  },
  created() {
    this.fetchPersons()
  },
  methods: {
    // 获取制作人员图片
    getPersonImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images)
          // 优先使用small尺寸图片
          return imagesObj.small || imagesObj.grid || imagesObj.medium || imagesObj.common || imagesObj.large
        }
      } catch (error) {
        console.error('解析制作人员图片JSON失败:', error)
      }
      // 默认图片
      return ''
    },
    
    // 获取制作人员列表数据
    async fetchPersons() {
      try {
        this.loading = true
        const res = await getGamePersonsAPI(this.gameId)
        
        if (res && res.code === 1) {
          // 处理可能存在的重复制作人员（同一人有多个角色）
          const personsMap = new Map()
          
          // 先整理数据，合并同一人的多个关系
          ;(res.data || []).forEach(person => {
            const key = person.id
            
            if (personsMap.has(key)) {
              // 已存在此人，合并关系
              const existingPerson = personsMap.get(key)
              
              // 如果有新的关系，添加到现有关系中
              if (person.gameRelations && person.gameRelations.length > 0) {
                const newRelations = person.gameRelations[0]
                if (newRelations && newRelations.relation) {
                  // 检查是否已存在相同关系
                  const hasRelation = existingPerson.gameRelations.some(
                    r => r.relation === newRelations.relation
                  )
                  
                  if (!hasRelation) {
                    existingPerson.gameRelations.push(newRelations)
                  }
                }
              }
            } else {
              // 不存在，添加新条目，设置validImage属性
              personsMap.set(key, { ...person, validImage: true })
            }
          })
          
          // 转换为数组
          this.persons = Array.from(personsMap.values())
        } else {
          console.error('获取制作人员列表失败:', res.msg)
        }
      } catch (error) {
        console.error('获取制作人员列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 切换显示全部/部分制作人员
    togglePersonsDisplay() {
      this.showAllPersons = !this.showAllPersons;
    },
    
    // 获取制作人员与游戏的关系
    getPersonRelation(person) {
      if (person.gameRelations && person.gameRelations.length > 0) {
        // 收集所有关系
        const relations = person.gameRelations
          .filter(r => r.gameId === parseInt(this.gameId))
          .map(r => r.relation)
          .filter(Boolean)
          
        // 用"/"连接多个关系
        return relations.join('/')
      }
      return ''
    },
    
    // 跳转到制作人员详情页
    goToPersonDetail(personId) {
      this.$router.push(`/person/${personId}`)
    },

    // 处理图片加载错误
    handleImageError(event, person) {
      console.error(`图片加载失败: ${person.nameCn || person.name}`, event)
      person.validImage = false
    },

    // 获取名称首字母
    getNameInitial(name) {
      return name.substring(0, 1).toUpperCase()
    }
  }
}
</script>

<style scoped>
.game-persons {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.persons-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px; /* 抵消子元素的margin */
}

.person-item {
  width: calc(16.666% - 20px); /* 默认一行6个 */
  margin: 0 10px 20px;
  box-sizing: border-box;
}

@media (max-width: 1600px) {
  .person-item {
    width: calc(20% - 20px); /* 大屏幕一行5个 */
  }
}

@media (max-width: 1200px) {
  .person-item {
    width: calc(25% - 20px); /* 中等屏幕一行4个 */
  }
}

@media (max-width: 992px) {
  .person-item {
    width: calc(33.333% - 20px); /* 小屏幕一行3个 */
  }
}

@media (max-width: 768px) {
  .person-item {
    width: calc(50% - 20px); /* 平板一行2个 */
  }
}

@media (max-width: 576px) {
  .person-item {
    width: calc(100% - 20px); /* 手机一行1个 */
  }
}

.person-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s;
}

.person-card:hover {
  transform: translateY(-5px);
}

.person-image {
  position: relative;
  text-align: center;
  margin-bottom: 10px;
  height: 180px;
  overflow: hidden;
}

.person-image img {
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

.person-info {
  padding: 0 8px;
  margin-bottom: 10px;
}

.person-name {
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

.person-relation {
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
</style> 