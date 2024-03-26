import React, { useState } from 'react';
import ImageUploader from '../../Components/ImageUploader';
import { useAuth } from '../../context/AuthContext';

interface Character {
    name: string;
    confidence: number; // Assuming confidence is a decimal representing a percentage
}

const search: React.FC = () => {
    const { UUID, saveSearchHistory } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
    const [revealThank, setRevealThank] = useState<boolean>(false);

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
            console.log("CURRENT RESPONSE: " + data["prediction"]);

            if (response.ok) {
                const predictions = data['prediction'];
                const parsed = JSON.parse(predictions);
                const filteredCharacters = [];
                for (const key in parsed) {
                    if (parsed[key] > 0.5) {
                        filteredCharacters.push({ name: key, confidence: parsed[key] });
                    }
                }
                setCharacters(filteredCharacters);
                saveSearchHistoryFunction(filteredCharacters);
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

    const saveSearchHistoryFunction = async (searchResults: Character[]) => {
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

    const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmittingFeedback(true);

        //TODO: Implement feedback submission logic here

        setSubmittingFeedback(false);
        setFeedback('');
        setRevealThank(true); // Moved inside the function to correctly update state only on submit
    };

    const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(event.target.value);
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4">
            <h1 className="text-black dark:text-white">Search for Characters</h1>
            <ImageUploader onUpload={handleUpload} />
            {uploading && <p>Uploading and analyzing image...</p>}
            <ul>
                {characters.map((char, index) => (
                    <li key={index}>{char.name} - Confidence: {(char.confidence * 100).toFixed(2)}%</li>
                ))}
            </ul>
            {characters.length > 0 && (
                <form onSubmit={submitFeedback} className="mt-4">
                    <label htmlFor="feedback" className="block mb-2 text-pl-3 dark:text-white">Report Incorrect Results:</label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        className="border rounded p-2 w-full text-pl-3 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                        rows={4}
                        placeholder="We're sorry we got the character wrong! Please describe the issue..."
                    ></textarea>
                    <button type="submit" className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2 mt-2" disabled={submittingFeedback}>
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
            {revealThank && <p className="text-pl-3 dark:text-white">Thank you for your feedback!</p>}
        </div>
    );
};

export default search;
