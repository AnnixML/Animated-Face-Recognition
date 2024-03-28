import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';
import { useAuth } from '../../context/AuthContext';
import InfoTag from '../../components/Infotag';
import * as blob_storage from '../../blob_storage';

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
    const [path, setPath] = useState('');
    

    const handleUpload = async (imageFile: Blob) => {
        setUploading(true);
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'image/jpeg');
        requestHeaders.set('Access-Control-Allow-Origin', '*');

        try {
            //TODO: Upload imageFile to S3Bucket, then get path from S3 bucket, then pass path below
            //TODO FOR ETHAN: create function for blob that takes in imagefile uploads it to blob and returns path
            const fileName = await blob_storage.uploadImageToStorage(imageFile)
            console.log("FILE: " + fileName);
            
            // await blob_storage.getImageFromStorage(fileName, "download.jpg")

            setPath("command_that_calls_imagefile_goes_here"); //ONE PLACEHOLDER HERE
            const response = await fetch('INSERT_LEO_URL_HERE', { //ONE PLACEHOLDER HERE
                method: 'POST',
                headers: requestHeaders,
                body: path,
            });
            const data = await response.json();
            console.log("CURRENT RESPONSE: " + data["prediction"]);

            if (response.ok) {
                const predictions = data['prediction'];
                const parsed = JSON.parse(predictions);
                const filteredCharacters = [];
                for (const key in parsed) {
                    if (parsed[key] > 0.5) {
                        filteredCharacters.push({ name: key, confidence: parsed[key] }); //UPDATE TO TAKE IN TITLE OF SHOW AS WELL
                    }
                }
                setCharacters(filteredCharacters);
                saveSearchHistoryFunction(filteredCharacters);
                saveMostRecChar(filteredCharacters);
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
        
        await fetch('../api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map(result => result.name),
            }),
        });
    };

    const saveMostRecChar = async (searchResults: Character[]) => {
        if (!UUID) return;
        
        await fetch('../api/saveRecChar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map(result => result.name),
            }),
        });
    };

    const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setSubmittingFeedback(true);
        console.log(JSON.stringify({ feedback }));
        
        try {
            const response = await fetch('../api/feedback', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedback)
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }
            setRevealThank(true);
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            alert((error as Error).message || 'An unknown error occurred');
        } finally {
            setSubmittingFeedback(false);
            setFeedback(''); // Clear the feedback after submission
        }
    };

    const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(event.target.value);
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4">
            <h1 className="text-black dark:text-white">Search for Characters</h1>
            <ImageUploader onUpload={handleUpload} />
            <InfoTag text="Upload an image to search for characters. The system uses AI to predict characters present in the uploaded image. Results, including the character names and confidence levels, are displayed below. If you believe a character has been incorrectly identified or missed, please provide feedback in the form that appears after submission. Your input helps improve our recognition accuracy." />
            {uploading && <p>Uploading and analyzing image...</p>}
            <ul>
                {characters.map((char, index) => (
                    <li key={index}>{char.name} - Confidence: {(char.confidence * 100).toFixed(2)}%</li> //TODO: ALSO ADD TWO BUTTONS: MERCH AND WATCH, SEE TODOLIST
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
                        title="Write your feedback here"
                        rows={4}
                        placeholder="We're sorry we got the character wrong! Please describe the issue..."
                    ></textarea>
                    <button type="submit"
                    className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2 mt-2"
                    title="Submit Feedback" disabled={submittingFeedback}>
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
            {revealThank && <p className="text-pl-3 dark:text-white">Thank you for your feedback!</p>}
        </div>
    );
};

export default search;
