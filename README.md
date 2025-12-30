# CuMob AI - AI 视频生成平台

基于 Next.js 构建的现代化 AI 视频生成平台，集成了 Coze 工作流 API 调用功能。

## 功能特性

- 🎨 **现代化界面设计** - 深色主题，玻璃拟态风格
- 🚀 **Coze 工作流集成** - 支持流式响应，实时显示生成内容
- 📝 **丰富的参数配置** - 风格、情感、多语言支持
- 🔒 **安全的 API 密钥管理** - 本地存储，安全可靠
- 📱 **响应式设计** - 完美适配移动设备
- ⚡ **高性能** - Next.js 15 + TypeScript + Tailwind CSS

## 技术栈

- **框架**: Next.js 15.3.2
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: shadcn/ui + Radix UI
- **包管理**: Bun
- **代码质量**: Biome + ESLint

## 快速开始

### 安装依赖

```bash
bun install
```

### 开发环境

```bash
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
bun build
bun start
```

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── workflow/          # 工作流页面
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── CozeWorkflowForm.tsx
│   └── StreamingOutput.tsx
├── hooks/                 # 自定义 Hooks
├── lib/                   # 工具函数
├── types/                 # TypeScript 类型定义
├── public/               # 静态资源
│   ├── favicon.ico       # 网站图标
│   └── logo.png          # 网站 Logo
└── package.json          # 项目配置
```

## 主要功能

### 1. 视频画廊展示
- 瀑布流布局展示 AI 生成的视频
- 分类过滤和搜索功能
- 响应式设计

### 2. Coze 工作流调用
- 支持多种参数配置
- 流式响应实时显示
- 错误处理和状态管理
- 表单数据持久化

### 3. 用户界面
- 深色主题设计
- 现代化交互体验
- 移动端适配

## API 配置

### 环境变量

创建 `.env.local` 文件：

```env
# Coze API 配置
COZE_API_TOKEN=your_coze_token
COZE_WORKFLOW_ID=7555704402121506826

# 其他 API 配置
DEEPL_API_KEY=your_deepl_key
MINIMAX_API_KEY=your_minimax_key
MINIMAX_GROUP_ID=your_group_id
```

## 开发指南

### 添加新的 UI 组件

使用 shadcn/ui CLI：

```bash
bunx shadcn@latest add [component-name]
```

### 代码格式化

```bash
bun format
```

### 类型检查

```bash
bun lint
```

## 部署

### Netlify

项目已配置 `netlify.toml`，可直接部署到 Netlify。

### Vercel

```bash
vercel deploy
```

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License