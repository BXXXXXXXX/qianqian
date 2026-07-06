import { BottomNavigation } from "@/components/BottomNavigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <main className="app-main">{children}</main>
      <BottomNavigation />
    </div>
  );
}
