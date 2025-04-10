<template>
  <div class="game-short-comments">
    <h2 class="section-title">玩家短评</h2>
    
    <!-- 发表短评 -->
    <div class="add-comment-section" v-if="userId">
      <div v-if="!userComment">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="说说你对这个游戏的看法吧（最多500字）..."
          v-model="commentContent"
          :maxlength="500"
          show-word-limit
          :disabled="submitting || !hasRated"
        ></el-input>
        <div class="comment-actions">
          <el-tooltip content="请先对游戏评分才能发表短评" placement="top" v-if="!hasRated">
            <el-button type="primary" disabled>发表短评</el-button>
          </el-tooltip>
          <el-button type="primary" @click="submitComment" v-else :loading="submitting">发表短评</el-button>
        </div>
      </div>
      <div v-else class="comment-item user-comment">
        <div class="comment-header">
          <div class="user-info">
            <img :src="userId && userComment.user && userComment.user.avatar ? userComment.user.avatar : '/images/default-avatar.jpg'" class="user-avatar" :alt="`${userComment.user ? userComment.user.username : '我'} - 用户头像`" />
            <div class="username-and-rating">
              <div class="username">
                {{ userComment.user ? userComment.user.username : '我' }}
                <span class="my-comment-tag">我的短评</span>
                <span class="rating-label">评分：</span>
                <span class="rating-badge" :class="getRatingClass(userRating)">{{ userRating }}</span>
              </div>
            </div>
          </div>
          <div class="comment-actions-container">
            <div class="comment-time">{{ formatDate(userComment.createTime) }}</div>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete" class="delete-btn">删除</el-button>
          </div>
        </div>
        <div class="comment-content">{{ userComment.content }}</div>
      </div>
    </div>
    
    <!-- 未登录提示 -->
    <div class="login-tip" v-else>
      <el-alert
        title="登录后才能发表短评"
        type="info"
        :closable="false"
        show-icon
      >
        <template slot="title">
          登录后才能发表短评，<a href="/login" class="login-link">点击登录</a>
        </template>
      </el-alert>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-list" v-loading="loading">
      <div v-if="comments.length === 0 && !loading" class="no-comments">
        暂无短评，快来发表第一条短评吧！
      </div>
      
      <template v-else>
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <div class="user-info">
              <img :src="comment.user && comment.user.avatar ? comment.user.avatar : '/images/default-avatar.jpg'" class="user-avatar" :alt="`${comment.user ? comment.user.username : '未知用户'} - 用户头像`" />
              <div class="username-and-rating">
                <div class="username">
                  {{ comment.user ? comment.user.username : '未知用户' }}
                  <span class="rating-label">评分：</span>
                  <span class="rating-badge" :class="getRatingClass(comment.rating || 0)">{{ comment.rating || 0 }}</span>
                </div>
              </div>
            </div>
            <div class="comment-time">{{ formatDate(comment.createTime) }}</div>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getGameShortCommentsAPI, getUserGameShortCommentAPI, addShortCommentAPI, deleteShortCommentAPI } from '@/api/game'
import { getCurrentUserAPI } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'GameShortComments',
  props: {
    gameId: {
      type: Number,
      required: true
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    userRating: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      comments: [],
      userComment: null,
      commentContent: '',
      userId: null,
      hasRated: false
    }
  },
  watch: {
    userRating(newVal) {
      this.hasRated = newVal > 0;
    },
    gameId() {
      this.fetchComments();
      this.checkCurrentUser();
    }
  },
  created() {
    this.hasRated = this.userRating > 0;
    this.fetchComments();
    this.checkCurrentUser();
  },
  methods: {
    // 检查当前用户状态
    async checkCurrentUser() {
      try {
        const res = await getCurrentUserAPI();
        if (res && res.code === 1 && res.data) {
          this.userId = res.data.id;
          this.fetchUserComment();
        } else {
          this.userId = null;
        }
      } catch (error) {
        console.error('获取当前用户信息失败:', error);
        this.userId = null;
      }
    },
    
    // 获取所有评论
    async fetchComments() {
      try {
        this.loading = true;
        const res = await getGameShortCommentsAPI(this.gameId);
        if (res.code === 1) {
          console.log('获取到的短评数据:', res.data);
          
          // 确保每个评论都有有效的user对象
          const processedComments = res.data.map(comment => {
            // 检查返回的数据结构
            if (comment.user && typeof comment.user === 'object') {
              // user对象已存在，确保属性正确
              return comment;
            } else {
              // 如果user不是对象，尝试从后端返回的数据中构建user对象
              comment.user = {
                id: comment.userId,
                username: comment.username || ('用户' + comment.userId),
                avatar: comment.avatar || null
              };
              return comment;
            }
          });
          
          // 过滤掉当前用户的评论，因为已经单独显示
          this.comments = processedComments.filter(comment => {
            return !this.userId || comment.userId !== this.userId;
          });
        }
      } catch (error) {
        console.error('获取短评列表失败:', error);
        this.$message.error('获取短评列表失败');
      } finally {
        this.loading = false;
      }
    },
    
    // 获取当前用户
    async getCurrentUser() {
      try {
        const res = await getCurrentUserAPI();
        if (res.code === 1 && res.data) {
          this.userId = res.data.id;
          this.fetchUserComment();
        }
      } catch (error) {
        console.error('获取当前用户信息失败:', error);
      }
    },
    
    // 获取用户评论
    async fetchUserComment() {
      if (!this.userId) return;
      
      try {
        const res = await getUserGameShortCommentAPI(this.gameId, this.userId);
        if (res.code === 1) {
          this.userComment = res.data;
        }
      } catch (error) {
        console.error('获取用户短评失败:', error);
      }
    },
    
    // 提交评论
    async submitComment() {
      if (!this.commentContent.trim()) {
        this.$message.warning('评论内容不能为空');
        return;
      }
      
      if (!this.userId) {
        this.$message.warning('请先登录');
        return;
      }
      
      if (!this.hasRated) {
        this.$message.warning('请先对游戏评分才能发表短评');
        return;
      }
      
      try {
        this.submitting = true;
        const data = {
          gameId: this.gameId,
          userId: this.userId,
          content: this.commentContent
        };
        
        const res = await addShortCommentAPI(data);
        if (res.code === 1) {
          this.$message.success('短评发表成功');
          this.commentContent = '';
          
          // 获取当前用户信息
          const userRes = await getCurrentUserAPI();
          if (userRes.code === 1 && userRes.data) {
            // 创建包含用户信息的评论对象
            const newComment = {
              ...data,
              id: res.data && res.data.id ? res.data.id : Date.now(), // 如果后端返回ID则使用，否则用当前时间戳
              createTime: new Date(),
              user: {
                id: this.userId,
                username: userRes.data.username,
                avatar: userRes.data.avatar
              },
              rating: this.userRating
            };
            
            // 更新当前用户评论
            this.userComment = newComment;
          } else {
            // 直接获取更新后的评论
            this.fetchUserComment();
          }
          
          // 更新评论列表
          this.fetchComments();
        } else {
          this.$message.error(res.msg || '短评发表失败');
        }
      } catch (error) {
        console.error('发表短评失败:', error);
        this.$message.error('发表短评失败');
      } finally {
        this.submitting = false;
      }
    },
    
    // 删除评论
    async handleDelete() {
      try {
        await this.$confirm('确定要删除这条短评吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        
        const res = await deleteShortCommentAPI(this.gameId, this.userId);
        if (res.code === 1) {
          this.$message.success('短评删除成功');
          this.userComment = null;
          this.fetchComments();
        } else {
          this.$message.error(res.msg || '短评删除失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除短评失败:', error);
          this.$message.error('删除短评失败');
        }
      }
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return '';
      return dayjs(date).format('YYYY-MM-DD HH:mm');
    },
    
    // 获取评分对应的样式类
    getRatingClass(rating) {
      if (rating >= 90) return 'rating-excellent';
      if (rating >= 70) return 'rating-good';
      if (rating >= 50) return 'rating-average';
      return 'rating-poor';
    }
  }
}
</script>

<style scoped>
.game-short-comments {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  border-bottom: 2px solid #ebeef5;
  padding-bottom: 10px;
  margin: 30px 0 15px;
}

.add-comment-section {
  margin-bottom: 20px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}

.comment-actions {
  margin-top: 10px;
  text-align: right;
}

.user-comment {
  padding: 10px;
  background-color: #ecf5ff;
  border-radius: 4px;
  position: relative;
  border-left: 3px solid #409EFF;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.my-comment-tag {
  font-weight: bold;
  color: #409EFF;
  font-size: 12px;
  margin-left: 5px;
  border: 1px solid #409EFF;
  padding: 1px 4px;
  border-radius: 4px;
}

.comments-list {
  margin-top: 20px;
}

.comment-item {
  padding: 18px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
  border-radius: 4px;
}

.comment-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.username {
  font-weight: bold;
  color: #303133;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.rating-badge {
  color: white;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
  display: inline-block;
}

.rating-excellent {
  background-color: #67C23A; /* 绿色 - 优秀 */
}

.rating-good {
  background-color: #E6A23C; /* 橙色 - 良好 */
}

.rating-average {
  background-color: #F56C6C; /* 红色 - 一般 */
}

.rating-poor {
  background-color: #909399; /* 灰色 - 较差 */
}

.user-rating {
  display: none; /* 隐藏原来的评分显示 */
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-content {
  margin-top: 15px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 15px;
}

.no-comments {
  text-align: center;
  padding: 30px 0;
  color: #909399;
  font-size: 14px;
}

.login-tip {
  margin-bottom: 20px;
}

.login-link {
  color: #409EFF;
  text-decoration: none;
}

.comment-actions-container {
  display: flex;
  align-items: center;
}

.delete-btn {
  margin-left: 10px;
}

.rating-label {
  color: #606266;
  margin-left: 10px;
}
</style> 