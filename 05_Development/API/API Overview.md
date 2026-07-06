# API Overview

更新时间：2026-07-06
负责人：Development
版本：v0.1
状态：Draft

---

## 初始资源

- `children`
- `events`
- `drafts`
- `growth_records`
- `teachers`
- `classrooms`

---

## 初始接口

- `POST /events/capture`
- `GET /children`
- `GET /children/{id}/timeline`
- `POST /drafts/{id}/confirm`
- `PATCH /drafts/{id}`

---

## API 原则

事件事实和生成草稿分开存储。草稿可以重生成，事实必须可追溯。
