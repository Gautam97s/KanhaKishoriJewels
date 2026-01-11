'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-serif text-2xl text-stone-50 mb-6 tracking-widest">KANHA & KISHORI</h3>
                        <p className="text-sm leading-relaxed max-w-md">
                            Crafting eternal moments through ethically sourced gemstones and unparalleled artistry.
                            Each piece tells a story of elegance, waiting to become part of yours.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-stone-50 mb-6 uppercase tracking-widest text-sm">Customer Care</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/contact" className="hover:text-gold-400 cursor-pointer transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-gold-400 cursor-pointer transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/size-guide" className="hover:text-gold-400 cursor-pointer transition-colors">Size Guide</Link></li>
                            <li><Link href="/warranty" className="hover:text-gold-400 cursor-pointer transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-stone-50 mb-6 uppercase tracking-widest text-sm">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/privacy-policy" className="hover:text-gold-400 cursor-pointer transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-gold-400 cursor-pointer transition-colors">Terms of Service</Link></li>
                            <li><Link href="/accessibility" className="hover:text-gold-400 cursor-pointer transition-colors">Accessibility</Link></li>
                            {/* <li>
                                <Link href="/admin" className="hover:text-gold-400 cursor-pointer transition-colors text-stone-600">
                                    Admin Access
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Kanha & Kishori. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-6">
                        <span>Instagram</span>
                        <span>Pinterest</span>
                        <span>Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
