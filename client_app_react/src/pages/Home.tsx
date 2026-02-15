import { useEffect, useState } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PosterSection from '../components/PosterSection';
import CategorySelector from '../components/CategorySelector';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
    const { 
        products, 
        categories, 
        posters, 
        isLoading, 
        error, 
        fetchAll 
    } = useDataStore();

    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const filteredProducts = selectedCategory 
        ? products.filter(p => p.proCategoryId?._id === selectedCategory || p.proSubCategoryId?._id === selectedCategory)
        : products;

    if (isLoading && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <p className="text-red-500 mb-4">Error loading data: {error}</p>
                <button onClick={() => fetchAll()} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                {/* Welcome Section */}
                <div>
                     <h1 className="text-2xl font-bold text-gray-900">
                        Hello, {user ? user.name.split(' ')[0] : 'Guest'}!
                     </h1>
                     <p className="text-gray-500">Let's get something...</p>
                </div>

                {/* Posters */}
                <PosterSection posters={posters} />

                {/* Categories */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Top Categories</h2>
                        <button className="text-sm text-primary font-medium hover:underline">See All</button>
                    </div>
                    <CategorySelector 
                        categories={categories} 
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </section>

                {/* Products Grid */}
                <section>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">All Products</h2>
                     </div>
                     
                     {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                     ) : (
                         <div className="text-center py-10 text-gray-500">
                             No products found in this category.
                         </div>
                     )}
                </section>
            </main>
        </div>
    );
};

export default Home;
