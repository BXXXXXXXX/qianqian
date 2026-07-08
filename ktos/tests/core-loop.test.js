import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createKtosLoop } from "../packages/domain/src/ktosLoop.js";
import { JsonStore } from "../packages/domain/src/storage/JsonStore.js";

test("KTOS V1 runs record -> understanding -> fact -> timeline -> report", () => {
  const storeFile = path.join(os.tmpdir(), `ktos-test-${Date.now()}.json`);
  const ktos = createKtosLoop({ store: new JsonStore(storeFile) });
  const teacherId = "teacher_demo";
  const classId = "class_demo";
  const recordedAt = "2026-07-09T08:20:00+08:00";

  const recordResult = ktos.record({
    teacherId,
    classId,
    type: "voice",
    content: "今天晨检小宇有点咳嗽，媛媛今天心情很好，今天要准备家长开放日。",
    recordedAt
  });

  assert.equal(recordResult.observation.input_type, "voice");
  assert.equal(recordResult.understanding.events.length, 3);
  assert.equal(recordResult.pending_facts.length, 3);
  assert.equal(recordResult.pending_facts[0].confirm_status, "PENDING");

  const emptyTimeline = ktos.getTimeline({ teacherId, classId, date: "2026-07-09" });
  assert.equal(emptyTimeline.events.length, 0);

  for (const fact of recordResult.pending_facts) {
    ktos.confirmFact({ factId: fact.id, teacherId });
  }

  const timeline = ktos.getTimeline({ teacherId, classId, date: "2026-07-09" });
  assert.equal(timeline.events.length, 3);
  assert.equal(timeline.events[0].fact.student_name, "小宇");
  assert.equal(timeline.events[0].fact.confirm_status, "CONFIRMED");

  const report = ktos.generateDailyReport({ teacherId, classId, date: "2026-07-09" });
  assert.equal(report.status, "DRAFT");
  assert.equal(report.requires_teacher_confirmation, true);
  assert.equal(report.source_fact_ids.length, 3);
  assert.match(report.content.sections.class_overview.join("\n"), /小宇/u);
  assert.match(report.content.sections.parent_communication.join("\n"), /开放日/u);

  const confirmedReport = ktos.confirmReport({ reportId: report.id, teacherId });
  assert.equal(confirmedReport.status, "CONFIRMED");

  const inbox = ktos.getTodayInbox({ teacherId, classId, date: "2026-07-09" });
  assert.equal(inbox.today_records, 3);
  assert.equal(inbox.pending_confirmations, 0);

  fs.rmSync(storeFile, { force: true });
});
