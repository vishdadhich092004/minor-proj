import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore';
import { useCartStore } from '../store/useCartStore';
import Navbar from '../components/Navbar';
import { ArrowLeft, ShoppingBag, Share2 } from 'lucide-react';
import type { Product } from '../types';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, variants, fetchAll, isLoading } = useDataStore();
    const addToCart = useCartStore((state) => state.addToCart);
    
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedVariant, setSelectedVariant] = useState<string>('');

    useEffect(() => {
        if (products.length === 0 || variants.length === 0) {
            fetchAll();
        }
    }, [products.length, variants.length, fetchAll]);

    useEffect(() => {
        if (id && products.length > 0) {
            const found = products.find(p => p._id === id);
            if (found) {
                setProduct(found);
                if (found.images && found.images.length > 0) {
                    setSelectedImage(found.images[0].url);
                }
            }
        }
    }, [id, products]);

    const handleAddToCart = () => {
        if (!product) return;
        
        // Check variant if applicable
        if (product.proVariantId && product.proVariantId.length > 0 && !selectedVariant) {
            alert('Please select a variant'); // Use toast later
            return;
        }

        addToCart({
            id: product._id,
            name: product.name,
            price: product.offerPrice > 0 ? product.offerPrice : product.price,
            image: product.images && product.images.length > 0 ? product.images[0].url : '',
            quantity: 1,
            variant: selectedVariant
        });
        
        // Feedback
        alert('Added to cart');
    };

    if (isLoading || (!product && products.length === 0)) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p>Product not found.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-primary underline">Go Home</button>
            </div>
        );
    }

    const displayPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
    const originalPrice = product.price;
    const discount = product.offerPrice > 0 ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                                <img 
                                    src={selectedImage || (product.images?.[0]?.url)} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {product.images.map((img) => (
                                        <button 
                                            key={img._id}
                                            onClick={() => setSelectedImage(img.url)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === img.url ? 'border-primary' : 'border-transparent'}`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                                    {/* <p className="text-sm text-gray-500 mt-1">Brand: {product.proBrandId?.name || 'Generic'}</p> */}
                                </div>
                                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                    <Share2 className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <span className="text-3xl font-bold text-primary">₹{displayPrice}</span>
                                {product.offerPrice > 0 && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-md">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {product.description}
                                </p>
                            </div>

                            {/* Variants - Dynamic Placeholder */}
                            {product.proVariantId && product.proVariantId.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Available Options</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Map variant IDs to names */}
                                        {product.proVariantId.map((variantId, index) => {
                                            const variantObj = variants.find(v => v._id === variantId);
                                            const variantName = variantObj ? variantObj.name : variantId; // Fallback to ID if not found
                                            
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedVariant(variantName)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                                        selectedVariant === variantName 
                                                            ? 'border-primary bg-primary/5 text-primary' 
                                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {variantName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-8">
                                <div className="flex gap-4">
                                     <button 
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                     >
                                        <ShoppingBag className="h-5 w-5" />
                                        Add to Cart
                                     </button>
                                     {/* Favorite Button Placeholder */}
                                     {/* <button className="px-4 py-4 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                                        <Heart className="h-6 w-6" />
                                     </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;
