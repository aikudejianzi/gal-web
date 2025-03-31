<template>
  <el-card class="article-content">
    <!-- 文章标题 -->
    <h1 class="article-title">{{article.title}}</h1>
    
    <!-- 文章元信息 -->
    <div class="article-meta">
      <div class="meta-row">
        <!-- 作者信息 -->
        <div class="info-item author-info">
          <el-avatar :size="40" :src="article.avatar" fit="cover" :shape="'square'"></el-avatar>
          <span class="author-name">{{article.author}}</span>
        </div>

        <div class="info-divider"></div>

        <div class="info-item">
          <i class="el-icon-date"></i>
          <span>{{formatDate(article.createTime)}}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-collection-tag"></i>
          <span>{{article.category}}</span>
        </div>

        <div class="info-item">
          <i class="el-icon-view"></i>
          <span>{{article.views}} 阅读</span>
        </div>

        <div class="info-item" v-if="userInfo && userInfo.id">
          <el-button 
            type="text" 
            @click="$emit('toggleFavorite')">
            <i :class="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            {{article.favorites}} 收藏
          </el-button>
        </div>
      </div>
    </div>

    <!-- 文章标签 -->
    <div class="article-tags" v-if="article.tags">
      <el-tag 
        v-for="tag in tagList" 
        :key="tag" 
        size="small" 
        effect="light"
        type="info"
        style="margin-right: 10px;">
        <i class="el-icon-price-tag"></i> {{tag}}
      </el-tag>
    </div>

    <!-- 文章内容 -->
    <div class="article-content-html" v-html="article.content"></div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ArticleContent',
  props: {
    article: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 处理标签字符串为数组
    tagList() {
      return this.article.tags ? this.article.tags.split(',').filter(tag => tag.trim()) : []
    }
  },
  methods: {
    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.article-content {
  width: 100%;
  min-height: 800px;
  line-height: 1.8;
  font-size: 16px;
  color: #34495e;
  padding: 20px 0;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #2c3e50;
  line-height: 1.4;
}

.article-meta {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info .el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 4px;
  flex-shrink: 0;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.info-divider {
  width: 1px;
  height: 20px;
  background-color: #dcdfe6;
}

.info-item i {
  margin-right: 6px;
  font-size: 16px;
}

.info-item .el-button {
  padding: 0;
  font-size: 14px;
  font-weight: normal;
  height: auto;
}

.article-tags {
  margin: 25px 0;
}

.article-tags .el-tag {
  margin: 5px 10px 5px 0;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
  border-radius: 14px;
  transition: all 0.3s;
}

.article-tags .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-tags .el-tag i {
  margin-right: 4px;
}

.is-favorited {
  color: #409EFF !important;
}

.is-favorited i {
  animation: favorite-animation 0.3s ease-in-out;
}

@keyframes favorite-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 文章内容中的图片样式 */
:deep(.article-content-html img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .article-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .meta-row {
    gap: 15px;
  }
  
  .info-item {
    font-size: 13px;
  }
  
  .info-item i {
    font-size: 14px;
  }
}
</style> 