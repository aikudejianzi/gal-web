<template>
  <div class="activities-container">
    <h1 class="page-title">活动中心</h1>
    
    <el-card class="activity-card">
      <div class="activity-header">
        <h2 class="activity-title">游戏生涯个人喜好表</h2>
        <span class="activity-tag">热门活动</span>
      </div>
      <div class="activity-content">
        <p class="activity-description">
          创建并分享你的个人游戏生涯喜好表，展示你最喜欢的GalGame，包括入坑作品、最喜欢的游戏、最佳剧情等。
        </p>
        <div class="activity-actions">
          <router-link to="/activity/game-grid" class="activity-link">
            <el-button type="primary">进入活动</el-button>
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ActivitiesPage',
  head() {
    return {
      title: '活动中心 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.activities-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.activity-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.activity-title {
  font-size: 20px;
  margin: 0;
  color: #303133;
}

.activity-tag {
  background: #67C23A;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.activity-description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.activity-actions {
  display: flex;
  justify-content: flex-end;
}

.activity-link {
  text-decoration: none;
}

@media (max-width: 768px) {
  .activities-container {
    padding: 0 10px;
  }
}
</style> 