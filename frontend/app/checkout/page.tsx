'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../lib/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart, toggleCart } = useShop();
    const { user } = useAuth();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India' // Defaulting to India for COD usually
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cart.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity
                })),
                shipping_address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                },
                customer_name: formData.customerName,
                phone: formData.phone
            };

            await axios.post(`${API_URL}/orders/`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            clearCart();
            setStep('success');
            window.scrollTo(0, 0);

        } catch (error: any) {
            console.error("Order Placement Error:", error);
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-beige-100 animate-fade-in flex items-center justify-center">
                <div className="bg-white p-8 md:p-12 text-center shadow-sm max-w-lg mx-auto m-6 rounded">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-3xl mb-4 text-stone-900">Order Placed Successfully</h2>
                    <p className="text-stone-500 mb-8">
                        Thank you for your purchase. Your order has been confirmed. <br />
                        <span className="font-bold text-stone-700">Please pay ₹{subtotal.toLocaleString('en-IN')} on delivery.</span>
                    </p>
                    <Link href="/" className="bg-stone-900 text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors inline-block">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-beige-100 animate-fade-in pt-10">
            <div className="max-w-7xl mx-auto px-6">
                <button
                    onClick={() => toggleCart(true)}
                    className="text-xs uppercase tracking-widest text-stone-500 mb-8 hover:text-stone-900 flex items-center gap-2 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Return to Shopping Bag
                </button>

                <h1 className="font-serif text-3xl mb-8 text-center md:text-left">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handlePlaceOrder} className="space-y-8">

                            {/* Contact Details */}
                            <div className="bg-white p-8 shadow-sm">
                                <h2 className="font-serif text-lg mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">1</span>
                                    Contact Details
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        required
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                    />
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white p-8 shadow-sm">
                                <h2 className="font-serif text-lg mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">2</span>
                                    Shipping Address
                                </h2>

                                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                    <input required name="street" value={formData.street} onChange={handleChange} type="text" placeholder="Street Address" className="col-span-2 w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                                    <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                                    <input required name="zip" value={formData.zip} onChange={handleChange} type="text" placeholder="Postal Code" className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                                    <input required name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State" className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                                    <input required name="country" value={formData.country} onChange={handleChange} type="text" placeholder="Country" className="col-span-2 w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                                </div>
                            </div>

                            {/* Payment Method - COD Only */}
                            <div className="bg-white p-8 shadow-sm">
                                <h2 className="font-serif text-lg mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">3</span>
                                    Payment Method
                                </h2>

                                <div className="p-4 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-stone-600" />
                                        <span className="font-medium text-stone-900">Cash on Delivery (COD)</span>
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-stone-900 border-2 border-stone-900"></div>
                                </div>
                                <p className="text-xs text-stone-500 mt-2 ml-1">
                                    Pay securely with cash upon receipt of your order.
                                </p>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-terracotta-600 text-white py-5 uppercase tracking-widest text-sm hover:bg-terracotta-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Place Order (₹${subtotal.toLocaleString('en-IN')})`}
                            </button>

                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 shadow-sm sticky top-32">
                            <h2 className="font-serif text-lg mb-6">Order Summary</h2>
                            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="w-16 h-16 bg-beige-50 flex items-center justify-center flex-shrink-0">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-serif text-sm text-stone-900">{item.product.name}</h4>
                                            <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p>
                                            <p className="text-sm text-stone-900 mt-1">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                                {cart.length === 0 && (
                                    <p className="text-stone-500 text-sm">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="border-t border-stone-100 pt-6 space-y-4 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-serif text-lg text-stone-900 pt-4 border-t border-stone-100">
                                    <span>Total</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
