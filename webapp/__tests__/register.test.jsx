import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../pages/register/index'; // Update the import path as necessary
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(() => ({
        logInNoAuth: jest.fn(),
    })),
}));

global.fetch = jest.fn();

describe('Register Component', () => {
    const mockPush = jest.fn();
    const mockLogInNoAuth = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockImplementation(() => ({ push: mockPush }));
        useAuth.mockImplementation(() => ({ logInNoAuth: mockLogInNoAuth }));
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                userId: '123',
                message: 'Registration successful'
            }),
        });
    });

    it('handles user registration and navigates on success', async () => {
        render(<Register />);

        // Simulate user input
        fireEvent.change(screen.getByTitle('Type your username here!'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByTitle('Type your email here!'), { target: { value: 'newUser@example.com' } });
        fireEvent.change(screen.getByTitle('Type your password here!'), { target: { value: 'securePassword123' } });

        // Submit the form
        fireEvent.click(screen.getByText('Register'));

        // Check that the fetch was called correctly
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("../api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: 'newUser',
                    email: 'newUser@example.com',
                    password: '010203',
                }),
            });
        });
        expect(fetch).toHaveBeenCalledWith("../api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: 'newUser@example.com',
            }),
        });

        // Ensure the user is logged in without auth and redirected
        await waitFor(() => {
            expect(mockLogInNoAuth).toHaveBeenCalledWith('123');
            expect(mockPush).toHaveBeenCalledWith("/pending");
        });

        // Check for success message display
        expect(screen.getByText('Registration successful')).toBeInTheDocument();
    });
});
