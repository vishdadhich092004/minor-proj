import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

const NotificationForm: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { sendNotification } = useNotifications();

    const [loading, setLoading] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = { title, description, imageUrl };

        const result = await sendNotification(data);
        setLoading(false);
        
        if (result.success) {
            alert(t('notifications_page.form.success_msg'));
            navigate('/notifications');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/notifications')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> {t('notifications_page.form.back_to_list')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('notifications_page.form.title')}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label={t('notifications_page.form.title_label')} value={title} onChange={e => setTitle(e.target.value)} required />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('notifications_page.form.description_label')}</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <Input label={t('notifications_page.form.image_url_label')} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/notifications')}>{t('common.cancel')}</Button>
                        <Button type="submit" isLoading={loading}>
                            {t('notifications_page.form.send_btn')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationForm;
