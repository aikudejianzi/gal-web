<template>
  <div class="user-info-container">
    <h2>个人资料</h2>
    
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px" class="user-form">
      <!-- 头像 -->
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="userForm.avatar" class="user-avatar" alt="用户头像" />
        </div>
        <div class="avatar-actions">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="uploadAvatar"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button size="small" type="primary">更换头像</el-button>
          </el-upload>
        </div>
      </div>
      
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" :disabled="!isEditing"></el-input>
      </el-form-item>
      
      <!-- 邮箱（不可修改） -->
      <el-form-item label="邮箱">
        <el-input v-model="userForm.email" disabled></el-input>
        <span class="email-tip">邮箱不可修改</span>
      </el-form-item>
      
      <!-- 操作按钮 -->
      <el-form-item>
        <template v-if="!isEditing">
          <el-button type="primary" @click="handleEdit">修改资料</el-button>
        </template>
        <template v-else>
          <el-button type="success" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCurrentUserAPI, updateUserAPI, uploadImageAPI } from '@/api/user'

export default {
  name: 'UserInfo',
  props: {
    userInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isEditing: false,
      userForm: {
        id: '',
        username: '',
        email: '',
        avatar: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initUserData()
  },
  watch: {
    // 监听父组件传入的userInfo变化，及时更新表单数据
    userInfo: {
      handler(val) {
        if (val) {
          this.initUserData()
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化用户数据
    initUserData() {
      if (this.userInfo) {
        this.userForm = { ...this.userInfo }
      } else {
        this.fetchUserInfo()
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await getCurrentUserAPI()
        if (res.code === 1 && res.data) {
          this.userForm = res.data
        } else {
          this.$message.warning('获取用户信息失败')
        }
      } catch (error) {
        this.$message.error('获取用户信息失败，请稍后重试')
      }
    },
    
    // 进入编辑模式
    handleEdit() {
      this.isEditing = true
    },
    
    // 取消编辑
    handleCancel() {
      this.isEditing = false
      this.initUserData() // 重置为原始数据
    },
    
    // 保存用户信息
    handleSave() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await updateUserAPI({
              id: this.userForm.id,
              username: this.userForm.username,
              avatar: this.userForm.avatar
            })
            
            if (res.code === 1) {
              this.$message.success('个人资料更新成功')
              this.isEditing = false
              
              // 重新获取最新的用户信息
              await this.fetchUserInfo()
              
              // 通知父组件用户数据已更新，触发NavBar组件的更新
              this.$emit('user-updated', this.userForm)
              
              // 触发全局事件，通知NavBar组件更新用户信息
              this.$nuxt.$emit('user-info-updated')
            } else {
              this.$message.error(res.msg || '更新失败')
            }
          } catch (error) {
            this.$message.error('保存失败，请稍后重试')
          }
        }
      })
    },
    
    // 上传头像
    async uploadAvatar(options) {
      try {
        // 创建FormData对象
        const formData = new FormData()
        formData.append('file', options.file)
        
        // 上传图片
        const res = await uploadImageAPI(formData)
        
        if (res.code === 1 && res.data) {
          // 更新头像URL
          this.userForm.avatar = res.data
          this.$message.success('头像上传成功')
          
          // 自动保存用户信息
          if (!this.isEditing) {
            this.handleSave()
          }
        } else {
          this.$message.error(res.msg || '头像上传失败')
        }
      } catch (error) {
        this.$message.error('头像上传失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped>
.user-info-container {
  padding: 20px;
}

.user-form {
  max-width: 500px;
  margin: 20px auto;
}

.avatar-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eaeaea;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-actions {
  margin-top: 10px;
}

.email-tip {
  color: #909399;
  font-size: 12px;
  margin-left: 10px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
  font-weight: 500;
}
</style>
