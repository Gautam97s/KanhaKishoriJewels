'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../lib/types';
import { PRODUCTS } from '../lib/constants';
import api from '../lib/api';

interface ShopContextType {
    products: Product[];
    cart: CartItem[];
    isCartOpen: boolean;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    removeProduct: (id: string) => Promise<void>;
    toggleProductStock: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    toggleCart: (isOpen?: boolean) => void;
    clearCart: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]); // Start empty, fetch from API
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await api.getProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
                // Fallback to constants if API fails?
                setProducts(PRODUCTS);
            }
        };
        fetchProducts();
    }, []);

    const addProduct = async (product: Product) => {
        try {
            const savedProductBackend = await api.createProduct(product);

            // Map back to frontend Product
            const savedProduct: Product = {
                id: savedProductBackend.id,
                name: savedProductBackend.name,
                price: savedProductBackend.price,
                currency: 'INR',
                categoryId: savedProductBackend.category,
                image: savedProductBackend.image_url,
                description: savedProductBackend.description,
                details: { material: '', gemstone: '' },
                inStock: savedProductBackend.stock > 0,
                isNewArrival: savedProductBackend.is_featured
            };

            setProducts((prev) => [savedProduct, ...prev]);
        } catch (error) {
            console.error("Failed to create product", error);
            throw error; // Retrow so component can handle UI
        }
    };

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId: product.id, quantity: 1, product }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.productId === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const toggleCart = (isOpen?: boolean) => {
        setIsCartOpen((prev) => (isOpen !== undefined ? isOpen : !prev));
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const savedProductBackend = await api.updateProductById(updatedProduct.id, updatedProduct);
            // Map back to frontend Product (reuse logic or extract mapper)
            const savedProduct: Product = {
                id: savedProductBackend.id,
                name: savedProductBackend.name,
                price: savedProductBackend.price,
                currency: 'INR',
                categoryId: savedProductBackend.category,
                image: savedProductBackend.image_url,
                description: savedProductBackend.description,
                details: { material: '', gemstone: '' },
                inStock: savedProductBackend.stock > 0,
                isNewArrival: savedProductBackend.is_featured
            };

            setProducts((prev) =>
                prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
            );
        } catch (error) {
            console.error("Failed to update product", error);
            throw error;
        }
    };

    const removeProduct = async (id: string) => {
        try {
            await api.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product", error);
            throw error;
        }
    };

    const toggleProductStock = (id: string) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <ShopContext.Provider
            value={{
                products,
                cart,
                isCartOpen,
                addProduct,
                updateProduct,
                removeProduct,
                toggleProductStock,
                addToCart,
                removeFromCart,
                updateQuantity,
                toggleCart,
                clearCart,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
