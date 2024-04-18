import React, { useState, useEffect } from "react";
import ImageUploader from "../../components/ImageUploader";
import { useAuth } from "../../context/AuthContext";
import InfoTag from "../../components/Infotag";
import * as blob_storage from "../../blob_storage";

interface Character {
    name: string;
    confidence: number;
    title: string;
}

const search: React.FC = () => {
    const { UUID } = useAuth();
    const [saveSearchHist, setSaveSearchHist] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [hiddencharacters, setHiddenCharacters] = useState<Character[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>("");
    const [submittingFeedback, setSubmittingFeedback] =
        useState<boolean>(false);
    const [revealThank, setRevealThank] = useState<boolean>(false);
    const [path, setPath] = useState("");
    const [saveStatistics, setSaveStatistics] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (UUID) {
                try {
                    const response = await fetch("../api/user/fetch", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: UUID,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSaveStatistics(data.saveStatistics);
                        setSaveSearchHist(data.saveSearchHist);
                        // Update any other state variables as needed
                    } else {
                        throw new Error("Failed to fetch user details");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    alert(
                        error instanceof Error
                            ? error.message
                            : "An unknown error occurred"
                    );
                }
            }
        };

        // Call fetchDetails to update component state
        fetchDetails();
    }, [UUID]); // Depend on UUID and refreshState

    const handleUpload = async (imageFile: Blob) => {
        setUploading(true);
        const requestHeaders: HeadersInit = new Headers();
        setCharacters([]);
        setHiddenCharacters([]);
        setRevealThank(false);
        requestHeaders.set("Content-Type", "image/jpeg");
        requestHeaders.set("Access-Control-Allow-Origin", "*");

        try {
            const fileName = await blob_storage.uploadImageToStorage(imageFile);
            console.log("FILE: " + fileName);

            setPath(fileName);
            const response = await fetch(
                "https://annixml.azurewebsites.net/predict",
                {
                    method: "POST",
                    headers: requestHeaders,
                    body: imageFile,
                }
            );

            if (response.ok) {
                const data = await response.json();
                const { top5_animes, top5_classes, top5_probs } = data;
                // Map all characters
                const allCharacters: Character[] = top5_probs.map(
                    (prob: number, index: number): Character => ({
                        title: top5_animes[index],
                        name: top5_classes[index],
                        confidence: prob,
                    })
                );

                // Filtered characters: always include the first character, then others by confidence > 0.5
                const filteredCharacters: Character[] = allCharacters.filter(
                    (character: Character, index: number) =>
                        index === 0 || character.confidence > 0.8
                );
                // Hidden characters: include every character except the first one, regardless of confidence
                const hiddenCharacters: Character[] = allCharacters.slice(1); // This takes all characters starting from the second one
                setCharacters(filteredCharacters);
                setHiddenCharacters(hiddenCharacters);
                if (filteredCharacters[0].confidence < 0.8) {
                    console.log("less than 0.8");
                    setCharacters((current) => [
                        ...current,
                        ...hiddenCharacters,
                    ]);
                    setHiddenCharacters([]);
                }
                // Update to use the correct variable name
                if (saveSearchHist == true) {
                    saveSearchHistoryFunction(filteredCharacters, fileName);
                    if (saveStatistics == true) {
                        saveMostRecChar(filteredCharacters);
                    }
                }
            } else {
                throw new Error("Failed to get prediction");
            }
        } catch (error: any) {
            console.error("Error uploading image:", error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const saveSearchHistoryFunction = async (
        searchResults: Character[],
        path: string
    ) => {
        if (!UUID) return;

        await fetch("../api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map((result) => result.name),
                fileName: path,
            }),
        });
    };

    const saveMostRecChar = async (searchResults: Character[]) => {
        if (!UUID) return;

        await fetch("../api/saveRecChar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uuid: UUID,
                searchHistory: searchResults.map((result) => result.name),
            }),
        });
    };

    const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setSubmittingFeedback(true);
        console.log(JSON.stringify({ feedback }));

        try {
            const response = await fetch("../api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedback),
            });

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }
            setRevealThank(true);
        } catch (error: any) {
            console.error("Error submitting feedback:", error);
            alert((error as Error).message || "An unknown error occurred");
        } finally {
            setSubmittingFeedback(false);
            setFeedback(""); // Clear the feedback after submission
        }
    };

    const handleFeedbackChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFeedback(event.target.value);
    };

    useEffect(() => {
        if (revealThank) {
            setCharacters((current) => [...current, ...hiddencharacters]); // Append hidden characters to current ones
        }
    }, [revealThank, hiddencharacters]);

    return (
        <div className="px-4 py-2 min-h-screen bg-pl-1 dark:bg-pd-4 justify-center">
            <h1 className="text-black dark:text-pd-2">Search for Characters</h1>
            <ImageUploader onUpload={handleUpload} />
            <div className="py-2"> </div>
            <InfoTag text="Upload an image to search for characters. The system uses AI to predict characters present in the uploaded image. Results, including the character names and confidence levels, are displayed below. If you believe a character has been incorrectly identified or missed, please provide feedback in the form that appears after submission. Your input helps improve our recognition accuracy." />
            {uploading && (
                <div className="hourglassBackground">
                    <div className="hourglassContainer">
                        <div className="hourglassCurves"></div>
                        <div className="hourglassCapTop"></div>
                        <div className="hourglassGlassTop"></div>
                        <div className="hourglassSand"></div>
                        <div className="hourglassSandStream"></div>
                        <div className="hourglassCapBottom"></div>
                        <div className="hourglassGlass"></div>
                    </div>
                </div>
            )}
            <ul>
                {characters.map((char: Character, index: number) => (
                    <li key={index} className="mb-4">
                        {`${char.name} in ${char.title} - Confidence: ${(
                            char.confidence * 100
                        ).toFixed(2)}%`}
                        <div>
                            <a
                                href={`https://www.amazon.com/s?k=${char.name.replace(
                                    /_/g,
                                    "+"
                                )}+${char.title.replace(/ /g, "+")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2 mr-2">
                                Merch
                            </a>
                            <a
                                href={`https://www.crunchyroll.com/search?from=&q=${char.title.replace(
                                    /_/g,
                                    "+"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2">
                                Watch
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
            {characters.length > 0 && !revealThank && (
                <form onSubmit={submitFeedback} className="mt-4">
                    <label
                        htmlFor="feedback"
                        className="block mb-2 text-pl-3 dark:text-white">
                        Report Incorrect Results:
                    </label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        className="border rounded p-2 w-full text-pl-3 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                        title="Write your feedback here"
                        rows={4}
                        placeholder="We're sorry we got the character wrong! Please describe the issue..."></textarea>
                    <button
                        type="submit"
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2 mt-2"
                        title="Submit Feedback"
                        disabled={submittingFeedback}>
                        {submittingFeedback
                            ? "Submitting..."
                            : "Submit Feedback"}
                    </button>
                </form>
            )}
            {revealThank && (
                <>
                    <h2 className="text-xl font-bold mb-4">
                        Sorry we got it wrong! Before you go, is it any of these
                        characters?
                    </h2>
                </>
            )}
        </div>
    );
};
export default search;
