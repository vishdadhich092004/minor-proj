import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import Navbar from '../components/Navbar';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { t } = useTranslation();
    const { items, updateQuantity, removeFromCart, getSubtotal } = useCartStore();
    const navigate = useNavigate();
    const subtotal = getSubtotal();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <img src="/empty-cart.png" alt="Empty Cart" className="w-48 h-48 opacity-50 mb-4" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cart.empty_title')}</h2>
                    <p className="text-gray-500 mb-6">{t('cart.empty_subtitle')}</p>
                    <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                        {t('cart.start_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.title')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.variant}`} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                        {item.variant && <p className="text-sm text-gray-500">{t('cart.variant')}: {item.variant}</p>}
                                        <p className="font-bold text-primary mt-1">₹{item.price}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.variant, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id, item.variant)}
                                            className="text-red-500 hover:text-red-600 p-2"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('cart.order_summary')}</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.shipping')}</span>
                                    <span className="text-green-600">{t('cart.free')}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>{t('cart.total')}</span>
                                    <span>₹{subtotal}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {t('cart.checkout')} <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Cart;
