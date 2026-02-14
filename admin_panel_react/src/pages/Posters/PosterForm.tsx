import React, { useState, useEffect } from 'react';
import { usePosters } from '../../hooks/usePosters';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ArrowLeft, Upload, X } from 'lucide-react';

const PosterForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { posters, submitPoster, loading: hooksLoading } = usePosters();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    
    const [posterName, setPosterName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && posters.length > 0) {
            const p = posters.find(poster => (poster._id === id || poster.sId === id));
            if (p) {
                setPosterName(p.posterName || '');
                setPreviewUrl(p.imageUrl || null);
            }
        }
    }, [isEditMode, posters, id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isEditMode && !imageFile) {
            alert('Please select an image');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('posterName', posterName);
        if (imageFile) {
            formData.append('img', imageFile); // 'img' matches server expectation from Flutter code analysis
        } else if (isEditMode && previewUrl) {
             formData.append('image', previewUrl); // Send existing URL if no new file (API dependency)
        }


        const result = await submitPoster(formData, isEditMode, id || '');
        setLoading(false);
        
        if (result.success) {
            navigate('/posters');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !posters.length) return <div className="p-10">Loading form data...</div>;

    return (
        <div className="max-w-xl mx-auto pb-10">
            <button onClick={() => navigate('/posters')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Posters
            </button>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? 'Edit Poster' : 'Add New Poster'}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Poster Name" value={posterName} onChange={e => setPosterName(e.target.value)} required />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Poster Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                {previewUrl ? (
                                    <div className="relative w-full h-full">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImageFile(null);
                                                setPreviewUrl(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/posters')}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            {isEditMode ? 'Update Poster' : 'Create Poster'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PosterForm;
