import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErudaProvider } from '@/components/Eruda'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PollIt',
  description: 'Participate polls and earn tokens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ErudaProvider>
        <body className={`${inter.className} bg-black text-white min-h-screen pb-16`}>
          <main className="max-w-md mx-auto px-4">
            {children}
          </main>
          <Navbar />
        </body>
      </ErudaProvider>
    </html>
  )
}
