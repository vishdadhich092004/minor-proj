import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Product, Category, SubCategory, Brand, VariantType, Variant } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Data Sources
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [
                productsRes,
                categoriesRes,
                subCategoriesRes,
                brandsRes,
                variantTypesRes,
                variantsRes
            ] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
                api.get('/subCategories'),
                api.get('/brands'),
                api.get('/variantTypes'),
                api.get('/variants')
            ]);

            setProducts(productsRes.data.data || []);
            setCategories(categoriesRes.data.data || []);
            setSubCategories(subCategoriesRes.data.data || []);
            setBrands(brandsRes.data.data || []);
            setVariantTypes(variantTypesRes.data.data || []);
            setVariants(variantsRes.data.data || []);

        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete product');
        }
    };

    const submitProduct = async (formData: FormData, isUpdate: boolean = false, id: string = '') => {
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/products/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                fetchAllData(); // Refresh list
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message || 'Operation failed' };
            }
        } catch (err: any) {
            console.error("Submit Product Error:", err);
            return { success: false, message: err.message || 'An error occurred' };
        }
    };

    return {
        products,
        categories,
        subCategories,
        brands,
        variantTypes,
        variants,
        loading,
        error,
        deleteProduct,
        submitProduct,
        refresh: fetchAllData
    };
};
