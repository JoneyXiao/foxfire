import { AppShell } from "@/components/AppShell";

export default function Loading() {
  return (
    <AppShell>
      <div className="skel" aria-busy="true" aria-live="polite">
        <div className="skel-line skel-line--title" />
        <div className="skel-line" />
        <div className="skel-line skel-line--short" />
      </div>
    </AppShell>
  );
}
