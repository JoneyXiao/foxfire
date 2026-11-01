import { AppShell } from "@/components/AppShell";

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-3 py-6" aria-busy="true" aria-live="polite">
        <div className="h-5 w-2/5 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded-md bg-muted" />
      </div>
    </AppShell>
  );
}
