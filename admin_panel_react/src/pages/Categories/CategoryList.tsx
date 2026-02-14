import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';

const CategoryList: React.FC = () => {
    const { categories, loading, error, deleteCategory } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading categories...</div>;
    if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Categories</h1>
                <Link to="/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <input 
                        type="text" 
                        placeholder="Search categories..." 
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCategories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {category.image ? (
                                                <img className="h-10 w-10 rounded object-cover" src={category.image} alt={category.name} onError={(e: any) => e.target.src='https://via.placeholder.com/40'} />
                                            ) : (
                                                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-400">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/categories/edit/${category._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => deleteCategory(category._id)} className="text-red-600 hover:text-red-900 inline-block">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No categories found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
