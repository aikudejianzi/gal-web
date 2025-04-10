<template>
  <div class="game-rating-chart">
    <h3 class="section-title">评分分布</h3>
    
    <div class="chart-container" ref="chartContainer" v-loading="loading"></div>
    
    <div v-if="error" class="chart-error">
      <el-alert
        title="加载图表失败"
        type="error"
        :description="error"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
  </div>
</template>

<script>
import { getGameRatingStatsAPI } from '@/api/game'
import * as echarts from 'echarts'

export default {
  name: 'GameRatingChart',
  props: {
    gameId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      chart: null,
      loading: false,
      error: null,
      ratingStats: []
    }
  },
  watch: {
    // 当游戏ID变化时重新加载数据
    gameId() {
      this.fetchRatingStats()
    },
    // 当评分统计数据变化时更新图表
    ratingStats() {
      this.renderChart()
    }
  },
  mounted() {
    this.initChart()
    this.fetchRatingStats()
    
    // 添加窗口大小变化时重新调整图表尺寸的监听器
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器和释放图表实例
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      if (!this.$refs.chartContainer) return
      
      this.chart = echarts.init(this.$refs.chartContainer)
    },
    
    // 窗口大小变化时调整图表尺寸
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    
    // 获取评分统计数据
    async fetchRatingStats() {
      if (!this.gameId) return
      
      try {
        this.loading = true
        this.error = null
        
        const res = await getGameRatingStatsAPI(this.gameId)
        
        if (res && res.code === 1) {
          this.ratingStats = res.data || []
        } else {
          throw new Error(res.msg || '获取评分统计数据失败')
        }
      } catch (error) {
        console.error('获取评分统计数据失败:', error)
        this.error = error.message || '获取评分统计数据失败'
      } finally {
        this.loading = false
      }
    },
    
    // 渲染图表
    renderChart() {
      if (!this.chart || !this.ratingStats.length) return
      
      const xAxisData = this.ratingStats.map(item => item.range)
      const seriesData = this.ratingStats.map(item => item.count)
      
      const option = {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c}人'
        },
        grid: {
          left: '15%',
          right: '5%',
          bottom: '15%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 45,
            interval: 0,
            fontSize: 10,
            formatter: function(value) {
              // 截断过长的文本，确保显示正常
              return value.length > 8 ? value.substring(0, 8) + '...' : value;
            }
          },
          nameLocation: 'middle',
          nameGap: 35
        },
        yAxis: {
          type: 'value',
          name: '评分人数',
          minInterval: 1,
          nameTextStyle: {
            fontSize: 10,
            padding: [0, 0, 0, 10]
          },
          nameLocation: 'middle',
          nameGap: 35,
          axisLabel: {
            fontSize: 10
          }
        },
        series: [
          {
            name: '评分人数',
            type: 'bar',
            barWidth: '60%',
            data: seriesData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FF9900' },
                { offset: 1, color: '#FFB84D' }
              ])
            }
          }
        ]
      }
      
      this.chart.setOption(option)
      
      // 确保图表完全渲染后调整大小
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
    }
  }
}
</script>

<style scoped>
.game-rating-chart {
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  font-size: 18px;
  color: #303133;
  margin: 0 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart-error {
  margin-top: 15px;
}
</style> 