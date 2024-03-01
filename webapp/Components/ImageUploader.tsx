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
            className="upload-area border-2 border-dashed p-10 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUploader;
