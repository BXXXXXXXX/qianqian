const teacherId = "teacher_demo";
const classId = "class_demo";

const state = {
  pendingFacts: [],
  timeline: [],
  inbox: null,
  report: null,
  isRecording: false
};

const elements = {
  welcome: document.querySelector("#welcome"),
  inbox: document.querySelector("#inbox"),
  startWorkButton: document.querySelector("#startWorkButton"),
  recordCount: document.querySelector("#recordCount"),
  pendingCount: document.querySelector("#pendingCount"),
  reportStatus: document.querySelector("#reportStatus"),
  savedMinutes: document.querySelector("#savedMinutes"),
  suggestionList: document.querySelector("#suggestionList"),
  pressToTalkButton: document.querySelector("#pressToTalkButton"),
  recordHint: document.querySelector("#recordHint"),
  transcriptPreview: document.querySelector("#transcriptPreview"),
  recordText: document.querySelector("#recordText"),
  factCards: document.querySelector("#factCards"),
  timelineList: document.querySelector("#timelineList"),
  reportButton: document.querySelector("#reportButton"),
  reportDraft: document.querySelector("#reportDraft")
};

elements.startWorkButton.addEventListener("click", async () => {
  elements.welcome.classList.add("hidden");
  elements.inbox.classList.remove("hidden");
  await refreshInbox();
  await refreshTimeline();
});

elements.pressToTalkButton.addEventListener("pointerdown", startRecording);
elements.pressToTalkButton.addEventListener("pointerup", finishRecording);
elements.pressToTalkButton.addEventListener("pointercancel", cancelRecording);
elements.pressToTalkButton.addEventListener("pointerleave", () => {
  if (state.isRecording) {
    finishRecording();
  }
});

elements.reportButton.addEventListener("click", async () => {
  const report = await request("/api/v1/reports/daily", {
    method: "POST",
    body: { teacherId, classId, date: today() }
  });
  state.report = report;
  renderReport(report);
  await refreshInbox();
});

function startRecording(event) {
  event.preventDefault();
  state.isRecording = true;
  elements.pressToTalkButton.classList.add("is-recording");
  elements.pressToTalkButton.setAttribute("aria-pressed", "true");
  elements.pressToTalkButton.querySelector("span").textContent = "正在记录";
  elements.recordHint.textContent = "正在听。松开后我会整理成 Fact Card。";
  elements.transcriptPreview.textContent = elements.recordText.value.trim();
}

async function finishRecording() {
  if (!state.isRecording) {
    return;
  }

  state.isRecording = false;
  elements.pressToTalkButton.classList.remove("is-recording");
  elements.pressToTalkButton.setAttribute("aria-pressed", "false");
  elements.pressToTalkButton.querySelector("span").textContent = "按住说话";
  elements.recordHint.textContent = "我正在整理这一段记录。";

  const content = elements.recordText.value.trim();
  if (!content) {
    elements.recordHint.textContent = "先说一句今天发生了什么。";
    return;
  }

  const result = await request("/api/v1/records", {
    method: "POST",
    body: {
      teacherId,
      classId,
      type: "voice",
      content,
      recordedAt: new Date().toISOString()
    }
  });

  state.pendingFacts = result.pending_facts;
  elements.recordHint.textContent = "我整理了一版，请老师确认后进入时间线。";
  renderFactCards();
  await refreshInbox();
}

function cancelRecording() {
  state.isRecording = false;
  elements.pressToTalkButton.classList.remove("is-recording");
  elements.pressToTalkButton.setAttribute("aria-pressed", "false");
  elements.pressToTalkButton.querySelector("span").textContent = "按住说话";
}

async function confirmFact(factId) {
  await request(`/api/v1/facts/${factId}/confirm`, {
    method: "POST",
    body: { teacherId }
  });

  state.pendingFacts = state.pendingFacts.filter((fact) => fact.id !== factId);
  renderFactCards();
  await refreshTimeline();
  await refreshInbox();
}

async function ignoreFact(factId) {
  await request(`/api/v1/facts/${factId}/reject`, {
    method: "POST",
    body: { teacherId, reason: "Teacher ignored this Fact Card in prototype." }
  });

  state.pendingFacts = state.pendingFacts.filter((fact) => fact.id !== factId);
  renderFactCards();
  await refreshInbox();
}

function editFact(factId) {
  const fact = state.pendingFacts.find((item) => item.id === factId);
  if (!fact) {
    return;
  }

  elements.recordText.value = fact.description;
  elements.recordHint.textContent = "先在演示文字里修改，再重新按住记录。";
}

async function refreshInbox() {
  state.inbox = await request(`/api/v1/inbox/today?teacherId=${teacherId}&classId=${classId}&date=${today()}`);
  renderInbox();
}

async function refreshTimeline() {
  const timeline = await request(`/api/v1/timeline?teacherId=${teacherId}&classId=${classId}&date=${today()}`);
  state.timeline = timeline.events;
  renderTimeline();
}

function renderInbox() {
  const inbox = state.inbox ?? { today_records: 0, pending_confirmations: 0, draft_report: false, suggestions: [] };
  elements.recordCount.textContent = inbox.today_records;
  elements.pendingCount.textContent = inbox.pending_confirmations + state.pendingFacts.length;
  elements.reportStatus.textContent = inbox.draft_report || state.report ? "草稿已准备" : "未生成";
  elements.savedMinutes.textContent = estimateSavedMinutes(inbox);

  if (inbox.suggestions.length === 0) {
    elements.suggestionList.innerHTML = `<p class="empty">先记录一件今天发生的事。</p>`;
    return;
  }

  elements.suggestionList.innerHTML = inbox.suggestions.map((suggestion) => `
    <article class="suggestion">
      <strong>${escapeHtml(suggestion.title)}</strong>
      <p>${escapeHtml(suggestion.reason)}</p>
    </article>
  `).join("");
}

function renderFactCards() {
  if (state.pendingFacts.length === 0) {
    elements.factCards.innerHTML = `<p class="empty">暂无待确认 Fact。</p>`;
    return;
  }

  elements.factCards.innerHTML = state.pendingFacts.map((fact) => `
    <article class="fact-card">
      <strong>${escapeHtml(fact.student_name ?? "班级事项")}</strong>
      <div class="fact-meta">
        <span>${escapeHtml(labelEventType(fact.event_type))}</span>
        <span>${escapeHtml(fact.action)}</span>
        <span>${formatTime(fact.occurred_at)}</span>
        <span>把握 ${Math.round(fact.confidence * 100)}%</span>
      </div>
      <p>${escapeHtml(fact.explain_why)}</p>
      <div class="fact-actions">
        <button data-action="confirm" data-id="${fact.id}">确认</button>
        <button data-action="edit" data-id="${fact.id}">修改</button>
        <button data-action="ignore" data-id="${fact.id}">忽略</button>
      </div>
    </article>
  `).join("");

  elements.factCards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (button.dataset.action === "confirm") {
        confirmFact(id);
      } else if (button.dataset.action === "ignore") {
        ignoreFact(id);
      } else {
        editFact(id);
      }
    });
  });
}

function renderTimeline() {
  if (state.timeline.length === 0) {
    elements.timelineList.innerHTML = `<p class="empty">确认后的 Fact 会按发生时间出现在这里。</p>`;
    return;
  }

  elements.timelineList.innerHTML = state.timeline.map((event) => `
    <article class="timeline-item">
      <span class="timeline-time">${formatTime(event.occurred_at)}</span>
      <div>
        <strong>${escapeHtml(event.fact.student_name ?? "班级事项")}</strong>
        <span>${escapeHtml(event.fact.action)}</span>
      </div>
    </article>
  `).join("");
}

function renderReport(report) {
  const overview = report.content.sections.class_overview;
  elements.reportDraft.textContent = [
    report.content.title,
    report.content.summary,
    "",
    "今日时间轴：",
    ...(overview.length ? overview : ["暂无已确认事实。"]),
    "",
    report.content.teacher_confirmation_note
  ].join("\n");
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: options.body ? { "content-type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

function estimateSavedMinutes(inbox) {
  const suggestionMinutes = inbox.suggestions.reduce((total, suggestion) => total + suggestion.saved_time_minutes, 0);
  return Math.max(0, inbox.today_records * 2 + suggestionMinutes);
}

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function formatTime(value) {
  return value.slice(11, 16);
}

function labelEventType(type) {
  const labels = {
    communication: "沟通",
    emotion: "情绪",
    general: "记录",
    health: "健康",
    meal: "进餐",
    safety: "安全",
    sleep: "午睡"
  };

  return labels[type] ?? type;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

renderFactCards();
renderTimeline();
