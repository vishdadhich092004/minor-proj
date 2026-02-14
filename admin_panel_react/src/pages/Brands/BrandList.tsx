import React, { useState } from 'react';
import { useBrands } from '../../hooks/useBrands';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';

const BrandList: React.FC = () => {
    const { brands, loading, error, deleteBrand } = useBrands();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading brands...</div>;
    if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Brands</h1>
                <Link to="/brands/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Brand
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <input 
                        type="text" 
                        placeholder="Search brands..." 
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sub Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredBrands.map((brand) => (
                                <tr key={brand._id || brand.sId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{brand.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {typeof brand.subcategoryId === 'string' ? brand.subcategoryId : brand.subcategoryId?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/brands/edit/${brand._id || brand.sId}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => deleteBrand(brand._id || brand.sId!)} className="text-red-600 hover:text-red-900 inline-block">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {filteredBrands.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No brands found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BrandList;
