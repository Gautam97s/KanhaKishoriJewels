'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { Product } from '../../lib/types';

interface HeroProps {
    products: Product[];
}

export default function Hero({ products }: HeroProps) {
    return (
        <header className="relative w-full h-[90vh] md:h-screen overflow-hidden flex items-center justify-center pt-20">
            {/* Background Text */}
            <h1 className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-serif text-[20vw] text-white opacity-80 z-0 pointer-events-none tracking-tighter leading-none select-none">
                Jewelry
            </h1>

            {/* Hero Content Wrapper */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center">

                {/* Left Text */}
                <div className="md:w-1/3 mb-10 md:mb-0 pt-20 md:pt-0">
                    <p className="text-sm md:text-base leading-relaxed text-stone-700 max-w-xs mb-8">
                        Our curated collection of fine jewelry is designed to captivate and celebrate the unique essence of every individual.
                    </p>
                    <Link
                        href="/catalog"
                        className="bg-terracotta-600 text-white text-xs px-8 py-3 uppercase tracking-widest hover:bg-terracotta-700 transition-colors shadow-lg inline-block"
                    >
                        Open Store
                    </Link>
                </div>

                {/* Center Image */}
                <div className="md:w-1/3 flex justify-center relative">
                    <div className="relative w-64 md:w-96 aspect-[3/4] shadow-2xl">
                        <img
                            src="/images/HeroRing.jpeg"
                            alt="Hero Ring"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Right Card */}
                <div className="md:w-1/3 flex justify-end items-center h-full">
                    <div className="bg-terracotta-600 text-white p-6 md:p-8 max-w-xs relative mt-10 md:mt-0">
                        <h3 className="font-serif text-xl mb-4">Only today - 50% OFF</h3>
                        <div className="flex items-center justify-between">
                            <div className="bg-white rounded-full p-2 cursor-pointer hover:scale-110 transition-transform">
                                <ArrowRight className="w-4 h-4 text-terracotta-600" />
                            </div>
                        </div>
                        {products.find(p => p.isHolidaySpecial) ? (
                            <img
                                src={products.find(p => p.isHolidaySpecial)!.image}
                                alt="Promo"
                                className="w-24 h-24 object-cover ml-4 rounded-full bg-terracotta-700"
                            />
                        ) : products.length > 0 && (
                            <img
                                src={products.length > 3 ? products[3].image : products[0].image}
                                alt="Promo"
                                className="w-24 h-24 object-cover ml-4 rounded-full bg-terracotta-700"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="absolute bottom-8 right-8 text-xs text-right text-stone-600 hidden md:block">
                Delhi, India
            </div>
        </header>
    );
}
