import React, { useState, useEffect } from 'react';
import { useVariants } from '../../hooks/useVariants';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { ArrowLeft } from 'lucide-react';

const VariantForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { variants, variantTypes, submitVariant, loading: hooksLoading } = useVariants();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [variantTypeId, setVariantTypeId] = useState('');

    useEffect(() => {
        if (isEditMode && variants.length > 0) {
            const v = variants.find(v => (v._id === id || v.sId === id));
            if (v) {
                setName(v.name);
                if (typeof v.variantTypeId === 'string') {
                    setVariantTypeId(v.variantTypeId);
                } else if (v.variantTypeId) {
                    setVariantTypeId(v.variantTypeId._id || v.variantTypeId.sId || '');
                }
            }
        }
    }, [isEditMode, variants, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!variantTypeId) {
            alert('Please select a variant type');
            return;
        }

        setLoading(true);
        const data = { name, variantTypeId };

        const result = await submitVariant(data, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/variants');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !variants.length) return <div className="p-10">Loading form data...</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/variants')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Variants
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? 'Edit Variant' : 'Add New Variant'}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Variant Value (e.g. Red, XL)" value={name} onChange={e => setName(e.target.value)} required />
                    
                    <Select
                        label="Variant Type"
                        options={variantTypes.map(vt => ({ label: vt.name, value: vt._id || vt.sId || '' }))}
                        value={variantTypeId}
                        onChange={e => setVariantTypeId(e.target.value)}
                        required
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/variants')}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? 'Update Variant' : 'Create Variant'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VariantForm;
