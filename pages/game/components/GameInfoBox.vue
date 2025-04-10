<template>
  <div class="game-infobox">
    <h3 class="sidebar-title">基本信息</h3>
    <el-descriptions direction="vertical" :column="1" border class="infobox-content">
      <el-descriptions-item v-for="(item, index) in parsedInfobox" :key="index" :label="item.key">
        <!-- 处理不同类型的值 -->
        <template v-if="typeof item.value === 'string'">
          <span v-if="isUrl(item.value)">
            <a :href="item.value" target="_blank" rel="noopener noreferrer">{{ item.value }}</a>
          </span>
          <span v-else>{{ item.value }}</span>
        </template>
        
        <!-- 处理数组值 -->
        <template v-else-if="Array.isArray(item.value)">
          <div v-for="(subItem, subIndex) in item.value" :key="subIndex" class="sub-item">
            <template v-if="typeof subItem === 'string'">
              {{ subItem }}
            </template>
            <template v-else>
              <strong>{{ subItem.k }} </strong>{{ subItem.v }}
            </template>
          </div>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: 'GameInfoBox',
  props: {
    infobox: {
      type: [String, Array, Object],
      required: true
    }
  },
  computed: {
    parsedInfobox() {
      if (!this.infobox) return [];
      
      // 如果已经是数组或对象
      if (typeof this.infobox !== 'string') {
        return Array.isArray(this.infobox) 
          ? this.infobox 
          : Object.entries(this.infobox).map(([key, value]) => ({ key, value }));
      }
      
      // 尝试解析字符串
      try {
        const infoboxData = JSON.parse(this.infobox);
        return Array.isArray(infoboxData) 
          ? infoboxData 
          : Object.entries(infoboxData).map(([key, value]) => ({ key, value }));
      } catch (error) {
        console.error('解析infobox失败:', error);
        return [];
      }
    }
  },
  methods: {
    // 判断是否是URL
    isUrl(value) {
      return typeof value === 'string' && 
        (value.startsWith('http://') || value.startsWith('https://'));
    }
  }
}
</script>

<style scoped>
.game-infobox {
  width: 100%;
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
}

.infobox-content {
  font-size: 14px;
}

.sub-item {
  margin-bottom: 5px;
}

@media (max-width: 992px) {
  .game-infobox {
    margin-top: 20px;
  }
}
</style> 