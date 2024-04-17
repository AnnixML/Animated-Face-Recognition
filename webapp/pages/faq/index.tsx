import React, { useState } from 'react';

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const questionsAnswers = [
        {
            question: "How does the character identification work?",
            answer: "Our platform uses a machine learning model based on Convolutional Neural Networks to accurately identify animated characters from user-uploaded images. More specifically, we trained a CNN using the triplet-loss framework, in which we choose two similar images and one different image and train the model with this scenario millions of times. Images were sourced by repositories of animated characters and/or labelled by us."
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
    ];

    const handleToggle = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="min-h-screen dark:bg-gradient-to-r from-pd-4 to-pd-5 flex flex-col items-center justify-center">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
                <div className="mt-8 space-y-2">
                    {questionsAnswers.map((qa, index) => (
                        <div key={index} className="w-full">
                            <button
                                onClick={() => handleToggle(index)}
                                className={`w-full py-4 px-6 text-left text-lg font-semibold rounded-lg text-white
                                            ${activeIndex === index ? 'bg-pl-2 dark:bg-pd-2' : 'bg-pl-1 dark:bg-pd-2'}
                                            transition duration-300 ease-in-out`}
                            >
                                {qa.question}
                            </button>
                            <div className={`px-6 pt-0 pb-4 overflow-hidden transition-max-height duration-500 ease-in-out
                                            ${activeIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                                <p className={`text-white ${activeIndex === index ? 'block' : 'hidden'}`}>
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

export default Faq;
