<template>
  <div class="game-detail-container">
    <div v-loading="loading" element-loading-text="加载中...">
      <!-- 游戏不存在时显示 -->
      <el-empty v-if="!loading && !gameInfo" description="游戏不存在或已被删除"></el-empty>
      
      <!-- 游戏信息区域 - 两列布局 -->
      <el-row :gutter="30" v-if="gameInfo">
        <!-- 左侧主要内容 -->
        <el-col :xs="24" :sm="24" :md="17" :lg="17" :xl="17">
          <!-- 游戏基本信息 -->
          <game-basic-info 
            :gameInfo="gameInfo" 
            :isLoggedIn="isLoggedIn" 
            @refresh="fetchGameDetail"
          ></game-basic-info>
          
          <!-- 相关角色 -->
          <game-characters 
            :gameId="gameInfo.id"
          ></game-characters>
          
          <!-- 相关制作人员 -->
          <game-persons 
            :gameId="gameInfo.id"
          ></game-persons>
          
          <!-- 玩家短评 -->
          <game-short-comments
            :gameId="gameInfo.id"
            :userRating="gameInfo.userRating || 0"
          ></game-short-comments>
        </el-col>
        
        <!-- 右侧侧边栏 -->
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="sidebar-container">
          <!-- 评分分布图表 -->
          <game-rating-chart
            v-if="gameInfo.id"
            :gameId="gameInfo.id"
            class="sidebar-card"
          ></game-rating-chart>
          
          <!-- 游戏信息框 -->
          <game-info-box
            v-if="gameInfo.infobox"
            :infobox="gameInfo.infobox"
          ></game-info-box>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getGameDetailAPI } from '@/api/game'
import { getCurrentUserAPI } from '@/api/user'
import GameBasicInfo from './components/GameBasicInfo.vue'
import GameInfoBox from './components/GameInfoBox.vue'
import GameCharacters from './components/GameCharacters.vue'
import GamePersons from './components/GamePersons.vue'
import GameShortComments from './components/GameShortComments.vue'
import GameRatingChart from './components/GameRatingChart.vue'

export default {
  name: 'GameDetail',
  components: {
    GameBasicInfo,
    GameInfoBox,
    GameCharacters,
    GamePersons,
    GameShortComments,
    GameRatingChart
  },
  data() {
    return {
      gameInfo: null,
      loading: true,
      userId: null,
      isLoggedIn: false
    }
  },
  methods: {
    // 获取当前登录用户
    async fetchCurrentUser() {
      try {
        const res = await getCurrentUserAPI();
        if (res && res.code === 1 && res.data) {
          // 确保将用户ID作为字符串或数字处理，而不是假设它是特定类型
          this.userId = res.data.id;
          this.isLoggedIn = true;
        }
      } catch (error) {
        console.error('获取当前用户失败:', error);
        this.userId = null;
        this.isLoggedIn = false;
      }
    },
    
    // 获取游戏详情
    async fetchGameDetail() {
      const gameId = parseInt(this.$route.params.id);
      if (!gameId) {
        this.$message.error('游戏ID无效');
        this.loading = false;
        return;
      }
      
      try {
        this.loading = true;
        const res = await getGameDetailAPI(gameId, this.userId);
        
        if (res && res.code === 1) {
          this.gameInfo = res.data;
          
          // 设置页面标题
          this.$nuxt.$emit('update-meta', {
            title: `${this.gameInfo.nameCn || this.gameInfo.name} - GalGame同好会`
          });
        } else {
          this.$message.error(res.msg || '获取游戏详情失败');
          this.gameInfo = null;
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error);
        this.$message.error('获取游戏详情失败');
        this.gameInfo = null;
      } finally {
        this.loading = false;
      }
    }
  },
  // 服务端渲染数据获取
  async asyncData({ params }) {
    try {
      const gameId = parseInt(params.id);
      
      // 服务端渲染时无法获取用户信息，不传userId
      const res = await getGameDetailAPI(gameId);
      
      const gameInfo = res && res.code === 1 ? res.data : null;
      
      return {
        gameInfo,
        loading: false
      };
    } catch (error) {
      console.error('服务端获取游戏详情失败:', error);
      return {
        gameInfo: null,
        loading: false
      };
    }
  },
  // 客户端挂载
  async mounted() {
    if (process.client) {
      // 获取当前用户信息
      await this.fetchCurrentUser();
      
      // 如果服务端未获取到数据，则在客户端重新获取
      if (!this.gameInfo) {
        await this.fetchGameDetail();
      } else if (this.userId) {
        // 如果已登录，重新获取以获取用户评分信息
        await this.fetchGameDetail();
      }
    }
  },
  head() {
    // 确保游戏数据存在
    if (!this.gameInfo) {
      return {}
    }

    return {
      title: `${this.gameInfo.nameCn || this.gameInfo.name} - GalGame同好会`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.gameInfo.description || this.gameInfo.summary
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: {
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": this.gameInfo.name,
            "image": this.gameInfo.coverImage ? `https://aiwujiegal.top${this.gameInfo.coverImage}` : 'https://aiwujiegal.top/default-game-cover.png',
            "description": this.gameInfo.description || this.gameInfo.summary,
            "genre": this.gameInfo.genres || ["视觉小说", "Galgame"],
            "publisher": {
              "@type": "Organization",
              "name": this.gameInfo.publisher
            },
            "releaseDate": this.gameInfo.releaseDate,
            "url": `https://aiwujiegal.top/game/${this.gameInfo.id}`,
            "aggregateRating": this.gameInfo.rating ? {
              "@type": "AggregateRating",
              "ratingValue": this.gameInfo.rating,
              "ratingCount": this.gameInfo.ratingCount || 0
            } : undefined
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
.game-detail-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.sidebar-container {
  padding: 0 10px;
}

.sidebar-card {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 响应式布局调整 */
@media (max-width: 992px) {
  .sidebar-container {
    margin-top: 30px;
  }
}

@media (max-width: 768px) {
  .game-detail-container {
    padding: 0 10px;
  }
}
</style> 