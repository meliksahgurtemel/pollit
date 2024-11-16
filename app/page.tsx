'use client'

import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Leaderboard from '@/components/Leaderboard'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const { isLoading, error } = useFirebaseAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex flex-col">
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
    </div>
  )
}
