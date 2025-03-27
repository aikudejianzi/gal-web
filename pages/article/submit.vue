<template>
      <div id="app" class="submit-container">
        <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="80px">
            <!-- 标题 -->
            <el-form-item label="标题" prop="title">
                <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>

            <!-- 分类 -->
            <el-form-item label="分类" prop="category">
            <el-select v-model="articleForm.category" placeholder="请选择文章分类">
              <el-option
                        v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

            <!-- 标签 -->
            <el-form-item label="标签" prop="tags">
            <el-tag
              :key="tag"
              v-for="tag in articleForm.tags"
              closable
              :disable-transitions="false"
                    @close="handleClose(tag)"
                    class="tag-item">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
            </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
          </el-form-item>

            <!-- 封面 -->
            <el-form-item label="封面" prop="cover">
            <el-upload
                    class="cover-uploader"
                    action="/user/upload"
              :show-file-list="false"
                    :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload">
                    <img v-if="coverUrl" :src="coverUrl" class="cover">
                    <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </el-upload>
          </el-form-item>

            <!-- 内容 -->
            <el-form-item label="内容" prop="content">
                <div class="editor-container">
                    <textarea id="editor"></textarea>
                </div>
          </el-form-item>

            <!-- 按钮 -->
          <el-form-item>
                <el-button type="primary" @click="submitForm('articleForm')" :loading="submitting">发布文章</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

</template>

<script>
export default {
  data() {
    return {
                    articleForm: {
                        title: '',
                        category: '',
                        tags: [],
                        cover: '',
                        content: ''
                    },
                    categories: [
                        { value: 'review', label: '游戏评测' },
                        { value: 'news', label: '新闻资讯' },
                        { value: 'guide', label: '攻略心得' },
                        { value: 'discussion', label: '讨论交流' }
                    ],
                    rules: {
                        title: [
                            { required: true, message: '请输入文章标题', trigger: 'blur' },
                            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                        ],
                        category: [
                            { required: true, message: '请选择文章分类', trigger: 'change' }
                        ],
                        content: [
                            { required: true, message: '请输入文章内容', trigger: 'blur' }
                        ]
                    },
                    inputVisible: false,
                    inputValue: '',
                    submitting: false,
                    editor: null
                }
            },
            computed: {
                coverUrl() {
                    return this.articleForm.cover ? '/user/download?name=' + this.articleForm.cover : ''
                }
            },
            mounted() {
                // 延迟加载编辑器
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.initEditor()
                    }, 100)
                })
            },
            methods: {
                initEditor() {
                    tinymce.init({
                        selector: '#editor',
                        language: 'zh_CN',
                        height: '100%',  // 设置为100%以填充容器
                        width: '100%',
                        resize: false,   // 禁用手动调整大小
                        // 只保留必要的插件
                        plugins: [
                            'lists', // 列表
                            'link',  // 链接
                            'image', // 图片
                            'code',  // 代码
                            'table', // 表格
                            'fullscreen', // 全屏
                            'wordcount'   // 字数统计
                        ],
                        // 简化工具栏
                        toolbar: [
                            'undo redo | formatselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright',
                            'bullist numlist | link image | table | code | fullscreen'
                        ].join(' | '),
                        // 简化菜单
                        menubar: 'file edit insert format',
                        menu: {
                            file: { title: '文件', items: 'newdocument preview' },
                            edit: { title: '编辑', items: 'undo redo | cut copy paste | selectall' },
                            insert: { title: '插入', items: 'image link table' },
                            format: { title: '格式', items: 'bold italic underline | forecolor backcolor' }
                        },
                        // 预加载
                        preload_plugins: ['lists', 'link', 'image'],
                        // 异步加载
                        async: true,
                        // 缓存
                        cache_suffix: '?v=1',
                        // 减少不必要的格式
                        font_formats: "微软雅黑=Microsoft YaHei;宋体=simsun;黑体=SimHei;Arial=arial",
                        fontsize_formats: "12px 14px 16px 18px 24px",
                        block_formats: '段落=p;标题1=h1;标题2=h2;标题3=h3',
                        branding: false,
                        language_url: 'node_modules/tinymce/langs/zh_CN.js',
                        language: 'zh_CN',
                        setup: (editor) => {
                            this.editor = editor
                            editor.on('change', () => {
                                this.articleForm.content = editor.getContent()
                            })
                        },
                        // 禁用自动加载
                        auto_focus: false,
                        // 延迟初始化
                        init_instance_callback: (editor) => {
                            editor.on('LoadContent', () => {
                                this.$emit('ready')
                            })
                        },
                        // 图片上传处理
                        images_upload_handler: (blobInfo, progress) => {
                            return new Promise((resolve, reject) => {
                                const formData = new FormData();
                                formData.append('file', blobInfo.blob(), blobInfo.filename());
                                
                                $axios.post('/user/upload', formData)
                                    .then(response => {
                                        if (response.code === 1) {
                                            const fileName = response.data;
                                            resolve('../../images/' + fileName);
                                        } else {
                                            reject(response.msg || '上传失败');
                                        }
                                    })
                                    .catch(error => {
                                        reject('上传失败: ' + error.message);
                                    });
                            });
                        },
                        content_style: `
                            body { 
                                font-family: Microsoft YaHei, sans-serif;
                                font-size: 16px;
                                line-height: 1.6;
                                padding: 20px;
                                min-height: 800px;
                            }
                            p { margin: 0 0 1em; }
                        `
                    })
                },
                handleClose(tag) {
                    this.articleForm.tags.splice(this.articleForm.tags.indexOf(tag), 1)
                },
                showInput() {
                    this.inputVisible = true
                    this.$nextTick(_ => {
                        this.$refs.saveTagInput.$refs.input.focus()
                    })
                },
                handleInputConfirm() {
                    let inputValue = this.inputValue
                    if (inputValue && this.articleForm.tags.length < 5) {
                        this.articleForm.tags.push(inputValue)
                    }
                    this.inputVisible = false
                    this.inputValue = ''
                },
                beforeCoverUpload(file) {
                    const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
                    const isLt2M = file.size / 1024 / 1024 < 2

                    if (!isJPGOrPNG) {
                        this.$message.error('封面图片只能是 JPG 或 PNG 格式!')
                    }
                    if (!isLt2M) {
                        this.$message.error('封面图片大小不能超过 2MB!')
                    }
                    return isJPGOrPNG && isLt2M
                },
                handleCoverSuccess(response, file) {
                    // 判断响应是否成功
                    if (response.code === 1) {
                        // 只保存文件名
                        this.articleForm.cover = response.data;
                    } else {
                        this.$message.error(response.msg || '上传失败');
                    }
                },
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.submitting = true
                            // 获取编辑器内容
                            let content = this.editor.getContent()
                            
                            // 处理图片路径，将绝对路径转换为相对路径
                            content = content.replace(
                                new RegExp(window.location.origin + '/user/download\\?name=([^"\']*)', 'g'),
                                '../../images/$1'
                            )
                            this.articleForm.content = content
                            
                            // 从localStorage获取用户信息
                            const userInfo = JSON.parse(localStorage.getItem('userInfo'))
                            if (!userInfo || !userInfo.id) {
                                this.$message.error('用户未登录或登录已过期')
                                return
                            }
                            
                            // 处理标签数组，转换为逗号分隔的字符串，并添加userId和其他必要字段
                            const submitData = {
                                ...this.articleForm,
                                tags: this.articleForm.tags.join(','),
                                userId: userInfo.id,
                                status: 'published',  // 设置状态为已发布
                                views: 0,            // 设置默认浏览量
                                likes: 0,            // 设置默认点赞数
                                comments: 0          // 设置默认评论数
                            }
                            
                            // 使用$axios发送请求
                            $axios.post('/article/submit', submitData)
                                .then(response => {
                                    this.$message.success('文章发布成功！')
                                    setTimeout(() => {
                                        window.location.href = './list.html'
                                    }, 1500)
                                })
                                .catch(error => {
                                    this.$message.error('发布失败：' + error.message)
                                })
                                .finally(() => {
                                    this.submitting = false
                                })
                        }
                    })
                },
                cancel() {
                    this.$confirm('确认放弃编辑？未保存的内容将丢失', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        window.history.back()
                    }).catch(() => {})
                }
            },
            beforeDestroy() {
                // 销毁编辑器
                if (this.editor) {
                    this.editor.destroy()
                }
            }
        
}
</script>

<style>
        .submit-container {
            max-width: 1200px;
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
        .cover-uploader {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .cover-uploader:hover {
            border-color: #409EFF;
        }
        .cover-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 300px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .cover {
            width: 300px;
            height: 178px;
            display: block;
        }
        .editor-container {
            margin-top: 20px;
            height: calc(1650px - 450px); /* 表单容器高度减去其他元素的总高度 */
            width: 100%;
        }
        .tox-tinymce {
            height: 100% !important;
            width: 100% !important;
        }
        .tox .tox-edit-area__iframe {
            height: calc(100% - 100px) !important; /* 减去工具栏高度 */
            background: #fff !important;
        }
        .tag-item {
            margin-right: 10px;
        }
</style>