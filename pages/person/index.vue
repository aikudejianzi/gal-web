<template>
  <div class="person-list-container">
    <!-- 顶部搜索区域 -->
    <div class="search-section">
      <el-input
        placeholder="搜索制作人员/公司名称"
        v-model="searchQuery"
        class="search-input"
        suffix-icon="el-icon-search"
        @keyup.enter.native="handleSearch"
        :disabled="loading"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" :loading="loading"></el-button>
      </el-input>
    </div>

    <!-- 人员列表 -->
    <div class="person-list" v-loading="loading" element-loading-text="加载中...">
      <el-card v-for="person in personList" :key="person.id" class="person-card" shadow="hover" @click.native="goToPersonDetail(person.id)">
        <div class="person-card-content">
          <!-- 人员头像 -->
          <div class="person-avatar">
            <img 
              :src="getPersonImage(person.images)" 
              class="avatar-image"
              @error="handleImageError($event, person)"
              v-if="!person.imageLoadError"
            >
            <div 
              v-if="person.imageLoadError" 
              class="avatar-fallback"
            >
              {{ getNameInitial(person.nameCn || person.name) }}
            </div>
          </div>
          
          <!-- 人员信息 -->
          <div class="person-info">
            <h3 class="person-name">{{ person.nameCn || person.name }}</h3>
            <p class="person-original-name" v-if="person.nameCn && person.name !== person.nameCn">{{ person.name }}</p>
            
            <!-- 职业标签 -->
            <div class="person-jobs" v-if="person.career">
              <el-tag
                v-for="(job, index) in getPersonJobs(person.career)"
                :key="index"
                size="mini"
                effect="plain"
                class="job-tag"
              >
                {{ job }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>
      
      <!-- 无数据时显示 -->
      <el-empty v-if="personList.length === 0" description="暂无制作人员数据"></el-empty>
    </div>

    <!-- 底部分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="loading"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getPersonListAPI } from '@/api/person'

export default {
  name: 'PersonList',
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      personList: [],
      loading: false
    }
  },
  methods: {
    // 获取人员图片
    getPersonImage(images) {
      try {
        if (images) {
          // 尝试解析JSON
          const imagesObj = JSON.parse(images);
          // 优先使用small尺寸，如果没有则依次尝试其他尺寸
          return imagesObj.small || imagesObj.grid || imagesObj.medium || imagesObj.common || imagesObj.large;
        }
      } catch (error) {
        console.error('解析图片JSON失败:', error);
      }
      // 默认图片
      return '';
    },
    
    // 获取人员职业
    getPersonJobs(career) {
      if (!career) return [];
      return career.split(',').map(job => job.trim()).filter(job => job);
    },
    
    // 跳转到人员详情
    goToPersonDetail(id) {
      this.$router.push(`/person/${id}`);
    },
    
    // 搜索处理
    handleSearch() {
      this.currentPage = 1;
      this.fetchPersonList();
    },
    
    // 页大小改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPersonList();
    },
    
    // 页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchPersonList();
    },
    
    // 获取人员列表数据
    async fetchPersonList() {
      try {
        this.loading = true;
        const params = {
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchQuery
        };
        
        const res = await getPersonListAPI(params);
        
        this.personList = res.data.records || [];
        this.total = res.data.total || 0;
      } catch (error) {
        console.error('获取制作人员列表失败:', error);
        this.$message.error('获取制作人员列表失败');
      } finally {
        this.loading = false;
      }
    },

    // 处理图片加载失败
    handleImageError(event, person) {
      // 标记图片加载失败
      this.$set(person, 'imageLoadError', true);
    },

    // 获取姓名首字母（大写）
    getNameInitial(name) {
      if (!name || typeof name !== 'string') return '?';
      return name.charAt(0).toUpperCase();
    }
  },
  // 服务端获取数据
  async asyncData() {
    try {
      const params = {
        page: 1,
        size: 20
      };
      
      const res = await getPersonListAPI(params);
      
      return {
        personList: res.data.records || [],
        total: res.data.total || 0
      };
    } catch (error) {
      console.error('获取制作人员列表失败:', error);
      return {
        personList: [],
        total: 0
      };
    }
  },
  // 客户端挂载后更新数据
  mounted() {
    if (process.client && (!this.personList || this.personList.length === 0)) {
      this.fetchPersonList();
    }
  },
  head() {
    return {
      title: '制作人员/公司 - GalGame同好会'
    }
  }
}
</script>

<style scoped>
.person-list-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 400px;
}

.person-list {
  margin-bottom: 30px;
}

.person-card {
  margin-bottom: 15px;
  transition: transform 0.3s;
  cursor: pointer;
}

.person-card:hover {
  transform: translateY(-5px);
}

.person-card-content {
  display: flex;
  align-items: center;
}

.person-avatar {
  flex: 0 0 70px;
  margin-right: 20px;
}

.avatar-image {
  width: 70px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.avatar-fallback {
  width: 70px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #909399;
  color: white;
  font-size: 28px;
  font-weight: bold;
  border-radius: 4px;
}

.person-info {
  flex: 1;
}

.person-name {
  margin: 0 0 5px;
  font-size: 18px;
  color: #303133;
}

.person-original-name {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
}

.person-jobs {
  display: flex;
  flex-wrap: wrap;
}

.job-tag {
  margin-right: 6px;
  margin-bottom: 5px;
}

.pagination-container {
  text-align: center;
  margin-top: 30px;
}
</style> 
 
 
 