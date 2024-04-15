import React, { useState } from 'react';

const faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);


    const questionsAnswers = [
        {
            question: "How does the character identification work?",
            answer: "Our platform uses a machine learning model based on Convolutional Neural Networks to accurately identify animated characters from user-uploaded images."
        },
        {
            question: "Can I use the platform for free?",
            answer: "Yes, our basic services are free to use for anyone. Premium features might require a subscription in the future."
        },
        {
            question: "What types of images can I upload?",
            answer: "You can upload any image that contains an animated character, and our model will attempt to identify it. Please ensure the image is clear and the character is visible."
        },
    ];

    const handleToggle = (index: number) => {
      setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4 flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-black dark:text-white">Frequently Asked Questions</h1>
                <div className="mt-8 space-y-2">
                    {questionsAnswers.map((qa, index) => (
                        <div key={index} className="w-full">
                            <button
                                onClick={() => handleToggle(index)}
                                className={`w-full py-4 px-6 text-left text-lg font-semibold rounded-lg
                                            ${activeIndex === index ? 'bg-pl-2 dark:bg-pd-2 text-white' : 'bg-pl-1 dark:bg-pd-1 text-black'}
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
                </div>
            </div>
        </div>
    );
};

export default faq;
