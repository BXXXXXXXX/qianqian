import { todayInHongKong } from "../time.js";

export class InboxEngine {
  constructor({ store }) {
    this.store = store;
  }

  getTodayInbox({ teacherId, classId, date = todayInHongKong() }) {
    const facts = this.store.listFacts({ teacherId, classId });
    const reports = this.store.listReports({ teacherId, classId, date });
    const todayFacts = facts.filter((fact) => fact.occurred_at.startsWith(date));
    const confirmedFacts = todayFacts.filter((fact) => fact.confirm_status === "CONFIRMED");
    const pendingFacts = todayFacts.filter((fact) => fact.confirm_status === "PENDING");
    const draftReport = reports.find((report) => report.status === "DRAFT");

    return {
      date,
      today_records: confirmedFacts.length,
      pending_confirmations: pendingFacts.length,
      draft_report: Boolean(draftReport),
      suggestions: this.#suggest({ confirmedFacts, pendingFacts, draftReport })
    };
  }

  #suggest({ confirmedFacts, pendingFacts, draftReport }) {
    const suggestions = [];

    if (pendingFacts.length > 0) {
      suggestions.push({
        type: "confirm_facts",
        title: "确认刚刚整理的事实",
        reason: `还有 ${pendingFacts.length} 条 AI 整理结果等待老师确认。`,
        saved_time_minutes: 3
      });
    }

    if (confirmedFacts.length > 0 && !draftReport) {
      suggestions.push({
        type: "prepare_report",
        title: "生成今日记录草稿",
        reason: `今天已有 ${confirmedFacts.length} 条已确认事实，可以先整理成日报草稿。`,
        saved_time_minutes: 8
      });
    }

    return suggestions;
  }
}
