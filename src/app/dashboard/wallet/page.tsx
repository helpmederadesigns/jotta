'use client'

import { useState } from 'react'

export default function WalletPage() {
    // Now we track WHICH bundle is loading, not just a generic true/false
    const [loadingBundle, setLoadingBundle] = useState<number | null>(null)

    const handleBuyCredits = async (amount: number, credits: number) => {
        setLoadingBundle(credits) // Mark this specific bundle as loading

        const response = await fetch('/api/paystack/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, credits })
        })

        const data = await response.json()

        if (data.url) {
            window.location.href = data.url
        } else {
            alert('Failed to initialize payment. Check terminal for errors.')
            setLoadingBundle(null) // Reset if it fails
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
                <p className="text-gray-600 mt-1">Buy Jotta Credits to unlock premium stories.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starter Bundle */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Starter Pack</h3>
                        <p className="text-gray-500 text-sm mt-1">Perfect for reading a few articles.</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-gray-900">20</span>
                            <span className="text-gray-500 font-medium ml-2">Credits</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleBuyCredits(100, 20)}
                        disabled={loadingBundle !== null}
                        className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loadingBundle === 20 ? 'Processing...' : 'Buy for ₦100'}
                    </button>
                </div>

                {/* Avid Reader Bundle */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between border-t-4 border-t-gray-900">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Avid Reader</h3>
                        <p className="text-gray-500 text-sm mt-1">The best value for daily readers.</p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold text-gray-900">100</span>
                            <span className="text-gray-500 font-medium ml-2">Credits</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleBuyCredits(500, 100)}
                        disabled={loadingBundle !== null}
                        className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loadingBundle === 100 ? 'Processing...' : 'Buy for ₦500'}
                    </button>
                </div>
            </div>
        </div>
    )
}