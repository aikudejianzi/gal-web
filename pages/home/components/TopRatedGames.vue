<template>
  <div class="section featured-games">
    <div class="section-header">
      <h2>高分游戏</h2>
      <el-button type="text" @click="$router.push('/games')">查看更多</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" v-for="game in topRatedGames" :key="game.id" class="fade-in-element">
        <el-card class="game-card" shadow="hover" @click.native="$router.push(`/game/${game.id}`)">
          <div class="game-cover">
            <img :src="game.cover || '/default-game-cover.jpg'" :alt="`${game.nameCn || game.name} - 游戏封面`" :title="game.nameCn || game.name">
            <div class="game-rating" v-if="game.avgRating > 0">
              {{ formatRating(game.avgRating) }}
            </div>
            <div class="game-rating no-rating" v-else>
              暂无评分
            </div>
          </div>
          <div class="game-info">
            <h3 class="game-title">{{ game.nameCn || game.name }}</h3>
            <p class="game-meta">
              {{ formatYear(game.date) }} · {{ game.ratingCount > 0 ? game.ratingCount + '人评分' : '暂无评分' }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TopRatedGames',
  props: {
    topRatedGames: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.initFadeInAnimation();
  },
  methods: {
    formatRating(rating) {
      // 评分已经是百分制，只需四舍五入并添加"分"字
      return Math.round(rating) + '分';
    },
    formatYear(dateString) {
      if (!dateString) return '未知';
      // 提取年份
      return dateString.split('-')[0];
    },
    initFadeInAnimation() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      const elements = this.$el.querySelectorAll('.fade-in-element');
      elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`; // 添加延迟，实现依次渐入
        observer.observe(el);
      });
    }
  }
}
</script>

<style scoped>
.section {
  padding: 20px;
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -17px;
  left: 0;
  width: 60px;
  height: 2px;
  background-color: #ff9800;
}

.featured-games {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.game-card {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 25px;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 330px;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.game-cover {
  position: relative;
  height: 240px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-cover img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  background-color: #f5f5f5;
}

.game-rating {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: #FFC107;
  padding: 4px 8px;
  font-weight: bold;
  font-size: 14px;
}

.game-rating.no-rating {
  color: #ccc;
  font-weight: normal;
}

.game-info {
  padding: 12px;
  flex: 1;
}

.game-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.game-meta {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

@media screen and (max-width: 768px) {
  .section {
    padding: 15px;
  }
  
  .game-cover {
    height: 160px;
  }
}

.fade-in-element {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-element.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style> 