import { createId } from "../id.js";

const VALID_INPUT_TYPES = new Set(["voice", "text"]);

export class ObservationEngine {
  constructor({ store }) {
    this.store = store;
  }

  record(input) {
    if (!input.teacherId) {
      const error = new Error("teacherId is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!VALID_INPUT_TYPES.has(input.type)) {
      const error = new Error("type must be voice or text.");
      error.statusCode = 400;
      throw error;
    }

    if (!input.content || input.content.trim().length === 0) {
      const error = new Error("content is required.");
      error.statusCode = 400;
      throw error;
    }

    const observation = {
      id: createId("obs"),
      teacher_id: input.teacherId,
      class_id: input.classId ?? null,
      input_type: input.type,
      content: input.content.trim(),
      created_at: input.recordedAt ?? new Date().toISOString()
    };

    this.store.createObservation(observation);
    return observation;
  }
}
