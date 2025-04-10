<template>
  <div class="user-management">
    <h2>用户管理</h2>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户名/邮箱"
        prefix-icon="el-icon-search"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="handleSearch"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 筛选选项 -->
    <div class="filter-options">
      <el-radio-group v-model="statusFilter" @change="handleFilterChange">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="1">正常</el-radio-button>
        <el-radio-button label="0">已禁用</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 用户列表表格 -->
    <el-table
      v-loading="loading"
      :data="userList"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="180">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 0 ? 'danger' : 'info'">
            {{ scope.row.role === 0 ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '正常' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1 && scope.row.role !== 0"
            type="danger"
            size="mini"
            @click="handleDisableUser(scope.row)"
          >禁用</el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            size="mini"
            @click="handleEnableUser(scope.row)"
          >解禁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!-- 操作确认对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <span>{{ dialogMessage }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction" :loading="actionLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserListAPI, updateUserStatusAPI } from '@/api/admin'
import dayjs from 'dayjs'

export default {
  name: 'UserManagement',
  data() {
    return {
      loading: false,
      userList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: '',
      statusFilter: 'all',
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      actionType: '',
      currentUser: null,
      actionLoading: false
    }
  },
  created() {
    this.fetchUserList()
  },
  methods: {
    // 获取用户列表
    async fetchUserList() {
      this.loading = true
      try {
        const res = await getUserListAPI({
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchQuery,
          status: this.statusFilter === 'all' ? null : this.statusFilter
        })
        
        if (res.code === 1 && res.data) {
          this.userList = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取用户列表失败')
        }
      } catch (error) {
        this.$message.error('获取用户列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchUserList()
    },
    
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchUserList()
    },
    
    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchUserList()
    },
    
    // 处理筛选变化
    handleFilterChange() {
      this.currentPage = 1
      this.fetchUserList()
    },
    
    // 禁用用户
    handleDisableUser(user) {
      this.dialogTitle = '禁用用户'
      this.dialogMessage = `确定要禁用用户 "${user.username}" 吗？禁用后该用户将无法登录系统。`
      this.actionType = 'disable'
      this.currentUser = user
      this.dialogVisible = true
    },
    
    // 解禁用户
    handleEnableUser(user) {
      this.dialogTitle = '解禁用户'
      this.dialogMessage = `确定要解禁用户 "${user.username}" 吗？解禁后该用户将恢复正常使用。`
      this.actionType = 'enable'
      this.currentUser = user
      this.dialogVisible = true
    },
    
    // 确认操作
    async confirmAction() {
      if (!this.currentUser) return
      
      this.actionLoading = true
      try {
        const status = this.actionType === 'disable' ? 0 : 1
        
        const res = await updateUserStatusAPI({
          userId: this.currentUser.id,
          status: status
        })
        
        if (res.code === 1) {
          this.$message.success(this.actionType === 'disable' ? '用户禁用成功' : '用户解禁成功')
          this.dialogVisible = false
          
          // 更新本地状态
          const index = this.userList.findIndex(u => u.id === this.currentUser.id)
          if (index !== -1) {
            this.userList[index].status = status
          }
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败，请稍后重试')
      } finally {
        this.actionLoading = false
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      return dayjs(dateTimeStr).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 10px;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar .el-input {
  margin-right: 10px;
}

.filter-options {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 