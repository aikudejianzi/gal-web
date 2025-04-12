<template>
  <div class="game-basic-info">
    <!-- 游戏基本信息头部 -->
    <div class="game-header">
      <!-- 游戏封面 -->
      <div class="game-cover">
        <img :src="getGameCover(gameInfo.images)" :alt="gameInfo.name" class="cover-image">
      </div>
      
      <!-- 游戏信息 -->
      <div class="game-info">
        <h1 class="game-title">{{ gameInfo.nameCn || gameInfo.name }}</h1>
        <p class="game-original-title" v-if="gameInfo.nameCn && gameInfo.name !== gameInfo.nameCn">{{ gameInfo.name }}</p>
        
        <!-- 评分 -->
        <div class="game-rating">
          <div class="rating-score" v-if="gameInfo.ratingCount > 0">
            <span class="rating-label">平均分：</span>
            <span class="score">{{ Math.round(gameInfo.avgRating) }}</span>
            <span class="max-score">/100</span>
            <span class="count">({{ gameInfo.ratingCount }}人评分)</span>
          </div>
          <div class="rating-score" v-else>
            <span class="rating-label">平均分：</span>
            <span class="no-rating">暂无评分</span>
          </div>
          
          <!-- 用户评分 -->
          <div class="user-rating">
            <div class="user-rating-header">
              <span class="rating-label">我的评分：</span>
              <span class="user-score" v-if="currentRating > 0">{{ currentRating }}</span>
            </div>
            <div class="rating-slider-container">
              <el-slider
                v-model="currentRating"
                :step="1"
                :min="0"
                :max="100"
                :format-tooltip="value => `${value}分`"
                @change="handleRatingChange"
                :disabled="!isLoggedIn"
              ></el-slider>
              <div class="input-number-container">
                <el-input-number 
                  v-model="currentRating" 
                  :min="0" 
                  :max="100"
                  size="medium"
                  :disabled="!isLoggedIn"
                  @change="handleRatingChange"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 发行日期 -->
        <div class="game-date" v-if="gameInfo.date">
          <span class="date-label">发行日期：</span>
          <span>{{ formatDate(gameInfo.date) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 游戏简介 -->
    <div class="game-summary" v-if="gameInfo.summary">
      <h3 class="section-title">游戏简介</h3>
      <div class="summary-content" v-html="gameInfo.summary"></div>
    </div>
  </div>
</template>

<script>
import { rateGameAPI } from '@/api/game'
import { getCurrentUserAPI } from '@/api/user'

export default {
  name: 'GameBasicInfo',
  props: {
    gameInfo: {
      type: Object,
      required: true
    },
    // 用户是否已登录
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRating: 0,
      isRating: false
    }
  },
  computed: {
  },
  watch: {
    // 当游戏信息变化时，更新当前评分
    'gameInfo.userRating'(newVal) {
      if (newVal) {
        this.currentRating = newVal;
      } else {
        this.currentRating = 0; // 默认最小评分为0
      }
    }
  },
  created() {
    // 初始化用户评分
    if (this.gameInfo.userRating) {
      this.currentRating = this.gameInfo.userRating;
    } else {
      this.currentRating = 0; // 默认最小评分为0
    }
  },
  methods: {
    // 获取游戏封面
    getGameCover(images) {
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
    
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN');
      } catch (err) {
        return dateStr;
      }
    },
    
    // 用户评分变化
    async handleRatingChange(rating) {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录后再评分');
        // 重置为原来的评分
        this.currentRating = this.gameInfo.userRating || 0;
        return;
      }
      
      if (this.isRating) return;
      
      try {
        this.isRating = true;
        // 从当前登录用户信息中获取用户ID
        const userInfoRes = await getCurrentUserAPI();
        if (!userInfoRes || userInfoRes.code !== 1 || !userInfoRes.data) {
          throw new Error('获取用户信息失败');
        }
        
        const userId = userInfoRes.data.id;
        
        const res = await rateGameAPI({
          gameId: this.gameInfo.id,
          userId: userId, // 确保传递正确的用户ID
          rating: rating
        });
        
        if (res.code === 1) {
          this.$message.success('评分成功');
          // 刷新游戏信息
          this.$emit('refresh');
          
          // 如果是首次评分或者改变了评分，提示用户是否要发表短评
          if (this.gameInfo.userRating !== rating) {
            this.$confirm('评分成功！要分享您对这款游戏的看法吗？', '发表短评', {
              confirmButtonText: '去评论',
              cancelButtonText: '暂不评论',
              type: 'info',
              center: true
            }).then(() => {
              // 跳转到评论区
              const commentSection = document.querySelector('.game-short-comments');
              if (commentSection) {
                commentSection.scrollIntoView({ behavior: 'smooth' });
                // 聚焦到评论输入框
                setTimeout(() => {
                  const textarea = document.querySelector('.add-comment-section textarea');
                  if (textarea) {
                    textarea.focus();
                  }
                }, 500);
              }
            }).catch(() => {
              // 用户取消，不做任何操作
            });
          }
        } else {
          // 显示具体错误信息
          this.$message.error(res.msg || '评分失败');
          // 重置为原来的评分
          this.currentRating = this.gameInfo.userRating || 0;
        }
      } catch (error) {
        console.error('评分失败:', error);
        this.$message.error('评分失败：' + (error.message || '未知错误'));
        // 重置为原来的评分
        this.currentRating = this.gameInfo.userRating || 0;
      } finally {
        this.isRating = false;
      }
    }
  }
}
</script>

<style scoped>
.game-basic-info {
  margin-bottom: 30px;
}

.game-header {
  display: flex;
  margin-bottom: 30px;
}

.game-cover {
  flex: 0 0 240px;
  margin-right: 30px;
}

.cover-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-info {
  flex: 1;
}

.game-title {
  margin: 0 0 10px;
  font-size: 28px;
  color: #303133;
}

.game-original-title {
  margin: 0 0 15px;
  font-size: 16px;
  color: #606266;
}

.game-rating {
  margin: 20px 0;
}

.rating-score {
  margin-bottom: 15px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.rating-score .rating-label {
  margin-right: 5px;
  color: #606266;
}

.rating-score .score {
  font-size: 24px;
  color: #FF9900;
  font-weight: bold;
}

.rating-score .no-rating {
  color: #909399;
  font-style: italic;
}

.rating-score .max-score {
  margin: 0 5px;
  color: #909399;
  font-size: 14px;
}

.rating-score .count {
  margin-left: 5px;
  color: #909399;
  font-size: 14px;
}

.user-rating {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}

.user-rating-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-score {
  font-size: 20px;
  color: #FF9900;
  font-weight: bold;
  margin-left: 5px;
}

.rating-label {
  color: #606266;
}

.rating-slider-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 自定义滑块控件样式 */
.rating-slider-container >>> .el-slider {
  width: 100%;
  margin-bottom: 15px;
}

.input-number-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.rating-slider-container >>> .el-input-number {
  width: 150px;
}

/* 自定义数字输入框样式 */
.rating-slider-container >>> .el-input-number .el-input__inner {
  font-size: 18px;
  color: #FF9900;
  font-weight: bold;
  text-align: center;
  height: 40px;
}

.rating-slider-container >>> .el-input-number__decrease,
.rating-slider-container >>> .el-input-number__increase {
  width: 30px;
  height: 40px;
  line-height: 40px;
}

.rating-slider-container >>> .el-slider__button {
  border-color: #FF9900;
}

.rating-slider-container >>> .el-slider__bar {
  background-color: #FF9900;
}

.game-date {
  margin-top: 15px;
  color: #606266;
}

.date-label {
  font-weight: 500;
  margin-right: 5px;
}

.section-title {
  font-size: 20px;
  color: #303133;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.summary-content {
  line-height: 1.8;
  color: #606266;
  white-space: pre-line;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
  }
  
  .game-cover {
    margin-right: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .cover-image {
    width: 200px;
  }
}
</style> 