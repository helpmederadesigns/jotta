import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return NextResponse.redirect(`${origin}/dashboard/wallet?error=missing_reference`)
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })
    
    const paystackData = await paystackRes.json()

    if (paystackData.data.status === 'success') {
      const { user_id, credits_to_add } = paystackData.data.metadata
      const supabase = await createClient()

      // Call the secure RPC we just created to deposit the credits
      await supabase.rpc('deposit_credits', {
        target_user_id: user_id,
        amount: credits_to_add
      })

      return NextResponse.redirect(`${origin}/dashboard?payment=success`)
    }

    return NextResponse.redirect(`${origin}/dashboard/wallet?error=payment_failed`)
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(`${origin}/dashboard/wallet?error=server_error`)
  }
}