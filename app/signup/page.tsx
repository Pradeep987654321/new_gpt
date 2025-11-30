'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        address: '',
    });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Creating your account...');

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('Success! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setStatus(`Error: ${data.error}`);
                setIsLoading(false);
            }
        } catch (err) {
            setStatus('Failed to submit. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative backdrop-blur-xl bg-black/30 p-8 rounded-3xl w-full max-w-md border border-purple-500/20 shadow-2xl shadow-purple-500/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Join Your GPT
                    </h1>
                    <p className="text-purple-300/70 text-sm">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">User ID (Unique)</label>
                        <input
                            required
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            placeholder="your-unique-id"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">Full Name</label>
                        <input
                            required
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">Email</label>
                        <input
                            required
                            type="email"
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">Phone</label>
                        <input
                            required
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">Location</label>
                        <input
                            required
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="New York, USA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-purple-300 mb-1.5 font-medium">Address</label>
                        <textarea
                            required
                            rows={2}
                            className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-xl p-3 border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Main Street"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-purple-500/50 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creating Account...</span>
                            </span>
                        ) : 'Create Account'}
                    </button>

                    {status && (
                        <div className={`text-center text-sm p-3 rounded-xl ${status.includes('Success')
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : status.includes('Error')
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                            {status}
                        </div>
                    )}
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                        Already have an account? <span className="underline">Login</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
