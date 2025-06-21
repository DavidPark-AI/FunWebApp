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
        <meta name="google-adsense-account" content="ca-pub-3228294204750660" />
      </head>
      <body className={inter.className}>
        <Script id="google-adsense-verification" strategy="afterInteractive">
          {`window.onload = function() {
            if (!document.head.querySelector('meta[name="google-adsense-account"]')) {
              var meta = document.createElement('meta');
              meta.name = 'google-adsense-account';
              meta.content = 'ca-pub-3228294204750660';
              document.head.appendChild(meta);
            }
          };`}
        </Script>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
