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

    // First check if a user with this nullifier_hash already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select()
      .eq('nullifier_hash', payload.nullifier_hash)
      .single()

    // If user exists, just update last_login and return existing session
    if (existingUser) {
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', existingUser.id)

      // Create a new session for existing user
      const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.createUser({
        email: `${existingUser.id}@worldcoin.fake`,
        email_confirm: false,
        user_metadata: {
          world_id_nullifier: existingUser.nullifier_hash,
          user_id: existingUser.id
        }
      })

      if (sessionError) {
        return NextResponse.json({ error: 'Session creation failed:' + sessionError.message }, { status: 500 })
      }

      return NextResponse.json({
        user: existingUser,
        session
      })
    }

    // If no existing user, proceed with verification and new user creation
    const app_id = process.env.WORLD_APP_ID as `app_${string}`
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse

    if (!verifyRes.success) {
      return NextResponse.json({ error: 'Invalid proof:' + verifyRes.detail }, { status: 400 })
    }

    // Create new user
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

    // Create a session for new user
    const { data: token, error: tokenError } = await supabaseAdmin.auth.admin.createUser({
      user_metadata: {
        world_id_nullifier: payload.nullifier_hash,
        user_id: user.id
      }
    })

    if (tokenError) {
      return NextResponse.json({ error: 'Token creation failed:' + tokenError.message }, { status: 500 })
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
