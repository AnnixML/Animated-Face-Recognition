import React, { useState, useCallback, FC } from 'react';

// Define the props for the component
interface ImageUploaderProps {
    onUpload: (file: File) => void; // Define onUpload as a function that takes a File and returns void
}

// Type your component with FC (Functional Component) and the props type
const ImageUploader: FC<ImageUploaderProps> = ({ onUpload }) => {
    
    const [error, setError] = useState<string>('');

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]; // Check if there's a file
        if (file && !file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError('');
        if (file) {
            onUpload(file); // Assuming the file exists and is an image, call onUpload
        }
    }, [onUpload]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files && event.dataTransfer.files[0]; // Check if there's a file
        if (file && !file.type.startsWith('image/')) {
            setError('Please select a valid image file.');
            return;
        }
        setError('');
        if (file) {
            onUpload(file); // Assuming the file exists and is an image, call onUpload
        }
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
