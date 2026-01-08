export interface User {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
    phone_number?: string;
    address?: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    categoryId: string;
    image: string;
    description: string;
    details: {
        material: string;
        gemstone?: string;
        weight?: string;
    };
    inStock: boolean;
    isNewArrival?: boolean;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product: Product; // Expanded for frontend ease
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface Order {
    id: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalAmount: number;
    currency: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    shippingAddress: Address;
    createdAt: string;
}

// --- Frontend Application Types ---

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export enum Page {
    HOME = 'HOME',
    CATALOG = 'CATALOG',
    PRODUCT = 'PRODUCT',
    CART = 'CART',
    CHECKOUT = 'CHECKOUT',
    ADMIN = 'ADMIN'
}
