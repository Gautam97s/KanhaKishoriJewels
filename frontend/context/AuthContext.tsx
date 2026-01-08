'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as apiLogin, signup as apiSignup, updateProfile as apiUpdateProfile } from '../lib/api';
import { User } from '../lib/types';

interface AuthContextType {
    user: User | null;
    loading: boolean; // Initial check
    login: (credentials: { email: string; password: string }) => Promise<void>;
    signup: (payload: { email: string; password: string; name: string }) => Promise<void>;
    logout: () => void;
    updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for token on mount
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Ideally verify token with backend /users/me
                // For now, we simulate persistence if we have a token
                // We'll create a dummy user or fetch from localStorage if we saved it too
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    // Fallback if we have token but no user data (shouldn't happen if we save both)
                    // If we had /users/me, we would call it here.
                    // For now, logout if data is inconsistent
                    // localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const { user, token } = await apiLogin(credentials);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            router.push('/');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async (payload: { email: string; password: string; name: string }) => {
        try {
            const result = await apiSignup(payload);
            // If signup returns token (which our api adapter logic tries to handle)
            // If API doesn't auto-login, we might need to call login.
            // But let's assume our api layer returns { user, token } or we improved it.
            // Actually api.ts signup currently returns mock token or empty string?
            // Let's assume for this flow we treat success as login.

            if (result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                setUser(result.user);
                router.push('/');
            } else {
                // If backend requires login after signup
                router.push('/signin?registered=true');
            }
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Assuming 'api' is an axios instance or similar where default headers are set
        // If not, this line might need adjustment based on how auth headers are managed.
        // For now, commenting out as 'api' is not directly imported as an object.
        // delete api.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/signin');
    };

    const updateUserProfile = async (data: Partial<User>) => {
        try {
            const updatedUser = await apiUpdateProfile(data);
            // Map backend response to frontend User type if needed
            const mappedUser: User = {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.full_name,
                role: updatedUser.role,
                phone_number: updatedUser.phone_number,
                address: updatedUser.address,
                createdAt: updatedUser.created_at,
            };
            setUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(mappedUser));
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
