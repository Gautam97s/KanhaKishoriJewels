'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../lib/constants';

// Import Home Components
import Hero from '../components/home/Hero';
import Collections from '../components/home/Collections';
import NewArrivals from '../components/home/NewArrivals';
import Testimonials from '../components/home/Testimonials';
import HolidayBanner from '../components/home/HolidayBanner';

export default function Home() {
  const { products } = useShop();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-beige-100">
        <div className="text-terracotta-600 animate-pulse">Loading JewelE...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-beige-100 -mt-20"> {/* Negative margin to offset padding-top in layout for Hero */}

      <Hero products={products} />

      <Collections categories={CATEGORIES} />

      <NewArrivals products={products} />

      {/* <Testimonials /> */}

      <HolidayBanner products={products} />

    </div>
  );
}
