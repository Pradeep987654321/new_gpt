'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Verifying your account...');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('ollama_user_id', userId);
                setStatus('Success! Redirecting...');
                setTimeout(() => router.push('/'), 500);
            } else {
                setStatus(`${data.error}${data.status ? ` (Status: ${data.status})` : ''}`);
                setIsLoading(false);
            }
        } catch (err) {
            setStatus('Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative backdrop-blur-xl bg-black/30 p-10 rounded-3xl w-full max-w-md border border-purple-500/20 shadow-2xl shadow-purple-500/20">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                        Welcome Back
                    </h1>
                    <p className="text-purple-300/70">Sign in to Your GPT</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm text-purple-300 mb-2 font-medium">User ID</label>
                        <input
                            required
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-4 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-center text-lg tracking-wider font-mono"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="your-user-id"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-green-500/50 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Signing In...</span>
                            </span>
                        ) : 'Access Your GPT'}
                    </button>

                    {status && (
                        <div className={`text-center text-sm p-3 rounded-xl ${status.includes('Success')
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {status}
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center">
                    <a href="/signup" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                        Don't have an account? <span className="underline">Create one</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
