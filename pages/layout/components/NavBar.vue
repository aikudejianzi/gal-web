<template>
  <el-menu 
    class="navbar" 
    mode="horizontal" 
    background-color="#f5f7fa" 
    text-color="#606266" 
    active-text-color="#409EFF"
    :router="true"
  >
    <!-- 兰州大学GalGame同好会   -->
    <div class="logo-container">
      <h1 class="logo">兰州大学GalGame同好会</h1>
    </div>
    <!-- 主页 -->
    <el-menu-item index="/">主页</el-menu-item>
    <!-- 文章 -->
    <el-menu-item index="/article">文章</el-menu-item>
    <!-- 分隔作用, 如果没有这个, 菜单会挤在一起 -->
    <div class="flex-spacer"></div>
    <!-- 登录/注册 -->
    <el-menu-item index="/user">
      <i class="el-icon-user"></i>
      <span>登录/注册</span>
    </el-menu-item>
  </el-menu>
  
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      activeIndex: '/'
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  border-bottom: 1px solid #ebeef5;
}

.logo-container {
  padding: 0 20px;
  margin-right: 20px;
}

.logo {
  margin: 0;
  font-size: 18px;
  color: #409EFF;
  line-height: 60px;
}

.flex-spacer {
  flex-grow: 1;
}

.search-input {
  width: 200px;
}
</style>