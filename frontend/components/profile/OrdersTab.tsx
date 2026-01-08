import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface OrderItem {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    payment_method: string;
    items: OrderItem[];
}

export default function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/orders/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
            case 'delivered': return <Package className="w-5 h-5 text-green-500" />;
            case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading) return <div className="text-center py-8 text-stone-500 animate-pulse">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 mb-6">Order History</h3>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-beige-50 rounded-sm border border-dashed border-stone-300">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-stone-50 pb-4">
                                <div>
                                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Order ID</p>
                                    <p className="font-mono text-sm text-stone-900">#{order.id.slice(0, 8)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Date</p>
                                    <p className="text-sm text-stone-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total</p>
                                    <p className="font-serif text-lg text-stone-900">₹{order.total_amount.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="text-sm font-medium capitalize text-stone-700">{order.status}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-stone-500">
                                <span>{order.items.length} Item(s)</span>
                                <span>{order.payment_method}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
