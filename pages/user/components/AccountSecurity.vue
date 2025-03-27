<template>
  <div class="security-container">
    <h2>账号安全</h2>
    <el-form :model="securityForm" :rules="securityRules" ref="securityForm" label-width="100px">
      <el-form-item label="当前邮箱">
        <el-input v-model="securityForm.currentEmail" disabled></el-input>
      </el-form-item>
      <el-form-item label="新邮箱" prop="newEmail">
        <el-input v-model="securityForm.newEmail">
          <template slot="append">
            <el-button @click="sendCode" :disabled="isDisabled">
              {{buttonText}}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="securityForm.code" maxlength="6"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEmail" :loading="loading">更换邮箱</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AccountSecurity',
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
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
      securityForm: {
        currentEmail: '',
        newEmail: '',
        code: ''
      },
      securityRules: {
        newEmail: [
          {required: true, message: '请输入新邮箱', trigger: 'blur'},
          {validator: validateEmail, trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {len: 6, message: '验证码长度必须为6位', trigger: 'blur'}
        ]
      },
      
      // 发送验证码 按钮  
      isDisabled: false,
      buttonText: '发送验证码',
      count: 60,
      timer: null,
    }
  },
  created() {
    this.initForm();
  },
  methods: {
    // 初始化表单
    initForm() {
      this.securityForm = {
        currentEmail: this.userInfo.email,
        newEmail: '',
        code: ''
      }
    },

    // 发送验证码
    sendCode() {
      if (!this.securityForm.newEmail) {
        this.$message.error('请输入新邮箱')
        return
      }
      
      // 检查新邮箱是否与当前邮箱相同
      if(this.securityForm.newEmail === this.securityForm.currentEmail) {
        this.$message.error('新邮箱不能与当前邮箱相同')
        return
      }

      this.isDisabled = true
      this.timer = setInterval(() => {
        if (this.count > 0) {
          this.buttonText = this.count + 's后重新发送'
          this.count--
        } else {
          clearInterval(this.timer)
          this.buttonText = '发送验证码'
          this.count = 60
          this.isDisabled = false
        }
      }, 1000)

      // 模拟发送验证码
      setTimeout(() => {
        this.$message.success('验证码已发送到新邮箱')
      }, 1000)
    },

    // 更换邮箱
    updateEmail() {
      this.$refs.securityForm.validate(valid => {
        if (valid) {
          this.loading = true
          
          // 模拟请求
          setTimeout(() => {
            if (this.securityForm.code === '123456') { // 假设验证码为123456
              this.$message.success('邮箱更换成功,请重新登录')
              // 清除本地存储的用户信息
              if (process.client) {
                localStorage.removeItem('userInfo')
              }
              // 跳转到登录页
              setTimeout(() => {
                this.$router.push('/login')
              }, 1500)
            } else {
              this.$message.error('验证码错误，请重新输入')
            }
            this.loading = false
          }, 1000)
        }
      })
    }
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.security-container {
  padding: 20px 0;
}

/* 通用样式 */
.security-container h2 {
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
