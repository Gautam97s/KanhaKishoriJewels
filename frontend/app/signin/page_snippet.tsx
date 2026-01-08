'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const { login } = useAuth(); // hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login({ email, password });
            // Redirect handled in AuthContext or here. 
            // AuthContext does router.push('/').
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };
    // ... UI with error display
}
