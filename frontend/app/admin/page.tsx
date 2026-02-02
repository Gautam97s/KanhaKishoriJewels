'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Check, Plus, Lock, Package, Search, XCircle, AlertCircle, Edit } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../lib/constants';
import { Product } from '../../lib/types';
import OrdersManager from '../../components/admin/OrdersManager';
import api from '../../lib/api';

export default function AdminPage() {
    const router = useRouter();
    const { products, addProduct, updateProduct, removeProduct, toggleProductStock } = useShop();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'add' | 'list' | 'orders'>('list');
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: CATEGORIES[0].id,
        description: '',
        material: '',
        gemstone: '',
        inStock: true,
        discountPercentage: '0',
        isHolidaySpecial: false
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [error, setError] = useState<{ [key: string]: string }>({});
    const [errorString, setErrorString] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({});
        try {
            const { token, user } = await api.login({ email, password });
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setIsAuthenticated(true);
            }
        } catch (err: any) {
            console.error(err);
            setError({ login: 'Invalid email or password' });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setError(prev => ({ ...prev, image: '' })); // Clear image error
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            setFormData({ ...formData, price: val });
            setError(prev => ({ ...prev, price: '' })); // Clear price error
        } else {
            // setError(prev => ({ ...prev, price: 'Please enter a valid price (numbers only).' }));
            // Don't set error on typing, just block incorrect input or show error if blurred? 
            // Better to show error briefly or just ignore. 
            // User requested red text under the box.
            setError(prev => ({ ...prev, price: 'Please enter a valid price (numbers only).' }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: CATEGORIES[0].id,
            description: '',
            material: '',
            gemstone: '',
            inStock: true,
            discountPercentage: '0',
            isHolidaySpecial: false
        });
        setImagePreview(null);
        setEditingId(null);
        setError({});
        setSuccessMessage(null);
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            category: product.categoryId,
            description: product.description,
            material: product.details.material,
            gemstone: product.details.gemstone || '',
            inStock: product.inStock,
            discountPercentage: (product.discountPercentage || 0).toString(),
            isHolidaySpecial: product.isHolidaySpecial || false
        });
        setImagePreview(product.image);
        setEditingId(product.id);
        setActiveTab('add');
        setError({});
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({});
        setSuccessMessage(null);

        if (!imagePreview) {
            setError(prev => ({ ...prev, image: 'Please upload an image.' }));
            return;
        }

        const productData: Product = {
            id: editingId || Date.now().toString(),
            name: formData.name,
            price: parseFloat(formData.price),
            currency: 'INR',
            categoryId: formData.category,
            image: imagePreview,
            description: formData.description,
            details: {
                material: formData.material,
                gemstone: formData.gemstone || undefined,
            },
            inStock: formData.inStock,
            isNewArrival: true,
            discountPercentage: parseFloat(formData.discountPercentage) || 0,
            isHolidaySpecial: formData.isHolidaySpecial
        };

        try {
            if (editingId) {
                await updateProduct(productData);
                setSuccessMessage("Product updated successfully.");
            } else {
                await addProduct(productData);
                setSuccessMessage("Product successfully added to the collection.");
            }
            // Optional: reset form after success, or keep it to show success message?
            // Resetting form clears message if we do it immediately.
            // Let's modify resetForm or handle it separate.
            setTimeout(() => {
                resetForm();
                setActiveTab('list');
            }, 1000);
        } catch (err) {
            // Error handling wrapped in ShopContext but we catch re-thrown errors?
            // ShopContext currently uses alert(). I should probably suppressing alerts there or handle UI feedback here.
            // But ShopContext alert is hardcoded.
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)
    );

    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

    const handleDeleteClick = (id: string, name: string) => {
        setItemToDelete({ id, name });
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await removeProduct(itemToDelete.id);
                setSuccessMessage(`"${itemToDelete.name}" has been deleted.`);
                setErrorString(null);
            } catch (error: any) {
                console.error("Delete failed", error);
                const msg = error.response?.data?.detail || "Failed to delete product. It might be linked to existing orders.";
                setErrorString(msg);
                setSuccessMessage(null);
            } finally {
                setItemToDelete(null);
            }
        }
    };

    if (!isAuthenticated) {
        // ... (Keep existing login logic)
        return (
            <div className="min-h-screen bg-beige-100 flex items-center justify-center animate-fade-in">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-900">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-center font-serif text-2xl mb-6 text-stone-900">Admin Access</h1>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-beige-50 border p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                            autoFocus
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={`w-full bg-beige-50 border p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none ${error.login ? 'border-red-500' : 'border-transparent'}`}
                        />
                        {error.login && <p className="text-red-500 text-xs mt-1">{error.login}</p>}
                    </div>
                    <button type="submit" className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-sm hover:bg-terracotta-600 transition-colors">
                        Login
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/" className="text-xs text-stone-500 hover:text-stone-900">Return to Home</Link>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-beige-100 animate-fade-in pt-10 relative">
            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="font-serif text-xl text-stone-900 mb-2">Delete Product?</h3>
                            <p className="text-stone-500 text-sm mb-6">
                                Are you sure you want to delete <span className="font-bold text-stone-900">"{itemToDelete.name}"</span>?
                                <br />This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="flex-1 px-4 py-3 bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-widest rounded hover:bg-stone-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-red-700 transition-colors shadow-md"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6">
                {/* ... (Rest of the component content) ... */}
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Admin Dashboard</h1>
                        <p className="text-stone-500 font-light">Manage your collection and inventory.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold uppercase tracking-widest text-stone-900">Total Products</p>
                            <p className="font-serif text-2xl">{products.length}</p>
                        </div>
                        <button onClick={() => setIsAuthenticated(false)} className="text-sm underline text-stone-500 hover:text-stone-900">Exit Admin</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-stone-200">
                    <button
                        onClick={() => { setActiveTab('list'); resetForm(); }}
                        className={`pb-4 px-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'list' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        Inventory List
                    </button>
                    <button
                        onClick={() => { setActiveTab('orders'); resetForm(); }}
                        className={`pb-4 px-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        Manage Orders
                    </button>
                    <button
                        onClick={() => { setActiveTab('add'); resetForm(); }}
                        className={`pb-4 px-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'add' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                        {editingId ? 'Edit Product' : 'Add New Product'}
                    </button>
                </div>

                {/* Global Messages (List View) */}
                {activeTab === 'list' && (
                    <div className="mb-6">
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded text-sm flex items-center gap-2 animate-fade-in">
                                <Check className="w-4 h-4" />
                                {successMessage}
                            </div>
                        )}
                        {errorString && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex items-center gap-2 animate-fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {errorString}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'list' ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-stone-100 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-beige-50 rounded-md text-sm border-none focus:ring-1 focus:ring-stone-900"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-beige-50 text-xs uppercase tracking-widest text-stone-500">
                                    <tr>
                                        <th className="p-4 font-medium">Product</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Price</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-beige-50/50 transition-colors">
                                            <td className="p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white border border-stone-100 rounded p-1">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-stone-900 text-sm">{product.name}</p>
                                                    <p className="text-xs text-stone-400">ID: {product.id}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-stone-600">
                                                {CATEGORIES.find(c => c.id === product.categoryId)?.name || product.categoryId}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-stone-900">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleProductStock(product.id)}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${product.inStock
                                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                        }`}
                                                >
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-stone-400 hover:text-stone-900 transition-colors p-2 inline-block"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product.id, product.name)}
                                                    className="text-stone-400 hover:text-red-600 transition-colors p-2 inline-block"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-stone-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <AlertCircle className="w-8 h-8 text-stone-300" />
                                                    <p>No products found matching "{searchTerm}"</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'orders' ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <OrdersManager />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 shadow-sm rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in relative">
                        {editingId && (
                            <div className="absolute top-4 right-4 bg-terracotta-100 text-terracotta-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Edit className="w-3 h-3" /> Editing Mode
                            </div>
                        )}

                        {successMessage && (
                            <div className="lg:col-span-2 bg-green-50 border border-green-200 text-green-700 p-4 rounded text-sm mb-4 flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {successMessage}
                            </div>
                        )}

                        {/* Left: Image Upload */}
                        <div>
                            <label className="block font-serif text-lg mb-4">Product Photography</label>
                            <div className={`relative aspect-square bg-beige-50 border-2 border-dashed ${error.image ? 'border-red-500 bg-red-50/10' : 'border-stone-300'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-beige-100 transition-colors group overflow-hidden`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto mb-4 group-hover:bg-terracotta-100 group-hover:text-terracotta-600 transition-colors">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm font-medium text-stone-900">Click to upload image</p>
                                        <p className="text-xs text-stone-500 mt-2">SVG, PNG, JPG or GIF</p>
                                    </div>
                                )}
                            </div>
                            {error.image && <p className="text-red-500 text-xs mt-2">{error.image}</p>}
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="mt-4 text-xs text-red-500 flex items-center gap-1 hover:underline"
                                >
                                    <Trash2 className="w-3 h-3" /> Remove Image
                                </button>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                    placeholder="e.g. Royal Sapphire Necklace"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Price (INR)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.price}
                                        onChange={handlePriceChange}
                                        className={`w-full bg-beige-50 border ${error.price ? 'border-red-500' : 'border-transparent'} p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none`}
                                        placeholder="0.00"
                                    />
                                    {error.price && <p className="text-red-500 text-xs mt-1">{error.price}</p>}
                                </div>
                                <div className="flex items-center gap-2 mt-6">
                                    <input
                                        type="checkbox"
                                        id="isHolidaySpecial"
                                        checked={formData.isHolidaySpecial}
                                        onChange={e => setFormData({ ...formData, isHolidaySpecial: e.target.checked })}
                                        className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900"
                                    />
                                    <label htmlFor="isHolidaySpecial" className="text-xs font-bold uppercase tracking-widest text-stone-900">
                                        Holiday Special
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Discount (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discountPercentage}
                                        onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none "
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none h-32 resize-none"
                                    placeholder="Describe the elegance and craftsmanship..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Material</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.material}
                                        onChange={e => setFormData({ ...formData, material: e.target.value })}
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                        placeholder="e.g. 18k Gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">Gemstone (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.gemstone}
                                        onChange={e => setFormData({ ...formData, gemstone: e.target.value })}
                                        className="w-full bg-beige-50 border-none p-4 text-sm focus:ring-1 focus:ring-stone-900 outline-none"
                                        placeholder="e.g. Diamond"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                                    className={`w-6 h-6 border flex items-center justify-center transition-colors ${formData.inStock ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'}`}
                                >
                                    {formData.inStock && <Check className="w-4 h-4 text-white" />}
                                </button>
                                <span className="text-sm text-stone-600">Available in Stock</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('list'); resetForm(); }}
                                        className="flex-1 bg-stone-100 text-stone-600 py-4 uppercase tracking-widest text-sm hover:bg-stone-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="flex-1 bg-terracotta-600 text-white py-4 uppercase tracking-widest text-sm hover:bg-terracotta-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {editingId ? 'Update Product' : 'Upload Product'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
