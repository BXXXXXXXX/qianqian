import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createApp } from "../apps/backend/src/app.js";

test("serves interactive prototype shell", async () => {
  const storeFile = path.join(os.tmpdir(), `ktos-ui-${Date.now()}.json`);
  const server = http.createServer(createApp({ storeFile }));
  const baseUrl = await listen(server);

  try {
    const html = await fetchText(`${baseUrl}/`);
    const appJs = await fetchText(`${baseUrl}/app.js`);
    const css = await fetchText(`${baseUrl}/style.css`);

    assert.match(html, /开始今天工作/u);
    assert.match(html, /Today's Inbox/u);
    assert.match(html, /按住说话/u);
    assert.match(appJs, /confirmFact/u);
    assert.match(css, /\.record-button/u);
  } finally {
    server.close();
    fs.rmSync(storeFile, { force: true });
  }
});

test("interactive prototype API path updates inbox after Fact confirmation", async () => {
  const storeFile = path.join(os.tmpdir(), `ktos-ui-api-${Date.now()}.json`);
  const server = http.createServer(createApp({ storeFile }));
  const baseUrl = await listen(server);
  const teacherId = "teacher_demo";
  const classId = "class_demo";
  const date = "2026-07-09";

  try {
    const record = await postJson(`${baseUrl}/api/v1/records`, {
      teacherId,
      classId,
      type: "voice",
      content: "今天晨检小宇有点咳嗽。",
      recordedAt: `${date}T08:20:00+08:00`
    });

    assert.equal(record.pending_facts.length, 1);

    let inbox = await getJson(`${baseUrl}/api/v1/inbox/today?teacherId=${teacherId}&classId=${classId}&date=${date}`);
    assert.equal(inbox.today_records, 0);
    assert.equal(inbox.pending_confirmations, 1);

    await postJson(`${baseUrl}/api/v1/facts/${record.pending_facts[0].id}/confirm`, { teacherId });

    inbox = await getJson(`${baseUrl}/api/v1/inbox/today?teacherId=${teacherId}&classId=${classId}&date=${date}`);
    const timeline = await getJson(`${baseUrl}/api/v1/timeline?teacherId=${teacherId}&classId=${classId}&date=${date}`);

    assert.equal(inbox.today_records, 1);
    assert.equal(inbox.pending_confirmations, 0);
    assert.equal(timeline.events.length, 1);
  } finally {
    server.close();
    fs.rmSync(storeFile, { force: true });
  }
});

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, () => {
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

async function fetchText(url) {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  return response.text();
}

async function getJson(url) {
  const response = await fetch(url);
  assert.equal(response.status, 200);
  return response.json();
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  assert.ok(response.status >= 200 && response.status < 300);
  return response.json();
}
