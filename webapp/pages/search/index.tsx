import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader'; // Adjust the import path if necessary
import { useAuth } from '../../context/AuthContext'; // Adjust the import path if necessary


interface Character {
    name: string;
    confidence: number; // Assuming confidence is a decimal representing a percentage
}

const search: React.FC = () => {
    const { UUID } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

    const handleUpload = async (imageFile: Blob) => {
        setUploading(true);
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'image/jpeg');
        requestHeaders.set('Access-Control-Allow-Origin', '*');

        try {
            const response = await fetch('http://localhost:3267/predict', {
                method: 'POST',
                headers: requestHeaders,
                body: imageFile,
            });
            const data = await response.json();

            if (response.ok) {
                const predictions = data.prediction;
                const filteredCharacters: Character[] = Object.entries(predictions).reduce((acc: Character[], [key, value]) => {
                    if (value >= 0.5) { 
                        acc.push({ name: key, confidence: value });
                    }
                    return acc;
                }, []);

                setCharacters(filteredCharacters);
            } else {
                throw new Error(data.error || 'Failed to get prediction');
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const saveSearchHistory = async (searchResults: Character[]) => {
        if (!UUID) return;
        await fetch('../api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map(result => result.name),
            }),
        });
    };

    const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmittingFeedback(true);

        //TODO: Implement feedback submission logic here

        setSubmittingFeedback(false);
        setFeedback('');
    };

    const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(event.target.value);
    };

    return (
        <div>
            <h1>Search for Characters</h1>
            <ImageUploader onUpload={handleUpload} />
            {uploading && <p>Uploading and analyzing image...</p>}
            <ul>
                {characters.map((char, index) => (
                    <li key={index}>{char.name} - Confidence: {(char.confidence * 100).toFixed(2)}%</li>
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

export default search;
