# GalGame同好会网站

<p align="center">
  <img src="static/logo.png" alt="LE Gal同好会" width="200">
</p>

<p align="center">
  一个基于Nuxt.js前端和Spring Boot后端的GalGame爱好者社区网站
</p>

## 项目介绍

兰州大学Galgame同好会（LE Gal同好会）是一个专注于Galgame的爱好者社区，提供游戏评测、攻略、讨论交流、游戏资料查询等功能。用户可以发布文章、浏览游戏信息、参与评论收藏、制作游戏喜好表，还能查看角色和制作人员详细资料。

## 功能特色

- **用户系统** - 登录/注册/个人中心
- **文章系统** - 发布/编辑/查看/收藏
- **评论系统** - 发布/查看/管理
- **游戏系统** - 游戏/角色/人物/评分
- **上传系统** - 图片/Word文档解析

## 技术栈

### 前端技术栈

- **框架**: Nuxt.js (Vue 2)
- **UI库**: Element UI
- **HTTP客户端**: Axios
- **富文本编辑器**: WangEditor
- **时间处理**: dayjs
- **图表库**: ECharts

### 后端技术栈

- **框架**: Spring Boot
- **ORM**: MyBatis-Plus
- **数据库**: MySQL
- **工具库**: Lombok, Hutool
- **文档处理**: Apache POI
- **邮件服务**: Spring Mail
- **环境变量**: dotenv-java

## 项目结构

```
gal-web/               # 前端项目目录
├── api/               # 接口请求函数
├── config/            # 配置文件
├── pages/             # 页面组件
│   ├── article/       # 文章相关页面
│   ├── game/          # 游戏相关页面
│   ├── user/          # 用户相关页面
│   ├── person/        # 人物相关页面
│   ├── character/     # 角色相关页面
│   └── ...
├── static/            # 静态资源
├── utils/             # 工具函数
├── plugins/           # 插件配置
└── nuxt.config.js     # Nuxt配置文件

gal_web_backend/       # 后端项目目录 (另外的仓库)
├── controller/        # 控制器层 - 处理HTTP请求
├── service/           # 服务层 - 业务逻辑
├── mapper/            # 数据访问层 - 数据库交互
├── entity/            # 实体类 - 对应数据库表
├── dto/               # 数据传输对象 - 前后端数据交换
├── common/            # 通用工具类和常量
├── config/            # 配置类
└── utils/             # 工具类
```

## 安装与运行

### 前端

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 生产环境启动
npm run start

# 生成静态页面
npm run generate
```

### 后端

后端项目在单独的仓库中，需要单独克隆并运行。

## 项目约定

- **前端路由**: 不使用基于文件的路由系统，在nuxt.config.js中自定义路由
- **状态管理**: 不使用Vuex，使用localStorage进行简单的状态管理
- **HTTP请求**: 使用封装在utils/request.js中的axios
- **错误处理**: 在axios响应拦截器中统一处理错误
- **数据传输**: 前后端统一使用JSON格式
- **接口规范**: RESTful API设计风格

## 配置说明

开发环境和生产环境的配置在`config/index.js`中定义：

- 开发环境使用本地服务器（localhost）
- 生产环境使用线上域名（aiwujiegal.top）

## 数据模型

- **User**: 用户信息，包含权限、状态等
- **Article**: 文章内容，包含标题、内容、分类等
- **Comment**: 文章评论
- **Favorite**: 用户收藏
- **Game**: 游戏基本信息
- **Character**: 游戏角色
- **Person**: 游戏相关人物(声优、制作人等)
- **Rating**: 游戏评分
- **GameCharacter**: 游戏和角色的关联
- **GamePerson**: 游戏和人物的关联

## 文章分类

- 0-游戏评测
- 1-游戏攻略
- 2-行业新闻
- 3-讨论交流

## 用户角色

- 0-管理员
- 1-普通用户

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 `git checkout -b feature/amazing-feature`
3. 提交您的更改 `git commit -m 'Add some amazing feature'`
4. 将您的更改推送到分支 `git push origin feature/amazing-feature`
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情 