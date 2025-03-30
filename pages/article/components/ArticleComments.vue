<template>
  <el-card class="comment-section">
    <div slot="header">
      <span>评论区</span>
      <span class="comment-count">({{comments.length}}条评论)</span>
    </div>

    <!-- 发表评论 -->
    <div class="comment-form" v-if="userInfo.id">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="写下你的评论..."
        v-model="commentContent"
        maxlength="500"
        show-word-limit>
      </el-input>
      <div style="margin-top: 10px; text-align: right;">
        <el-button type="primary" @click="submitComment">发表评论</el-button>
      </div>
    </div>
    <div v-else class="login-tip">
      <el-button type="text" @click="$router.push('/login')">登录后发表评论</el-button>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-wrapper">
          <el-avatar :size="40" :src="comment.avatar" fit="cover"></el-avatar>
          <div class="comment-main">
            <div class="comment-info">
              <span class="comment-author">{{comment.username}}</span>
              <span class="comment-time">{{formatDate(comment.createTime)}}</span>
              <!-- 删除按钮 -->
              <el-button 
                v-if="userInfo.id === comment.userId"
                type="text" 
                class="delete-btn"
                @click="handleDeleteComment(comment.id)">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
            <div class="comment-content">{{comment.content}}</div>
          </div>
        </div>
      </div>
      <!-- 暂无评论 -->
      <el-empty v-if="comments.length === 0" description="暂无评论"></el-empty>
    </div>
  </el-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ArticleComments',
  props: {
    articleId: {
      type: [String, Number],
      required: true
    },
    comments: {
      type: Array,
      default: () => []
    },
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      commentContent: ''
    }
  },
  methods: {
    // 提交评论
    submitComment() {
      if (!this.commentContent.trim()) {
        this.$message.warning('请输入评论内容')
        return
      }
      
      this.$emit('submitComment', this.commentContent)
      this.commentContent = ''
    },
    
    // 处理删除评论
    handleDeleteComment(commentId) {
      this.$emit('deleteComment', commentId)
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return ''
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style scoped>
.comment-section {
  width: 100%;
  min-height: 200px;
  margin-top: 40px;
  border-radius: 8px;
}

.comment-section .el-card__header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.comment-count {
  color: #909399;
  margin-left: 10px;
  font-size: 14px;
  font-weight: normal;
}

.comment-list {
  width: 100%;
  min-height: 100px;
}

.comment-form {
  width: 100%;
  margin: 25px 0 35px;
}

.comment-form .el-textarea__inner {
  width: 100%;
  min-height: 100px;
  border-radius: 8px;
  padding: 15px;
  font-size: 14px;
  resize: vertical;
}

.login-tip {
  text-align: center;
  padding: 30px;
  color: #909399;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-item {
  padding: 25px 15px;
  border-bottom: 1px solid #ebeef5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-wrapper {
  display: flex;
  gap: 15px;
}

.comment-main {
  flex-grow: 1;
  min-width: 0;
}

.comment-info {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
  margin-right: 15px;
}

.comment-time {
  color: #909399;
  font-size: 13px;
}

.comment-content {
  color: #34495e;
  line-height: 1.8;
  font-size: 14px;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.delete-btn {
  color: #F56C6C;
  padding: 0;
  margin-left: auto;
}

.delete-btn:hover {
  color: #f78989;
}

.delete-btn i {
  font-size: 16px;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .comment-item {
    padding: 20px 10px;
  }

  .comment-wrapper {
    gap: 15px;
  }

  .comment-author {
    font-size: 14px;
    margin-right: 10px;
  }

  .comment-time {
    font-size: 12px;
  }

  .comment-content {
    font-size: 13px;
    line-height: 1.6;
  }
}
</style> 