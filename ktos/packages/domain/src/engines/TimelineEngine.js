import { createId } from "../id.js";
import { todayInHongKong } from "../time.js";

export class TimelineEngine {
  constructor({ store }) {
    this.store = store;
  }

  addConfirmedFact(fact) {
    const existing = this.store
      .listTimelineEvents({ teacherId: fact.teacher_id })
      .find((event) => event.fact_id === fact.id);

    if (existing) {
      return existing;
    }

    const event = {
      id: createId("timeline"),
      fact_id: fact.id,
      teacher_id: fact.teacher_id,
      class_id: fact.class_id,
      occurred_at: fact.occurred_at,
      created_at: new Date().toISOString()
    };

    this.store.createTimelineEvent(event);
    return event;
  }

  getDailyTimeline({ teacherId, classId, date = todayInHongKong() }) {
    const events = this.store
      .listTimelineEvents({ teacherId, classId, date })
      .map((event) => ({ ...event, fact: this.store.getFact(event.fact_id) }))
      .filter((event) => event.fact?.confirm_status === "CONFIRMED")
      .sort((left, right) => left.occurred_at.localeCompare(right.occurred_at));

    return {
      date,
      events
    };
  }
}
