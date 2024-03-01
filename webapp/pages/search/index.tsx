import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader'; 
import { useAuth } from '../../context/AuthContext';

const Search = () => {
    const { UUID } = useAuth();
    const [characters, setCharacters] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const handleUpload = async (imageFile) => {
        console.log("TESTTEST");
        setUploading(true);
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'image/jpeg');
        //const formData = new FormData();
        //formData.append('file', imageFile);
        try {
            const response = await fetch('http://localhost:3267/predict', {
                method: 'POST',
                headers: requestHeaders,
                body: imageFile,
            });
            console.log("CURRENT RESPONSE: " + response);
            const data = await response.json();

            if (response.ok) {
                setCharacters(data.characters); 
                saveSearchHistory(data.characters);
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

    const saveSearchHistory = async (searchResults) => {
        if (!UUID) return;
        if (!saveSearchHistory) return;
        await fetch('../api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map(result => result.name),
            }),
        });
    };

    const submitFeedback = async (event) => {
        event.preventDefault();
        setSubmittingFeedback(true);

        //TODO submit feedback

        setSubmittingFeedback(false);
        setFeedback('');
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
            {characters.length > 0 && (
                <form onSubmit={submitFeedback} className="mt-4">
                    <label htmlFor="feedback" className="block mb-2">Report Incorrect Results:</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        className="border rounded p-2 w-full"
                        rows={4}
                        placeholder="We're sorry we got the character wrong! Please describe the issue..."
                    ></textarea>
                    <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2" disabled={submittingFeedback}>
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Search;
