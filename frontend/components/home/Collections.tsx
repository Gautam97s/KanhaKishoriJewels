'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Category } from '../../lib/types';

interface CollectionsProps {
    categories: Category[];
}

export default function Collections({ categories }: CollectionsProps) {
    const [collectionPage, setCollectionPage] = useState(0);
    const COLLECTIONS_PER_PAGE = 4;
    const totalCollectionPages = Math.ceil(categories.length / COLLECTIONS_PER_PAGE);

    const handlePrevCollection = () => {
        setCollectionPage((prev) => (prev - 1 + totalCollectionPages) % totalCollectionPages);
    };

    const handleNextCollection = () => {
        setCollectionPage((prev) => (prev + 1) % totalCollectionPages);
    };

    return (
        <section className="py-16 md:py-24 bg-beige-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-0">
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900">Our collections</h2>
                    <div className="flex gap-2 self-end md:self-auto">
                        <button
                            onClick={handlePrevCollection}
                            className="p-2 border border-stone-800 rounded-full hover:bg-stone-800 hover:text-white transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleNextCollection}
                            className="p-2 border border-stone-800 rounded-full hover:bg-stone-800 hover:text-white transition"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.slice(collectionPage * COLLECTIONS_PER_PAGE, (collectionPage + 1) * COLLECTIONS_PER_PAGE).map((cat) => (
                        <Link
                            key={cat.id}
                            href="/catalog"
                            className="relative h-[300px] group overflow-hidden cursor-pointer block"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                            {/* Overlay Content */}
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="font-serif text-2xl text-white mb-2 bg-stone-900/80 px-4 py-1 inline-block">{cat.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
