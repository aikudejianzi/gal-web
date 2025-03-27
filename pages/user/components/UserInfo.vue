<template>
  <div class="profile-container">
    <h2>个人资料</h2>
    <!-- 个人资料表单 -->
    <el-form :model="profileForm" :rules="profileRules" ref="profileForm"
              label-width="100px">
      <!-- 头像 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profileForm.username"></el-input>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" disabled></el-input>
      </el-form-item>

      <!-- 个人简介 -->
      <el-form-item label="个人简介" prop="selfIntroduction">
        <el-input type="textarea" v-model="profileForm.selfIntroduction" :rows="4"></el-input>
      </el-form-item>

      <!-- 保存修改 -->
      <el-form-item>
        <el-button type="primary" @click="updateProfile" :loading="loading">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    // 验证用户名格式
    const validateUsername = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9_]{4,16}$/.test(value)) {
        callback(new Error('用户名必须为4-16位字母、数字或下划线'));
      } else {
        callback();
      }
    };

    // 验证邮箱格式
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱格式'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      profileForm: {
        username: '',
        email: '',
        avatar: '',
        selfIntroduction: ''
      },
      profileRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: validateUsername, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: validateEmail, trigger: 'blur'}
        ],
        selfIntroduction: [
          {max: 200, message: '个人简介不能超过200字', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.initProfileForm();
  },
  methods: {
    // 初始化个人资料表单
    initProfileForm() {
      this.profileForm = {
        username: this.userInfo.username,
        email: this.userInfo.email,
        selfIntroduction: this.userInfo.selfIntroduction || '',
        // 只存储文件名,显示时拼接路径
        avatar: this.userInfo.avatar ? '/user/download?name=' + this.userInfo.avatar : ''
      }
    },

    // 更新个人资料
    updateProfile() {
      this.$refs.profileForm.validate(valid => {
        if (valid) {
          this.loading = true;
          
          // 构造请求数据,只包含修改的字段
          const data = {
            id: this.userInfo.id
          }
          
          // 检查用户名是否修改
          if(this.profileForm.username !== this.userInfo.username) {
            data.username = this.profileForm.username
          }
          
          // 检查个人简介是否修改
          if(this.profileForm.selfIntroduction !== this.userInfo.selfIntroduction) {
            data.selfIntroduction = this.profileForm.selfIntroduction
          }
          
          // 如果没有修改任何内容,直接返回
          if(Object.keys(data).length === 1) {
            this.$message.info('您没有修改任何内容')
            this.loading = false
            return
          }
          
          // 模拟请求
          setTimeout(() => {
            // 更新成功,通知父组件更新用户信息
            const updatedUserInfo = {
              ...this.userInfo,
              ...(data.username && { username: data.username }),
              ...(data.selfIntroduction && { selfIntroduction: data.selfIntroduction })
            }
            this.$emit('user-updated', updatedUserInfo)
            
            // 提示更新成功
            this.$message.success('个人资料更新成功')
            this.loading = false
          }, 800)
        }
      })
    },

    // 上传头像前的处理
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      
      this.loading = true
      
      // 模拟头像上传和更新
      setTimeout(() => {
        // 模拟文件名
        const avatarName = 'avatar_' + new Date().getTime() + '.jpg'
        
        // 模拟更新成功
        const updatedUserInfo = {
          ...this.userInfo,
          avatar: avatarName
        }
        
        // 通知父组件更新用户信息
        this.$emit('user-updated', updatedUserInfo)
        
        // 显示时拼接完整路径
        this.profileForm.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        this.$message.success('头像上传成功')
        this.loading = false
      }, 1000)
      
      return false
    }
  }
}
</script>

<style scoped>
/* 头像上传样式 */
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

/* 通用样式 */
.profile-container h2 {
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.el-form {
  max-width: 600px;
}

.el-form-item__label {
  font-weight: bold;
}

@media screen and (max-width: 768px) {
  .el-form {
    max-width: 100%;
  }
}
</style>
