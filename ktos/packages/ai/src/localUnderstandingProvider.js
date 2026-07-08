const EVENT_RULES = [
  {
    type: "health",
    tags: ["health"],
    pattern: /(咳嗽|发烧|流鼻涕|不舒服|肚子疼|呕吐|过敏)/u
  },
  {
    type: "emotion",
    tags: ["emotion"],
    pattern: /(心情|开心|哭|难过|情绪|害怕|兴奋)/u
  },
  {
    type: "sleep",
    tags: ["sleep"],
    pattern: /(午睡|入睡|睡着|醒来)/u
  },
  {
    type: "meal",
    tags: ["meal"],
    pattern: /(早餐|午餐|吃饭|喝水|进餐)/u
  },
  {
    type: "safety",
    tags: ["safety"],
    pattern: /(摔|磕|碰|受伤|抓伤|流血)/u
  },
  {
    type: "communication",
    tags: ["communication"],
    pattern: /(家长|通知|沟通|开放日|接送)/u
  }
];

const CONTEXT_TIMES = [
  { pattern: /晨检|入园/u, time: "08:10" },
  { pattern: /早餐/u, time: "08:30" },
  { pattern: /户外|区域/u, time: "10:00" },
  { pattern: /午餐/u, time: "11:30" },
  { pattern: /午睡/u, time: "13:00" },
  { pattern: /下午/u, time: "15:30" },
  { pattern: /放学|离园/u, time: "16:30" }
];

const STUDENT_STOP_WORDS = new Set([
  "今天",
  "晨检",
  "上午",
  "下午",
  "中午",
  "午睡",
  "午餐",
  "早餐",
  "家长",
  "开放日",
  "准备",
  "通知"
]);

export class LocalUnderstandingProvider {
  understand(observation) {
    const clauses = splitClauses(observation.content);
    const events = clauses.map((clause) => this.#understandClause(clause, observation));

    return {
      id: `understanding_${observation.id}`,
      observation_id: observation.id,
      teacher_id: observation.teacher_id,
      class_id: observation.class_id,
      events,
      explanation: `我理解这次记录里有 ${events.length} 件需要整理的事情。请老师确认后再进入正式时间线。`
    };
  }

  #understandClause(clause, observation) {
    const rule = EVENT_RULES.find((candidate) => candidate.pattern.test(clause));
    const studentName = extractStudentName(clause);
    const action = extractAction(clause, studentName);

    return {
      student_name: studentName,
      student_id: studentName ? stableStudentId(studentName) : null,
      event_type: rule?.type ?? "general",
      action,
      description: clause,
      occurred_at: inferOccurredAt(clause, observation.created_at),
      confidence: studentName ? 0.86 : 0.72,
      tags: rule?.tags ?? ["general"],
      missing_fields: studentName ? [] : ["student_name"],
      reason: studentName
        ? "根据老师的原始记录识别出孩子、事件类型和发生时间。"
        : "这条记录更像班级事项，未识别到具体孩子。"
    };
  }
}

function splitClauses(content) {
  return content
    .split(/[，,。；;\n]+/u)
    .map((part) => part.trim())
    .filter(Boolean);
}

function extractStudentName(clause) {
  const normalized = clause
    .replace(/^(今天|早上|上午|下午|中午|晨检|午睡|早餐|午餐|户外|区域活动|放学|入园|离园)+/u, "")
    .replace(/的时候/u, "");

  const patterns = [
    /^([\u4e00-\u9fa5]{2,3})(?:今天|有点|一直|心情|哭|咳嗽|发烧|吃|午睡|摔|不舒服|流鼻涕|表现|喝水)/u,
    /(?:今天|晨检|上午|下午)([\u4e00-\u9fa5]{2,3})(?:有点|一直|心情|哭|咳嗽|发烧|吃|午睡|摔|不舒服|流鼻涕|表现|喝水)/u
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern) ?? clause.match(pattern);
    if (match && !STUDENT_STOP_WORDS.has(match[1])) {
      return match[1];
    }
  }

  return null;
}

function extractAction(clause, studentName) {
  let action = clause
    .replace(/今天|早上|上午|下午|中午|晨检|的时候|时候/gu, "")
    .trim();

  if (studentName) {
    action = action.replace(studentName, "").trim();
  }

  return action || clause;
}

function inferOccurredAt(clause, createdAt) {
  const date = createdAt.slice(0, 10);
  const context = CONTEXT_TIMES.find((item) => item.pattern.test(clause));
  if (context) {
    return `${date}T${context.time}:00+08:00`;
  }

  const explicitTime = clause.match(/(\d{1,2})[:：点](\d{0,2})/u);
  if (explicitTime) {
    const hour = explicitTime[1].padStart(2, "0");
    const minute = (explicitTime[2] || "00").padStart(2, "0");
    return `${date}T${hour}:${minute}:00+08:00`;
  }

  return createdAt;
}

function stableStudentId(name) {
  return `student_${Buffer.from(name).toString("hex")}`;
}
