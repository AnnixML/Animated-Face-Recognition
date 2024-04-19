import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/login/index';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

// Mocks for external modules and hooks
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(() => ({
        logIn: jest.fn(),
        logInNoAuth: jest.fn(),
    })),
}));

global.fetch = jest.fn();


describe('SignIn Component', () => {
    const mockPush = jest.fn();
    const mockLogin = jest.fn();
    const mockLoginNoAuth = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockImplementation(() => ({ push: mockPush }));
        useAuth.mockImplementation(() => ({ logIn: mockLogin, logInNoAuth: mockLoginNoAuth }));

        // Assuming two fetch calls, one for login and another for additional user details
        fetch.mockResolvedValueOnce({  // First fetch call for login
            ok: true,
            json: () => Promise.resolve({
                uuid: 'some-uuid',
                verif: true,
                twofac: false,
                email: 'test@example.com'
            })
        }).mockResolvedValueOnce({  // Second fetch call for fetching additional details
            ok: true,
            json: () => Promise.resolve({
                verif: true,  // assuming this call checks for verification
            })
        });
    });

    it('submits the form and handles the sign in', async () => {
        render(<SignIn />);

        // Fill out the form
        fireEvent.change(screen.getByTitle('Type your username here!'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTitle('Type your email here!'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTitle('Type your password here!'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByTestId('submit'));

        // Wait for async actions to complete
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: `010203`,
                }),
            });
        });
        expect(fetch).toHaveBeenNthCalledWith(2, "../api/user/fetch", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: 'some-uuid',
            }
        });
    });
});
