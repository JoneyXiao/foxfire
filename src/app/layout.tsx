import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
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
  description: "狐火是面向 AI 应用工程师的面试题库。按分类打开一题，对照参考作答，进度存在本地。",
};

const themeBoot = `try{var m=localStorage.getItem('foxfire-mode');document.documentElement.dataset.mode=(m==='light'||m==='dark')?m:'dark';}catch(e){document.documentElement.dataset.mode='dark'}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hans"
      className={`${instrument.variable} ${noto.variable} ${mono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
