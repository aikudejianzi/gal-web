<template>
  <div class="image-management">
    <h2>图片管理</h2>
    
    <div class="operation-panel">
      <el-button type="primary" @click="handleCleanup" :loading="cleanupLoading" :disabled="unusedImages.length === 0">
        <i class="el-icon-delete"></i> 清理未使用图片
      </el-button>
      <el-button type="info" @click="loadUnusedImages" :loading="loading">
        <i class="el-icon-refresh"></i> 刷新列表
      </el-button>
    </div>
    
    <!-- 初始提示 -->
    <div class="stats-panel" v-if="!hasLoaded">
      <el-alert
        title="点击刷新按钮查看未使用的图片"
        type="info"
        :closable="false">
      </el-alert>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats-panel" v-else-if="unusedImages.length > 0">
      <el-alert
        title="系统检测到以下图片未被引用"
        type="warning"
        :closable="false">
        <template slot="title">
          系统检测到 <strong>{{ unusedImages.length }}</strong> 张图片未被引用，可以安全删除。
        </template>
      </el-alert>
    </div>
    
    <div class="stats-panel" v-else>
      <el-alert
        title="没有检测到未使用的图片"
        type="success"
        :closable="false">
      </el-alert>
    </div>

    <!-- 图片列表 -->
    <div v-loading="loading" class="image-list">
      <template v-if="hasLoaded && unusedImages.length > 0">
        <div class="image-grid">
          <div v-for="(image, index) in unusedImages" :key="index" class="image-item">
            <div class="image-container">
              <img :src="`https://aiwujiegal.top/api/common/download/${image}`" alt="未使用的图片">
            </div>
            <div class="image-info">
              <div class="image-name">{{ truncateFilename(image) }}</div>
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="hasLoaded && !loading" class="no-data">
        <el-empty description="暂无未使用的图片"></el-empty>
      </div>
    </div>

    <!-- 确认对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <div>
        确定要删除 <strong>{{ unusedImages.length }}</strong> 张未使用的图片吗？此操作不可恢复！
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmCleanup" :loading="cleanupLoading">确定删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUnusedImagesAPI, cleanupImagesAPI } from '@/api/admin'

export default {
  name: 'ImageManagement',
  data() {
    return {
      unusedImages: [],
      loading: false,
      cleanupLoading: false,
      dialogVisible: false,
      hasLoaded: false
    }
  },
  methods: {
    // 加载未使用的图片
    async loadUnusedImages() {
      this.loading = true
      try {
        const res = await getUnusedImagesAPI()
        if (res.code === 1) {
          this.unusedImages = res.data || []
          this.hasLoaded = true
        } else {
          this.$message.error(res.msg || '获取未使用图片失败')
        }
      } catch (error) {
        this.$message.error('获取未使用图片失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 处理清理操作
    handleCleanup() {
      if (this.unusedImages.length === 0) {
        this.$message.info('没有可清理的图片')
        return
      }
      this.dialogVisible = true
    },
    
    // 确认清理
    async confirmCleanup() {
      this.cleanupLoading = true
      try {
        const res = await cleanupImagesAPI()
        if (res.code === 1) {
          this.$message.success('清理成功')
          this.dialogVisible = false
          // 重新加载未使用图片列表
          this.loadUnusedImages()
        } else {
          this.$message.error(res.msg || '清理失败')
        }
      } catch (error) {
        this.$message.error('清理失败，请稍后重试')
      } finally {
        this.cleanupLoading = false
      }
    },
    
    // 截断文件名以适应显示
    truncateFilename(filename) {
      if (filename.length > 20) {
        return filename.substring(0, 8) + '...' + filename.substring(filename.length - 8)
      }
      return filename
    }
  }
}
</script>

<style>
.image-management {
  padding: 10px;
}

.operation-panel {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.stats-panel {
  margin-bottom: 20px;
}

.image-list {
  min-height: 300px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 5px;
  transition: all 0.3s;
}

.image-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-container {
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-info {
  font-size: 12px;
  color: #606266;
  text-align: center;
  padding: 5px 0;
}

.image-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-data {
  padding: 40px 0;
  text-align: center;
}
</style> 