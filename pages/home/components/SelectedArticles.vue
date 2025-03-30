<template>
  <div class="section featured-articles">
    <!-- 精选文章标题 -->
    <div class="section-header">
      <h2>精选文章</h2>
      <el-button type="text" @click="$router.push('/articles')">查看更多</el-button>
    </div>

    <!-- 精选文章列表 --> 
    <el-row :gutter="20">
      <el-col :span="8" v-for="(article, index) in selectedArticles" :key="index">
        <!-- 文章卡片 -->
        <el-card class="article-card" shadow="hover" @click.native="$router.push(`/article/${article.id}`)">
          <!-- 文章图片 --> 
          <div class="article-image" 
               :style="{backgroundImage: `url(${article.cover})`}">
          </div>
          <!-- 文章内容 -->
          <div class="article-content">
            <!-- 文章标题 -->
            <h3>{{ article.title }}</h3>
            <!-- 文章作者和日期 -->
            <div class="article-meta">
              <span class="meta-item"><i class="el-icon-user"></i>{{ article.username }}</span>
              <span class="meta-item"><i class="el-icon-date"></i>{{ article.createTime }}</span>
              <span class="meta-item"><i class="el-icon-view"></i>{{ article.views || 0 }}次浏览</span>
            </div>
            <!-- 文章摘要 -->
            <div class="article-excerpt">{{ article.excerpt }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    name: 'SelectedArticles',
    props: {
      selectedArticles: {
        type: Array,
        required: true
      }
    },
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
  background-color: #3498db;
}

.featured-articles {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 25px;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.article-image {
  height: 260px;
  background-size: cover;
  background-position: center;
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.article-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  transition: all 0.3s ease;
}

.article-content {
  padding: 20px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-content h3 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #2c3e50;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}

.article-meta {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 6px;
}

.meta-item {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.article-meta i {
  font-size: 16px;
  color: #3498db;
  margin-right: 4px;
}

.article-excerpt {
  font-size: 15px;
  color: #495057;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* 图片渐入效果 */
.article-image {
  transition: background-image 0.3s ease-in-out;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .section {
    padding: 15px;
  }
  
  .article-image {
    height: 160px;
  }
}
</style>