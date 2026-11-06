"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getSidebarGroups,
  isSidebarLinkActive,
  type SidebarGroup,
  type SidebarLink,
} from "@/lib/sidebar-nav";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  className?: string;
  onNavigate?: () => void;
};

function SidebarLinkRow({
  link,
  active,
  onNavigate,
}: {
  link: SidebarLink;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-md px-2 py-1.5 text-[0.8125rem] outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      {link.badge ? (
        <span className="w-5 shrink-0 font-mono text-[0.65rem] tabular-nums text-muted-foreground">
          {link.badge}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{link.label}</span>
    </Link>
  );
}

function SidebarGroupBlock({
  group,
  pathname,
  hasActiveChild,
  onNavigate,
}: {
  group: SidebarGroup;
  pathname: string;
  hasActiveChild: boolean;
  onNavigate?: () => void;
}) {
  // Collapsible groups (分类) default closed unless a child route is active.
  // Do not force-open on `/`. Parent remounts this block when active-child
  // flips so SPA navigations re-apply the default without an effect.
  const [open, setOpen] = useState(
    () => !group.collapsible || hasActiveChild,
  );

  const body = (
    <ul className="space-y-0.5">
      {group.links.map((link) => (
        <li key={link.href}>
          <SidebarLinkRow
            link={link}
            active={isSidebarLinkActive(pathname, link)}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );

  if (!group.collapsible) {
    return (
      <div className="space-y-2">
        <h2 className="px-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {group.label}
        </h2>
        {body}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 outline-none",
          "font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground",
          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
        )}
      >
        <span>{group.label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>{body}</CollapsibleContent>
    </Collapsible>
  );
}

/** Dense grouped nav — shared by desktop sticky sidebar and mobile drawer. */
export function SidebarNav({ className, onNavigate }: SidebarNavProps) {
  const pathname = usePathname() ?? "/";
  const groups = useMemo(() => getSidebarGroups(), []);

  return (
    <nav
      aria-label="目录"
      className={cn("flex flex-col gap-6", className)}
    >
      {groups.map((group) => {
        const hasActiveChild = group.links.some((link) =>
          isSidebarLinkActive(pathname, link),
        );
        return (
          <SidebarGroupBlock
            key={
              group.collapsible
                ? `${group.id}:${hasActiveChild ? "on" : "off"}`
                : group.id
            }
            group={group}
            pathname={pathname}
            hasActiveChild={hasActiveChild}
            onNavigate={onNavigate}
          />
        );
      })}
    </nav>
  );
}

/** Desktop sticky sidebar (~16rem), visible from lg up. */
export function AppSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 lg:block",
        className,
      )}
      aria-label="侧栏目录"
    >
      <div
        className={cn(
          "sticky top-[calc(3rem+env(safe-area-inset-top))] max-h-[calc(100svh-3rem-env(safe-area-inset-top))] overflow-y-auto overscroll-contain",
          "border-r border-sidebar-border py-1 pr-4",
          "bg-background",
        )}
      >
        <SidebarNav />
      </div>
    </aside>
  );
}
