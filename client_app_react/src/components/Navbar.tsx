import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Search functionality
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Menu */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-primary md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter">
                            LOGO
                        </Link>
                    </div>

                    {/* Search Bar (Hidden on mobile for now or collapsed) */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search className="h-5 w-5 text-gray-400" />
                        </button>
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <select
                            className="p-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                            value={i18n.language}
                        >
                            <option value="en">Eng</option>
                            <option value="hi">हिं</option>
                            <option value="bn">বাং</option>
                        </select>
                        <Link to="/cart" className="p-2 text-gray-500 hover:text-primary relative">
                            <ShoppingBag className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-2 text-gray-500 hover:text-primary"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                                </button>
                                
                                {/* Dropdown */}
                                {isProfileOpen && (
                                    <>
                                        {/* Overlay to close dropdown when clicking outside */}
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsProfileOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                                            <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.useremail}</p>
                                            </div>
                                            <Link 
                                                to="/profile" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                {t('common.your_profile')}
                                            </Link>
                                            <Link 
                                                to="/orders" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                {t('common.orders')}
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('common.sign_out')}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary">
                                <User className="h-6 w-6" />
                                <span className="hidden md:block">{t('common.login')}</span>
                            </Link>
                        )}
                    </div>
                </div>
                
                 {/* Mobile Search Bar */}
                <div className="md:hidden pb-3">
                     <form onSubmit={handleSearch} className="relative">
                        <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Search className="h-4 w-4 text-gray-400" />
                        </button>
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                        />
                    </form>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 transition-opacity" 
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                    
                    {/* Sidebar Panel */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform transform translate-x-0">
                        <div className="flex items-center justify-between h-16 px-4 border-b">
                            <span className="text-2xl font-bold text-primary tracking-tighter">LOGO</span>
                            <button 
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 -mr-2 text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
                            {user ? (
                                <div className="mb-6 pb-6 border-b">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.useremail}</p>
                                        </div>
                                    </div>
                                    <nav className="space-y-2">
                                        <Link 
                                            to="/profile" 
                                            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            {t('common.profile')}
                                        </Link>
                                        <Link 
                                            to="/orders" 
                                            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            {t('common.my_orders')}
                                        </Link>
                                    </nav>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="block w-full text-center px-4 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {t('common.login_signup')}
                                </Link>
                            )}

                            <div>
                                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    {t('common.shop')}
                                </h3>
                                <div className="space-y-1">
                                    <Link 
                                        to="/" 
                                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        {t('common.all_products')}
                                    </Link>
                                    <Link 
                                        to="/cart" 
                                        className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        {t('common.cart')} ({cartCount})
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {user && (
                            <div className="border-t p-4">
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    {t('common.sign_out')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
