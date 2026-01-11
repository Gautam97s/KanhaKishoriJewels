'use client';

import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../lib/constants';

// Import Home Components
import Hero from '../components/home/Hero';
import Collections from '../components/home/Collections';
import NewArrivals from '../components/home/NewArrivals';
import Testimonials from '../components/home/Testimonials';
import HolidayBanner from '../components/home/HolidayBanner';

export default function Home() {
  const { products } = useShop();
  const { products } = useShop();





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
