import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useVariantTypes } from '../../hooks/useVariantTypes';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const VariantTypeForm: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { variantTypes, submitVariantType, loading: hooksLoading } = useVariantTypes();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        if (isEditMode && variantTypes.length > 0) {
            const vt = variantTypes.find(v => (v._id === id || v.sId === id));
            if (vt) {
                setName(vt.name);
                setType(vt.type);
            }
        }
    }, [isEditMode, variantTypes, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = { name, type };

        const result = await submitVariantType(data, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/variant-types');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !variantTypes.length) return <div className="p-10">{t('products.form_loading')}</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/variant-types')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('variant_types.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? t('variant_types.edit_title') : t('variant_types.add_title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label={t('variant_types.form.name_label')} value={name} onChange={e => setName(e.target.value)} required />
                    <Input label={t('variant_types.form.type_label')} value={type} onChange={e => setType(e.target.value)} required />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/variant-types')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? t('variant_types.form.update_btn') : t('variant_types.form.create_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariantTypeForm;
