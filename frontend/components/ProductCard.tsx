'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../lib/types';
import { Heart, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useShop();

    return (
        <div className="group cursor-pointer flex flex-col p-6 bg-white transition-all duration-300 hover:shadow-lg">
            <div className="relative w-full aspect-square overflow-hidden mb-6 flex items-center justify-center">
                {/* Floating Actions */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 ease-out">
                    <button className="p-2 bg-white rounded-full text-stone-400 hover:text-terracotta-500 shadow-sm border border-stone-100">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="p-2 bg-stone-900 rounded-full text-white hover:bg-terracotta-600 shadow-sm"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>

                <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </Link>
            </div>

            <div className="mt-auto">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-sans font-bold text-sm text-stone-900 mb-1 leading-snug hover:text-terracotta-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-stone-500 text-xs font-medium tracking-wide">
                    ₹{product.price.toLocaleString('en-IN')}
                </p>
            </div>
        </div>
    );
}
