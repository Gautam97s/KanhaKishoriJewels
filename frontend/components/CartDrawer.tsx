'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useShop();
    const { user } = useAuth();
    const router = useRouter();

    const subtotal = cart.reduce((acc, item) => {
        const price = item.product.discountPercentage ? item.product.price * (1 - item.product.discountPercentage / 100) : item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    return (
        <div className={`fixed inset-0 z-[60] flex justify-end ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => toggleCart(false)}
            />
            <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="font-serif text-xl">Shopping Bag ({cart.length})</h2>
                    <button onClick={() => toggleCart(false)} className="hover:rotate-90 transition-transform duration-300">
                        <Minus className="rotate-90 w-6 h-6 text-stone-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {cart.length === 0 ? (
                        <div className="text-center text-stone-500 mt-20">
                            <p>Your bag is empty.</p>
                            <button onClick={() => toggleCart(false)} className="mt-4 text-terracotta-600 underline">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.productId} className="flex gap-4 animate-fade-in">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-20 h-24 object-cover bg-beige-50 p-2"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-serif text-sm pr-4">{item.product.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-stone-300 hover:text-terracotta-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-stone-500 mb-4">₹{item.product.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center border border-stone-200 w-max">
                                        <button
                                            onClick={() => updateQuantity(item.productId, -1)}
                                            className="p-1 hover:bg-stone-100 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-3 text-xs w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, 1)}
                                            className="p-1 hover:bg-stone-100 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-stone-100 bg-beige-50">
                        <div className="flex justify-between mb-4 text-lg font-serif">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            onClick={() => {
                                toggleCart(false);
                                if (user) {
                                    router.push('/checkout');
                                } else {
                                    router.push('/signin');
                                }
                            }}
                            className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors flex justify-center items-center gap-2"
                        >
                            Checkout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
