'use client'
import { useEffect, useState } from 'react'
import { useSession, signIn } from "next-auth/react"
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  console.log(session)

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  const handleSignIn = async () => {
    try {
      await signIn('worldcoin')
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col">
      {session?.user ? (
        <>
          {/* Header Section */}
          <div className="px-2 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Hey there! <span className="wave">👋</span>
                </h1>
                <p className="text-lg text-zinc-400 mt-1">
                  Ready to earn some tokens?
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-2 mt-2">
            <Stats />
          </div>

          {/* How It Works Section */}
          <div className="mt-3">
            <HowItWorks />
          </div>

          {/* Leaderboard Section */}
          <div className="px-2 mt-8">
            <Leaderboard />
          </div>

          {/* Bottom spacing for nav */}
          <div className="h-24" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
          <p className="text-zinc-400 mb-8 text-center">
            Please sign in with World ID to continue
          </p>
          <button
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Sign in with World ID
          </button>
        </div>
      )}
    </div>
  )
}
