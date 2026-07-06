import { ChildDetailPage } from "@/features/children/ChildDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  return <ChildDetailPage childId={childId} />;
}
