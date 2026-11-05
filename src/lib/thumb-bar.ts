/**
 * Mobile content bottom padding that clears the fixed QuestionThumbBar.
 *
 * Bar stack on mobile:
 *   pt-2 (0.5rem)
 *   + ProgressButtons min-h-11 (2.75rem)
 *   + gap-2 (0.5rem)
 *   + 上一题/下一题 min-h-11 (2.75rem)
 *   + border ≈ 6.5rem
 * plus the bar's own pb-[max(0.5rem,env(safe-area-inset-bottom))],
 * plus ~0.5rem air so the last adjacent-nav row is not flush against the blur.
 *
 * Desktop (sm+): bar is in-flow / not fixed, so padding resets to 0.
 */
export const questionThumbBarClearanceClass =
  "pb-[calc(7rem+max(0.5rem,env(safe-area-inset-bottom)))] sm:pb-0";
