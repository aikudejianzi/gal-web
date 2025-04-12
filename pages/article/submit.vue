<template>
  <div class="submit-container">
    <el-form :model="articleForm" :rules="articleRules" ref="articleForm" label-width="80px">
      <h2 class="page-title">{{ pageTitle }}</h2>
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
          :action="config && config.imageUploadUrl ? config.imageUploadUrl : ''"
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
          <div class="editor-tools" v-if="!isEditMode">
            <el-upload
              class="word-uploader"
              action="javascript:void(0)"
              :http-request="uploadWordDoc"
              :show-file-list="false"
              accept=".doc,.docx"
            >
              <el-button size="small" type="primary" icon="el-icon-upload">导入Word文档</el-button>
            </el-upload>
            <el-tooltip effect="dark" content="将Word文档内容导入编辑器，支持图片" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <client-only>
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
          </client-only>
        </div>
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitArticle" :loading="submitting">
          {{ isEditMode ? '更新文章' : '发布文章' }}
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { addArticleAPI, getArticleDetailAPI, updateArticleAPI, parseWordDocAPI } from '@/api/article'
import { getCurrentUserAPI } from '@/api/user'
import config from '@/config'

// 在客户端才导入编辑器
let Editor, Toolbar, IToolbarConfig, DomEditor
if (process.client) {
  const editorModule = require('@wangeditor/editor-for-vue')
  const editorConfigModule = require('@wangeditor/editor')
  Editor = editorModule.Editor
  Toolbar = editorModule.Toolbar
  IToolbarConfig = editorConfigModule.IToolbarConfig
  DomEditor = editorConfigModule.DomEditor
  require('@wangeditor/editor/dist/css/style.css')
}

export default Vue.extend({
  components: { 
    Editor: process.client ? require('@wangeditor/editor-for-vue').Editor : null,
    Toolbar: process.client ? require('@wangeditor/editor-for-vue').Toolbar : null
  },
  
  // 替换页面守卫逻辑，使用fetch钩子
  async fetch() {
    // 检查登录状态
    if (process.client) {
      await this.checkUserAuth()
    }
  },
  
  data() {
    return {
      editor: null,
      isEditMode: false, // 是否是编辑模式
      articleId: null, // 文章ID (编辑模式使用)
      userInfo: null, // 用户信息
      config, // 将config添加到data中确保可访问
      toolbarConfig: {
        // 工具栏排除配置
        excludeKeys: [
          'fullScreen', // 排除全屏功能
          'group-video' // 排除视频上传功能
        ],
      },
      editorConfig: { 
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 图片上传配置
          uploadImage: {
            server: process.client && config ? config.imageUploadUrl : '', // 添加判断防止undefined
            fieldName: 'file', // 上传图片的字段名
            maxFileSize: 5 * 1024 * 1024, // 限制大小，默认5M
            maxNumberOfFiles: 10, // 限制数量
            allowedFileTypes: ['image/*'], // 允许的文件类型
            withCredentials: true, // 允许跨域请求携带Cookie

            customUpload(file, insertFn) {
              const formData = new FormData()
              formData.append('file', file)
              
              // 发送上传请求
              fetch(this.config && this.config.imageUploadUrl ? this.config.imageUploadUrl : '', {
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
  computed: {
    // 页面标题，根据模式不同显示不同标题
    pageTitle() {
      return this.isEditMode ? '编辑文章' : '发布文章';
    }
  },
  async created() {
    // 检查当前路由，判断是投稿模式还是编辑模式
    const path = this.$route.path;
    if (path.includes('/article/edit/')) {
      this.isEditMode = true;
      this.articleId = this.$route.params.id;
      
      // 获取文章详情
      if (process.client) {
        // 先检查用户登录状态
        await this.checkUserAuth();
        // 获取文章详情
        await this.getArticleDetail();
      }
    } else if (process.client) {
      // 投稿模式也需要检查登录状态
      await this.checkUserAuth();
    }
  },
  methods: {
    // 获取文章详情（编辑模式使用）
    async getArticleDetail() {
      try {
        const res = await getArticleDetailAPI(this.articleId);
        
        if (res && res.code === 1 && res.data) {
          const article = res.data;
          
          // 填充表单数据
          this.articleForm.title = article.title;
          this.articleForm.category = article.category;
          this.articleForm.cover = article.cover;
          this.articleForm.content = article.content;
          
          // 处理标签 (将逗号分隔的字符串转为数组)
          if (article.tags) {
            this.articleForm.tags = article.tags.split(',').filter(tag => tag.trim());
          }
        } else {
          this.$message.error('获取文章详情失败');
          // 失败后返回列表页
          this.$router.push('/articles');
        }
      } catch (error) {
        console.error('获取文章详情失败:', error);
        this.$message.error('获取文章详情失败，请稍后再试');
        this.$router.push('/articles');
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      
      // 获取工具栏配置
      try {
        if (DomEditor) {
          const toolbar = DomEditor.getToolbar(editor)
          if (toolbar) {
            const curToolbarConfig = toolbar.getConfig()
            console.log('工具栏配置:', curToolbarConfig.toolbarKeys) // 当前菜单排序和分组
          }
        }
      } catch (error) {
        console.error('获取工具栏配置失败:', error)
      }
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
      // 只清空前端的封面URL，不删除服务器图片
      this.articleForm.cover = '';
    },
    submitArticle() {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true;
          try {
            // 检查用户登录状态
            if (!this.userInfo) {
              // 尝试重新获取用户信息
              await this.checkUserAuth();
              if (!this.userInfo) {
                this.$message.error('请先登录');
                this.$router.push('/login');
                return;
              }
            }
            
            // 准备提交数据
            const submitData = {
              ...this.articleForm,
              userId: this.userInfo.id,
              // 将标签数组转换为字符串
              tags: this.articleForm.tags.join(',')
            }

            let res;
            if (this.isEditMode) {
              // 编辑模式：更新文章
              submitData.id = this.articleId;
              res = await updateArticleAPI(submitData);
            } else {
              // 投稿模式：新增文章
              res = await addArticleAPI(submitData);
            }
            
            if (res.code === 1) {
              // 操作成功
              this.$message.success(this.isEditMode ? '文章更新成功' : '文章发布成功');
              // 跳转到文章列表页
              this.$router.push('/articles');
            } else {
              this.$message.error(res.msg || (this.isEditMode ? '文章更新失败' : '文章发布失败'));
            }
          } catch (error) {
            console.error(this.isEditMode ? '更新文章失败:' : '发布文章失败:', error);
            this.$message.error(this.isEditMode ? '更新文章失败，请稍后再试' : '发布文章失败，请稍后再试');
          } finally {
            this.submitting = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      // 重置表单字段
      this.$refs.articleForm.resetFields();
      this.articleForm.tags = [];
      this.articleForm.cover = '';
      this.articleForm.content = '<p>请输入文章内容...</p>';
    },
    // 上传并解析Word文档
    async uploadWordDoc(options) {
      const loading = this.$loading({
        lock: true,
        text: '正在解析Word文档...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      
      try {
        // 准备表单数据
        const formData = new FormData()
        formData.append('file', options.file)
        
        // 调用API解析Word文档
        const res = await parseWordDocAPI(formData)
        
        if (res && res.code === 1 && res.data) {
          // 解析成功，将HTML内容设置到编辑器
          if (this.editor) {
            // 先清空编辑器内容
            this.editor.clear();
            
            // 设置新的HTML内容（这样可以保证图片正确加载）
            this.editor.dangerouslyInsertHtml(res.data);
            
            // 更新表单值
            this.articleForm.content = this.editor.getHtml();
          } else {
            // 编辑器未初始化，直接设置内容
            this.articleForm.content = res.data;
          }
          
          // 从标题中提取文章标题
          this.tryExtractTitle(res.data);
          
          this.$message.success('Word文档解析成功');
        } else {
          this.$message.error(res.msg || 'Word文档解析失败');
        }
      } catch (error) {
        console.error('解析Word文档失败:', error);
        this.$message.error('解析Word文档失败，请稍后再试');
      } finally {
        loading.close();
      }
    },
    
    // 尝试从HTML内容中提取标题
    tryExtractTitle(htmlContent) {
      if (!this.articleForm.title || this.articleForm.title === '') {
        // 尝试从h1标签提取标题
        const titleMatch = /<h1[^>]*>(.*?)<\/h1>/i.exec(htmlContent);
        if (titleMatch && titleMatch[1]) {
          // 去除HTML标签
          const title = titleMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
          if (title) {
            this.articleForm.title = title;
          }
        }
      }
    },
    // 检查用户登录状态
    async checkUserAuth() {
      try {
        const res = await getCurrentUserAPI();
        if (res && res.code === 1 && res.data) {
          this.userInfo = res.data;
        } else {
          this.$message.error('获取用户信息失败');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('检查用户登录状态失败:', error);
        this.$message.error('检查用户登录状态失败，请稍后再试');
        this.$router.push('/login');
      }
    },
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
  width: 800px;
  margin: 20px auto;
  padding: 10px;
  min-height: 1200px;
}

.el-form {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  min-height: 1200px;
  max-width: 708px;
  margin: 0 auto;
}

/* 响应式优化 */
@media screen and (max-width: 1024px) {
  .submit-container {
    width: 90%;
    max-width: 900px;
    margin: 15px auto;
    padding: 15px;
  }
}

@media screen and (max-width: 768px) {
  .submit-container {
    width: 95%;
    margin: 15px auto;
    padding: 15px;
  }
}

:deep(body) {
  background-color: #f5f7fa;
}

.editor-container {
  border: 1px solid #ccc;
  height: calc(1200px - 350px); /* 减小高度 */
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  margin-top: 5px;
  max-width: 648px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
}

/* Word文档导入工具栏 */
.editor-tools {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.editor-tools .el-tooltip {
  margin-left: 8px;
  cursor: pointer;
  color: #909399;
}

.word-uploader {
  margin-right: 10px;
}

/* 让表单项也居中对齐 */
:deep(.el-form-item__content) {
  max-width: 648px; /* 调整为更合适的宽度 */
  margin: 0 auto !important;
  width: 100%;
}

:deep(.el-form-item__label) {
  float: none;
  text-align: left;
  margin-bottom: 5px;
  padding: 0;
  margin-left: 0; /* 移除左边距计算 */
}

/* 确保编辑器中的文本不会溢出容器 */
:deep(.w-e-text-container) {
  overflow: hidden;
}

:deep(.w-e-text) {
  overflow-wrap: break-word;
  word-break: break-all;
}

:deep(.w-e-text-container [data-slate-editor]) {
  padding: 0 15px;
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

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #409EFF;
}
</style>