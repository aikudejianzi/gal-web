<template>
  <div id="home-page">
    <!-- 轮播图 -->
    <Carousel />

    <!-- 精选文章 -->
    <SelectedArticles :selectedArticles="selectedArticles" />

  </div>
</template>

<script>
import Carousel from './components/Carousel.vue'
import SelectedArticles from './components/SelectedArticles.vue'
import { getSelectedArticlesAPI } from '@/api/article'
import dayjs from 'dayjs'
export default {
  name: 'HomeIndex',
  components: {
    Carousel,
    SelectedArticles
  },
  async asyncData(){
    const res = await getSelectedArticlesAPI();
    const data = res.data.map(item => {
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
      return item
    })
    return {
      selectedArticles: data
    }
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