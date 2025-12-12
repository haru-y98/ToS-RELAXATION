import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToS Relaxation - プロフェッショナルマッサージサービス",
  description: "経験豊富な施術者があなたの疲れを癒します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
