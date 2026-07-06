export const routes = {
  workspace: "/",
  children: "/children",
  review: "/review",
  childDetail: (childId: string) => `/children/${childId}`,
} as const;
