import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "狐火 Foxfire",
    template: "%s · 狐火",
  },
  description: "狐火：面向 AI 应用工程师的 150 题刷题题库，外加第 15–20 章 Agent 导图复习画布。进度只存在本地。",
};

// Default night (aihero-locked near-black). ThemeToggle syncs meta theme-color on switch.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
    { media: "(prefers-color-scheme: light)", color: "#F7F6F3" },
    { color: "#0B0B0B" },
  ],
};

const themeBoot = `try{var m=localStorage.getItem('foxfire-mode');var mode=(m==='light'||m==='dark')?m:'dark';document.documentElement.classList.toggle('dark',mode==='dark');document.documentElement.dataset.mode=mode;}catch(e){document.documentElement.classList.add('dark');document.documentElement.dataset.mode='dark';}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hans"
      suppressHydrationWarning
      className={cn("h-full", dmSans.variable, noto.variable, mono.variable, "font-sans")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full bg-background text-foreground pb-[env(safe-area-inset-bottom)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
