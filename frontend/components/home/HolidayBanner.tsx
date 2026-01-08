'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../../lib/types';

interface HolidayBannerProps {
    products: Product[];
}

export default function HolidayBanner({ products }: HolidayBannerProps) {
    return (
        <section className="bg-terracotta-600 py-16 md:py-24 relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
                <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
                    <h2 className="font-serif text-4xl md:text-6xl mb-6">Discounted holiday collection</h2>
                    <p className="max-w-md text-white/80 mb-8 mx-auto md:mx-0">
                        We have selected for you the best collection for the upcoming holiday with a pleasant discount.
                    </p>
                    <Link
                        href="/catalog"
                        className="bg-white text-terracotta-600 text-xs px-8 py-3 uppercase tracking-widest hover:bg-beige-100 transition-colors inline-block"
                    >
                        Explore More
                    </Link>
                </div>
                <div className="md:w-1/2 relative h-48 md:h-96 w-full flex justify-center items-center">
                    {/* Giant ring image mockup using dynamic product if available */}
                    {products.length > 0 ? (
                        <img
                            src={products.length > 4 ? products[4].image : products[0].image}
                            alt="Diamond Ring"
                            className="w-auto h-full object-contain drop-shadow-2xl transform rotate-12 scale-125"
                        />
                    ) : (
                        <div className="w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
                    )}
                </div>
            </div>
        </section>
    );
}
