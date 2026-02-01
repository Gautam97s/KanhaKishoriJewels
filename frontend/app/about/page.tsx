'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Award } from 'lucide-react';
import { Diamond } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-stone-900/30 z-10" />
                    {/* Placeholder for hero image */}
                    <div className="w-full h-full bg-stone-200 relative">
                        <Image
                            src="/images/HeroRing.jpeg"
                            alt="Artisan Jewelry"
                            fill
                            className="object-cover"
                            priority
                            onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                            }}
                        />
                        {/* Fallback pattern/color */}
                        <div className="absolute inset-0 bg-stone-800" />
                    </div>
                </div>

                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
                    <span className="text-gold-200 text-sm md:text-base uppercase tracking-[0.3em] font-light">Est. 2010</span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-wider leading-none">
                        Legacy of <br /> <span className="italic text-gold-100">Excellence</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-100 font-light max-w-xl mx-auto tracking-wide leading-relaxed pt-4 border-t border-white/20 mt-8">
                        Crafting eternal moments through ethically sourced gemstones and timeless design.
                    </p>
                </div>
            </section>

            {/* Our Story Section - Clean & Minimalist */}
            <section className="py-24 md:py-40 px-6 bg-beige-50">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-wide">
                        The Kanha & Kishori Story
                    </h2>
                    <div className="space-y-8 text-stone-600 font-light text-lg md:text-xl leading-relaxed">
                        <p>
                            Kanha & Kishori began as a whisper of a dream in a small family workshop. Founded with a vision to bridge the gap between traditional artistry and modern elegance, our journey is one of passion and precision.
                        </p>
                        <p>
                            We believe that jewelry is more than an accessory; it is a narrative. Every piece in our collection tells a story—harmony between nature's finest gifts and the skilled hands that shape them.
                        </p>
                        <p className="text-stone-800 font-normal italic">
                            "We do not just create jewelry; we curate heirlooms."
                        </p>
                    </div>
                </div>
            </section>

            {/* Visual Break / Image Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[60vh]">
                <div className="bg-stone-200 relative h-full min-h-[400px]">
                    {/* Placeholder Image 1 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-300">
                        <span className="font-serif italic text-stone-500">[Craftsmanship in Action]</span>
                    </div>
                </div>
                <div className="bg-stone-800 flex items-center justify-center p-12 text-center md:text-left">
                    <div className="max-w-md space-y-6">
                        <h3 className="text-white font-serif text-3xl">Purity in Process</h3>
                        <p className="text-stone-300 font-light leading-relaxed">
                            From the depths of the earth to the light of the showcase, every step of our process is governed by strict ethical standards. We source conflict-free diamonds and recycle precious metals, ensuring our beauty leaves a gentle footprint.
                        </p>
                    </div>
                </div>
            </div>


            {/* Principles Section - Refined */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
                        {/* Principle 1 */}
                        <div className="text-center space-y-6 group">
                            <div className="w-20 h-20 mx-auto rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-gold-400 group-hover:text-gold-500 transition-all duration-500">
                                <Diamond className="w-8 h-8" strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900">Timeless Design</h3>
                            <p className="text-stone-500 font-light leading-relaxed px-4">
                                Pieces that transcend trends, meant to be cherished today and passed down as heirlooms tomorrow.
                            </p>
                        </div>

                        {/* Principle 2 */}
                        <div className="text-center space-y-6 group">
                            <div className="w-20 h-20 mx-auto rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-gold-400 group-hover:text-gold-500 transition-all duration-500">
                                <Award className="w-8 h-8" strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900">Expert Craftsmanship</h3>
                            <p className="text-stone-500 font-light leading-relaxed px-4">
                                Decades of experience guide every cut and setting, ensuring perfection in every detail.
                            </p>
                        </div>

                        {/* Principle 3 */}
                        <div className="text-center space-y-6 group">
                            <div className="w-20 h-20 mx-auto rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-gold-400 group-hover:text-gold-500 transition-all duration-500">
                                <Sparkles className="w-8 h-8" strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900">Ethical Integrity</h3>
                            <p className="text-stone-500 font-light leading-relaxed px-4">
                                Committed to responsible sourcing and transparency, creating beauty with a clear conscience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
