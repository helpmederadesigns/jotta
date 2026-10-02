import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, credits } = await request.json()

    // Ping Paystack to initialize a secure transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount * 100, // Paystack requires the amount in Kobo (₦100 = 10000 kobo)
        callback_url: `http://localhost:3000/api/paystack/verify`,
        metadata: {
          user_id: user.id,
          credits_to_add: credits
        }
      }),
    })

    const data = await response.json()
    
    // Return the secure checkout URL to the frontend
    if (data.status) {
      return NextResponse.json({ url: data.data.authorization_url })
    }
    
    return NextResponse.json({ error: data.message }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}