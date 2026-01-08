import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Plus, Trash2, Edit2, Save, X, Home } from 'lucide-react';
import { useForm } from 'react-hook-form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    is_default: boolean;
}

interface AddressFormData {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    is_default: boolean;
}

export default function AddressesTab() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<AddressFormData>();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/users/me/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(response.data);
        } catch (err) {
            console.error("Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: AddressFormData) => {
        const token = localStorage.getItem('token');
        try {
            if (editingId) {
                await axios.put(`${API_URL}/users/me/addresses/${editingId}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/users/me/addresses`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error("Failed to save address", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/users/me/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (error) {
            console.error("Failed to delete address", error);
        }
    };

    const startEdit = (address: Address) => {
        setEditingId(address.id);
        setIsAdding(false);
        setValue('street', address.street);
        setValue('city', address.city);
        setValue('state', address.state);
        setValue('zip', address.zip);
        setValue('country', address.country);
        setValue('is_default', address.is_default);
        window.scrollTo(0, 0); // Scroll to top to see form if list is long
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        reset({ street: '', city: '', state: '', zip: '', country: '', is_default: false });
    };

    if (loading) return <div className="text-center py-8 text-stone-500 animate-pulse">Loading addresses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl text-stone-900">Saved Addresses</h3>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add New
                    </button>
                )}
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white p-6 rounded-sm shadow-md border border-stone-100 mb-8 animate-fade-in relative">
                    <button onClick={resetForm} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                        <X className="w-5 h-5" />
                    </button>
                    <h4 className="font-serif text-lg text-stone-900 mb-4">{editingId ? 'Edit Address' : 'New Address'}</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <input {...register('street')} required placeholder="Street Address" className="w-full bg-beige-50 p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input {...register('city')} required placeholder="City" className="w-full bg-beige-50 p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                            <input {...register('state')} required placeholder="State" className="w-full bg-beige-50 p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                            <input {...register('zip')} required placeholder="Postal Code" className="w-full bg-beige-50 p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                            <input {...register('country')} required placeholder="Country" className="w-full bg-beige-50 p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                        </div>
                        {/* Checkbox for default? Backend supports it but frontend not showing check yet. Keep simple. */}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-stone-500 hover:text-stone-900 text-xs uppercase tracking-widest">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-terracotta-600 text-white hover:bg-terracotta-700 text-xs uppercase tracking-widest transition-colors shadow-sm">
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                    <div key={addr.id} className="bg-white p-6 rounded-sm border border-stone-200 hover:border-stone-300 transition-colors relative group">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-beige-100 text-stone-600 rounded-full mt-1">
                                <Home className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-stone-900 font-medium whitespace-pre-line">{addr.street}</p>
                                <p className="text-stone-500 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-stone-500 text-sm">{addr.country}</p>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(addr)} className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-beige-50 rounded">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(addr.id)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {addr.is_default && (
                            <span className="absolute bottom-4 right-4 text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">Default</span>
                        )}
                    </div>
                ))}
            </div>

            {addresses.length === 0 && !isAdding && (
                <div className="text-center py-12 text-stone-400 italic">No addresses saved yet.</div>
            )}
        </div>
    );
}
