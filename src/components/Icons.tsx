import type { ReactNode } from "react";

type IconProps = {
  label?: string;
};

function Svg({ label, children }: IconProps & { children: ReactNode }) {
  if (label) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" role="img" aria-label={label} fill="none">
        {children}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
      {children}
    </svg>
  );
}

export function IconSearch() {
  return (
    <Svg>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

export function IconSun() {
  return (
    <Svg label="切换到日间">
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconMoon() {
  return (
    <Svg label="切换到夜间">
      <path
        d="M15.2 4.4a7.4 7.4 0 1 0 4.4 11.8 6.2 6.2 0 0 1-4.4-11.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconMark({ pressed }: { pressed?: boolean }) {
  return (
    <Svg>
      <path
        d="M6 12.2 10.1 16 18 8"
        stroke="currentColor"
        strokeWidth={pressed ? "2" : "1.6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconStar({ pressed }: { pressed?: boolean }) {
  return (
    <Svg>
      <path
        d="m12 4.4 2.1 4.3 4.8.7-3.5 3.4.8 4.8L12 15.3 7.8 17.6l.8-4.8-3.5-3.4 4.8-.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={pressed ? "currentColor" : "none"}
      />
    </Svg>
  );
}
