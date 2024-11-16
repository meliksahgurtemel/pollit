import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErudaProvider } from '@/components/Eruda'
import MiniKitProvider from '@/components/MinikitProvider'
import Navbar from '@/components/Navbar'
import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from 'next-auth'
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poll It',
  description: 'Participate polls and earn tokens',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen pb-16`}>
        <ErudaProvider>
          <MiniKitProvider>
            <SessionProvider session={session}>
              <main className="max-w-md mx-auto px-4">
                {children}
              </main>
              <Navbar />
            </SessionProvider>
          </MiniKitProvider>
        </ErudaProvider>
        <Toaster />
      </body>
    </html>
  )
}
