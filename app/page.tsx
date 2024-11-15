'use client'
import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'
import { MiniKit, VerifyCommandInput, VerificationLevel, ResponseEvent, ISuccessResult } from '@worldcoin/minikit-js'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSessionAndVerify = async () => {
      try {
        // Check if there's an active session
        const { data: { session }, error } = await supabaseClient.auth.getSession()

        if (error) throw error

        if (!session) {
          // No active session, proceed with World ID verification
          if (!MiniKit.isInstalled()) {
            console.error('World ID app not installed')
            return
          }

          const verifyPayload: VerifyCommandInput = {
            action: 'sign-in',
            signal: '',
            verification_level: VerificationLevel.Device,
          }

          // Trigger verification
          MiniKit.commands.verify(verifyPayload)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSessionAndVerify()

    // Set up MiniKit listener
    const handleVerification = async (response: any) => {
      if (response.status === 'error') {
        console.log('Error payload', response)
        return
      }

      try {
        const verifyResponse = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: response as ISuccessResult,
            action: 'sign-in',
            signal: '',
          }),
        })

        const data = await verifyResponse.json()

        if (verifyResponse.ok) {
          // Set the session in Supabase client
          await supabaseClient.auth.setSession(data.session)
          console.log('Verification success!')
        } else {
          console.error('Verification failed:', data.error)
        }
      } catch (error) {
        console.error('Verification error:', error)
      }
    }

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, handleVerification)

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
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
