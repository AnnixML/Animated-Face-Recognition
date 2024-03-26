import React, { useState, useCallback } from 'react';

const ImageUploader = ({ onUpload }) => {
    
    const [error, setError] = useState('');

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError('');
        onUpload(file);
    }, [onUpload]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError('');
        onUpload(file);
    }, [onUpload]);

    return (
        <div
            className="upload-area border-2 border-dashed p-10 text-center
            py-2 px-4 rounded
            text-pl-3 border-2 border-rounded border-pl-3
            bg-pl-2
            dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
            dark:bg-pd-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUploader;
