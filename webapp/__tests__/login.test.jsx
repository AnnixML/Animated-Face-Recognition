import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Signin from '../pages/login/index';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        logIn: jest.fn(),
        logInNoAuth: jest.fn(),
    }),
}));

describe('Signin component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the sign-in form', () => {
        render(<Signin />);
        let link = screen.getAllByText('Sign In')[0];
        expect(link).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
        const mockedFetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ uuid: 'some-uuid', email: 'test@example.com', twofac: false }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ verif: true }),
            });
        global.fetch = mockedFetch;
    
        render(<Signin />);
    
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
        await waitFor(() => {
            expect(mockedFetch).toHaveBeenCalledTimes(2); // One for login, one for user fetch
            expect(mockedFetch.mock.calls[0][1].body).toEqual(JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' }));
            expect(mockedFetch.mock.calls[1][1].headers.Authorization).toEqual('some-uuid');
        });
    
        await screen.findByText('Forgot Your Password?');
    });

    it('should display error message for invalid input', async () => {
        const mockedFetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Invalid credentials' }),
        });
        global.fetch = mockedFetch;
    
        render(<Signin />);
    
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
        await waitFor(() => {
            expect(mockedFetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should navigate to reset password page when "Forgot Your Password?" is clicked', async () => {
        const pushMock = jest.fn();
        useRouter.mockReturnValue({ push: pushMock });

        render(<Signin />);

        fireEvent.click(screen.getByText('Forgot Your Password?'));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/resetpassword');
        });
    });

    it('should show information on clicking the info button', async () => {
        render(<Signin />);
        const infoButton = screen.getByTitle('Click for more information');
        fireEvent.click(infoButton);

        // Wait for the information to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Enter your username and password to log in. Ensure your details are correct. If you are new and don't have an account yet, please register by clicking the Register button. Keep your login credentials secure and do not share them with others./i)).toBeInTheDocument();
        });
    });
});
