'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Testimonials() {
    return (
        <section className="py-16 md:py-24 bg-beige-50">
            <h2 className="font-serif text-3xl md:text-5xl text-center mb-10 md:mb-16 px-4">Our satisfied customers</h2>
            <div className="max-w-5xl mx-auto px-6 flex items-center justify-between gap-4 md:gap-8">
                <button className="hidden md:block p-4 rounded-full border border-stone-300 hover:bg-white"><ArrowLeft className="w-5 h-5 text-stone-400" /></button>

                <div className="flex-1 bg-white p-6 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                        alt="Customer"
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                    />
                    <div className="text-center md:text-left">
                        <p className="text-stone-600 text-sm leading-relaxed mb-4">
                            "Absolutely in love with my custom necklace from EFRONA. The attention to detail and the quality of the materials surpassed my expectations."
                        </p>
                        <span className="font-serif font-bold text-stone-900">Emily G.</span>
                    </div>
                </div>

                <button className="hidden md:block p-4 rounded-full border border-stone-300 hover:bg-white"><ArrowRight className="w-5 h-5 text-stone-400" /></button>
            </div>
        </section>
    );
}
