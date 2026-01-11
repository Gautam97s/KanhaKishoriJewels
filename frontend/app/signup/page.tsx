'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
    const { signup, user } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await signup({ name, email, password });
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Failed to create account';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-beige-50 px-4 py-12">
            <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-xl border border-stone-100 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-stone-900 mb-2">Join Our Circle</h1>
                    <div className="h-1 w-16 bg-terracotta-500 mx-auto"></div>
                    <p className="mt-4 text-stone-600 text-sm uppercase tracking-wider">Create your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-beige-50 border-b-2 border-stone-200 px-3 py-3 text-stone-900 focus:outline-none focus:border-terracotta-500 transition-colors rounded-t-sm"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-beige-50 border-b-2 border-stone-200 px-3 py-3 text-stone-900 focus:outline-none focus:border-terracotta-500 transition-colors rounded-t-sm"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-beige-50 border-b-2 border-stone-200 px-3 py-3 text-stone-900 focus:outline-none focus:border-terracotta-500 transition-colors rounded-t-sm pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-stone-400">Must be at least 8 characters long.</p>
                    </div>

                    <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="form-checkbox text-terracotta-500 rounded border-stone-300 focus:ring-terracotta-500"
                            />
                        </div>
                        <div className="ml-3 text-xs">
                            <label htmlFor="terms" className="text-stone-600">
                                I agree to the <a href="#" className="text-terracotta-600 hover:text-terracotta-700 underline">Terms of Service</a> and <a href="#" className="text-terracotta-600 hover:text-terracotta-700 underline">Privacy Policy</a>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-stone-900 text-white py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-terracotta-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                        {!isLoading && <span className="absolute inset-0 bg-terracotta-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-2 text-stone-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-6">
                        {/* Social Buttons */}
                        <button
                            type="button"
                            className="flex items-center justify-center w-12 h-12 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center w-12 h-12 bg-black border border-stone-200 rounded-full text-stone-900 hover:bg-stone-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            <svg className="h-5 w-5" fill="white" viewBox="0 0 16 16">
                                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-stone-100 pt-8">
                    <p className="text-stone-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-stone-900 font-bold hover:text-terracotta-600 transition-colors uppercase text-xs tracking-wider">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
