import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
