'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const { cart, toggleCart } = useShop();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Store', path: '/catalog' },
    ];

    return (
        <nav className="absolute top-0 w-full z-50 bg-transparent pt-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-16 border-b border-stone-800/10">

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden ${pathname === '/about' ? 'text-white' : 'text-stone-900'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-xs uppercase tracking-widest transition-colors ${pathname === '/about'
                                    ? 'text-stone-200 hover:text-white'
                                    : 'text-stone-600 hover:text-stone-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/" className={`font-serif text-2xl md:text-3xl tracking-[0.1em] whitespace-nowrap ${pathname === '/about' ? 'text-white' : 'text-stone-900'
                            }`}>
                            KANHA & KISHORI
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="hidden md:block bg-stone-900 text-white text-xs px-6 py-2.5 uppercase tracking-widest hover:bg-stone-800 transition-colors">
                            Contact Us
                        </button>

                        <Link href={user ? "/profile" : "/signin"}>
                            <button className={`p-2 border rounded-full transition-colors ${pathname === '/about'
                                    ? 'text-white border-stone-400 hover:border-white'
                                    : 'text-stone-900 border-stone-300 hover:border-stone-900'
                                }`}>
                                <User className="h-4 w-4" />
                            </button>
                        </Link>

                        <button
                            className={`relative p-2 border rounded-full transition-colors ${pathname === '/about'
                                    ? 'text-white border-stone-400 hover:border-white'
                                    : 'text-stone-900 border-stone-300 hover:border-stone-900'
                                }`}
                            onClick={() => toggleCart(true)}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-terracotta-600 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-beige-100 absolute w-full border-b border-stone-200 shadow-lg top-24 left-0 z-40">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full text-left px-3 py-3 text-sm uppercase tracking-widest text-stone-900"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button className="block w-full mt-4 bg-stone-900 text-white text-xs px-6 py-3 uppercase tracking-widest">
                            Contact Us
                        </button>
                        {user && (
                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="block w-full mt-2 border border-stone-900 text-stone-900 text-xs px-6 py-3 uppercase tracking-widest hover:bg-stone-50 transition-colors">
                                    Profile
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
