import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
    {
        id: 'cat_necklaces',
        name: 'Necklaces',
        slug: 'necklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 'cat_pendants',
        name: 'Pendants',
        slug: 'pendants',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 'cat_bracelets',
        name: 'Bracelets',
        slug: 'bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 'cat_rings',
        name: 'Rings',
        slug: 'rings',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 'cat_earrings',
        name: 'Earrings',
        slug: 'earrings',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    }
];

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Heart Locket',
        price: 51500,
        currency: 'INR',
        categoryId: 'cat_earrings',
        image: 'https://images.unsplash.com/photo-1635767798638-3e2523c01e39?auto=format&fit=crop&q=80&w=800', // Gold heart pendant/earring
        description: 'A delicate 18k gold heart locket.',
        details: { material: '18k Gold', weight: '2g' },
        inStock: true,
        isNewArrival: true,
    },
    {
        id: '2',
        name: 'Layer Cake Necklace Set',
        price: 99900,
        currency: 'INR',
        categoryId: 'cat_necklaces',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800', // Layered necklace
        description: 'Double layered diamond pendant necklace.',
        details: { material: '14k Gold', gemstone: 'Diamond' },
        inStock: true,
        isNewArrival: true,
    },
    {
        id: '3',
        name: 'T1 Circle Pendant',
        price: 149000,
        currency: 'INR',
        categoryId: 'cat_pendants',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', // Circular pendant
        description: 'Modern circle pendant encrusted with pave diamonds.',
        details: { material: '18k Gold', gemstone: 'Pave Diamond' },
        inStock: true,
        isNewArrival: true,
    },
    {
        id: '4',
        name: 'Gold Bracelet with Texture',
        price: 66500,
        currency: 'INR',
        categoryId: 'cat_bracelets',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', // Gold ring/bracelet
        description: 'Hand-hammered finish gold band.',
        details: { material: '22k Gold' },
        inStock: true,
        isNewArrival: true,
    },
    {
        id: '5',
        name: 'Ethereal Diamond Ring',
        price: 375000,
        currency: 'INR',
        categoryId: 'cat_rings',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
        description: 'A masterclass in brilliance.',
        details: { material: 'Platinum', gemstone: 'Diamond' },
        inStock: true,
        isNewArrival: true,
    },
    {
        id: '6',
        name: 'Emerald Vine',
        price: 465000,
        currency: 'INR',
        categoryId: 'cat_bracelets',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
        description: 'Intertwined gold vines accented with emeralds.',
        details: { material: '18k Yellow Gold', gemstone: 'Emerald' },
        inStock: true,
        isNewArrival: true,
    },
];
