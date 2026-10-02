'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

export default function WritePostPage() {
    const router = useRouter()
    const supabase = createClient()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPremium, setIsPremium] = useState(false)
    const [price, setPrice] = useState(10) // Default premium price
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    // Fetch the current logged-in user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        getUser()
    }, [])

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Title and content are required.')
            return
        }

        if (!userId) {
            alert('You must be logged in to publish.')
            return
        }

        // Strip HTML tags to calculate the real word count
        const plainText = content.replace(/<[^>]*>?/gm, '')
        const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length

        // ENFORCE BUSINESS RULE: Premium posts must be >= 500 words
        if (isPremium && wordCount < 500) {
            alert(`Premium articles must be at least 500 words to prevent reader chargebacks. You currently have ${wordCount} words.`)
            return
        }

        setIsSubmitting(true)

        // Generate a short excerpt for the SEO Soft-Gate preview
        const excerpt = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '')

        // Send the data to Supabase
        const { error } = await supabase.from('posts').insert({
            author_id: userId,
            title,
            content,
            excerpt,
            is_premium: isPremium,
            price_in_credits: isPremium ? price : 0,
            word_count: wordCount,
            status: 'pending' // Starts as pending for our future moderation trigger
        })

        setIsSubmitting(false)

        if (error) {
            console.error(error)
            alert('Failed to publish post. Check the console.')
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Draft New Article</h2>
                <button
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Article Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-4xl font-bold border-none focus:ring-0 placeholder-gray-300 bg-transparent px-0"
                />

                {/* The TipTap Editor we just built */}
                <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Monetization Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Monetization</h3>

                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="text-gray-700 font-medium">Lock behind Paywall (Premium)</span>
                </label>

                {isPremium && (
                    <div className="pl-8 pt-2">
                        <label className="block text-sm text-gray-600 mb-1">Price (in Credits)</label>
                        <input
                            type="number"
                            min="5"
                            step="5"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:ring-gray-900 focus:border-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-2">1 Credit = ₦5. (Example: 20 Credits = ₦100).</p>
                    </div>
                )}
            </div>
        </div>
    )
}