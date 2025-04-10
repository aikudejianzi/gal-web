<template>
  <div class="admin-container">
    <!-- 左侧导航 -->
    <div class="admin-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        router>
        <!-- 用户管理 -->
        <el-menu-item index="/admin/users">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </el-menu-item>

        <!-- 文章审核 -->
        <el-menu-item index="/admin/articles">
          <i class="el-icon-document"></i>
          <span>文章审核</span>
        </el-menu-item>

        <!-- 文章管理 -->
        <el-menu-item index="/admin/article-management">
          <i class="el-icon-document-copy"></i>
          <span>文章管理</span>
        </el-menu-item>

        <!-- 评论管理 -->
        <el-menu-item index="/admin/comments">
          <i class="el-icon-chat-dot-round"></i>
          <span>评论管理</span>
        </el-menu-item>

        <!-- 图片管理 -->
        <el-menu-item index="/admin/images">
          <i class="el-icon-picture"></i>
          <span>图片管理</span>
        </el-menu-item>

        <!-- 可以根据需要添加更多管理选项 -->
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="admin-content">
      <!-- 子路由渲染区域 -->
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import { getCurrentUserAPI } from '@/api/user'

export default {
  name: 'AdminIndex',
  // 设置为仅客户端渲染
  ssr: false,
  head() {
    return {
      title: '管理后台 - GalGame同好会'
    }
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    // 根据当前路由计算激活的菜单项
    activeMenu() {
      const path = this.$route.path
      // 如果是管理后台首页则激活用户管理
      if (path === '/admin') {
        return '/admin/users'
      }
      return path
    }
  },
  async created() {
    // 权限检查
    await this.checkAdminPermission()
  },
  methods: {
    // 检查是否有管理员权限
    async checkAdminPermission() {
      try {
        this.loading = true
        const res = await getCurrentUserAPI()
        if (res && res.code === 1 && res.data) {
          // 检查用户角色是否为管理员(role=0)
          if (res.data.role !== 0) {
            this.$message.error('无权访问管理后台')
            this.$router.push('/')
          }
        } else {
          // 未登录跳转到登录页
          this.$message.warning('请先登录')
          this.$router.push('/login?redirect=/admin')
        }
      } catch (error) {
        // 请求失败说明用户未登录或登录已过期
        this.$message.warning('请先登录')
        this.$router.push('/login?redirect=/admin')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 200px);
}

/* 左侧导航样式 */
.admin-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.admin-menu {
  border-right: none;
}

.admin-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.admin-menu .el-menu-item i {
  margin-right: 10px;
}

/* 右侧内容区样式 */
.admin-content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
  }
  
  .admin-content {
    padding: 15px;
  }
}
</style> 