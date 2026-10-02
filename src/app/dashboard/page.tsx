import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Securely fetch the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // Fetch the user's actual wallet balances
    const { data: profile } = await supabase
        .from('users')
        .select('real_credits, promo_credits')
        .eq('id', user.id)
        .single()

    // Fetch all posts created by this user
    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, status, is_premium, price_in_credits, created_at')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            {/* User Info Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex space-x-4 text-center">
                    <div className="bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Real Credits</p>
                        <p className="text-lg font-bold text-gray-900">{profile?.real_credits || 0}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Promo Credits</p>
                        <p className="text-lg font-bold text-gray-900">{profile?.promo_credits || 0}</p>
                    </div>
                </div>
            </div>

            {/* Content Library */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Your Articles</h3>
                    <Link
                        href="/dashboard/write"
                        className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        New Draft
                    </Link>
                </div>

                <div className="divide-y divide-gray-200">
                    {!posts || posts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            You haven't written any articles yet.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="text-md font-semibold text-gray-900">{post.title}</h4>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString('en-NG', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {post.is_premium ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {post.price_in_credits} Credits
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Free
                                        </span>
                                    )}

                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${post.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    ${post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${post.status === 'flagged' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}