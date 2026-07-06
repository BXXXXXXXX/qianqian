# RFC-0001 App Foundation

Version: 0.1.0

Status: Frozen

Author: Product

Owner: Engineering (Codex)

---

# Goal

建立 KTOS V1 的工程基础。

**本 RFC 不涉及任何 AI、业务逻辑、数据库设计。**

目标是让 App 可以开始开发，并且未来不会因为产品演进而推翻重构。

---

# Product Background

KTOS 是一个 AI 驱动的幼儿园教师工作助手。

第一版目标：

> 帮助老师快速记录事件，并自动生成家长沟通、成长记录等文书。

当前 Sprint 不开发 AI，仅完成工程基础。

---

# Sprint Target

完成一个可运行的 App Skeleton。

要求：

- 页面可跳转
- UI 可展示
- Mock Data 可运行
- 后续 AI 可直接接入

---

# Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui style component foundation
- Zustand
- React Query (TanStack Query)
- pnpm

说明：如工程已有既定技术选型，可保持一致，但需满足组件化、可扩展和易于替换 AI 服务的目标。

---

# Folder Structure

```text
src/
  app/
  components/
  features/
  services/
  store/
  hooks/
  types/
  mock/
  design/
  constants/
  lib/
```

---

# features

每一个业务模块一个目录。

例如：

```text
features/
  workspace/
  record/
  review/
  children/
```

禁止所有业务逻辑直接堆放在 Page。

---

# Design System

建立：

```text
design/
  colors.ts
  spacing.ts
  typography.ts
  radius.ts
  shadow.ts
  motion.ts
```

所有 UI 引用 Design Token。

禁止 Magic Number。

---

# App Shell

建立基础导航。

底部导航仅保留：

```text
Workspace
Children
```

其它功能入口暂不开放。

---

# Component Library

请先建立组件，不开发页面。

第一批组件：

```text
PrimaryButton
SecondaryButton
Card
Section
VoiceButton
SuggestionCard
ChildCard
ProgressCard
BottomNavigation
LoadingView
EmptyView
```

每个组件：

- 独立目录
- 独立 Props
- 方便后续 Storybook

---

# Workspace Page

仅完成静态布局。

使用 Mock Data。

例如：

```json
{
  "todaySuggestion": "继续完成今天成长记录",
  "savingTime": "预计节约12分钟",
  "recentEvents": []
}
```

不要写业务逻辑。

---

# Voice Button

完成：

- 按住开始
- 松开发送

目前：

- 无需录音
- 无需 Speech API

仅实现：

- Pressed
- Released
- Loading

三个状态。

---

# Children Page

建立：

- 孩子列表
- 孩子详情

均使用 Mock。

---

# Mock Layer

建立：

```text
mock/
  workspace.ts
  children.ts
  review.ts
  events.ts
```

所有页面读取 Mock。

不要写死数据。

---

# Service Layer

建立：

```text
services/
  workspace.ts
  record.ts
  review.ts
  children.ts
```

目前：

全部 `Promise.resolve()`

方便未来替换 API。

---

# Store

建议：

```text
WorkspaceStore
RecordStore
ReviewStore
ChildrenStore
```

不要提前设计复杂状态。

---

# 禁止开发

以下全部等待 RFC：

- AI
- Prompt
- Memory
- Event Engine
- Database
- Authentication
- Notification
- Push
- Report
- Timeline

---

# Definition of Done

完成后能够演示：

```text
启动 App
↓
Workspace
↓
点击录音按钮
↓
进入 Recording 状态
↓
跳转 Review
↓
确认
↓
返回 Workspace
```

所有数据可以是 Mock。

不要求 AI。

---

# Deliverables

- App Skeleton
- Component Library
- Navigation
- Mock Layer
- Workspace
- Children
- Voice Button

---

# Out of Scope

不要自行设计产品。

如遇产品逻辑不明确。

请反馈。

不要自行决定。

---

# Priority

Five stars. Must complete.
