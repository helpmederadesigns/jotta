import { GoogleLoginButton } from '@/components/ui/google-login-button'

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your creator dashboard and read premium stories.
                    </p>
                </div>

                <div className="mt-8">
                    <GoogleLoginButton />
                </div>
            </div>
        </div>
    )
}