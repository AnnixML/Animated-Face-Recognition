import React, { useState, useEffect } from "react";
import ImageUploader from "../../components/ImageUploader";
import { useAuth } from "../../context/AuthContext";
import InfoTag from "../../components/Infotag";
import * as blob_storage from "../../blob_storage";
import { useRouter } from "next/router";
import Link from "next/link";

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const questionsAnswers = [
        {
            question: "How does the character identification work?",
            answer: "Our platform uses a machine learning model based on Convolutional Neural Networks to accurately identify animated characters from user-uploaded images. More specifically, we trained a CNN using the triplet-loss framework, in which we choose two similar images and one different image and train the model with this scenario millions of times. Images were sourced by repositories of animated characters and/or labelled by us. For the more technical users, please click the 'Technical Details: Why Triplet Loss?' question."
        },
        {
            question: "Can I use the platform for free?",
            answer: "Yes, our basic services are free to use for anyone. Premium features might require a subscription in the future."
        },
        {
            question: "What types of images can I upload?",
            answer: "You can upload any image that contains an animated character, and our model will attempt to identify it. Please ensure the image is clear and the character is visible."
        },
        {
            question: "Why can't the model identify some characters?",
            answer: "We trained our model on primarily older and more popular characters, because the very few labelled character data sets consisted of them. Thus, it may not be able to identify newer or less well-known characters. However, we are constantly updating our model to include more characters, and to this end we have already manually labelled many recent popular characters."
        },
        {
            question: "What data do you collect from users?",
            answer: "We only collect what users allow us to collect, and account deletion results in deletion and/or anonymization of all user data."
        },
        {
            question: "Technical Details: Why Triplet Loss?",
            answer: "Triplet loss is an effective training method for machine learning models, especially in distinguishing individuals in tasks like face recognition. It works by comparing three images: an anchor (a baseline image of one character), a positive (another image of the same character), and a negative (an image of a different character). This approach helps the model fine-tune features that differentiate similar characters, crucial in recognizing animated characters with similar traits. By minimizing the distance between the anchor and positive images while maximizing the distance from the negative, triplet loss creates a structured embedding space where similar features cluster and dissimilar ones are distanced. This enhances the model's ability to handle variations within the same character and ensures reliable identification in varied real-world conditions."
        },
    ];

    const handleToggle = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const { UUID } = useAuth();
    const [saveSearchHist, setSaveSearchHist] = useState(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>("");
    const [submittingFeedback, setSubmittingFeedback] =
        useState<boolean>(false);
    const [revealThank, setRevealThank] = useState<boolean>(false);
    const [path, setPath] = useState("");
    const [saveStatistics, setSaveStatistics] = useState(false);

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

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-gradient-to-r from-pd-4 to-pd-5 flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold  text-black dark:text-white">Frequently Asked Questions</h1>
                <div className="mt-8 space-y-2">
                    {questionsAnswers.map((qa, index) => (
                        <div key={index} className="w-full">
                            <button
                                onClick={() => handleToggle(index)}
                                className={`w-full py-4 px-6 text-left text-lg font-semibold rounded-lg text-black dark:text-white
                                            ${activeIndex === index ? 'bg-pl-2 dark:bg-pd-2' : 'bg-pl-2 dark:bg-pd-2'}
                                            transition duration-300 ease-in-out`}
                            >
                                {qa.question}
                            </button>
                            <div className={`px-6 pt-0 pb-4 overflow-hidden transition-max-height duration-500 ease-in-out
                                            ${activeIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                                <p className={`text-black dark:text-white ${activeIndex === index ? 'block' : 'hidden'}`}>
                                    {qa.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="border rounded px-4 py-4 mt-4 bg-pl-2 dark:bg-pd-2">
                    <form onSubmit={submitFeedback} >
                                        <label
                                            htmlFor="feedback"
                                            className="block mb-2 text-pl-3 dark:text-white">
                                            Don't see your question? Ask us here!
                                        </label>
                                        <textarea
                                            id="feedback"
                                            value={feedback}
                                            onChange={handleFeedbackChange}
                                            className="px-4 border rounded p-2 w-full text-pl-3 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                                            title="Write your question here"
                                            rows={4}
                                            placeholder="Question..."></textarea>
                                        <button
                                            type="submit"
                                            className="animated-button px-2"
                                            title="Submit Question"
                                            disabled={submittingFeedback}>
                                            {submittingFeedback
                                                ? "Submitting..."
                                                : "Submit Question"}
                                        </button>
                                    </form>
                                    {revealThank && (
                                        <>
                                            <h2 className="dark:text-white font-semibold mb-4">
                                                Thank you for reaching out!
                                            </h2>
                                        </>
                                    )}
                        <label className="py-4 block mb-2 text-pl-3 dark:text-white">
                            Or, Contact Us Directly:
                        </label>
                        <Link href="/contact" legacyBehavior>
                                    <a className="animated-button"
                                    title="Click to view contact information">Contact Us!</a>
                        </Link>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;
