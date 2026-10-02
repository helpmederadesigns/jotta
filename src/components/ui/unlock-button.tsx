'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UnlockButtonProps {
    postId: string
    price: number
}

export function UnlockButton({ postId, price }: UnlockButtonProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isUnlocking, setIsUnlocking] = useState(false)

    const handleUnlock = async () => {
        setIsUnlocking(true)

        // Call the secure PostgreSQL function we just created
        const { error } = await supabase.rpc('unlock_article', {
            target_post_id: postId
        })

        if (error) {
            if (error.message.includes('Insufficient credits')) {
                alert('You do not have enough credits. (We will redirect to Paystack later!)')
            } else {
                alert('Something went wrong unlocking this article.')
            }
            setIsUnlocking(false)
            return
        }

        // Refresh the page so the server re-evaluates the paywall and removes it
        router.refresh()
    }

    return (
        <button
            onClick={handleUnlock}
            disabled={isUnlocking}
            className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
            {isUnlocking ? 'Unlocking...' : `Unlock for ${price} Credits`}
        </button>
    )
}