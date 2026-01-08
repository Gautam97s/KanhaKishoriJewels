'use client';

import React from 'react';
import { CATEGORIES } from '../../lib/constants';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard';

export default function CatalogPage() {
    const { products } = useShop();

    return (
        <div className="pb-24 min-h-screen bg-beige-100 animate-fade-in pt-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">The Collection</h1>
                    <p className="text-stone-500 font-light">Explore our masterful creations.</p>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {CATEGORIES.map(category => {
                        const categoryProducts = products.filter(p => p.categoryId === category.id);
                        if (categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} className="animate-fade-in">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900">{category.name}</h2>
                                    <div className="hidden md:block h-px bg-stone-200 w-full" />
                                    <button className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 whitespace-nowrap self-end md:self-auto">View All</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categoryProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Fallback for items without category */}
                {products.filter(p => !CATEGORIES.find(c => c.id === p.categoryId)).length > 0 && (
                    <div className="mt-24 animate-fade-in">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-8">
                            <h2 className="font-serif text-2xl md:text-3xl text-stone-900">Other Treasures</h2>
                            <div className="hidden md:block h-px bg-stone-200 w-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.filter(p => !CATEGORIES.find(c => c.id === p.categoryId)).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
