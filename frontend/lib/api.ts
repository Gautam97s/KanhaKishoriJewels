import axios from 'axios';
import { Product, Category, User, Order } from './types';
import { CATEGORIES } from './constants'; // Keep categories static for now if backend doesn't have an endpoint, or mock them if needed.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add interceptor to handle errors (token expiration)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (credentials: { email: string; password: string }) => {
    // Backend expects OAuth2PasswordRequestForm (username, password)
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    const response = await api.post('/auth/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // Backend returns { access_token, token_type }
    const token = response.data.access_token;

    // Fetch user details with the new token
    const userResponse = await api.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const userData = userResponse.data;

    return {
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            role: userData.role,
            phone_number: userData.phone_number,
            address: userData.address,
            createdAt: userData.created_at
        },
        token
    };
};

export const signup = async (payload: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/signup', {
        email: payload.email,
        password: payload.password,
        full_name: payload.name,
    });
    // Backend returns User object.
    // We can auto-login or ask user to login. 
    // Frontend expects { user, token }. 
    // Signup doesn't return token in backend implementation provided.
    // So we might need to login after signup.

    // Let's assume we need to login separately or return just user.
    // Adaptation:
    return {
        user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.full_name,
            role: response.data.role,
            createdAt: response.data.created_at
        },
        token: '' // No token on signup
    };
};

export const updateProfile = async (data: Partial<User>) => {
    // Backend expects snake_case, frontend uses mapping if needed, or sending direct payload matching Pydantic
    const payload = {
        full_name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address
    };
    const response = await api.put('/users/me', payload);
    return response.data; // Returns updated user
};

export const createProduct = async (productData: Partial<Product>) => {
    // Backend expects ProductCreate schema
    // Map frontend Product to backend schema
    // Frontend Product: id, name, price, currency, categoryId, image, description, details
    // Backend ProductCreate: name, description, price, image_url, category, stock, is_featured

    const payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image, // Map image -> image_url
        category: productData.categoryId, // Map categoryId -> category
        stock: productData.inStock ? 10 : 0, // Simple mapping
        is_featured: productData.isNewArrival,
        is_holiday_special: productData.isHolidaySpecial, // Added payload field
        details: productData.details // Backend doesn't support details json yet? 
        // We added models but maybe not in schema yet. Checking ProductBase...
        // ProductBase has: name, description, price, image_url, category, stock, is_featured.
        // It DOES NOT have 'details'. So we lose material/gemstone for now unless we add it to backend.
    };

    // We strictly need to modify backend if we want to save details.
    // For now, let's just save valid fields.
    const response = await api.post('/products/', payload);
    return response.data;
};

export const updateProductById = async (id: string, productData: Partial<Product>) => {
    const payload = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image,
        category: productData.categoryId,
        stock: productData.inStock ? 10 : 0,
        is_featured: productData.isNewArrival,
        is_holiday_special: productData.isHolidaySpecial // Added payload field
    };
    // Using ID as slug/id param
    const response = await api.put(`/products/${id}`, payload);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const getProducts = async (params?: { category?: string; limit?: number }) => {
    const response = await api.get('/products/', {
        params: {
            category: params?.category,
            limit: params?.limit
        }
    });

    // Backend returns list of products.
    // Map backend snake_case to frontend camelCase if necessary.
    // Frontend Product interface: id, name, price, currency, categoryId, image, description, details, inStock, isNewArrival
    // Backend: id, name, slug, description, price, stock, image_url, category, is_featured

    return response.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price, // Assuming currency is implied or we add it
        currency: 'INR',
        categoryId: p.category, // Map category string to Id if needed, or just use string
        image: p.image_url,
        description: p.description,
        details: {}, // Backend doesn't have details json yet
        inStock: p.stock > 0,
        isNewArrival: false // or use created_at logic
    }));
};

export const getProductById = async (id: string) => {
    // Configured backend to use slug or id
    const response = await api.get(`/products/${id}`);
    const p = response.data;
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        currency: 'INR',
        categoryId: p.category,
        image: p.image_url,
        description: p.description,
        details: {},
        inStock: p.stock > 0,
        isNewArrival: false
    };
};

export const getCategories = async () => {
    // Backend doesn't have categories endpoint yet. Return static.
    return Promise.resolve(CATEGORIES);
};

export const getCart = async () => Promise.resolve([]);
export const addToCart = async (productId: string, quantity: number = 1) => Promise.resolve({ productId, quantity, product: {} as any });
export const updateCartItem = async (productId: string, quantity: number) => Promise.resolve({ productId, quantity, product: {} as any });
export const removeFromCart = async (productId: string) => Promise.resolve();

export const createOrder = async (orderPayload: { items: any[]; shippingAddress: any }) => {
    // Backend has /orders endpoint but we haven't mapped it fully.
    return Promise.resolve({
        id: Date.now().toString(),
        userId: '1',
        items: [],
        totalAmount: 0,
        currency: 'INR',
        status: 'pending' as const,
        shippingAddress: orderPayload.shippingAddress,
        createdAt: new Date().toISOString()
    });
};

export default {
    getProducts,
    getProductById,
    getCategories,
    createProduct,
    updateProductById,
    deleteProduct,
    login
};
