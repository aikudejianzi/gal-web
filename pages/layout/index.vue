<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <NavBar />
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 二级路由出口 -->
      <nuxt-child/>
    </div>

    <!-- 底部页脚 -->
    <Footer />
    
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

export default {
    name: 'LayoutIndex',
    components: {
        NavBar,
        Footer
    }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 60px; /* 导航栏高度 */
  flex: 1;
  padding: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .main-content {
    padding: 15px 10px;
  }
}
</style>