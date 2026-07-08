import { createId } from "../id.js";
import { todayInHongKong } from "../time.js";

export class ReportEngine {
  constructor({ store, timelineEngine }) {
    this.store = store;
    this.timelineEngine = timelineEngine;
  }

  generateDailyReport({ teacherId, classId, date = todayInHongKong() }) {
    if (!teacherId) {
      const error = new Error("teacherId is required.");
      error.statusCode = 400;
      throw error;
    }

    const timeline = this.timelineEngine.getDailyTimeline({ teacherId, classId, date });
    const facts = timeline.events.map((event) => event.fact);

    const report = {
      id: createId("report"),
      teacher_id: teacherId,
      class_id: classId ?? null,
      report_date: date,
      status: "DRAFT",
      requires_teacher_confirmation: true,
      source_fact_ids: facts.map((fact) => fact.id),
      content: buildReportContent({ date, facts }),
      explain_why: `根据 ${facts.length} 条已确认事实整理，草稿需要老师确认后才能使用。`,
      created_at: new Date().toISOString()
    };

    this.store.createReport(report);
    return report;
  }

  confirmReport({ reportId, teacherId }) {
    const report = this.store.getReport(reportId);
    if (!report) {
      const error = new Error("Report not found.");
      error.statusCode = 404;
      throw error;
    }

    if (report.teacher_id !== teacherId) {
      const error = new Error("Only the owning teacher can confirm this report.");
      error.statusCode = 403;
      throw error;
    }

    return this.store.updateReport(reportId, {
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
      confirmed_by: teacherId
    });
  }
}

function buildReportContent({ date, facts }) {
  const timelineLines = facts.map((fact) => {
    const time = fact.occurred_at.slice(11, 16);
    const subject = fact.student_name ?? "班级事项";
    return `${time} ${subject}: ${fact.action}`;
  });

  const specialAttention = facts
    .filter((fact) => ["health", "safety", "emotion"].includes(fact.event_type))
    .map((fact) => `${fact.student_name ?? "班级事项"}: ${fact.action}`);

  const parentCommunication = facts
    .filter((fact) => ["health", "safety", "communication"].includes(fact.event_type))
    .map((fact) => `${fact.student_name ?? "班级事项"}: ${fact.action}`);

  return {
    title: `${date} 今日记录草稿`,
    summary: facts.length === 0
      ? "今天还没有已确认事实。"
      : `今天已整理 ${facts.length} 条已确认事实。`,
    sections: {
      class_overview: timelineLines,
      special_attention: specialAttention,
      parent_communication: parentCommunication
    },
    teacher_confirmation_note: "这是一版草稿。请老师确认、修改或重新生成。"
  };
}
