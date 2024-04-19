import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangePassword from '../pages/resetpassword/index';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

// Mocking useRouter and useAuth
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

describe('ChangePassword component', () => {
    let pushMock;

    beforeEach(() => {
        pushMock = jest.fn();
        useRouter.mockImplementation(() => ({
            push: pushMock,
        }));
        useAuth.mockImplementation(() => ({
            logInNoAuth: jest.fn(),
        }));
    });

    test('successful email sends user to reset password page', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ uuid: '123-uuid' }),
            })
        );

        render(<ChangePassword />);
        const emailInput = screen.getByTitle('Please Write your email!');
        const submitButton = screen.getByText(/Write your email to get a verification to change your password./);

        // Simulate user typing an email
        userEvent.type(emailInput, 'test@example.com');
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/allmyfellas', expect.anything());
        });

        // Simulate successful response
        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/resetpassword2');
        });
    });

    test('displays error message when email is not found', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        render(<ChangePassword />);
        const emailInput = screen.getByTitle('Please Write your email!');
        const submitButton = screen.getByText(/Write your email to get a verification to change your password./);

        userEvent.type(emailInput, 'fail@example.com');
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/allmyfellas', expect.anything());
        });

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText('Email not found')).toBeInTheDocument();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
