<template>
  <div class="submit-container">
    <el-form :model="articleForm" :rules="articleRules" ref="articleForm" label-width="80px">
      <!-- 标题 -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      
      <!-- 分类 -->
      <el-form-item label="分类" prop="category">
        <el-select v-model="articleForm.category" placeholder="请选择文章分类">
          <el-option label="游戏评测" value="0"></el-option>
          <el-option label="游戏攻略" value="1"></el-option>
          <el-option label="行业新闻" value="2"></el-option>
          <el-option label="讨论交流" value="3"></el-option>
        </el-select>
      </el-form-item>
      
      <!-- 标签 -->
      <el-form-item label="标签">
        <div class="article-tags">
          <el-tag
            :key="tag"
            v-for="tag in articleForm.tags"
            closable
            size="small"
            effect="plain"
            :disable-transitions="false"
            @close="handleTagClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputTagVisible"
            v-model="inputTagValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleTagConfirm"
            @blur="handleTagConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ 新标签</el-button>
        </div>
      </el-form-item>
      
      <!-- 封面 -->
      <el-form-item label="封面">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/common/upload"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :with-credentials="true">
          <div v-if="articleForm.cover" class="avatar-wrapper">
            <img :src="articleForm.cover" class="avatar">
            <div class="delete-icon" @click.stop="removeCover">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 内容 -->
      <el-form-item label="内容" prop="content">
        <div class="editor-container">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
          />
          <Editor
              class="editor-content"
              v-model="articleForm.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
          />
        </div>
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitArticle" :loading="submitting">发布文章</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { addArticleAPI, deleteFileAPI } from '@/api/article'

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      imageList1: [], // 存储插入的图片
      imageList2: [], // 存储最终实际插入(没有被删除的)图片
      toolbarConfig: {
        // 工具栏配置
      },
      editorConfig: { 
        placeholder: '请输入内容...',
        MENU_CONF: {
          insertImage: {
            onInsertedImage: (imageNode) => {
              if (imageNode == null) return

              //获取图片的src
              const {src} = imageNode
              console.log(src)

              //将图片的src放入imageList1中
              this.imageList1.push(src)

            }
          },
          // 图片上传配置
          uploadImage: {
            server: 'http://localhost:8080/common/upload', // 上传接口地址
            fieldName: 'file', // 上传图片的字段名
            maxFileSize: 5 * 1024 * 1024, // 限制大小，默认5M
            maxNumberOfFiles: 10, // 限制数量
            allowedFileTypes: ['image/*'], // 允许的文件类型
            withCredentials: true, // 允许跨域请求携带Cookie

            customUpload(file, insertFn) {
              const formData = new FormData()
              formData.append('file', file)
              
              // 发送上传请求
              fetch('http://localhost:8080/common/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include' // 允许携带cookie
              })
              .then(res => res.json())
              .then(res => {
                if (res.code === 1) {
                  // 上传成功，调用插入图片方法
                  insertFn(res.data)
                } else {
                  this.$message.error('图片上传失败')
                }
              })
              .catch(err => {
                console.error('上传失败:', err)
                this.$message.error('图片上传失败')
              })
            },

          }
        },
      },
      mode: 'default',
      articleForm: {
        title: '',
        category: '',
        tags: [],
        cover: '',
        content: '<p>请输入文章内容...</p>'
      },
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 50, message: '标题长度在1到50个字符之间', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      submitting: false,
      inputTagVisible: false,
      inputTagValue: ''
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    handleTagClose(tag) {
      this.articleForm.tags.splice(this.articleForm.tags.indexOf(tag), 1);
    },
    showTagInput() {
      this.inputTagVisible = true;
      this.$nextTick(_ => {
        // 获取焦点 
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleTagConfirm() {
      if (this.inputTagValue && this.articleForm.tags.indexOf(this.inputTagValue) === -1) {
        this.articleForm.tags.push(this.inputTagValue);
      }
      this.inputTagVisible = false;
      this.inputTagValue = '';
    },
    handleCoverSuccess(res, file) {
      if (res && res.code === 1 && res.data) {
        this.articleForm.cover = res.data;
      } else {
        this.$message.error('封面上传失败：响应格式不正确');
      }
    },
    beforeCoverUpload(file) {
      const isImage = file.type.indexOf('image/') === 0;
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        this.$message.error('上传封面图片只能是图片格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传封面图片大小不能超过 5MB!');
      }
      return isImage && isLt5M;
    },
    removeCover(e) {
      e.preventDefault();
      
      // 如果有封面图片，则从URL中提取文件名并调用删除API
      if (this.articleForm.cover) {
          // 从URL中提取文件名
          const url = this.articleForm.cover;
          const filename = url.substring(url.lastIndexOf('/') + 1);
          // 调用删除API
          deleteFileAPI(filename).then(res => {
            if (res && res.code === 1) {
              this.$message.success('封面已删除');
            }
          })
      }
      // 无论服务器端是否成功删除，前端都清空封面
      this.articleForm.cover = '';
    },
    submitArticle() {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true;
          try {
            // 从localStorage获取用户信息
            const userInfoStr = localStorage.getItem('userInfo')
            if (!userInfoStr) {
              this.$message.error('请先登录')
              return
            }
            
            const userInfo = JSON.parse(userInfoStr)
            
            // 准备提交数据
            const submitData = {
              ...this.articleForm,
              userId: userInfo.id,
              // 将标签数组转换为字符串
              tags: this.articleForm.tags.join(',')
            }

            // 获取实际使用的图片
            this.imageList2 = this.editor.getElemsByType('image')
                      
            // 获取上传到服务器, 但没被使用的图片
            const unusedImageList = this.imageList1.filter(item => !this.imageList2.includes(item))
          
            // 删除未使用的图片
            if (unusedImageList.length > 0) {
              console.log('删除未使用的图片:', unusedImageList);
              // 循环删除每张未使用的图片
              unusedImageList.forEach(imageUrl => {
                  // 调用删除API
                  deleteFileAPI(imageUrl.substring(imageUrl.lastIndexOf('/') + 1))
              });
            }

            // 调用API提交文章
            const res = await addArticleAPI(submitData)
            
            if (res.code === 1) {
              // 发布文章成功
              this.$message.success('文章发布成功')
              // 跳转到文章列表页
              this.$router.push('/articles')
            } else {
              this.$message.error(res.msg || '文章发布失败')
            }
          } catch (error) {
            this.$message.error('文章发布失败，请稍后再试')
          } finally {
            this.submitting = false
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      // 删除已上传的封面图片
      if (this.articleForm.cover) {
          // 从URL中提取文件名
          const url = this.articleForm.cover;
          const filename = url.substring(url.lastIndexOf('/') + 1);
          // 调用删除API
          deleteFileAPI(filename)
      }
      // 删除已上传但未使用的编辑器图片
      if (this.imageList1.length > 0) {
        this.imageList1.forEach(imageUrl => {
            // 从URL中提取文件名
            const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            // 调用删除API
            deleteFileAPI(filename)
        });
        // 清空图片列表
        this.imageList1 = [];
        this.imageList2 = [];
      }
      
      // 重置表单字段
      this.$refs.articleForm.resetFields();
      this.articleForm.tags = [];
      this.articleForm.cover = '';
      this.articleForm.content = '<p>请输入文章内容...</p>';
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
})
</script>

<style scoped>
.submit-container {
  width: 1200px;
  margin: 20px auto;
  padding: 20px;
  min-height: 1650px;
}

.el-form {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  min-height: 1650px;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .submit-container {
    width: 100%;
    margin: 15px auto;
    padding: 15px;
  }
}

:deep(body) {
  background-color: #f5f7fa;
}

.editor-container {
  border: 1px solid #ccc;
  height: calc(1650px - 450px); /* 表单容器高度减去其他元素的总高度 */
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  margin-top: 5px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
}

/* 让表单项也居中对齐 */
:deep(.el-form-item__content) {
  max-width: 1000px;
  margin: 0 auto !important;
}

:deep(.el-form-item__label) {
  float: none;
  text-align: left;
  margin-bottom: 5px;
  padding: 0;
  margin-left: calc((100% - 1000px) / 2);
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 300px;
  height: 178px;
  object-fit: cover;
  display: block;
}

:deep(.avatar-uploader) {
  width: 100%;
  max-width: 300px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

/* 文章标签样式 */
.article-tags {
  margin-top: 2px;
}

.article-tags .el-tag {
  margin-right: 5px;
  margin-bottom: 3px;
}

/* 减小表单项之间的间距 */
:deep(.el-form-item) {
  margin-bottom: 8px;
}

/* 标题和分类之间的间距 */
:deep(.el-form-item:nth-child(1)),
:deep(.el-form-item:nth-child(2)) {
  margin-bottom: 5px;
}

/* 标签和封面之间的间距 */
:deep(.el-form-item:nth-child(3)) {
  margin-bottom: 5px;
}

/* 封面和内容之间的间距 */
:deep(.el-form-item:nth-child(4)) {
  margin-bottom: 5px;
}

.avatar-wrapper {
  position: relative;
  width: 300px;
  height: 178px;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0 0 0 4px;
}

.delete-icon:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>