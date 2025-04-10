<template>
  <div class="person-detail-container">
    <!-- 人员基本信息 -->
    <div class="person-header">
      <!-- 左侧封面 -->
      <div class="person-avatar">
        <img 
          :src="getPersonImage(person.images)" 
          class="avatar-image"
          @error="handleImageError"
          v-if="!imageLoadError"
        >
        <div 
          v-if="imageLoadError" 
          class="avatar-fallback"
        >
          {{ getNameInitial(person.nameCn || person.name) }}
        </div>
      </div>
      
      <!-- 右侧基本信息 -->
      <div class="person-info">
        <h1 class="person-name">
          {{ person.nameCn || person.name }}
          <span class="original-name" v-if="person.nameCn && person.name !== person.nameCn">{{ person.name }}</span>
        </h1>
        
        <div class="person-job">
          <el-tag v-for="(job, index) in getPersonJobs(person.career)" :key="index" size="medium" effect="plain" class="job-tag">
            {{ job }}
          </el-tag>
        </div>
        
        <!-- 基本信息表 -->
        <div class="info-box" v-if="parsedInfobox.length > 0">
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="(item, index) in parsedInfobox" :key="index" :label="item.key">
              <!-- 普通文本值 -->
              <template v-if="typeof item.value === 'string'">
                <span v-if="isUrl(item.value)">
                  <a :href="item.value" target="_blank">{{ item.value }}</a>
                </span>
                <span v-else>{{ item.value }}</span>
              </template>
              
              <!-- 对象数组值 -->
              <template v-else-if="Array.isArray(item.value)">
                <div v-for="(subItem, subIndex) in item.value" :key="subIndex" class="sub-item">
                  <template v-if="typeof subItem === 'string'">{{ subItem }}</template>
                  <template v-else>
                    <template v-if="subItem.k">
                      <strong>{{ subItem.k }}：</strong>{{ subItem.v }}
                    </template>
                    <template v-else>
                      {{ subItem.v }}
                    </template>
                  </template>
                </div>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
    
    <!-- 人员简介 -->
    <div class="person-summary" v-if="person.summary">
      <h2 class="section-title">简介</h2>
      <div class="summary-content" v-html="person.summary"></div>
    </div>
    
    <!-- 相关作品 -->
    <div class="related-works" v-if="relatedGames.length > 0">
      <h2 class="section-title">相关作品</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="game in relatedGames" :key="game.id" class="game-item">
          <el-card shadow="hover" @click.native="goToGame(game.id)">
            <div class="game-card-inner">
              <img 
                :src="getGameImage(game.images)" 
                class="game-cover"
                @error="handleGameImageError($event, game)"
                v-if="!game.imageLoadError"
              >
              <div 
                v-if="game.imageLoadError" 
                class="game-cover-fallback"
              >
                {{ getNameInitial(game.nameCn || game.name) }}
              </div>
              <div class="game-name">{{ game.nameCn || game.name }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getPersonDetailAPI, getPersonGamesAPI } from '@/api/person'

export default {
  name: 'PersonDetail',
  data() {
    return {
      personId: null,
      person: {
        id: null,
        name: '',
        nameCn: '',
        images: null,
        career: '',
        summary: '',
        infobox: ''
      },
      relatedGames: [],
      loading: false,
      imageLoadError: false
    }
  },
  computed: {
    parsedInfobox() {
      if (!this.person.infobox) return [];
      try {
        return JSON.parse(this.person.infobox);
      } catch (e) {
        console.error('解析infobox失败:', e);
        return [];
      }
    }
  },
  methods: {
    // 获取制作人员图片
    getPersonImage(images) {
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
      return '/images/default-avatar.jpg';
    },
    
    // 获取游戏图片
    getGameImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images);
          // 优先使用small尺寸
          return imagesObj.small || imagesObj.grid || imagesObj.medium || imagesObj.common || imagesObj.large;
        }
      } catch (error) {
        console.error('解析图片JSON失败:', error);
      }
      // 默认图片
      return '/images/default-game.jpg';
    },
    
    // 获取制作人员职业
    getPersonJobs(career) {
      if (!career) return [];
      return career.split(',').map(job => job.trim());
    },
    
    // 判断是否是URL
    isUrl(value) {
      return typeof value === 'string' && 
        (value.startsWith('http://') || value.startsWith('https://'));
    },
    
    // 跳转到游戏详情页
    goToGame(gameId) {
      this.$router.push(`/game/${gameId}`);
    },
    
    // 获取制作人员详情
    async fetchPersonDetail() {
      try {
        this.loading = true;
        const res = await getPersonDetailAPI(this.personId);
        this.person = res.data || {};
      } catch (error) {
        console.error('获取制作人员详情失败:', error);
        this.$message.error('获取制作人员详情失败');
      } finally {
        this.loading = false;
      }
    },
    
    // 获取相关游戏
    async fetchRelatedGames() {
      try {
        const res = await getPersonGamesAPI(this.personId);
        this.relatedGames = res.data || [];
      } catch (error) {
        console.error('获取相关游戏失败:', error);
      }
    },
    
    // 处理图片加载错误
    handleImageError() {
      this.imageLoadError = true;
    },
    
    // 获取姓名首字母
    getNameInitial(name) {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
    },
    
    // 处理游戏图片加载错误
    handleGameImageError(event, game) {
      event.target.src = '/images/default-game.jpg';
      game.imageLoadError = true;
    }
  },
  // 服务端获取数据
  async asyncData({ params }) {
    const personId = params.id;
    try {
      // 获取制作人员详情
      const detailRes = await getPersonDetailAPI(personId);
      const person = detailRes.data || {};
      
      // 获取相关游戏
      const gamesRes = await getPersonGamesAPI(personId);
      const relatedGames = gamesRes.data || [];
      
      return { personId, person, relatedGames };
    } catch (error) {
      console.error('获取制作人员数据失败:', error);
      return { 
        personId,
        person: {
          id: personId,
          name: '',
          nameCn: '',
          images: null,
          career: '',
          summary: '',
          infobox: ''
        },
        relatedGames: []
      };
    }
  },
  // 客户端挂载后更新数据
  mounted() {
    if (process.client && !this.person.id) {
      this.personId = this.$route.params.id;
      this.fetchPersonDetail();
      this.fetchRelatedGames();
    }
  },
  head() {
    return {
      title: `${this.person.nameCn || this.person.name || '制作人员'} - GalGame同好会`
    }
  }
}
</script>

<style scoped>
.person-detail-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.person-header {
  display: flex;
  margin-bottom: 30px;
}

.person-avatar {
  flex: 0 0 200px;
  margin-right: 30px;
}

.avatar-image {
  width: 200px;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-fallback {
  width: 200px;
  height: 250px;
  background-color: #909399;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.person-info {
  flex: 1;
}

.person-name {
  margin: 0 0 15px;
  font-size: 24px;
  color: #303133;
}

.original-name {
  font-size: 16px;
  color: #909399;
  margin-left: 10px;
  font-weight: normal;
}

.person-job {
  margin-bottom: 20px;
}

.job-tag {
  margin-right: 10px;
  margin-bottom: 8px;
}

.info-box {
  margin-top: 20px;
  max-width: 700px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  border-bottom: 2px solid #ebeef5;
  padding-bottom: 10px;
  margin: 30px 0 15px;
}

.person-summary {
  margin-bottom: 30px;
}

.summary-content {
  line-height: 1.8;
  color: #606266;
}

.related-works {
  margin-bottom: 40px;
}

.game-item {
  margin-bottom: 20px;
}

.game-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.game-name {
  font-size: 14px;
  color: #303133;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.sub-item {
  margin-bottom: 5px;
}

.game-cover-fallback {
  width: 100%;
  height: 180px;
  background-color: #909399;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .person-header {
    flex-direction: column;
  }
  
  .person-avatar {
    margin-right: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .avatar-image {
    width: 150px;
    height: 200px;
  }
}
</style> 