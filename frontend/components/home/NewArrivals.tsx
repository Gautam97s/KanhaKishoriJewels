'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../../lib/types';

interface NewArrivalsProps {
    products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
    const [arrivalPage, setArrivalPage] = useState(0);
    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handlePrevArrival = () => {
        setArrivalPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const handleNextArrival = () => {
        setArrivalPage((prev) => (prev + 1) % totalPages);
    };

    return (
        <section className="py-16 md:py-24 bg-beige-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-0">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-4">Latest Arrivals</h2>
                        <div className="w-12 h-px bg-stone-900" />
                    </div>
                    <p className="text-stone-500 text-sm max-w-xs">
                        Crafted with precision and passion, these pieces are destined to become cherished heirlooms.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:min-h-[400px]">
                    {products.slice(arrivalPage * ITEMS_PER_PAGE, (arrivalPage + 1) * ITEMS_PER_PAGE).map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                    <div className="flex gap-4">
                        <button onClick={handlePrevArrival} className="p-3 border border-stone-300 rounded-full hover:bg-stone-900 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button onClick={handleNextArrival} className="p-3 border border-stone-300 rounded-full hover:bg-stone-900 hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        {Array.from({ length: Math.max(1, totalPages) }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-8 h-1 rounded-full transition-colors duration-300 ${idx === arrivalPage ? 'bg-stone-900' : 'bg-stone-300'}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className="font-serif">{products.length} products</span>
                        <Link
                            href="/catalog"
                            className="bg-terracotta-600 text-white text-xs px-6 py-2 uppercase tracking-widest"
                        >
                            All products
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
