import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "酷猫视频：每个想法都是一部大片 – AI视频生成 | 酷猫 AI",
  description: "生成 & 播放 酷猫 AI 视频：酷猫视频工具 - 创新的AI视频生成器和提示词工具，可以将您的想法转化为精美的AI视频。",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: "酷猫视频：每个想法都是一部大片 – AI视频生成 | 酷猫 AI",
    description: "生成 & 播放 酷猫 AI 视频：酷猫视频工具 - 创新的AI视频生成器和提示词工具，可以将您的想法转化为精美的AI视频。",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        {/* 统计代码 - 推荐位置 */}
        <Script
          id="analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?2a68c4f831958784a4488fc730a4077b";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
            `
          }}
        />

        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
