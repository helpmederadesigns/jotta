import { ReactNode } from 'react'
import Link from 'next/link' // Add this import at the top
import { SignOutButton } from '@/components/ui/sign-out-button'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/dashboard" className="text-xl font-bold text-gray-900">Jotta</Link>
                    <Link href="/dashboard/write" className="text-sm font-medium text-gray-600 hover:text-gray-900">Write</Link>
                    <Link href="/dashboard/wallet" className="text-sm font-medium text-gray-600 hover:text-gray-900">Wallet</Link>
                </div>
                <SignOutButton />
            </header>
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    )
}