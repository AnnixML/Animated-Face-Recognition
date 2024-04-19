import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Faq from '../pages/faq';

describe('Faq component', () => {
    it('should render the FAQ questions and answers', () => {
        render(<Faq />);

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
        ];

        questionsAnswers.forEach((qa) => {
            const questionButton = screen.getByText(qa.question);
            fireEvent.click(questionButton); // Toggle the question

            const answerText = screen.getByText(qa.answer);
            expect(answerText).toBeInTheDocument();
        });
    });
});
