# Design: 狐火 Foxfire

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: atmospheric
- Shape of the first page: app screen
- Theme: Ribbon (colourway two-in-the-morning; dawn for light)
- Axes: dark/grotesk-sans/chromatic-ember · posture: committed

## Tokens
`src/app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(13.2% 0.022 258); --color-paper-2: oklch(16.4% 0.02 258); --color-paper-3: oklch(19.6% 0.018 258);
  --color-ink: oklch(93.5% 0.012 85); --color-ink-2: oklch(84% 0.016 255); --color-muted: oklch(72% 0.02 255); --color-rule: oklch(27% 0.016 258);
  --color-accent: oklch(82% 0.095 68); --color-accent-ink: oklch(20% 0.03 62); --color-focus: oklch(82% 0.095 68);
  --font-display: "Instrument Sans", "Noto Sans SC", sans-serif; --font-body: "Noto Sans SC", sans-serif; --font-outlier: "JetBrains Mono", monospace;
  --radius-card: 20px; --radius-pill: 999px; --rule-hair: 1px; --shadow-card: none;
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`.

## Controls
- Primary: accent fill · pill · 44px
- Secondary: quiet outline · same radius and height

## Motion
- Character: calm; one answer reveal; under reduced motion everything ends at once.

## Exports
`src/app/tokens.css` in this project.
