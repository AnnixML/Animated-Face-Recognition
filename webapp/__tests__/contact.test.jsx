import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../pages/contact/index'; // Adjust the import path as necessary
import { useAuth } from "../context/AuthContext";

// Mocking the AuthContext
jest.mock("../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

// Mocking the fetch call
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
);

beforeEach(() => {
    // Set up any default values for your auth context here
    useAuth.mockReturnValue({ UUID: 'some-uuid' });

    // Clear all mocks before each test
    jest.clearAllMocks();
});

describe('Contact component', () => {
    test('submits feedback correctly', async () => {
        render(<Contact />);
        const feedbackInput = screen.getByTitle('Write your feedback here');
        const submitButton = screen.getByTitle('Submit Feedback');

        // Change the feedback input
        fireEvent.change(feedbackInput, { target: { value: 'Test feedback' } });
        expect(feedbackInput.value).toBe('Test feedback');

        // Submit the feedback
        userEvent.click(submitButton);

        // Wait for the fetch to be called
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("../api/feedback", expect.anything()));

        // Check if the thank you message appears
        await waitFor(() => expect(screen.getByText(/thank you for submitting feedback/i)).toBeInTheDocument());
    });

    // Add more tests for other functionalities and interactions
});
