import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';
import * as fs from 'fs';

const search = () => {
    const [characters, setCharacters] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const handleUpload = async (imageFile) => {
        const handleUpload = async (imageFile) => {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', imageFile);
            
        
            try {
                const response = await fetch('http://localhost:3267/predict', {
                    method: 'POST',
                    body: formData, 
                })

                //parse json
                const data = await response.json(); 
        
                if (response.ok) {
                    setCharacters([{ name: 'Character Name'}]); //What does the model actually return?
                } else {
                    throw new Error(data.error || 'Failed to get prediction');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert(error.message);
            } finally {
                setUploading(false);
            }
        };
        
    };

    const submitFeedback = async (event) => {
        event.preventDefault();
        <p>Thank you for your feedback! We will take this into account.</p>
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    return (
        <div>
            <h1>Search for Characters</h1>
            <ImageUploader onUpload={handleUpload} />
            {uploading && <p>Uploading and analyzing image...</p>}
            <ul>
                {characters.map((char, index) => (
                    <li key={index}>{char.name} - Confidence: {char.confidence}%</li>
                ))}
            </ul>
            {characters.length > 0 && ( // This line ensures the form is only shown when there are characters
                <form onSubmit={submitFeedback} className="mt-4">
                    <label htmlFor="feedback" className="block mb-2">Report Incorrect Results:</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        className="border rounded p-2 w-full"
                        rows={4}
                        placeholder="Describe the issue..."
                    ></textarea>
                    <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2" disabled={submittingFeedback}>
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default search;
