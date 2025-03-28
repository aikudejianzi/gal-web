<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 联系我们 -->
      <div class="footer-section">
        <h3>联系我们</h3>
        <ul class="contact-info">
          <!-- 邮箱 -->
          <li>
            <i class="el-icon-message"></i>
            邮箱：2957793671@qq.com
          </li>
          <!-- QQ群 -->
          <li>
            <i class="el-icon-chat-dot-square"></i>
            QQ群：668090544
          </li>
          <!-- 微信公众号 -->
          <li>
            <i class="el-icon-chat-line-square"></i>
            微信公众号：LE Gal同好会
          </li>
        </ul>
      </div>
      
      <!-- 快速链接 -->
      <div class="footer-section">
        <h3>快速链接</h3>
        <ul>  
          <!-- 首页 -->
          <li>
            <nuxt-link to="/">
              <i class="el-icon-s-home"></i> 主页
            </nuxt-link>
          </li>
          <!-- 文章中心 -->
          <li>
            <nuxt-link to="/articles">
              <i class="el-icon-document"></i> 文章中心
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="footer-bottom">
      <p class="copyright">© {{ new Date().getFullYear() }} 兰州大学GalGame同好会 All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #f5f7fa;
  color: #606266;
  padding: 30px 20px 10px;
  border-top: 1px solid #ebeef5;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  margin: 0 20px 20px;
  min-width: 250px;
}

.footer-section h3 {
  color: #409EFF;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 10px;
  font-size: 14px;
}

.footer-section a {
  color: #606266;
  text-decoration: none;
}

.footer-section a:hover {
  color: #409EFF;
}

.contact-info li {
  display: flex;
  align-items: center;
}

.contact-info i {
  margin-right: 10px;
  font-size: 16px;
  color: #409EFF;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
}

.copyright {
  font-size: 13px;
  color: #909399;
}
</style>