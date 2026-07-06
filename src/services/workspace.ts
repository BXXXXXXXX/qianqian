import { workspaceMock } from "@/mock/workspace";

export async function getWorkspaceSummary() {
  return Promise.resolve(workspaceMock);
}
