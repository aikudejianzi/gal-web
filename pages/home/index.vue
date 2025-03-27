<template>
  <div id="home-page">
    <!-- 轮播图 -->
    <Carousel />

    <!-- 精选文章 -->
    <SelectedArticles />
  </div>
</template>

<script>
import Carousel from './components/Carousel.vue'
import SelectedArticles from './components/SelectedArticles.vue'

export default {
  name: 'HomeIndex',
  components: {
    Carousel,
    SelectedArticles
  },

  // TODO 添加SEO优化
  head() {
    return {
      title: '兰州大学GalGame同好会'
    }
  }
}
</script>

<style>
/* 清除原来样式，因为已经移动到各个组件中 */
</style>