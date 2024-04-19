import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Faq from '../pages/faq/index';
import { AuthContext } from '../context/AuthContext';

// Mocking the next/link
jest.mock('next/link', () => {
    return ({ children }) => children;
});

const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

describe('Faq component tests', () => {
    beforeEach(() => {
        // Setup the mock return values before each test
        mockUseAuth.mockReturnValue({ UUID: '12345' });
    });

    test('renders the component', () => {
        render(<Faq />);
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    test('toggle FAQ answers', () => {
        render(<Faq />);
        const questionButtons = screen.getAllByText(/How does the character identification work\?/i);
        expect(questionButtons).toHaveLength(1);

        // Simulate clicking the question to open the answer
        fireEvent.click(questionButtons[0]);
        const answerParagraph = screen.getByText(/Our platform uses a machine learning model/i);
        expect(answerParagraph).not.toHaveClass('hidden');  // Ensure it is visible first time

        // Click again to close
        fireEvent.click(questionButtons[0]);
        expect(answerParagraph).toHaveClass('hidden');  // Now it should have the 'hidden' class, implying it is not visible
    });


    test('submit feedback form', () => {
        render(<Faq />);
        const feedbackTextarea = screen.getByPlaceholderText('Question...');
        fireEvent.change(feedbackTextarea, { target: { value: 'New user question' } });
        expect(feedbackTextarea.value).toBe('New user question');

        const submitButton = screen.getByTitle('Submit Question');
        fireEvent.click(submitButton);
    });
});
