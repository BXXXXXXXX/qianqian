import { FactEngine } from "./engines/FactEngine.js";
import { InboxEngine } from "./engines/InboxEngine.js";
import { ObservationEngine } from "./engines/ObservationEngine.js";
import { ReportEngine } from "./engines/ReportEngine.js";
import { TimelineEngine } from "./engines/TimelineEngine.js";
import { UnderstandingEngine } from "./engines/UnderstandingEngine.js";
import { JsonStore } from "./storage/JsonStore.js";

export function createKtosLoop(options = {}) {
  const store = options.store ?? new JsonStore(options.storeFile);
  const observationEngine = new ObservationEngine({ store });
  const understandingEngine = new UnderstandingEngine(options.understanding);
  const factEngine = new FactEngine({ store });
  const timelineEngine = new TimelineEngine({ store });
  const reportEngine = new ReportEngine({ store, timelineEngine });
  const inboxEngine = new InboxEngine({ store });

  return {
    record(input) {
      const observation = observationEngine.record(input);
      const understanding = understandingEngine.understand(observation);
      const pendingFacts = factEngine.createPendingFacts({ observation, understanding });

      return {
        observation,
        understanding,
        pending_facts: pendingFacts,
        next_step: {
          type: "teacher_confirmation",
          message: "我整理了一版事实。请老师确认后再进入正式时间线。"
        }
      };
    },

    confirmFact(input) {
      const fact = factEngine.confirmFact(input);
      const timelineEvent = timelineEngine.addConfirmedFact(fact);
      return { fact, timeline_event: timelineEvent };
    },

    rejectFact(input) {
      return { fact: factEngine.rejectFact(input) };
    },

    listFacts(filter = {}) {
      return { facts: store.listFacts(filter) };
    },

    getTimeline(input = {}) {
      return timelineEngine.getDailyTimeline(input);
    },

    generateDailyReport(input) {
      return reportEngine.generateDailyReport(input);
    },

    getReport(reportId) {
      const report = store.getReport(reportId);
      if (!report) {
        const error = new Error("Report not found.");
        error.statusCode = 404;
        throw error;
      }
      return report;
    },

    confirmReport(input) {
      return reportEngine.confirmReport(input);
    },

    getTodayInbox(input = {}) {
      return inboxEngine.getTodayInbox(input);
    }
  };
}
