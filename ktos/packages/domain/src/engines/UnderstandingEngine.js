import { LocalUnderstandingProvider } from "../../../../packages/ai/src/localUnderstandingProvider.js";

export class UnderstandingEngine {
  constructor({ provider = new LocalUnderstandingProvider() } = {}) {
    this.provider = provider;
  }

  understand(observation) {
    return this.provider.understand(observation);
  }
}
