import { NextRequest, NextResponse } from 'next/server'
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js'
import { supabaseAdmin } from '@/lib/supabase/server'

interface IRequestPayload {
    payload: ISuccessResult
    action: string
    signal: string | undefined
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload

    // Verify World ID proof
    const app_id = process.env.WORLD_APP_ID as `app_${string}`
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse

    if (!verifyRes.success) {
      return NextResponse.json({ error: 'Invalid proof' }, { status: 400 })
    }

    // Check if user exists or create new user
    const { data: user, error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({
        nullifier_hash: payload.nullifier_hash,
        verification_level: payload.verification_level,
        last_login: new Date().toISOString()
      })
      .select()
      .single()

    if (upsertError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Create a custom JWT token
    const { data: token, error: tokenError } = await supabaseAdmin.auth.admin.createUser({
      user_metadata: {
        world_id_nullifier: payload.nullifier_hash,
        user_id: user.id
      }
    })

    if (tokenError) {
      return NextResponse.json({ error: 'Token creation failed' }, { status: 500 })
    }

    return NextResponse.json({
      user,
      session: token
    })

  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
