'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useShop } from '../../../context/ShopContext';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
    const params = useParams();
    const { products, addToCart } = useShop();

    // Handle case where params might be undefined or not yet ready
    const id = params?.id as string;
    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-beige-100">
                <p className="text-xl font-serif text-stone-900 mb-4">Product not found.</p>
                <Link href="/catalog" className="text-sm underline text-stone-500 hover:text-stone-900">Back to Collection</Link>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-beige-100 animate-fade-in pt-10">
            <div className="max-w-7xl mx-auto px-6">
                <Link href="/catalog" className="text-xs uppercase tracking-widest text-stone-500 mb-8 hover:text-stone-900 flex items-center gap-2 w-max">
                    <ArrowLeft className="w-4 h-4" /> Back to Collection
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white p-8 md:p-12 shadow-sm rounded-lg">
                    <div className="aspect-[4/5] bg-beige-50 flex items-center justify-center p-8 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-4 md:mb-6">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            {product.discountPercentage && product.discountPercentage > 0 ? (
                                <>
                                    <p className="text-2xl font-light text-stone-900 text-terracotta-600 font-bold">
                                        ₹{(product.price * (1 - product.discountPercentage / 100)).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-xl font-light text-stone-500 line-through">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </p>
                                    <span className="bg-terracotta-100 text-terracotta-700 text-xs px-2 py-1 uppercase tracking-widest font-bold rounded">
                                        {product.discountPercentage}% OFF
                                    </span>
                                </>
                            ) : (
                                <p className="text-2xl font-light text-stone-900">₹{product.price.toLocaleString('en-IN')}</p>
                            )}
                        </div>
                        <div className="space-y-6 mb-10">
                            <p className="text-stone-600 leading-relaxed font-light">{product.description}</p>
                            <div className="flex gap-8 text-sm text-stone-500 border-t border-stone-100 pt-6">
                                <div><span className="block font-bold text-stone-900 uppercase text-xs mb-1">Material</span>{product.details.material}</div>
                                {product.details.gemstone && (
                                    <div><span className="block font-bold text-stone-900 uppercase text-xs mb-1">Gemstone</span>{product.details.gemstone}</div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors shadow-lg"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
