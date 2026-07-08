import { createId } from "../id.js";

export class FactEngine {
  constructor({ store }) {
    this.store = store;
  }

  createPendingFacts({ observation, understanding }) {
    return understanding.events.map((event) => {
      const fact = {
        id: createId("fact"),
        teacher_id: observation.teacher_id,
        class_id: observation.class_id,
        student_id: event.student_id,
        student_name: event.student_name,
        event_type: event.event_type,
        action: event.action,
        description: event.description,
        occurred_at: event.occurred_at,
        recorded_at: observation.created_at,
        source: {
          observation_id: observation.id,
          type: observation.input_type,
          raw_text: observation.content
        },
        confidence: event.confidence,
        confirm_status: "PENDING",
        tags: event.tags,
        created_by: "AI",
        requires_teacher_confirmation: true,
        explain_why: event.reason
      };

      this.store.createFact(fact);
      return fact;
    });
  }

  confirmFact({ factId, teacherId }) {
    const fact = this.store.getFact(factId);
    if (!fact) {
      const error = new Error("Fact not found.");
      error.statusCode = 404;
      throw error;
    }

    if (fact.teacher_id !== teacherId) {
      const error = new Error("Only the owning teacher can confirm this fact.");
      error.statusCode = 403;
      throw error;
    }

    return this.store.updateFact(factId, {
      confirm_status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
      confirmed_by: teacherId
    });
  }

  rejectFact({ factId, teacherId, reason }) {
    const fact = this.store.getFact(factId);
    if (!fact) {
      const error = new Error("Fact not found.");
      error.statusCode = 404;
      throw error;
    }

    if (fact.teacher_id !== teacherId) {
      const error = new Error("Only the owning teacher can reject this fact.");
      error.statusCode = 403;
      throw error;
    }

    return this.store.updateFact(factId, {
      confirm_status: "REJECTED",
      rejected_at: new Date().toISOString(),
      rejected_by: teacherId,
      rejected_reason: reason ?? "Teacher rejected this AI understanding."
    });
  }
}
