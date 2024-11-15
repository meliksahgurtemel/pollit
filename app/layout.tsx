import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poll App',
  description: 'A Gen Z-focused poll app where users can participate and earn tokens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
          <ul className="flex justify-around">
            <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
            <li><a href="/earn" className="text-white hover:text-gray-300">Earn</a></li>
            <li><a href="/profile" className="text-white hover:text-gray-300">Profile</a></li>
          </ul>
        </nav>
        <main className="pb-16">
          {children}
        </main>
      </body>
    </html>
  )
}
