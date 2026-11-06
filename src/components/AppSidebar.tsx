"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
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
  onNavigate,
}: {
  group: SidebarGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  // Collapsible groups (分类) default expanded; user can still collapse.
  const [open, setOpen] = useState(true);

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
        <ChevronRightIcon
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-90",
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
      {groups.map((group) => (
        <SidebarGroupBlock
          key={group.id}
          group={group}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

/**
 * Desktop sticky sidebar (~16rem), visible from lg up.
 * Outer aside stretches full body height so border-r meets the header
 * bottom rule and continues to the page foot (footer sits in the right column).
 */
export function AppSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-border/70 lg:block",
        "pl-4 sm:pl-6",
        className,
      )}
      aria-label="侧栏目录"
    >
      <div
        className={cn(
          "sticky top-[calc(3rem+env(safe-area-inset-top))] max-h-[calc(100svh-3rem-env(safe-area-inset-top))] overflow-y-auto overscroll-contain",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "py-7 pr-4 sm:py-9",
          "bg-background",
        )}
      >
        <SidebarNav />
      </div>
    </aside>
  );
}
