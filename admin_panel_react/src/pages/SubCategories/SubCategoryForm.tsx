import React, { useState, useEffect } from 'react';
import { useSubCategories } from '../../hooks/useSubCategories';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const SubCategoryForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subCategories, categories, submitSubCategory, loading: hooksLoading } = useSubCategories();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (isEditMode && subCategories.length > 0) {
            const sub = subCategories.find(s => (s._id === id || s.sId === id));
            if (sub) {
                setName(sub.name);
                const catId = typeof sub.categoryId === 'string' ? sub.categoryId : sub.categoryId?._id || sub.categoryId?.sId;
                setSelectedCategory(catId || '');
            }
        }
    }, [isEditMode, subCategories, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name,
            categoryId: selectedCategory
        };

        const result = await submitSubCategory(data, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/sub-categories');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !subCategories.length) return <div className="p-10">Loading form data...</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/sub-categories')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sub Categories
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? 'Edit Sub Category' : 'Add New Sub Category'}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Sub Category Name" value={name} onChange={e => setName(e.target.value)} required />

                    <Select 
                        label="Parent Category" 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}
                        options={categories.map(c => ({ value: c._id || c.sId!, label: c.name }))}
                        required
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/sub-categories')}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? 'Update Sub Category' : 'Create Sub Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubCategoryForm;
