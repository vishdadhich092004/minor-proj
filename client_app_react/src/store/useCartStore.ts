import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import type { Coupon, CartItem, OrderData, ApiResponse } from '../types';

interface CartState {
    items: CartItem[];
    coupon: Coupon | null;
    discountAmount: number;

    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, variant?: string) => void;
    updateQuantity: (id: string, variant: string | undefined, quantity: number) => void;
    clearCart: () => void;

    applyCoupon: (code: string) => Promise<boolean>;
    removeCoupon: () => void;
    getSubtotal: () => number;
    getTotal: () => number;

    createRazorpayOrder: (amount: number) => Promise<any>;
    verifyRazorpayPayment: (orderId: string, paymentId: string, signature: string) => Promise<boolean>;
    placeOrder: (orderData: OrderData) => Promise<string | null>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            coupon: null,
            discountAmount: 0,

            addToCart: (item) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.id === item.id && i.variant === item.variant
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id && i.variant === item.variant
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                });
            },

            removeFromCart: (id, variant) => {
                set((state) => ({
                    items: state.items.filter((i) => !(i.id === id && i.variant === variant)),
                }));
            },

            updateQuantity: (id, variant, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id && i.variant === variant ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [], coupon: null, discountAmount: 0 });
            },

            getSubtotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getTotal: () => {
                return get().getSubtotal() - get().discountAmount;
            },

            applyCoupon: async (code: string) => {
                const subtotal = get().getSubtotal();
                const productIds = get().items.map(i => i.id);

                try {
                    const response = await api.post<ApiResponse<Coupon>>('/couponCodes/check-coupon', {
                        couponCode: code,
                        purchaseAmount: subtotal,
                        productIds
                    });

                    if (response.data.success && response.data.data) {
                        const coupon = response.data.data;
                        let discount = 0;
                        if (coupon.discountType === 'fixed') {
                            discount = coupon.discountAmount;
                        } else {
                            discount = (subtotal * coupon.discountAmount) / 100;
                        }

                        set({ coupon, discountAmount: discount });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Coupon check failed', error);
                    return false;
                }
            },

            removeCoupon: () => {
                set({ coupon: null, discountAmount: 0 });
            },

            createRazorpayOrder: async (amount: number) => {
                try {
                    const response = await api.post('/payment/razorpay/create-order', {
                        amount,
                        currency: 'INR',
                        receipt: `receipt_${Date.now()}`
                    });
                    if (response.data.success || !response.data.error) {
                        return response.data.data;
                    }
                    return null;
                } catch (error) {
                    console.error('Razorpay order creation failed', error);
                    return null;
                }
            },

            verifyRazorpayPayment: async (orderId, paymentId, signature) => {
                try {
                    const response = await api.post('/payment/razorpay/verify', {
                        razorpay_order_id: orderId,
                        razorpay_payment_id: paymentId,
                        razorpay_signature: signature
                    });
                    return response.data.success || !response.data.error;
                } catch (error) {
                    console.error('Payment verification failed', error);
                    return false;
                }
            },

            placeOrder: async (orderData) => {
                try {
                    const response = await api.post('/orders', orderData);
                    if (response.data.success) {
                        get().clearCart();
                        // Assuming backend returns the created order object in data
                        // Check backend structure if needed. Usually response.data.data._id
                        // Based on Flutter code analysis or typical pattern:
                        return response.data.data?._id || null;
                    }
                    return null;
                } catch (error) {
                    console.error('Place order failed', error);
                    return null;
                }
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
