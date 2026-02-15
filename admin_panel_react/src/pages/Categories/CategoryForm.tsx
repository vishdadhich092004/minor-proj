import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../hooks/useCategories';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const CategoryForm: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { categories, submitCategory, loading: hooksLoading } = useCategories();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && categories.length > 0) {
            const category = categories.find(c => c._id === id || c.sId === id);
            if (category) {
                setName(category.name);
                setImageUrl(category.image || null);
            }
        }
    }, [isEditMode, categories, id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onload = (ev) => {
                setImageUrl(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        // If imageFile is present, perform upload
        // If editing and no new file, backend might keep old one if we don't send 'img' or send 'image' string?
        // Flutter sends 'image': 'no_data' or old url, and 'img': file.
        // Let's emulate:
        // If new file: send 'img': file.
        // If update and no new file: send 'image': imageUrl (though backend likely ignores this for the file part, but maybe checks it).
        // Best practice: Send file if new. 
        if (imageFile) {
            formData.append('img', imageFile);
            formData.append('image', 'no_data'); // Flutter logic emulation
        } else if (isEditMode && imageUrl) {
             formData.append('image', imageUrl);
        }

        const result = await submitCategory(formData, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/categories');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !categories.length) return <div className="p-10">{t('categories.loading')}</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/categories')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('categories.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? t('categories.edit_title') : t('categories.add_title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('categories.form.image_label')}</label>
                        <div className="flex items-center space-x-6">
                            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700 overflow-hidden">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Category" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-xs">{t('categories.form.no_image')}</span>
                                )}
                            </div>
                            <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                <span>{t('categories.form.change_image')}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                             {imageUrl && (
                                <button 
                                    type="button"
                                    onClick={() => { setImageUrl(null); setImageFile(null); }}
                                    className="text-red-600 hover:text-red-900 text-sm"
                                >
                                    {t('categories.form.remove_image')}
                                </button>
                            )}
                        </div>
                    </div>


                    <Input label={t('categories.form.name_label')} value={name} onChange={e => setName(e.target.value)} required />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/categories')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? t('categories.form.update_btn') : t('categories.form.create_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
