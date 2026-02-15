import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoupons } from '../../hooks/useCoupons';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { ArrowLeft } from 'lucide-react';

const CouponForm: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { coupons, categories, subCategories, products, submitCoupon, loading: hooksLoading } = useCoupons();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [couponCode, setCouponCode] = useState('');
    const [discountType, setDiscountType] = useState('fixed');
    const [discountAmount, setDiscountAmount] = useState('');
    const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('active');
    const [applicableCategory, setApplicableCategory] = useState('');
    const [applicableSubCategory, setApplicableSubCategory] = useState('');
    const [applicableProduct, setApplicableProduct] = useState('');

    useEffect(() => {
        if (isEditMode && coupons.length > 0) {
            const c = coupons.find(coupon => (coupon._id === id || coupon.sId === id));
            if (c) {
                setCouponCode(c.couponCode);
                setDiscountType(c.discountType);
                setDiscountAmount(c.discountAmount.toString());
                setMinimumPurchaseAmount(c.minimumPurchaseAmount.toString());
                setEndDate(c.endDate);
                setStatus(c.status);
                
                if (c.applicableCategory) {
                    setApplicableCategory(typeof c.applicableCategory === 'string' ? c.applicableCategory : c.applicableCategory.sId || c.applicableCategory._id || '');
                }
                if (c.applicableSubCategory) {
                    setApplicableSubCategory(typeof c.applicableSubCategory === 'string' ? c.applicableSubCategory : c.applicableSubCategory.sId || c.applicableSubCategory._id || '');
                }
                if (c.applicableProduct) {
                    setApplicableProduct(typeof c.applicableProduct === 'string' ? c.applicableProduct : c.applicableProduct.sId || c.applicableProduct._id || '');
                }
            }
        }
    }, [isEditMode, coupons, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            couponCode,
            discountType,
            discountAmount: Number(discountAmount),
            minimumPurchaseAmount: Number(minimumPurchaseAmount),
            endDate,
            status,
            applicableCategory: applicableCategory || null,
            applicableSubCategory: applicableSubCategory || null,
            applicableProduct: applicableProduct || null
        };

        const result = await submitCoupon(data, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/coupons');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !coupons.length) return <div className="p-10">{t('coupons.loading')}</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/coupons')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('coupons.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? t('coupons.edit_title') : t('coupons.add_title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label={t('coupons.form.code_label')} value={couponCode} onChange={e => setCouponCode(e.target.value)} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label={t('coupons.form.type_label')}
                            options={[{ label: t('coupons.type.fixed'), value: 'fixed' }, { label: t('coupons.type.percentage'), value: 'percentage' }]}
                            value={discountType}
                            onChange={e => setDiscountType(e.target.value)}
                        />
                        <Input label={t('coupons.form.amount_label')} type="number" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} required />
                    </div>

                    <Input label={t('coupons.form.min_purchase_label')} type="number" value={minimumPurchaseAmount} onChange={e => setMinimumPurchaseAmount(e.target.value)} required />
                    
                    <div className="space-y-1">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('coupons.form.end_date_label')}</label>
                        <input 
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)} 
                            required
                        />
                    </div>

                     <Select
                        label={t('coupons.form.status_label')}
                        options={[{ label: t('coupons.status.active'), value: 'active' }, { label: t('coupons.status.inactive'), value: 'inactive' }]}
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    />

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('coupons.form.applicability_title')}</h3>
                        <div className="space-y-4">
                            <Select
                                label={t('coupons.form.applicable_category_label')}
                                options={[{ label: t('coupons.form.none_option'), value: '' }, ...categories.map(c => ({ label: c.name, value: c._id || c.sId || '' }))]}
                                value={applicableCategory}
                                onChange={e => setApplicableCategory(e.target.value)}
                            />
                            <Select
                                label={t('coupons.form.applicable_sub_category_label')}
                                options={[{ label: t('coupons.form.none_option'), value: '' }, ...subCategories.map(sc => ({ label: sc.name, value: sc._id || sc.sId || '' }))]}
                                value={applicableSubCategory}
                                onChange={e => setApplicableSubCategory(e.target.value)}
                            />
                             <Select
                                label={t('coupons.form.applicable_product_label')}
                                options={[{ label: t('coupons.form.none_option'), value: '' }, ...products.map(p => ({ label: p.name, value: p._id || p.sId || '' }))]}
                                value={applicableProduct}
                                onChange={e => setApplicableProduct(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/coupons')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? t('coupons.form.update_btn') : t('coupons.form.create_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponForm;
