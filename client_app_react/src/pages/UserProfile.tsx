import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Package, MapPin, LogOut, ChevronRight, Plus, Trash2, X } from 'lucide-react';

interface Address {
    id: string;
    type: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}

const UserProfile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // State for modals
    const [showAddressModal, setShowAddressModal] = useState(false);

    
    // State for Features
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [newAddress, setNewAddress] = useState<Partial<Address>>({});
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    // Initialize data from localStorage
    useEffect(() => {
        const storedAddresses = localStorage.getItem('user_addresses');
        if (storedAddresses) {
            setAddresses(JSON.parse(storedAddresses));
        }
        

    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('user_addresses', JSON.stringify(addresses));
    }, [addresses]);



    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/')
    };

    const handleAddAddress = () => {
        if (!newAddress.street || !newAddress.city || !newAddress.zip) return;
        
        const address: Address = {
            id: Date.now().toString(),
            type: newAddress.type || 'Home',
            street: newAddress.street,
            city: newAddress.city,
            state: newAddress.state || '',
            zip: newAddress.zip
        };
        
        setAddresses([...addresses, address]);
        setNewAddress({});
        setIsAddingAddress(false);
    };

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };



    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('profile.title')}</h1>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="p-6 flex flex-col items-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-4">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500">{user.useremail}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Package className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-900">{t('profile.my_orders')}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        <button 
                            onClick={() => setShowAddressModal(true)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-gray-900">{t('profile.my_addresses')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{addresses.length} {t('profile.saved')}</span>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                        </button>



                         <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-red-600">{t('profile.logout')}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddressModal(false)}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{t('profile.address_modal_title')}</h3>
                            <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {isAddingAddress ? (
                            <div className="space-y-4">
                                <input 
                                    placeholder={t('profile.address_label')}
                                    className="w-full p-2 border rounded-lg"
                                    value={newAddress.type || ''}
                                    onChange={e => setNewAddress({...newAddress, type: e.target.value})}
                                />
                                <input 
                                    placeholder={t('profile.street_address')}
                                    className="w-full p-2 border rounded-lg"
                                    value={newAddress.street || ''}
                                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        placeholder={t('profile.city')}
                                        className="w-full p-2 border rounded-lg"
                                        value={newAddress.city || ''}
                                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                    />
                                    <input 
                                        placeholder={t('profile.state')}
                                        className="w-full p-2 border rounded-lg"
                                        value={newAddress.state || ''}
                                        onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                    />
                                </div>
                                <input 
                                    placeholder={t('profile.zip_code')} 
                                    className="w-full p-2 border rounded-lg"
                                    value={newAddress.zip || ''}
                                    onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                />
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => setIsAddingAddress(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                                    >
                                        {t('profile.cancel')}
                                    </button>
                                    <button 
                                        onClick={handleAddAddress}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
                                    >
                                        {t('profile.save_address')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {addresses.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">{t('profile.no_addresses')}</p>
                                    ) : (
                                        addresses.map(addr => (
                                            <div key={addr.id} className="p-3 border rounded-xl flex justify-between items-center bg-gray-50">
                                                <div>
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                        {addr.type}
                                                    </span>
                                                    <p className="text-sm font-medium mt-1">{addr.street}</p>
                                                    <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button 
                                    onClick={() => setIsAddingAddress(true)}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    {t('profile.add_new_address')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
};

export default UserProfile;
