# KTOS V1 MVP

This is the first runnable KTOS implementation. It intentionally focuses on the smallest useful loop:

```text
Voice/Text Record
  -> AI Understanding
  -> Pending Fact
  -> Teacher Confirmation
  -> Timeline
  -> Report Draft
  -> Teacher Confirmation
```

## Scope

Implemented now:

- Observation Engine
- Understanding Engine
- Fact Engine
- Timeline Engine
- Report Engine
- Inbox summary
- JSON file storage for local development
- Node built-in test coverage for the closed loop

Not implemented yet:

- Memory
- Knowledge
- Workflow learning
- Automation
- Auto-send actions

The code keeps those future modules out of the active path. V1 only prepares drafts and waits for teacher confirmation.

## Run

```bash
npm test
npm run dev
```

The API defaults to `http://localhost:8787`.

## Example

```bash
curl -X POST http://localhost:8787/api/v1/records \
  -H "Content-Type: application/json" \
  -d "{\"teacherId\":\"teacher_demo\",\"classId\":\"class_demo\",\"type\":\"voice\",\"content\":\"今天晨检小宇有点咳嗽，媛媛今天心情很好，今天要准备家长开放日。\"}"
```

The response contains an observation, AI understanding, and pending facts. Confirm facts before they enter the official timeline.
