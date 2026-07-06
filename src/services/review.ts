import { reviewMock } from "@/mock/review";

export async function getReviewDraft() {
  return Promise.resolve(reviewMock);
}

export async function confirmReviewDraft() {
  return Promise.resolve({ ok: true });
}
