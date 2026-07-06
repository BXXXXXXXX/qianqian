# Fact Schema

更新时间：2026-07-06
负责人：Product / AI / Development
版本：v0.1
状态：Draft

---

## JSON Draft

```json
{
  "event_id": "evt_001",
  "event_type": "Growth",
  "child_ids": ["child_001"],
  "occurred_at": "2026-07-06T09:30:00+08:00",
  "location": "classroom",
  "source": {
    "type": "teacher_voice",
    "raw_text": ""
  },
  "facts": [
    {
      "predicate": "observed_behavior",
      "value": "",
      "confidence": "teacher_reported"
    }
  ],
  "risk_level": "none",
  "sensitivity": "normal",
  "requires_teacher_confirmation": true,
  "draft_outputs": []
}
```

---

## 字段说明

- `event_type`：必须来自 `Event Taxonomy.md`。
- `child_ids`：可以多个儿童。
- `facts`：只写事实，不写评价。
- `risk_level`：`none`、`low`、`medium`、`high`。
- `sensitivity`：用于判断是否适合对外表达。
- `requires_teacher_confirmation`：默认 `true`。
