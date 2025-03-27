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
    <el-menu-item index="/articles">文章</el-menu-item>
    <!-- 分隔作用, 如果没有这个, 菜单会挤在一起 -->
    <div class="flex-spacer"></div>
    
    <!-- 根据登录状态显示不同内容 -->
    <el-menu-item v-if="!userInfo" index="/login">
      <i class="el-icon-user"></i>
      <span>登录/注册</span>
    </el-menu-item>
    
    <!-- 已登录显示用户名和下拉菜单 -->
    <el-submenu v-else index="/user">
      <template slot="title">
        <el-avatar :size="30" :src="userInfo.avatar"></el-avatar>
        <span style="margin-left: 5px">{{ userInfo.username }}</span>
      </template>
      <el-menu-item index="/user">个人中心</el-menu-item>
      <el-menu-item @click="handleLogout">退出登录</el-menu-item>
    </el-submenu>
  </el-menu>
  
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      activeIndex: '/',
      userInfo: null
    }
  },
  mounted() {
    // 页面加载时检查登录状态
    this.checkLoginStatus()
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        if (userInfoStr) {
          this.userInfo = JSON.parse(userInfoStr)
        }
      } catch (error) {
        console.error('解析用户信息出错:', error)
      }
    },
    // 退出登录
    handleLogout() {
      // 清除本地存储中的用户信息
      localStorage.removeItem('userInfo')
      // 重置用户信息
      this.userInfo = null
      // 提示用户已退出
      this.$message.success('已退出登录')
      // 如果当前在用户中心页面，则跳转到首页
      if (this.$route.path.startsWith('/user')) {
        this.$router.push('/')
      }
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