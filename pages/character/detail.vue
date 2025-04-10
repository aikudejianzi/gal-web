<template>
  <div class="character-detail-container">
    <div v-loading="loading" element-loading-text="加载中...">
      <!-- 基本信息 -->
      <div class="character-info" v-if="characterInfo">
        <div class="character-header">
          <div class="character-avatar">
            <img :src="getCharacterImage(characterInfo.images)" :alt="characterInfo.name" class="avatar-image">
          </div>
          <div class="character-basic">
            <h1 class="character-name">{{ characterInfo.nameCn || characterInfo.name }}</h1>
            <p class="character-original-name" v-if="characterInfo.nameCn && characterInfo.name !== characterInfo.nameCn">{{ characterInfo.name }}</p>
            
            <!-- 配音信息 -->
            <div class="character-cv" v-if="characterInfo.cv">
              <span class="cv-label">配音：</span>
              <router-link 
                v-if="characterInfo.cvId" 
                :to="`/person/${characterInfo.cvId}`" 
                class="cv-link"
              >
                {{ characterInfo.cv }}
              </router-link>
              <span v-else>{{ characterInfo.cv }}</span>
            </div>
          </div>
        </div>

        <!-- 角色信息框 -->
        <div class="character-infobox" v-if="parsedInfobox.length > 0">
          <h3 class="section-title">基本信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="(item, index) in parsedInfobox" :key="index" :label="item.key">
              <!-- 处理不同类型的值 -->
              <template v-if="typeof item.value === 'string'">
                <span v-if="isUrl(item.value)">
                  <a :href="item.value" target="_blank" rel="noopener noreferrer">{{ item.value }}</a>
                </span>
                <span v-else>{{ item.value }}</span>
              </template>
              
              <!-- 处理数组值 -->
              <template v-else-if="Array.isArray(item.value)">
                <div v-for="(subItem, subIndex) in item.value" :key="subIndex" class="sub-item">
                  <template v-if="typeof subItem === 'string'">
                    {{ subItem }}
                  </template>
                  <template v-else>
                    <strong>{{ subItem.k }}：</strong>{{ subItem.v }}
                  </template>
                </div>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 角色简介 -->
        <div class="character-summary" v-if="characterInfo.summary">
          <h3 class="section-title">角色简介</h3>
          <div class="summary-content" v-html="characterInfo.summary"></div>
        </div>
        
        <!-- 若无数据显示提示 -->
        <el-empty v-if="!characterInfo.summary && parsedInfobox.length === 0" description="暂无角色详细信息"></el-empty>
      </div>
      
      <!-- 数据不存在显示 -->
      <el-empty v-if="!loading && !characterInfo" description="找不到该角色信息"></el-empty>
    </div>
  </div>
</template>

<script>
import { getCharacterDetailAPI } from '@/api/character'

export default {
  name: 'CharacterDetail',
  data() {
    return {
      characterInfo: null,
      loading: true
    }
  },
  computed: {
    parsedInfobox() {
      if (!this.characterInfo || !this.characterInfo.infobox) return [];
      try {
        const infoboxData = JSON.parse(this.characterInfo.infobox);
        // 如果是数组直接返回，如果是对象转为数组
        return Array.isArray(infoboxData) 
          ? infoboxData 
          : Object.entries(infoboxData).map(([key, value]) => ({ key, value }));
      } catch (error) {
        console.error('解析infobox失败:', error);
        return [];
      }
    }
  },
  methods: {
    // 获取角色图片
    getCharacterImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images);
          // 优先使用large尺寸，如果没有则依次尝试其他尺寸
          return imagesObj.large || imagesObj.medium || imagesObj.common || imagesObj.grid || imagesObj.small;
        }
      } catch (error) {
        console.error('解析图片JSON失败:', error);
      }
      // 默认图片
      return '';
    },
    
    // 判断是否是URL
    isUrl(value) {
      return typeof value === 'string' && 
        (value.startsWith('http://') || value.startsWith('https://'));
    },
    
    // 获取角色详情
    async fetchCharacterDetail(id) {
      try {
        this.loading = true;
        const res = await getCharacterDetailAPI(id);
        
        if (res && res.code === 1) {
          this.characterInfo = res.data;
          console.log('获取角色成功:', this.characterInfo);
        } else {
          console.error('获取角色详情失败:', res);
          this.$message.error(res.msg || '获取角色详情失败');
        }
      } catch (error) {
        console.error('获取角色详情异常:', error);
        this.$message.error('获取角色详情失败');
      } finally {
        this.loading = false;
      }
    }
  },
  // 服务端渲染数据获取
  async asyncData({ params }) {
    const characterId = parseInt(params.id);
    
    try {
      // 获取角色详情
      const res = await getCharacterDetailAPI(characterId);
      console.log('服务端获取数据结果:', res);
      const characterInfo = res.code === 1 ? res.data : null;
      
      return {
        characterInfo,
        loading: false
      };
    } catch (error) {
      console.error('服务端获取数据失败:', error);
      return {
        characterInfo: null,
        loading: false
      };
    }
  },
  // 客户端挂载
  mounted() {
    if (process.client && !this.characterInfo) {
      const characterId = parseInt(this.$route.params.id);
      this.fetchCharacterDetail(characterId);
    }
  },
  head() {
    return {
      title: this.characterInfo 
        ? `${this.characterInfo.nameCn || this.characterInfo.name} - 角色 - GalGame同好会` 
        : '角色详情 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.character-detail-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.character-header {
  display: flex;
  margin-bottom: 30px;
}

.character-avatar {
  flex: 0 0 220px;
  margin-right: 30px;
}

.avatar-image {
  width: 220px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.character-basic {
  flex: 1;
}

.character-name {
  margin: 0 0 10px;
  font-size: 28px;
  color: #303133;
}

.character-original-name {
  margin: 0 0 15px;
  font-size: 16px;
  color: #606266;
}

.character-cv {
  margin-bottom: 12px;
  font-size: 16px;
  color: #606266;
}

.cv-label {
  margin-right: 5px;
  font-weight: 500;
}

.cv-link {
  color: #409EFF;
  text-decoration: none;
}

.cv-link:hover {
  text-decoration: underline;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.character-infobox {
  margin-bottom: 30px;
  max-width: 700px;
}

.sub-item {
  margin-bottom: 5px;
}

.summary-content {
  line-height: 1.8;
  color: #606266;
  white-space: pre-line;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .character-header {
    flex-direction: column;
  }
  
  .character-avatar {
    margin-right: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .avatar-image {
    width: 180px;
  }
}
</style> 