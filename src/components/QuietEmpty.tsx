import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuietEmptyProps = {
  /** Tiny mono label, e.g. empty / notice. */
  label?: string;
  title: string;
  body: string;
  /** Suggested next step under the body. */
  nextStep?: string;
  href?: string;
  action?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Quiet empty / soft-failure panel — hairline doc section, not a floating card.
 * Matches the W1–W2 index-desk tone.
 */
export function QuietEmpty({
  label = "empty",
  title,
  body,
  nextStep,
  href,
  action,
  className,
  children,
}: QuietEmptyProps) {
  return (
    <div
      className={cn(
        "space-y-3 border-y border-border/80 py-8",
        className,
      )}
      role="status"
    >
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <h2 className="font-heading text-base font-medium text-foreground">{title}</h2>
      <p className="max-w-prose text-sm text-muted-foreground">{body}</p>
      {nextStep ? (
        <p className="max-w-prose text-sm text-muted-foreground">
          <span className="text-foreground/80">下一步：</span>
          {nextStep}
        </p>
      ) : null}
      {children}
      {href && action ? (
        <p className="pt-1">
          <Link href={href} className={cn(buttonVariants())}>
            {action}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

type QuietNoticeProps = {
  tone?: "neutral" | "danger" | "ok";
  children: React.ReactNode;
  className?: string;
  role?: "status" | "alert";
};

/** Inline feedback line for import/export, mic deny, load errors. */
export function QuietNotice({
  tone = "neutral",
  children,
  className,
  role = "status",
}: QuietNoticeProps) {
  return (
    <div
      role={role}
      className={cn(
        "text-sm",
        tone === "danger" && "text-destructive",
        tone === "ok" && "text-foreground",
        tone === "neutral" && "text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
