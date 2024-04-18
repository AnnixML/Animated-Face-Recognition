import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../pages/register/index';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        logInNoAuth: jest.fn(),
    }),
}));

describe('Register component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the register form', () => {
        render(<Register />);
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    it('should handle form submission with valid input', async () => {
        const mockedFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ userId: 'some-uuid' }),
        });
        global.fetch = mockedFetch;

        const { logInNoAuth } = useAuth();
        useRouter.mockReturnValue({ push: jest.fn() });

        render(<Register />);

        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() => {
            expect(mockedFetch).toHaveBeenCalledTimes(2);
            expect(mockedFetch.mock.calls[0][1].body).toEqual(JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' }));
            expect(logInNoAuth).toHaveBeenCalledWith('some-uuid');
        });
    });

    it('should show information on clicking the info button', async () => {
        render(<Register />);
        const infoButton = screen.getByTitle('Click for more information');
        userEvent.click(infoButton);

        // Wait for the information to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Welcome to the registration page. Please fill out the form with your username, email, and password to create a new account./i)).toBeInTheDocument();
        });
    });
});


