<template>
  <el-carousel :interval="4000" type="card" height="400px" autoplay>
    <el-carousel-item v-for="item in carouselImages" :key="item">
      <img class="carousel-image" :src="item">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data(){
    return {
      carouselImages: [
        '/banner1.png',
        '/banner2.jpg',
        '/banner3.jpg',
        '/banner4.png',
      ]
    }
  }  
}
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>