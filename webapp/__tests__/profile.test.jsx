import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Profile from '../pages/profile/index'; // Update the path to the Profile component
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import * as blob_storage from '../blob_storage';

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));
jest.mock('../blob_storage', () => ({
    uploadImageToStorage: jest.fn(() => Promise.resolve('path/to/image')),
    getBlobAsLink: jest.fn(() => Promise.resolve('url/to/image')),
}));

global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
        UUID: 'test-uuid',
        logOut: jest.fn(),
        saveSearchHistory: jest.fn(),
        changeSearchHistory: jest.fn(),
    });
    useRouter.mockReturnValue({
        push: jest.fn(),
    });
    fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ /* mock response values */ }),
    });
    global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    }));
});

it('updates email when user edits and submits', async () => {
    render(<Profile />);

    // Use getByTitle to select the email input.
    const emailInput = screen.getByTitle('Edit your email here!'); // this matches the title attribute on the input
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    // Simulate submitting the form or triggering the update
    const updateButton = screen.getByText('Update Email'); // Ensure this is the text on your button
    fireEvent.click(updateButton);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[3][0]).toContain('../api/user/update');
        expect(fetch.mock.calls[3][1].method).toBe('PUT');
        expect(fetch.mock.calls[3][1].headers).toEqual({
            'Authorization': 'test-uuid',
            'Content-Type': 'application/json',
        });
        expect(JSON.parse(fetch.mock.calls[3][1].body)).toEqual({
            data: 'newemail@example.com',
            field: 'email',
        });
    });

});

it('updates username when user edits and submits', async () => {
    render(<Profile />);
    const usernameInput = screen.getByTitle('Edit your username here!'); 
    fireEvent.change(usernameInput, { target: { value: 'newUsername' } });

    // Simulate submitting the form or triggering the update
    const updateButton = screen.getByText('Update Username');
    fireEvent.click(updateButton);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[3][0]).toContain('../api/user/update');
        expect(fetch.mock.calls[3][1].method).toBe('PUT');
        expect(fetch.mock.calls[3][1].headers).toEqual({
            'Authorization': 'test-uuid', 
            'Content-Type': 'application/json',
        });
        expect(JSON.parse(fetch.mock.calls[3][1].body)).toEqual({
            data: 'newUsername',
            field: 'username',
        });
    });

});


it('uploads a profile picture and updates it', async () => {
    render(<Profile />);
    const file = new File(['(⌐□_□)'], 'profile-pic.png', { type: 'image/png' });
    const input = screen.getByText('Display Recent Searches').parentNode.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(blob_storage.uploadImageToStorage).toHaveBeenCalledWith(file));
    expect(blob_storage.getBlobAsLink).toHaveBeenCalled();
});