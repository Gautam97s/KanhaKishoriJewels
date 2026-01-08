'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Save, X, ShoppingBag, Map } from 'lucide-react';
import { useForm } from 'react-hook-form';
import OrdersTab from '../../components/profile/OrdersTab';
import AddressesTab from '../../components/profile/AddressesTab';

interface ProfileFormData {
    name: string;
    phone_number: string;
    address: string;
}

export default function ProfilePage() {
    const { user, logout, loading, updateUserProfile } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

    // Profile Tab State
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
            setValue('address', user.address || ''); // Keep for backward compatibility or display
        }
    }, [user, loading, router, setValue]);

    const onProfileSubmit = async (data: ProfileFormData) => {
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-4xl text-stone-900 mb-2">My Account</h1>
                    <div className="h-1 w-20 bg-terracotta-500 mx-auto"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 text-center mb-4">
                            <div className="w-20 h-20 bg-terracotta-600 rounded-full mx-auto flex items-center justify-center mb-3 text-2xl font-serif text-white uppercase">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <h2 className="font-serif text-lg text-stone-900">{user.name}</h2>
                            <p className="text-xs text-stone-500">{user.email}</p>
                        </div>

                        <nav className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-beige-50'}`}
                            >
                                <User className="w-4 h-4" /> Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-beige-50'}`}
                            >
                                <ShoppingBag className="w-4 h-4" /> My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-beige-50'}`}
                            >
                                <Map className="w-4 h-4" /> Addresses
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100"
                            >
                                <LogOut className="w-4 h-4" /> Log Out
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-sm shadow-sm border border-stone-100 relative animate-fade-in">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 hover:bg-beige-50 rounded-full transition-colors"
                                        title="Edit Profile"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                )}

                                <div className="p-8 border-b border-stone-100">
                                    <h3 className="font-serif text-2xl text-stone-900">Profile Details</h3>
                                </div>

                                <form onSubmit={handleSubmit(onProfileSubmit)}>
                                    <div className="p-8 space-y-6">

                                        {/* Name */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-stone-50 pb-6">
                                            <div className="text-sm font-bold text-stone-500 uppercase tracking-wide pt-2">Full Name</div>
                                            <div className="md:col-span-2">
                                                {isEditing ? (
                                                    <input {...register('name')} className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none" />
                                                ) : (
                                                    <p className="text-stone-900 font-medium py-2">{user.name}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-stone-50 pb-6">
                                            <div className="text-sm font-bold text-stone-500 uppercase tracking-wide pt-2">Email</div>
                                            <div className="md:col-span-2">
                                                <p className="text-stone-900 font-medium py-2">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-stone-50 pb-6">
                                            <div className="text-sm font-bold text-stone-500 uppercase tracking-wide pt-2">Phone</div>
                                            <div className="md:col-span-2">
                                                {isEditing ? (
                                                    <input {...register('phone_number')} placeholder="Add phone number" className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none" />
                                                ) : (
                                                    <p className="text-stone-900 font-medium py-2">{user.phone_number || <span className="text-stone-400 italic">Not set</span>}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Default Address (Legacy) */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                            <div className="text-sm font-bold text-stone-500 uppercase tracking-wide pt-2">Default Address</div>
                                            <div className="md:col-span-2">
                                                {isEditing ? (
                                                    <textarea {...register('address')} placeholder="Add default address" className="w-full p-2 border border-stone-300 rounded-sm focus:border-terracotta-600 outline-none h-24 resize-none" />
                                                ) : (
                                                    <p className="text-stone-900 font-medium py-2 whitespace-pre-wrap">{user.address || <span className="text-stone-400 italic">Not set</span>}</p>
                                                )}
                                                <p className="text-xs text-stone-400 mt-2">To manage multiple shipping addresses, use the <button type="button" onClick={() => setActiveTab('addresses')} className="text-terracotta-600 hover:underline">Addresses tab</button>.</p>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
                                                <button type="button" onClick={() => { setIsEditing(false); reset({ name: user.name, phone_number: user.phone_number, address: user.address }); }} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-bold uppercase tracking-wide">Cancel</button>
                                                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-terracotta-600 text-white hover:bg-terracotta-700 text-sm font-bold uppercase tracking-wide rounded-sm flex items-center gap-2">
                                                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-sm shadow-sm border border-stone-100 p-8 animate-fade-in">
                                <OrdersTab />
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-sm shadow-sm border border-stone-100 p-8 animate-fade-in">
                                <AddressesTab />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
