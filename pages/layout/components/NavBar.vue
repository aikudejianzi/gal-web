<template>
  <div>
    <!-- 桌面端导航栏 -->
    <el-menu 
      v-if="!isMobile"
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
      <!-- 游戏 -->
      <el-menu-item index="/games">游戏</el-menu-item>
      <!-- 制作人员/公司 -->
      <el-menu-item index="/persons">制作人员/公司</el-menu-item>
      <!-- 活动 -->
      <el-menu-item index="/activities">活动</el-menu-item>

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
          <div class="avatar-container">
            <img :src="userInfo.avatar" class="nav-avatar" alt="用户头像">
          </div>
          <span style="margin-left: 5px">{{ userInfo.username }}</span>
        </template>
        <el-menu-item index="/user">个人中心</el-menu-item>
        <el-menu-item v-if="userInfo && userInfo.role === 0" index="/admin">管理后台</el-menu-item>
        <el-menu-item @click="handleLogout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
    
    <!-- 移动端导航栏 -->
    <div v-else class="mobile-navbar">
      <div class="mobile-header">
        <div class="mobile-logo">兰大Gal同好会</div>
        <div class="mobile-burger" @click="toggleMobileMenu">
          <i :class="mobileMenuOpen ? 'el-icon-close' : 'el-icon-s-fold'"></i>
        </div>
      </div>
      
      <!-- 移动端下拉菜单 -->
      <transition name="slide-fade">
        <div v-show="mobileMenuOpen" class="mobile-menu">
          <nuxt-link to="/" class="mobile-menu-item" @click.native="closeMobileMenu">主页</nuxt-link>
          <nuxt-link to="/articles" class="mobile-menu-item" @click.native="closeMobileMenu">文章</nuxt-link>
          <nuxt-link to="/games" class="mobile-menu-item" @click.native="closeMobileMenu">游戏</nuxt-link>
          <nuxt-link to="/persons" class="mobile-menu-item" @click.native="closeMobileMenu">制作人员/公司</nuxt-link>
          <nuxt-link to="/activities" class="mobile-menu-item" @click.native="closeMobileMenu">活动</nuxt-link>
          
          <template v-if="!userInfo">
            <nuxt-link to="/login" class="mobile-menu-item" @click.native="closeMobileMenu">
              <i class="el-icon-user"></i> 登录/注册
            </nuxt-link>
          </template>
          <template v-else>
            <div class="mobile-user-info">
              <img :src="userInfo.avatar" class="mobile-avatar" alt="用户头像">
              <span>{{ userInfo.username }}</span>
            </div>
            <nuxt-link to="/user" class="mobile-menu-item" @click.native="closeMobileMenu">个人中心</nuxt-link>
            <nuxt-link v-if="userInfo && userInfo.role === 0" to="/admin" class="mobile-menu-item" @click.native="closeMobileMenu">管理后台</nuxt-link>
            <div class="mobile-menu-item" @click="handleMobileLogout">退出登录</div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { getCurrentUserAPI, logoutAPI } from '@/api/user'

export default {
  name: 'NavBar',
  data() {
    return {
      activeIndex: '/',
      userInfo: null,
      isMobile: false,
      mobileMenuOpen: false
    }
  },
  created() {
    // 如果不是服务端渲染，则发送请求获取用户信息
    if (process.client) {
      this.fetchUserInfo()
      
      // 检测屏幕尺寸
      this.checkScreenSize()
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.checkScreenSize)
      
      // 监听全局事件，当用户信息更新时刷新导航栏
      this.$nuxt.$on('user-info-updated', this.fetchUserInfo)
    }
  },
  // 组件销毁时移除事件监听
  beforeDestroy() {
    if (process.client) {
      this.$nuxt.$off('user-info-updated', this.fetchUserInfo)
      window.removeEventListener('resize', this.checkScreenSize)
    }
  },
  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await getCurrentUserAPI()
        this.userInfo = res.data
      } catch (error) {
        // 请求失败说明用户未登录或登录已过期
        this.userInfo = null
      }
    },
    
    // 退出登录
    async handleLogout() {
      try {
        // 发送退出登录请求
        await logoutAPI()
        
        // 清空当前用户信息
        this.userInfo = null
        
        // 提示用户已退出
        this.$message.success('已退出登录')
        
        // 如果当前在用户中心页面，则跳转到首页
        if (this.$route.path.startsWith('/user')) {
          this.$router.push('/')
        }
      } catch (error) {
        this.$message.error('退出登录失败')
      }
    },
    
    // 移动端退出登录
    async handleMobileLogout() {
      await this.handleLogout()
      this.closeMobileMenu()
    },
    
    // 检测屏幕尺寸
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768
    },
    
    // 切换移动端菜单
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    
    // 关闭移动端菜单
    closeMobileMenu() {
      this.mobileMenuOpen = false
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

.avatar-container {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.nav-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 移动端导航样式 */
.mobile-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999; /* 提高z-index确保在所有内容之上 */
  background-color: #f5f7fa;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 15px;
}

.mobile-logo {
  font-weight: bold;
  font-size: 18px;
  color: #409EFF;
}

.mobile-burger {
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  z-index: 10000; /* 确保汉堡按钮始终可点击 */
}

.mobile-menu {
  position: fixed; /* 使用fixed定位而非absolute定位 */
  top: 60px; /* 与顶部导航栏高度一致 */
  left: 0;
  right: 0;
  bottom: 0; /* 扩展到页面底部 */
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 9998; /* 确保菜单显示在内容上方 */
  overflow-y: auto; /* 允许滚动查看所有菜单项 */
}

.mobile-menu-item {
  display: block;
  padding: 15px;
  color: #606266;
  text-decoration: none;
  border-bottom: 1px solid #ebeef5;
}

.mobile-menu-item:active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #ecf5ff;
  color: #409EFF;
  border-bottom: 1px solid #ebeef5;
}

.mobile-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

/* 过渡动画 */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>