'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
    name: string;
    phone_number: string;
    address: string;
}

export default function ProfilePage() {
    const { user, logout, loading, updateUserProfile } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset, setValue } = useForm<ProfileFormData>();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        } else if (user) {
            // Populate form with current user data
            setValue('name', user.name);
            setValue('phone_number', user.phone_number || '');
            setValue('address', user.address || '');
        }
    }, [user, loading, router, setValue]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            await updateUserProfile({
                name: data.name,
                phone_number: data.phone_number,
                address: data.address
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            // Optionally add toast notification here
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-beige-100">
                <div className="text-terracotta-600 animate-pulse font-serif">Loading Profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-beige-100">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-stone-900 mb-2">My Profile</h1>
                    <div className="h-1 w-20 bg-terracotta-500 mx-auto"></div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-stone-100 animate-fade-in relative">

                    {/* Edit Toggle (Absolute Top Right) */}
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                            title="Edit Profile"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}

                    {/* User Info Header */}
                    <div className="bg-stone-900 px-8 py-10 text-center relative">
                        <div className="w-24 h-24 bg-terracotta-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg text-3xl font-serif text-white uppercase border-4 border-stone-800">
                            {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-1">{user.name}</h2>
                        {/* Role label removed as requested */}
                        {/* <span className="inline-block px-3 py-1 bg-stone-800 text-stone-300 text-xs tracking-widest uppercase rounded-full mt-2">
                            {user.role}
                        </span> */}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Details List */}
                        <div className="p-8 space-y-6">

                            {/* Email (Read-only) */}
                            <div className="flex items-start p-4 bg-beige-50/50 rounded-sm border-b border-stone-100">
                                <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4 mt-1">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Email Address</p>
                                    <p className="text-stone-400 font-medium">{user.email}</p>
                                </div>
                            </div>

                            {isEditing ? (
                                <>
                                    {/* Edit Name */}
                                    <div className="flex items-start p-4 hover:bg-beige-50 transition-colors rounded-sm border-b border-stone-100">
                                        <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4 mt-1">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs uppercase tracking-wider text-stone-900 font-bold mb-1 block">Full Name</label>
                                            <input
                                                {...register('name')}
                                                className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Edit Phone */}
                                    <div className="flex items-start p-4 hover:bg-beige-50 transition-colors rounded-sm border-b border-stone-100">
                                        <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4 mt-1">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs uppercase tracking-wider text-stone-900 font-bold mb-1 block">Contact Number</label>
                                            <input
                                                {...register('phone_number')}
                                                placeholder="Enter phone number"
                                                className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Edit Address */}
                                    <div className="flex items-start p-4 hover:bg-beige-50 transition-colors rounded-sm border-b border-stone-100">
                                        <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4 mt-1">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs uppercase tracking-wider text-stone-900 font-bold mb-1 block">Address</label>
                                            <textarea
                                                {...register('address')}
                                                placeholder="Enter full address"
                                                className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none h-24 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Edit Actions */}
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                reset({ name: user.name, phone_number: user.phone_number || '', address: user.address || '' });
                                            }}
                                            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-bold uppercase tracking-wide"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2 bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors text-sm font-bold uppercase tracking-wide rounded-sm flex items-center gap-2"
                                        >
                                            {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* View Phone */}
                                    <div className="flex items-start p-4 hover:bg-beige-50 transition-colors rounded-sm border-b border-stone-100">
                                        <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Contact Number</p>
                                            <p className="text-stone-900 font-medium">
                                                {user.phone_number || <span className="text-stone-400 italic">Not added</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* View Address */}
                                    <div className="flex items-start p-4 hover:bg-beige-50 transition-colors rounded-sm border-b border-stone-100">
                                        <div className="p-3 bg-beige-100 rounded-full text-stone-600 mr-4">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-stone-500 font-bold mb-1">Address</p>
                                            <p className="text-stone-900 font-medium whitespace-pre-wrap">
                                                {user.address || <span className="text-stone-400 italic">Not added</span>}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    </form>

                    {/* Actions (Logout) only when not editing */}
                    {!isEditing && (
                        <div className="p-8 bg-beige-50 border-t border-stone-100 flex justify-center">
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-8 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow uppercase text-xs tracking-widest font-bold"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
