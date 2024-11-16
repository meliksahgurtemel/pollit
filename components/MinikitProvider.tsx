"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { ReactNode, useEffect } from "react"

const signInWallet = async () => {
  const res = await fetch(`/api/nonce`)
	const { nonce } = await res.json()

	const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
		nonce: nonce,
		requestId: '0', // Optional
		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
	})
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install()
    signInWallet()
    console.log(MiniKit.user)
  }, []);

  return <>{children}</>
}
