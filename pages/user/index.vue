<template>
  <div class="user-container">
    <!-- 左侧导航 -->
    <div class="user-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="user-menu"
        router>
        <!-- 个人资料 -->
        <el-menu-item index="/user/profile">
          <i class="el-icon-user"></i>
          <span>个人资料</span>
        </el-menu-item>
        
        <!--账号安全-->
        <el-menu-item index="/user/security">
          <i class="el-icon-lock"></i>
          <span>账号安全</span>
        </el-menu-item>

        <!--我的文章-->
        <el-menu-item index="/user/articles">
          <i class="el-icon-document"></i>
          <span>我的文章</span>
        </el-menu-item>

        <!--我的收藏-->
        <el-menu-item index="/user/favorites">
          <i class="el-icon-star-on"></i>
          <span>文章收藏</span>
        </el-menu-item>

        <!--我的评论-->
        <el-menu-item index="/user/comments">
          <i class="el-icon-chat-dot-round"></i>
          <span>我的评论</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="user-content">
      <!-- 子路由渲染区域 -->
      <nuxt-child :user-info="userInfo" @user-updated="handleUserInfoUpdated" />
    </div>
  </div>
</template>

<script>
import { checkAuthAPI } from '@/api/user'

export default {
  name: 'UserIndex',
  head() {
    return {
      title: '个人中心 - LE Gal同好会'
    }
  },
  data() {
    return {
      userInfo: null
    }
  },
  computed: {
    // 根据当前路由计算激活的菜单项
    activeMenu() {
      const path = this.$route.path
      // 如果是用户中心首页则激活个人资料
      if (path === '/user') {
        return '/user/profile'
      }
      return path
    }
  },
  async created() {
    // 先从localStorage中获取用户信息
    if (process.client) {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        this.userInfo = JSON.parse(userInfoStr)
      }
    }
    
    // 再通过API校验并更新用户信息
    try {
      const res = await checkAuthAPI()
      if (res.code === 1 && res.data) {
        // 用服务端最新数据更新用户信息
        this.userInfo = res.data
        // 更新localStorage
        if (process.client) {
          localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 错误处理已在响应拦截器中完成
    }
  },
  methods: {
    // 处理用户信息更新
    handleUserInfoUpdated(updatedUserInfo) {
      this.userInfo = updatedUserInfo
      // 更新localStorage
      if (process.client) {
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
      }
    }
  }
}
</script>

<style scoped>
.user-container {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 200px);
}

/* 左侧导航样式 */
.user-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-menu {
  border-right: none;
}

.user-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.user-menu .el-menu-item i {
  margin-right: 10px;
}

/* 右侧内容区样式 */
.user-content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 内容区通用样式 - 现在放在各子组件中 */

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .user-container {
    flex-direction: column;
  }
  
  .user-sidebar {
    width: 100%;
  }
  
  .user-content {
    padding: 15px;
  }
}
</style>