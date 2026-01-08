'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Package, ArrowLeft, Check, Truck, XCircle, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// Types
interface Order {
    id: string;
    customer_name: string;
    phone: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: any[];
    shipping_address: any;
    payment_method: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function AdminOrdersPage() {
    const router = useRouter();
    // const { token } = useAuth(); // Token not exposed, using localStorage directly
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Admin Gate
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin') {
            setIsAuthenticated(true);
            fetchOrders();
        } else {
            setError('Invalid password');
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/orders/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            // setError("Failed to fetch orders. Ensure you are logged in as admin.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await axios.patch(`${API_URL}/orders/${orderId}/status?status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        }
    };

    const filteredOrders = orders.filter(o =>
    (o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.includes(searchTerm) ||
        o.phone?.includes(searchTerm))
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-beige-100 flex items-center justify-center animate-fade-in">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-center font-serif text-2xl mb-6 text-stone-900">Admin Orders Access</h1>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password (admin)"
                            className={`w-full bg-beige-50 border p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none ${error ? 'border-red-500' : 'border-transparent'}`}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <button type="submit" className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors">
                        View Orders
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/admin" className="text-xs text-stone-500 hover:text-stone-900">Back to Dashboard</Link>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-beige-100 animate-fade-in pt-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/admin" className="text-stone-500 hover:text-stone-900">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <h1 className="font-serif text-3xl text-stone-900">Manage Orders</h1>
                        </div>
                        <p className="text-stone-500 font-light">View and update customer orders.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Total Orders</p>
                            <p className="font-serif text-2xl">{orders.length}</p>
                        </div>
                        <button onClick={() => { setIsAuthenticated(false); setOrders([]); }} className="text-sm underline text-stone-500 hover:text-stone-900">Logout</button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
                    <Search className="w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name, or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-beige-50 text-xs uppercase tracking-widest text-stone-500">
                                <tr>
                                    <th className="p-4 font-medium">Order ID</th>
                                    <th className="p-4 font-medium">Customer</th>
                                    <th className="p-4 font-medium">Items</th>
                                    <th className="p-4 font-medium">Total</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="p-8 text-center">Loading orders...</td></tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr><td colSpan={7} className="p-8 text-center text-stone-500">No orders found.</td></tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-beige-50/50 transition-colors">
                                            <td className="p-4 text-xs font-mono text-stone-500">
                                                {order.id.slice(0, 8)}...
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-stone-900 text-sm">{order.customer_name || 'Guest'}</p>
                                                <p className="text-xs text-stone-500">{order.phone}</p>
                                            </td>
                                            <td className="p-4 text-sm text-stone-600">
                                                {order.items?.length || 0} items
                                            </td>
                                            <td className="p-4 text-sm font-medium text-stone-900">
                                                ₹{order.total_amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4 text-xs text-stone-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'confirmed')}
                                                            title="Confirm Order"
                                                            className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {order.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'shipped')}
                                                            title="Mark Shipped"
                                                            className="p-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'delivered')}
                                                            title="Mark Delivered"
                                                            className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                        >
                                                            <Package className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(order.status !== 'cancelled' && order.status !== 'delivered') && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'cancelled')}
                                                            title="Cancel Order"
                                                            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
