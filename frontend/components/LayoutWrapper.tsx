'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import AIConcierge from './AIConcierge';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/signin' || pathname === '/signup';

    return (
        <>
            {!isAuthPage && <Navbar />}
            {!isAuthPage && <CartDrawer />}
            <main className={`min-h-screen ${!isAuthPage && pathname !== '/about' ? 'pt-16' : ''}`}>
                {children}
            </main>
            {!isAuthPage && <AIConcierge />}
            {!isAuthPage && <Footer />}
        </>
    );
}
