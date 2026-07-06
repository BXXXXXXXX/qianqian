import { childrenMock } from "@/mock/children";

export async function getChildren() {
  return Promise.resolve(childrenMock);
}

export async function getChildDetail(childId: string) {
  return Promise.resolve(childrenMock.find((child) => child.id === childId) ?? null);
}
