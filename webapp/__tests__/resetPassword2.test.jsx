import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordPage from '../pages/resetpassword2/index';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// Mocking useRouter and useAuth
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// Mocking fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
    })
);

describe('ChangePasswordPage', () => {
    beforeEach(() => {
        useRouter.mockReturnValue({
            push: jest.fn()
        });
        useAuth.mockReturnValue({
            UUID: 'test-uuid'
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<ChangePasswordPage />);
        expect(screen.getByText('Change Your Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('6-digit code')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    });

    it('updates input values and calls verifyCodeAndUpdatePassword', async () => {
        render(<ChangePasswordPage />);
        const codeInput = screen.getByPlaceholderText('6-digit code');
        const passwordInput = screen.getByPlaceholderText('New Password');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(codeInput, { target: { value: '123456' } });
        fireEvent.change(passwordInput, { target: { value: 'new-password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
            expect(fetch.mock.calls[0][0]).toContain('/api/verifyCode');
        });
    });

    it('displays error when session is invalid', async () => {
        useAuth.mockReturnValue({ UUID: null }); // Mocking no UUID
        render(<ChangePasswordPage />);
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(screen.getByText("There's an issue with your session. Please try to log in again.")).toBeInTheDocument();
        });
    });
});
