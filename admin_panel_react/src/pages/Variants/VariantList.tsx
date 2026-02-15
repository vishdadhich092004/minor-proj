import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVariants } from '../../hooks/useVariants';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';

const VariantList: React.FC = () => {
    const { t } = useTranslation();
    const { variants, variantTypes, loading, error, deleteVariant } = useVariants();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredVariants = variants.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || 
            (typeof v.variantTypeId === 'string' ? v.variantTypeId === typeFilter : v.variantTypeId?._id === typeFilter || v.variantTypeId?.sId === typeFilter);
        return matchesSearch && matchesType;
    });

    const getVariantTypeName = (v: any) => {
        if (!v.variantTypeId) return 'N/A';
        if (typeof v.variantTypeId === 'string') {
            const type = variantTypes.find(vt => vt._id === v.variantTypeId || vt.sId === v.variantTypeId);
            return type ? type.name : 'Unknown';
        }
        return v.variantTypeId.name || 'Unknown';
    };

    if (loading) return <div className="p-10 text-center">{t('variants.loading')}</div>;
    if (error) return <div className="p-10 text-center text-red-600">{t('common.error')}: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('variants.title')}</h1>
                <Link to="/variants/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> {t('variants.add_new')}
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder={t('variants.search_placeholder')} 
                        className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Select
                        className="w-full sm:w-48"
                        options={[{ label: t('variants.filter_type_label'), value: 'all' }, ...variantTypes.map(vt => ({ label: vt.name, value: vt._id || vt.sId || ''}))]}
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('variants.table.value')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('variants.table.type')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('variants.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredVariants.map((v) => (
                                <tr key={v._id || v.sId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{v.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{getVariantTypeName(v)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/variants/edit/${v._id || v.sId}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => deleteVariant(v._id || v.sId!)} className="text-red-600 hover:text-red-900 inline-block">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {filteredVariants.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">{t('variants.no_variants')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VariantList;
