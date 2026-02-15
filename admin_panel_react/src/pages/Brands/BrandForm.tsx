import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBrands } from '../../hooks/useBrands';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const BrandForm: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { brands, subCategories, submitBrand, loading: hooksLoading } = useBrands();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    useEffect(() => {
        if (isEditMode && brands.length > 0) {
            const brand = brands.find(b => (b._id === id || b.sId === id));
            if (brand) {
                setName(brand.name);
                const subId = typeof brand.subcategoryId === 'string' ? brand.subcategoryId : brand.subcategoryId?._id || brand.subcategoryId?.sId;
                setSelectedSubCategory(subId || '');
            }
        }
    }, [isEditMode, brands, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            name,
            subcategoryId: selectedSubCategory
        };

        const result = await submitBrand(data, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/brands');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !brands.length) return <div className="p-10">{t('brands.loading')}</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/brands')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('brands.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? t('brands.edit_title') : t('brands.add_title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label={t('brands.form.name_label')} value={name} onChange={e => setName(e.target.value)} required />

                    <Select 
                        label={t('brands.form.sub_category_label')} 
                        value={selectedSubCategory} 
                        onChange={e => setSelectedSubCategory(e.target.value)}
                        options={subCategories.map(s => ({ value: s._id || s.sId!, label: s.name }))}
                        required
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/brands')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? t('brands.form.update_btn') : t('brands.form.create_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandForm;
