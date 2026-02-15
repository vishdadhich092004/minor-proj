import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../hooks/useProducts';
import { useNavigate, useParams } from 'react-router-dom';
import {type SubCategory, type Brand, type Variant } from '../../types';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { ArrowLeft, Upload, X } from 'lucide-react';

const ProductForm: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams(); // If id exists, it's edit mode
    const navigate = useNavigate();
    const { 
        products, categories, subCategories, brands, variantTypes, variants,
        submitProduct, loading: hooksLoading 
    } = useProducts();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedVariantType, setSelectedVariantType] = useState('');
    const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
    
    // Images
    const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([null, null, null, null, null]);

    // Derived Lists
    const [filteredSubCats, setFilteredSubCats] = useState<SubCategory[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [filteredVariants, setFilteredVariants] = useState<Variant[]>([]);

    useEffect(() => {
        if (isEditMode && products.length > 0) {
            const product = products.find(p => p._id === id || p.sId === id);
            if (product) {
                setName(product.name);
                setDescription(product.description || '');
                setPrice(product.price.toString());
                setOfferPrice(product.offerPrice?.toString() || '');
                setQuantity(product.quantity.toString());
                
                // Set selections (safely handling objects vs strings if necessary)
                // Assuming IDs are available on the objects
                const catId = product.proCategoryId?._id || product.proCategoryId?.sId || (product.proCategoryId as any);
                setSelectedCategory(catId);
                
                const subCatId = product.proSubCategoryId?._id || product.proSubCategoryId?.sId || (product.proSubCategoryId as any);
                setSelectedSubCategory(subCatId);
                
                const brandId = product.proBrandId?._id || product.proBrandId?.sId || (product.proBrandId as any);
                setSelectedBrand(brandId || '');

                const varTypeId = product.proVariantTypeId?._id || product.proVariantTypeId?.sId || (product.proVariantTypeId as any);
                setSelectedVariantType(varTypeId || '');
                
                setSelectedVariants(product.proVariantId || []);

                // Images
                const newUrls = [...imageUrls];
                product.images?.forEach((img, idx) => {
                    if (idx < 5) newUrls[idx] = img.url;
                });
                setImageUrls(newUrls);
            }
        }
    }, [isEditMode, products, id]);

    // Filtering Effects
    useEffect(() => {
        if (selectedCategory) {
            setFilteredSubCats(subCategories.filter(s => {
                const sCatId = typeof s.categoryId === 'string' ? s.categoryId : s.categoryId?._id || s.categoryId?.sId;
                return sCatId === selectedCategory;
            }));
        } else {
            setFilteredSubCats([]);
        }
    }, [selectedCategory, subCategories]);

    useEffect(() => {
        if (selectedSubCategory) {
            setFilteredBrands(brands.filter(b => {
                const bSubId = typeof b.subcategoryId === 'string' ? b.subcategoryId : b.subcategoryId?._id || b.subcategoryId?.sId;
                return bSubId === selectedSubCategory;
            }));
        } else {
            setFilteredBrands([]);
        }
    }, [selectedSubCategory, brands]);

    useEffect(() => {
         if (selectedVariantType) {
            setFilteredVariants(variants.filter(v => {
                const vTypeId = typeof v.variantTypeId === 'string' ? v.variantTypeId : v.variantTypeId?._id || v.variantTypeId?.sId;
                return vTypeId === selectedVariantType;
            }));
        } else {
            setFilteredVariants([]);
        }
    }, [selectedVariantType, variants]);


    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newFiles = [...imageFiles];
            newFiles[index] = file;
            setImageFiles(newFiles);

            // Preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                const newUrls = [...imageUrls];
                newUrls[index] = ev.target?.result as string;
                setImageUrls(newUrls);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newFiles = [...imageFiles];
        newFiles[index] = null;
        setImageFiles(newFiles);

        const newUrls = [...imageUrls];
        newUrls[index] = null;
        setImageUrls(newUrls);
    };

    const handleVariantToggle = (variantId: string) => {
         setSelectedVariants(prev => 
            prev.includes(variantId) ? prev.filter(v => v !== variantId) : [...prev, variantId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('offerPrice', offerPrice || price);
        formData.append('quantity', quantity);
        
        formData.append('proCategoryId', selectedCategory);
        formData.append('proSubCategoryId', selectedSubCategory);
        if (selectedBrand) formData.append('proBrandId', selectedBrand);
        if (selectedVariantType) formData.append('proVariantTypeId', selectedVariantType);
        
        // Variants - Appending each one separately if array
        // Check how backend expects it. Flutter sent it raw. Here we assume array.
        // If backend expects 'proVariantId' to be a comma-separated string, we'd join it.
        // Assuming standard multipart array support:
        selectedVariants.forEach(v => formData.append('proVariantId', v));

        // Images
        imageFiles.forEach((file, index) => {
            if (file) {
                formData.append(`image${index + 1}`, file);
            }
        });

        const result = await submitProduct(formData, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/products');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !products.length) return <div className="p-10">{t('products.form_loading')}</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button onClick={() => navigate('/products')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('products.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? t('products.edit_title') : t('products.add_title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Images Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('products.form.images_label')}</label>
                        <div className="flex flex-wrap gap-4">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 transition-colors">
                                    {imageUrls[index] ? (
                                        <>
                                            <img src={imageUrls[index]!} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(index, e)} />
                                        </label>
                                    )}
                                    <span className="absolute bottom-1 right-1 text-xs text-gray-400">{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <Input label={t('products.form.name')} value={name} onChange={e => setName(e.target.value)} required />
                    <Input label={t('products.form.description')} value={description} onChange={e => setDescription(e.target.value)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label={t('products.form.price')} type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                        <Input label={t('products.form.offer_price')} type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} />
                        <Input label={t('products.form.quantity')} type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>

                    {/* Taxonomy */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select 
                            label={t('products.form.category')} 
                            value={selectedCategory} 
                            onChange={e => {
                                setSelectedCategory(e.target.value);
                                setSelectedSubCategory('');
                                setSelectedBrand('');
                            }}
                            options={categories.map(c => ({ value: c._id || c.sId!, label: c.name }))}
                            required
                        />
                        <Select 
                            label={t('products.form.sub_category')} 
                            value={selectedSubCategory} 
                            onChange={e => {
                                setSelectedSubCategory(e.target.value);
                                setSelectedBrand('');
                            }}
                            options={filteredSubCats.map(s => ({ value: s._id || s.sId!, label: s.name }))}
                            disabled={!selectedCategory}
                            required
                        />
                        <Select 
                            label={t('products.form.brand')} 
                            value={selectedBrand} 
                            onChange={e => setSelectedBrand(e.target.value)}
                            options={filteredBrands.map(b => ({ value: b._id || b.sId!, label: b.name }))}
                            disabled={!selectedSubCategory}
                        />
                    </div>

                    {/* Variants */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select 
                            label={t('products.form.variant_type')} 
                            value={selectedVariantType} 
                            onChange={e => {
                                setSelectedVariantType(e.target.value);
                                setSelectedVariants([]);
                            }}
                            options={variantTypes.map(v => ({ value: v._id || v.sId!, label: v.name }))}
                        />
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.form.variants')}</label>
                            <div className="mt-1 border rounded-md p-3 h-32 overflow-y-auto bg-white dark:bg-gray-700 dark:border-gray-600">
                                {filteredVariants.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredVariants.map(v => (
                                            <div key={v._id || v.sId} className="flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    id={`var-${v._id}`}
                                                    checked={selectedVariants.includes(v.name || v._id || v.sId!)} /* Assuming standard uses name sometimes? Flutter code used variant names in list: variantsByVariantType = variantNames */
                                                    /* Correct logic: Flutter selectedVariants is List<String> of NAMES or IDs? 
                                                       DashBoardProvider l.75: 'proVariantId': selectedVariants
                                                       DashBoardProvider l.350: variantsByVariantType = newList.map((variant) => variant.name).toList();
                                                       DashBoardProvider l.126: 'proVariantId': selectedVariants
                                                       Wait, Flutter sends NAMES or IDs? 
                                                       The code says: 'proVariantId': selectedVariants
                                                       And selectedVariants is populated from MultiSelectDropDown which uses variantsByVariantType (names).
                                                       BUT usually ID is better. 
                                                       Let's check backend model if possible.
                                                       For now, I will assume it expects what ever Flutter sent. Flutter sent `variantNames`.
                                                       So I will send names.
                                                    */
                                                    onChange={() => handleVariantToggle(v.name)}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor={`var-${v._id}`} className="ml-2 block text-sm text-gray-900 dark:text-white">
                                                    {v.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">{t('products.form.select_variant_hint')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/products')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? t('products.form.update_btn') : t('products.form.create_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
