import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Pending from '../pages/pending/index';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn().mockReturnValue({
        UUID: 'dummy-uuid',
        logIn: jest.fn(),
    }),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
);

beforeEach(() => {
    useAuth.mockReturnValue({
        UUID: 'test-uuid',
        logIn: jest.fn(),
    });
    useRouter.mockReturnValue({
        push: jest.fn(),
    });
    fetch.mockClear();
});

describe('Pending component', () => {
    test('verifies code correctly and navigates to profile', async () => {
        render(<Pending />);

        const codeInput = screen.getByPlaceholderText('6-digit code');
        fireEvent.change(codeInput, { target: { value: '123456' } });
        expect(codeInput.value).toBe('123456');

        const verifyButton = screen.getByText('Verify Code');
        userEvent.click(verifyButton);

        await waitFor(() => expect(fetch).toHaveBeenCalledWith(`/api/verifyCode`, expect.anything()));

        expect(useAuth().logIn).toHaveBeenCalledWith('test-uuid');
        expect(useRouter().push).toHaveBeenCalledWith('/profile');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('displays an error for an issue with the session', async () => {
        useAuth.mockReturnValueOnce({
            UUID: null,
            logIn: jest.fn(),
        });

        render(<Pending />);

        const verifyButton = screen.getByText('Verify Code');
        userEvent.click(verifyButton);

        await waitFor(() => expect(screen.getByText("There's an issue with your session. Please try to log in again.")).toBeInTheDocument());
    });
});
