import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, CreditCard, Banknote, Loader2 } from 'lucide-react';

// Load Razorpay Script
const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const checkoutSchema = z.object({
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
    const navigate = useNavigate();
    const { items, coupon, applyCoupon, removeCoupon, placeOrder, createRazorpayOrder, verifyRazorpayPayment, getSubtotal, getTotal } = useCartStore();
    const { user } = useAuth();
    
    const [couponCode, setCouponCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('prepaid');
    const [isProcessing, setIsProcessing] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            country: 'India'
        }
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        const success = await applyCoupon(couponCode);
        if (success) {
            alert('Coupon applied!');
        } else {
            alert('Invalid coupon');
        }
    };

    const onSubmit = async (data: CheckoutFormData) => {
        setIsProcessing(true);
        const orderTotal = getTotal();
        debugger; // Allow debugging if needed

        try {
            if (paymentMethod === 'cod') {
                const orderData = {
                    userID: user?._id || '',
                    orderStatus: 'pending',
                    items: items.map(item => ({
                        productID: item.id,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        variant: item.variant
                    })),
                    totalPrice: getSubtotal(),
                    shippingAddress: data,
                    paymentMethod: 'cod',
                    couponCode: coupon?._id,
                    orderTotal: {
                        subtotal: getSubtotal(),
                        discount: coupon ? (coupon.discountType === 'fixed' ? coupon.discountAmount : (getSubtotal() * coupon.discountAmount)/100) : 0,
                        total: orderTotal
                    }
                };

                const orderId = await placeOrder(orderData);
                if (orderId) {
                    alert('Order placed successfully!');
                    navigate(`/order/${orderId}`);
                } else {
                    alert('Failed to place order');
                }
            } else {
                // Prepaid (Razorpay)
                const res = await loadRazorpay();
                if (!res) {
                    alert('Razorpay SDK failed to load');
                    setIsProcessing(false);
                    return;
                }

                const order = await createRazorpayOrder(orderTotal);
                if (!order) {
                    alert('Failed to create order');
                    setIsProcessing(false);
                    return;
                }

                const options = {
                    key: order.key, // Enter the Key ID generated from the Dashboard
                    amount: order.amount,
                    currency: order.currency,
                    name: "E-Commerce App",
                    description: "Order Payment",
                    order_id: order.orderId,
                    handler: async function (response: any) {
                        const verified = await verifyRazorpayPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );
                        
                        if (verified) {
                             const orderData = {
                                userID: user?._id || '',
                                orderStatus: 'pending',
                                items: items.map(item => ({
                                    productID: item.id,
                                    productName: item.name,
                                    quantity: item.quantity,
                                    price: item.price,
                                    variant: item.variant
                                })),
                                totalPrice: getSubtotal(),
                                shippingAddress: data,
                                paymentMethod: 'prepaid',
                                couponCode: coupon?._id,
                                orderTotal: {
                                    subtotal: getSubtotal(),
                                    discount: coupon ? (coupon.discountType === 'fixed' ? coupon.discountAmount : (getSubtotal() * coupon.discountAmount)/100) : 0,
                                    total: orderTotal
                                }
                            };
                            const orderId = await placeOrder(orderData);
                            if (orderId) {
                                alert('Payment successful and order placed!');
                                navigate(`/order/${orderId}`);
                            } else {
                                alert('Order creation failed after payment');
                            }
                        } else {
                            alert('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.useremail,
                        contact: data.phone
                    },
                    theme: {
                        color: "#EC6813"
                    }
                };
                
                const rzp1 = new (window as any).Razorpay(options);
                rzp1.open();
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    const calculatedSubtotal = getSubtotal();
    const calculatedDiscount = coupon ? (coupon.discountType === 'fixed' ? coupon.discountAmount : (calculatedSubtotal * coupon.discountAmount)/100) : 0;
    const finalTotal = calculatedSubtotal - calculatedDiscount;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                 <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Cart
                </button>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <input {...register('phone')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Street</label>
                                    <input {...register('street')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.street && <span className="text-red-500 text-xs">{errors.street.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <input {...register('city')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">State</label>
                                    <input {...register('state')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                    <input {...register('postalCode')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode.message}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Country</label>
                                    <input {...register('country')} className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary" />
                                    {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                             <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                             <div className="space-y-3">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'prepaid' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="prepaid" 
                                        checked={paymentMethod === 'prepaid'} 
                                        onChange={() => setPaymentMethod('prepaid')}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <div className="ml-3 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">Pay Online (Razorpay)</span>
                                    </div>
                                </label>
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="cod" 
                                        checked={paymentMethod === 'cod'} 
                                        onChange={() => setPaymentMethod('cod')}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <div className="ml-3 flex items-center gap-2">
                                        <Banknote className="h-5 w-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                                    </div>
                                </label>
                             </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>
                            
                            {/* Coupon */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Coupon Code" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 p-2 border rounded-lg text-sm"
                                        disabled={!!coupon}
                                    />
                                    {coupon ? (
                                        <button onClick={removeCoupon} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">Remove</button>
                                    ) : (
                                        <button onClick={handleApplyCoupon} className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">Apply</button>
                                    )}
                                </div>
                                {coupon && <p className="text-green-600 text-xs mt-1">Coupon applied successfully!</p>}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{calculatedSubtotal}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{calculatedDiscount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                            </div>
                            
                            <button 
                                form="checkout-form"
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : (paymentMethod === 'cod' ? 'Place Order' : 'Pay Now')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
