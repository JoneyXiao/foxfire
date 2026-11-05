/**
 * Mobile bottom padding that clears the fixed QuestionThumbBar.
 *
 * Apply on AppShell (outer column), not only page content: SiteFooter lives
 * after <main>, so content-only padding still leaves the footer under the bar.
 *
 * Bar stack on mobile (measured ~7.06rem / 113px at 390px wide):
 *   pt-2 (0.5rem)
 *   + ProgressButtons min-h-11 (2.75rem)
 *   + gap-2 (0.5rem)
 *   + 上一题/下一题 min-h-11 (2.75rem)
 *   + border-t ≈ 6.5–7.1rem
 * plus the bar's own pb-[max(0.5rem,env(safe-area-inset-bottom))],
 * plus ~1rem air so the last footer line has a clear gap above the blur.
 *
 * Desktop (sm+): bar is in-flow / not fixed, so padding resets to 0.
 */
export const questionThumbBarClearanceClass =
  "pb-[calc(8rem+max(0.5rem,env(safe-area-inset-bottom)))] sm:pb-0";
