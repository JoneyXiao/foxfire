import type { ReactNode } from "react";

/** Centered login card with a warm foxfire wash, following the aihero login layout. */
export function LoginScreen({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-12 sm:px-10 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,color-mix(in_oklch,var(--primary)_55%,transparent)_0%,transparent_52%),radial-gradient(ellipse_at_85%_20%,color-mix(in_oklch,var(--primary)_35%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_50%_100%,color-mix(in_oklch,var(--primary)_40%,transparent)_0%,transparent_55%),radial-gradient(ellipse_at_80%_85%,oklch(0.72_0.14_35_/_0.45)_0%,transparent_50%),radial-gradient(ellipse_at_10%_80%,oklch(0.62_0.12_25_/_0.35)_0%,transparent_48%)] dark:bg-[radial-gradient(ellipse_at_15%_10%,color-mix(in_oklch,var(--primary)_40%,transparent)_0%,transparent_52%),radial-gradient(ellipse_at_85%_20%,color-mix(in_oklch,var(--primary)_28%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_50%_100%,color-mix(in_oklch,var(--primary)_32%,transparent)_0%,transparent_55%),radial-gradient(ellipse_at_80%_85%,oklch(0.55_0.12_45_/_0.35)_0%,transparent_50%),radial-gradient(ellipse_at_10%_80%,oklch(0.45_0.1_30_/_0.3)_0%,transparent_48%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/45 to-background" />
      </div>
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-foreground/5 sm:p-8">
        {children}
      </div>
    </div>
  );
}
