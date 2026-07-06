# Data Model

更新时间：2026-07-06
负责人：Development
版本：v0.1
状态：Draft

---

## Core Tables

- children
- classrooms
- teachers
- events
- facts
- drafts
- growth_records
- decision_audit_logs

---

## 核心关系

- 一个 child 可以关联多个 event。
- 一个 event 可以包含多个 fact。
- 一个 event 可以生成多个 draft。
- 一个 confirmed draft 可以成为 growth_record。

---

## 数据原则

保留原始输入，保留结构化事实，保留老师确认记录。
