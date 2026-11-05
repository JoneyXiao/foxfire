# Design: 狐火 Foxfire

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: app screen
- Theme: custom (vibe: "near-black yellow tech editorial"; inspired by developer tech sites — never copy brand/logo/copy)
- Axes: dark/grotesk-sans/chromatic-amber · posture: restrained

## Tokens
`src/app/globals.css` is the source of truth (shadcn CSS variables on `:root` / `.dark`). There is no `tokens.css`. Hex anchors → oklch in CSS:

```css
/* Dark (default) — locked hex anchors */
--background: #0B0B0B;           /* canvas */
--card: #0D0D0C;                 /* surface */
--popover / raised: #191510;     /* surface-raised */
--foreground: #F4F3F1;           /* ink */
--muted-foreground: ~70% ink;    /* readable step down */
--border: hairline on dark;      /* white @ low alpha or #2a2a2a–#3a3a3a */
--primary: #F5C451;              /* action yellow */
--primary-foreground: #1a1408;   /* dark on yellow */
--destructive / chart accent: #DC715F; /* warm coral — sparingly */

/* Light companion — near-white paper, same yellow primary (not warm ember) */
--background: #F7F6F3;
--foreground: #141413;
--card: #FFFFFF;
--primary: #F5C451;
--primary-foreground: #1a1408;
```

Type (wired in `src/app/layout.tsx` via `next/font/google`):
- `--font-sans` / heading: DM Sans
- Chinese body: Noto Sans SC (`--font-noto`)
- `--font-mono`: JetBrains Mono

Radius: `--radius: 0.625rem` (~10px cards). Flat solids only — no purple-blue gradients, glow, or glass.

## Controls
- Primary: yellow fill · same radius · 44px tap target
- Secondary: quiet outline / muted surface · same radius and height

## Motion
- Character: calm; one answer reveal; under reduced motion everything ends at once.

## Exports
`src/app/globals.css` (`:root` + `.dark`) and `src/app/layout.tsx` (fonts + theme-color).
