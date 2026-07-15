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
The interactive prototype is served at `http://localhost:8787/`.

## Interactive Prototype

The first clickable Sprint prototype focuses only on:

- Today's Inbox
- Press To Talk
- Fact Confirmation Card
- Confirmed-only Timeline
- Report draft entry
- Unlock panel placeholder

The prototype does not introduce chat, Memory, Workflow, Knowledge, or Automation. It uses the existing V1 API loop and keeps teacher confirmation as the boundary before a Fact enters Timeline or Report.

## Example

```bash
curl -X POST http://localhost:8787/api/v1/records \
  -H "Content-Type: application/json" \
  -d "{\"teacherId\":\"teacher_demo\",\"classId\":\"class_demo\",\"type\":\"voice\",\"content\":\"今天晨检小宇有点咳嗽，媛媛今天心情很好，今天要准备家长开放日。\"}"
```

The response contains an observation, AI understanding, and pending facts. Confirm facts before they enter the official timeline.
