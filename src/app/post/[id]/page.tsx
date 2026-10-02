import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { UnlockButton } from '@/components/ui/unlock-button'

interface PageProps {
    params: { id: string }
}

export default async function PublicPostPage({ params }: PageProps) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch Post
    const { data: post, error } = await supabase
        .from('posts')
        .select('*, users(username, avatar_url)')
        .eq('id', id)
        .single()

    if (error || !post || post.status !== 'published') notFound()

    // 2. Fetch User & determine if they already own it
    const { data: { user } } = await supabase.auth.getUser()
    let hasUnlocked = false

    if (user) {
        if (user.id === post.author_id) {
            hasUnlocked = true // Authors always have access to their own posts
        } else {
            const { data: transaction } = await supabase
                .from('transactions')
                .select('id')
                .eq('post_id', id)
                .eq('reader_id', user.id)
                .single()

            if (transaction) hasUnlocked = true
        }
    }

    const requiresUnlock = post.is_premium && !hasUnlocked

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100 py-4 px-6 flex justify-between items-center max-w-4xl mx-auto w-full">
                <Link href="/dashboard" className="text-xl font-bold text-gray-900">Jotta</Link>
                {!user && <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>}
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
                    <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">@{post.users?.username}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </header>

                <div className="relative">
                    <article
                        className={`prose prose-lg mx-auto ${requiresUnlock ? 'max-h-[500px] overflow-hidden' : ''}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {requiresUnlock && (
                        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-8">
                            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 text-center max-w-md w-full">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Keep reading</h3>
                                <p className="text-gray-600 text-sm mb-6">Unlock this premium story to read the rest.</p>

                                {user ? (
                                    <UnlockButton postId={post.id} price={post.price_in_credits} />
                                ) : (
                                    <Link href="/login" className="block w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                        Sign in to Unlock
                                    </Link>
                                )}
                                <p className="text-xs text-gray-500 mt-4">1 Credit = ₦5.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}