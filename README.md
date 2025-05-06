# Vue3 + TS + Ant Design Vue 项目

这是一个基于Vue3、TypeScript和Ant Design Vue的管理系统项目骨架，集成了常见的开发工具和库。

## 技术栈

- **前端框架**：Vue 3
- **开发语言**：TypeScript
- **UI组件库**：Ant Design Vue
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **HTTP请求**：Axios
- **代码规范**：ESLint + Prettier

## 项目结构

```
src/
├── api/            # API请求接口
├── assets/         # 静态资源
│   └── images/     # 图片资源
├── components/     # 通用组件
├── layouts/        # 布局组件
├── router/         # 路由配置
├── store/          # Pinia状态管理
├── utils/          # 工具函数
├── views/          # 页面组件
├── App.vue         # 根组件
├── main.ts         # 入口文件
└── style.css       # 全局样式
```

## 功能列表

- 响应式布局
- 侧边栏导航
- Tree树形组件示例
- 权限控制（待实现）
- 主题定制（待实现）
- 多语言支持（待实现）

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT
