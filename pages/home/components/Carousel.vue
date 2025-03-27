<template>
  <!-- 轮播图 -->
  <el-carousel height="400px" type="card" class="banner">
    <el-carousel-item v-for="(item, index) in bannerList" :key="item.id">
      <div class="banner-content" 
           :style="{backgroundImage: item.loaded ? 'url(' + item.image + ')' : ''}"
           :class="{'banner-loading': !item.loaded}">
        <img :src="item.image" style="display: none" @load="handleImageLoad(index)">
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
    name: 'Carousel',
    data() {
        return {
            // 轮播图列表
            bannerList: [
                {
                    id: 1,
                    image: '/banner1.png',
                    loaded: false
                },
                {
                    id: 2,
                    image: '/banner1.png',
                    loaded: false
                },
                {
                    id: 3,
                    image: '/banner1.png',
                    loaded: false
                },
                {
                    id: 4,
                    image: '/banner1.png',
                    loaded: false
                }
            ]
        }
    },
    methods: {
        // 处理轮播图加载完成
        handleImageLoad(index) {
            // 创建新数组，替换原来的数组元素
            const updatedList = [...this.bannerList];
            updatedList[index] = {
                ...updatedList[index],
                loaded: true
            };
            this.bannerList = updatedList;
        }
    }
}
</script>

<style scoped>
.banner {
  margin-bottom: 40px;
}

.banner-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.banner-loading {
  background-color: #f5f7fa;
  position: relative;
}

.banner-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图片渐入效果 */
.banner-content {
  transition: background-image 0.3s ease-in-out;
}

/* 图片容器优化 */
.banner-content {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  border-radius: 4px;
} 
</style>