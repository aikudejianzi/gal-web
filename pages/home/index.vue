<template>
  <div id="home-page">
    <!-- 欢迎区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>欢迎来到兰大Gal同好会</h1>
        <div class="scroll-down" @click="scrollToContent">
          <i class="el-icon-arrow-down bounce"></i>
        </div>
      </div>
    </section>

    <!-- 精选文章 -->
    <div class="content-wrapper">
      <SelectedArticles ref="selectedArticlesRef" :selectedArticles="selectedArticles" class="content-section fade-in-element" />

      <!-- 热门游戏 -->
      <TopRatedGames :topRatedGames="topRatedGames" class="content-section fade-in-element" />
    </div>

  </div>
</template>

<script>
import SelectedArticles from './components/SelectedArticles.vue'
import TopRatedGames from './components/TopRatedGames.vue'
import { getSelectedArticlesAPI } from '@/api/article'
import { getTopRatedGamesAPI } from '@/api/game'
import dayjs from 'dayjs'

export default {
  name: 'HomeIndex',
  components: {
    SelectedArticles,
    TopRatedGames
  },
  async asyncData(){
    // 获取精选文章
    const articleRes = await getSelectedArticlesAPI();
    const articles = articleRes.data.map(item => {
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
      return item
    });
    
    // 获取热门游戏
    const gamesRes = await getTopRatedGamesAPI();
    const games = gamesRes.data || [];
    
    return {
      selectedArticles: articles,
      topRatedGames: games
    }
  },
  head() {
    return {
      title: '首页 - 兰州大学GalGame同好会',
      link: [
        { rel: 'preload', href: '/bg1.webp', as: 'image' }
      ]
    }
  },
  mounted() {
    // 初始化渐入效果
    this.initFadeInAnimation();
    
    // 预加载背景图片
    this.preloadBackgroundImage();
  },
  methods: {
    // 滚动到内容区域
    scrollToContent() {
      const element = this.$refs.selectedArticlesRef?.$el;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    // 初始化渐入动画观察器
    initFadeInAnimation() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, {
        threshold: 0.1
      });

      const elements = this.$el.querySelectorAll('.fade-in-element');
      elements.forEach(el => observer.observe(el));
    },
    // 预加载背景图片
    preloadBackgroundImage() {
      const img = new Image();
      img.src = '/bg1.webp';
    }
  }
}
</script>

<style scoped>
.hero-section {
  height: 100vh;
  background-image: url('/bg1.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.hero-content h1 {
  font-size: 3rem;
  margin-top: 40vh;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.scroll-down {
  position: absolute;
  bottom: 33rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.scroll-down:hover {
  opacity: 0.8;
}

.scroll-down i {
  font-size: 2rem;
  color: white;
}

/* 箭头弹跳动画 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.bounce {
  animation: bounce 2s infinite;
}

.content-wrapper {
  padding-top: 70px;
  padding-bottom: 80px;
  background-color: #fff;
}

.content-section {
  padding: 70px 20px;
}

/* 渐入动画 */
.fade-in-element {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-element.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media screen and (max-width: 992px) {
  .content-wrapper {
    padding-top: 60px;
    padding-bottom: 70px;
  }
  
  .content-section {
    padding: 50px 15px;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
}

@media screen and (max-width: 768px) {
  .content-section {
    padding: 40px 15px;
  }
  
  .content-wrapper {
    padding-top: 50px;
    padding-bottom: 60px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
    margin-top: 35vh;
  }
  
  .scroll-down {
    bottom: 5rem;
  }
}

@media screen and (max-width: 576px) {
  .content-section {
    padding: 30px 10px;
  }
  
  .content-wrapper {
    padding-top: 40px;
    padding-bottom: 50px;
  }
  
  .hero-content h1 {
    font-size: 1.8rem;
    margin-top: 30vh;
  }
}
</style>