"use client";

import Link from "next/link";
import { Home, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/constants/routes";

const navItems = [
  { href: routes.workspace, label: "Workspace", icon: Home },
  { href: routes.children, label: "Children", icon: Users },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-2 px-[var(--space-4)] py-[var(--space-2)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === routes.workspace ? pathname === routes.workspace : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] text-[0.75rem] font-semibold leading-none text-ink-muted transition",
                isActive && "bg-surface-muted text-primary",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
