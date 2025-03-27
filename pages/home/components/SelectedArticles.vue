<template>
  <div class="section featured-articles">
    <!-- 精选文章标题 -->
    <div class="section-header">
      <h2>精选文章</h2>
      //
      <el-button type="text" @click="$router.push('/article')">查看更多</el-button>
    </div>

    <!-- 精选文章列表 --> 
    <el-row :gutter="20">
      <el-col :span="8" v-for="(article, index) in featuredArticles" :key="index">
        <!-- 文章卡片 -->
        <el-card class="article-card" shadow="hover" @click.native="$router.push(`/article/${id}`)">
          <!-- 文章图片 --> 
          <div class="article-image" 
               :style="{backgroundImage: article.imageLoaded ? 'url(' + article.cover + ')' : ''}"
               :class="{'image-loading': !article.imageLoaded}">
            <img :src="article.cover" style="display: none" @load="handleArticleImageLoad(index)">
          </div>
          <!-- 文章内容 -->
          <div class="article-content">
            <!-- 文章标题 -->
            <h3>{{ article.title }}</h3>
            <!-- 文章作者和日期 -->
            <p class="article-meta">
              <span><i class="el-icon-user"></i>{{ article.author }}</span>
              <span><i class="el-icon-date"></i>{{ article.date }}</span>
              <span><i class="el-icon-view"></i>{{ article.views || 0 }}次浏览</span>
            </p>
            <!-- 文章摘要 -->
            <div v-html="article.excerpt"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    name: 'SelectedArticles',
    data() {
        return {
            // 精选文章列表（假数据）
            featuredArticles: [
                {
                    id: 1,
                    title: '《ClannadクラナドCLANNAD》：一部让你哭着笑，笑着哭的感人作品',
                    author: '小明',
                    date: '2023-03-15',
                    views: 2541,
                    cover: '/banner1.png',
                    excerpt: 'CLANNAD是由Key社制作的一部催泪神作，它的每一个画面、每一段剧情都蕴含着深刻的人生哲理。游戏中的台词"人生中有些重要的，无可替代的东西，只有在失去后才能够了解"将会引发你的深思。',
                    imageLoaded: false
                },
                {
                    id: 2,
                    title: '《命运石之门》：穿越时空的科幻冒险',
                    author: '小红',
                    date: '2023-04-02',
                    views: 1856,
                    cover: '/banner1.png',
                    excerpt: '《命运石之门》是一部将科学与人文完美结合的作品，以独特的视角探讨了时间旅行的可能性和伦理问题。主角冈部伦太郎的内心挣扎和成长过程让人印象深刻。',
                    imageLoaded: false
                },
                {
                    id: 3,
                    title: '《白色相簿2》：青春的痛与美',
                    author: '小李',
                    date: '2023-05-21',
                    views: 1342,
                    cover: '/banner1.png',
                    excerpt: '《白色相簿2》以其真实的人物刻画和复杂的情感纠葛，向我们展示了青春期爱情的美好与残酷。在这个故事中，没有真正的坏人，只有各自追求幸福的年轻人。',
                    imageLoaded: false
                }
            ]
        }
    },
    methods: {
        // 处理文章图片加载完成
        handleArticleImageLoad(index) {
            // 创建新数组，替换原来的数组元素
            const updatedArticles = [...this.featuredArticles];
            updatedArticles[index] = {
                ...updatedArticles[index],
                imageLoaded: true
            };
            this.featuredArticles = updatedArticles;
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
  gap: 15px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.article-meta i {
  font-size: 16px;
  color: #3498db;
}

div[v-html] {
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

.image-loading {
  background-color: #f5f7fa;
  position: relative;
}

.image-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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