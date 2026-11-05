import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IndexRowProps = {
  href: string;
  /** Tiny mono label on the left (e.g. count, id, section code). */
  badge?: string;
  title: string;
  /** Optional muted trailing meta before the arrow. */
  meta?: React.ReactNode;
  description?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * Flat hairline index row — aihero-style: mono badge + title + arrow.
 * Prefer this over card grids for curated lists.
 */
export function IndexRow({
  href,
  badge,
  title,
  meta,
  description,
  className,
  onClick,
}: IndexRowProps) {
  return (
    <li className={cn("border-b border-border/80 last:border-b-0", className)}>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group flex min-h-11 items-center gap-3 py-3 outline-none transition-colors",
          "hover:bg-muted/30 focus-visible:bg-muted/40",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
        )}
      >
        {badge ? (
          <span className="w-10 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-tight text-muted-foreground">
            {badge}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium leading-snug text-foreground">
            {title}
          </span>
          {description ? (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            {meta}
          </span>
        ) : null}
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </Link>
    </li>
  );
}

type IndexSectionProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

/** Section wrapper with mono micro-label above a hairline list. */
export function IndexSection({ label, children, className, action }: IndexSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </h2>
        {action}
      </div>
      <ul className="border-t border-border/80">{children}</ul>
    </section>
  );
}
