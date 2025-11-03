import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL('https://mentern.vercel.app'),
  title: "멘턴 - AI 시니어 파트너스",
  description: "시니어 전문가를 위한 안산시 AI 일자리 플랫폼",
  generator: "v0.app",
  openGraph: {
    title: "멘턴 - AI 시니어 파트너스",
    description: "시니어 전문가를 위한 안산시 AI 일자리 플랫폼",
    images: ["/menturn_og.png"],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "멘턴 - AI 시니어 파트너스",
    description: "시니어 전문가를 위한 안산시 AI 일자리 플랫폼",
    images: ["/menturn_og.png"],
  },
  icons: {
    icon: "/mt_favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased tracking-tight">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
