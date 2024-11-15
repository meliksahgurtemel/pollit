import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Leaderboard from '@/components/Leaderboard';
import { MiniKit,
  VerifyCommandInput,
  VerificationLevel,
  ResponseEvent,
  ISuccessResult,
  MiniAppVerifyActionPayload
} from '@worldcoin/minikit-js'
import { useEffect } from 'react'


const verifyPayload: VerifyCommandInput = {
	action: 'sign-in',
	signal: '',
	verification_level: VerificationLevel.Device,
}

const payload = MiniKit.commands.verify(verifyPayload)

useEffect(() => {
	if (!MiniKit.isInstalled()) {
		return
	}

	MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (response: MiniAppVerifyActionPayload) => {
		if (response.status === 'error') {
			return console.log('Error payload', response)
		}

		// Verify the proof in the backend
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

		// TODO: Handle Success!
		const verifyResponseJson = await verifyResponse.json()
		if (verifyResponseJson.status === 200) {
			console.log('Verification success!')
		}
	})

	return () => {
		MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction)
	}
}, [])

export default function Home() {
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
  );
}
