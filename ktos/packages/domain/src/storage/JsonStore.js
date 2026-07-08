import fs from "node:fs";
import path from "node:path";

const DEFAULT_DATA = {
  observations: [],
  facts: [],
  timeline_events: [],
  reports: []
};

export class JsonStore {
  constructor(filePath = process.env.KTOS_DATA_FILE ?? path.resolve("ktos/.data/dev-store.json")) {
    this.filePath = filePath;
    this.data = this.#load();
  }

  createObservation(observation) {
    this.data.observations.push(observation);
    this.#save();
    return observation;
  }

  createFact(fact) {
    this.data.facts.push(fact);
    this.#save();
    return fact;
  }

  getFact(factId) {
    return this.data.facts.find((fact) => fact.id === factId) ?? null;
  }

  updateFact(factId, patch) {
    const index = this.data.facts.findIndex((fact) => fact.id === factId);
    if (index === -1) {
      return null;
    }

    this.data.facts[index] = { ...this.data.facts[index], ...patch };
    this.#save();
    return this.data.facts[index];
  }

  listFacts(filter = {}) {
    return this.data.facts.filter((fact) => {
      if (filter.teacherId && fact.teacher_id !== filter.teacherId) {
        return false;
      }
      if (filter.classId && fact.class_id !== filter.classId) {
        return false;
      }
      if (filter.status && fact.confirm_status !== filter.status) {
        return false;
      }
      return true;
    });
  }

  createTimelineEvent(event) {
    this.data.timeline_events.push(event);
    this.#save();
    return event;
  }

  listTimelineEvents(filter = {}) {
    return this.data.timeline_events.filter((event) => {
      if (filter.teacherId && event.teacher_id !== filter.teacherId) {
        return false;
      }
      if (filter.classId && event.class_id !== filter.classId) {
        return false;
      }
      if (filter.date && !event.occurred_at.startsWith(filter.date)) {
        return false;
      }
      return true;
    });
  }

  createReport(report) {
    this.data.reports.push(report);
    this.#save();
    return report;
  }

  getReport(reportId) {
    return this.data.reports.find((report) => report.id === reportId) ?? null;
  }

  updateReport(reportId, patch) {
    const index = this.data.reports.findIndex((report) => report.id === reportId);
    if (index === -1) {
      return null;
    }

    this.data.reports[index] = { ...this.data.reports[index], ...patch };
    this.#save();
    return this.data.reports[index];
  }

  listReports(filter = {}) {
    return this.data.reports.filter((report) => {
      if (filter.teacherId && report.teacher_id !== filter.teacherId) {
        return false;
      }
      if (filter.classId && report.class_id !== filter.classId) {
        return false;
      }
      if (filter.date && report.report_date !== filter.date) {
        return false;
      }
      return true;
    });
  }

  #load() {
    if (!fs.existsSync(this.filePath)) {
      return structuredClone(DEFAULT_DATA);
    }

    return {
      ...structuredClone(DEFAULT_DATA),
      ...JSON.parse(fs.readFileSync(this.filePath, "utf8"))
    };
  }

  #save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }
}
