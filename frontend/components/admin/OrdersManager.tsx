'use client';

import React, { useState, useEffect } from 'react';
import { Package, Check, Truck, XCircle, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';

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

export default function OrdersManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/orders/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
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

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
            {/* Search */}
            <div className="p-6 border-b border-stone-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Name, or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-beige-50 rounded-md text-sm border-none focus:ring-1 focus:ring-stone-900"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Total Orders:</span>
                    <span className="font-serif text-lg">{orders.length}</span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-beige-50 text-xs uppercase tracking-widest text-stone-500">
                        <tr>
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Items</th>
                            <th className="p-4 font-medium">Address</th>
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
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-stone-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 text-stone-300" />
                                        <p>No orders found matching "{searchTerm}"</p>
                                    </div>
                                </td>
                            </tr>
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
                                    <td className="p-4 text-xs text-stone-600 max-w-xs truncate" title={`${order.shipping_address?.street || ''}, ${order.shipping_address?.city || ''}`}>
                                        {order.shipping_address ? (
                                            <>
                                                <p className="font-medium text-stone-900">{order.shipping_address.street}</p>
                                                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                                                <p>{order.shipping_address.country}</p>
                                            </>
                                        ) : <span className="text-stone-400 italic">No address</span>}
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
    );
}
