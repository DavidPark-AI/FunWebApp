import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '나의 이름은?',
  description: 'Get name recommendations based on your photo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* 정적 메타 태그로 추가 */}
        <meta name="google-adsense-account" content="ca-pub-3228294204750660" />
      </head>
      <body className={inter.className}>
        {/* 클라이언트 자바스크립트로 메타 태그 추가 백업 방식 */}
        <Script id="google-adsense-verification" strategy="beforeInteractive">
          {`
            try {
              if (!document.querySelector('meta[name="google-adsense-account"]')) {
                console.log('Adding Google AdSense meta tag via script');
                var meta = document.createElement('meta');
                meta.name = 'google-adsense-account';
                meta.content = 'ca-pub-3228294204750660';
                document.head.appendChild(meta);
              } else {
                console.log('Google AdSense meta tag already exists');
              }
            } catch (e) {
              console.error('Error adding Google AdSense meta tag:', e);
            }
          `}
        </Script>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
