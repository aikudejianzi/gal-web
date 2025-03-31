<template>
  <div class="login-container">
    <!-- 登录盒子 -->
    <div class="login-box">
      <!-- 登录头部 -->
      <div class="login-header">
        <h1>兰州大学GalGame同好会</h1>
      </div>
      <!-- 登录表单 -->
      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginForm" 
        class="login-form" 
        @submit.native.prevent
      >
        <el-form-item prop="email">
          <!-- 邮箱输入框 -->
          <el-input
            v-model="loginForm.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱"
            @keydown.enter.native="handleEmailEnter">
            <!-- 验证码按钮 -->
            <template slot="append">
              <el-button @click="sendCode" :disabled="isDisabled">
                {{buttonText}}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <!-- 验证码输入框 -->
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            prefix-icon="el-icon-key"
            placeholder="请输入验证码"
            maxlength="6"
            @keydown.enter.native="handleLogin">
          </el-input>
        </el-form-item>

        <!--登录按钮-->
        <el-button
          type="primary"
          class="login-button"
          :loading="loading"
          @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入API方法
import { sendCodeAPI, loginAPI } from '@/api/user'

export default {
  name: 'LoginIndex',
  head() {
    return {
      title: '登录 - 兰州大学GalGame同好会'
    }
  },
  data() {
    // 邮箱验证规则
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱格式'));
      } else {
        callback();
      }
    };

    return {
      // 登录表单
      loginForm: {
        // 邮箱
        email: '',
        // 验证码
        code: ''
      },

      // 登录规则
      loginRules: {
        // 邮箱规则
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: validateEmail, trigger: 'blur'}
        ],

        // 验证码规则
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {len: 6, message: '验证码长度必须为6位', trigger: 'blur'}
        ]
      },

      // 登录加载
      loading: false,
      // 按钮禁用
      isDisabled: false,
      // 是否正在发送验证码请求
      isSending: false,
      // 按钮文本
      buttonText: '发送验证码',
      // 倒计时
      count: 60,
      // 定时器
      timer: null
    }
  },
  mounted() {
    // 页面加载时检查是否有未完成的倒计时
    if (process.client) {
      this.checkCountdownState();
    }
  },
  methods: {
    // 检查倒计时状态并恢复
    checkCountdownState() {
      const countdownData = localStorage.getItem('countdownData');
      if (countdownData) {
        try {
          const data = JSON.parse(countdownData);
          const now = new Date().getTime();
          const endTime = data.endTime;
          
          // 如果倒计时未结束，恢复倒计时状态
          if (now < endTime) {
            const remainingSeconds = Math.ceil((endTime - now) / 1000);
            this.count = remainingSeconds;
            this.isDisabled = true;
            this.startCountdown(data.email);
          } else {
            // 倒计时已结束，清除状态
            localStorage.removeItem('countdownData');
          }
        } catch (error) {
          console.error('恢复倒计时状态失败:', error);
          localStorage.removeItem('countdownData');
        }
      }
    },
    
    // 开始倒计时
    startCountdown(email) {
      this.buttonText = this.count + 's后重新发送';
      this.timer = setInterval(() => {
        if (this.count > 0) {
          this.count--;
          this.buttonText = this.count + 's后重新发送';
        } else {
          clearInterval(this.timer);
          this.buttonText = '发送验证码';
          this.isDisabled = false;
          this.count = 60;
          // 清除localStorage中的倒计时状态
          localStorage.removeItem('countdownData');
        }
      }, 1000);
    },

    // 发送验证码
    async sendCode() {
      // 如果按钮已禁用或正在发送请求，直接返回
      if (this.isDisabled || this.isSending) {
        return;
      }
      
      // 输入的邮箱不能为空
      if (!this.loginForm.email) {
        this.$message.error('请输入邮箱地址');
        return;
      }
      
      // 设置发送状态和按钮禁用
      this.isSending = true;
      this.isDisabled = true;
      
      try {
        // 发送验证码请求
        const res = await sendCodeAPI(this.loginForm.email);
        
        // 提示发送成功
        this.$message.success('验证码已发送到邮箱');
        
        // 保存倒计时状态到localStorage
        const now = new Date().getTime();
        const endTime = now + this.count * 1000;
        const countdownData = {
          email: this.loginForm.email,
          startTime: now,
          endTime: endTime
        };
        localStorage.setItem('countdownData', JSON.stringify(countdownData));
        
        // 开始倒计时
        this.startCountdown(this.loginForm.email);
      } catch (error) {
        // 错误已在请求拦截器中处理
        this.isDisabled = false;
      } finally {
        // 无论成功失败，都设置发送状态为false
        this.isSending = false;
      }
    },

    // 登录
    async handleLogin() {
      try {
        const valid = await new Promise((resolve, reject) => {
          this.$refs.loginForm.validate((isValid) => {
            resolve(isValid);
          });
        });
        
        if (valid) {
          // 登录加载
          this.loading = true;
          
          // 发送登录请求
          const res = await loginAPI({
            email: this.loginForm.email,
            code: this.loginForm.code
          });

          // 存储用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          
          // 清除倒计时状态
          localStorage.removeItem('countdownData');
          
          // 提示登录成功
          this.$message.success('登录成功');
          
          // 跳转到首页
          this.$router.push('/');
        }
      } catch (error) {
        // 错误已在请求拦截器中处理
        console.log('登录失败:', error);
      } finally {
        // 登录加载结束
        this.loading = false;
      }
    },

    // 处理邮箱输入框的回车事件
    handleEmailEnter() {
      // 如果按钮未禁用，则发送验证码
      if (!this.isDisabled) {
        this.sendCode();
      }
    }
  },

  // 销毁定时器
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script>

<style scoped>
/* 登录页面样式 */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.login-box {
  width: 400px;
  min-height: 450px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 60px;
}

.login-header h1 {
  font-size: 28px;
  color: #409EFF;
  margin-bottom: 20px;
}

.login-form {
  margin-bottom: 40px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 30px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-password {
  color: #409EFF;
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 20px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  display: inline-block;
  padding: 0 10px;
  background-color: #fff;
  position: relative;
  color: #999;
  font-size: 14px;
}

.social-login {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.social-button {
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-button.qq {
  background-color: #12B7F5;
  color: #fff;
  border: none;
}

.social-button.wechat {
  background-color: #09BB07;
  color: #fff;
  border: none;
}

.social-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-size: contain;
  background-repeat: no-repeat;
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-footer a {
  color: #409EFF;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .social-login {
    flex-direction: column;
  }
  
  .social-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>