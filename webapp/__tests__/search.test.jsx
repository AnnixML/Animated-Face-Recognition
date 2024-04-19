// import React from 'react';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Search from '../pages/search/index'; // Update the path accordingly
// import * as AuthContext from '../context/AuthContext';
// import * as blob_storage from '../blob_storage';

// // Mock the external modules
// jest.mock('../context/AuthContext', () => ({
//     useAuth: jest.fn()
// }));

// jest.mock('../blob_storage', () => ({
//     uploadImageToStorage: jest.fn(() => Promise.resolve('path/to/image'))
// }));

// // Mock global fetch
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ saveStatistics: true, saveSearchHist: true }),
//     })
// );

// beforeEach(() => {
//     // Clear all instances and calls to constructor and all methods:
//     jest.clearAllMocks();
//     AuthContext.useAuth.mockReturnValue({ UUID: '1234' });
// });

// describe('Search Component', () => {
//     test('renders correctly and fetches user details', async () => {
//         render(<Search />);

//         expect(screen.getByText('Search for Characters')).toBeInTheDocument();

//         await waitFor(() => {
//             expect(fetch).toHaveBeenCalledTimes(1);
//         });
//     });

//     test('handles image upload and character display', async () => {
//         const mockUpload = jest.fn(() => Promise.resolve('path/to/image'));
//         blob_storage.uploadImageToStorage = mockUpload;

//         render(<Search />);

//         // Wait for any preliminary operations, like data fetching
//         await waitFor(() => screen.getByTestId('upload-area'));

//         const file = new File(['content'], 'chucknorris.png', { type: 'image/png' });
//         const input = screen.getByTestId('upload-area').querySelector('input[type="file"]');
//         fireEvent.change(input, { target: { files: [file] } });

//         await waitFor(() => {
//             expect(mockUpload).toHaveBeenCalledWith(file);
//         });

//     });


//     test('handles feedback submission', async () => {
//         render(<Search />);
//         fireEvent.change(screen.getByLabelText('Report Incorrect Results:'), {
//             target: { value: 'Incorrect character' }
//         });

//         fireEvent.click(screen.getByText('Submit Feedback'));

//         await waitFor(() => {
//             expect(fetch).toHaveBeenCalledTimes(2); // Includes the fetch call during component mount and feedback submission
//         });
//     });
// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import Search from '../pages/search/index'; // Adjust the import based on your file structure
import * as blob_storage from '../blob_storage';

// Mocks
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));
jest.mock('../blob_storage', () => ({
    uploadImageToStorage: jest.fn(),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ saveStatistics: true, saveSearchHist: true }),
    })
);

describe('Search Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ UUID: 'dummy-uuid' });
        blob_storage.uploadImageToStorage.mockResolvedValue('mockPath');
        global.fetch.mockClear();
    });

    it('renders without crashing', () => {
        render(<Search />);
        expect(screen.getByText('Search for Characters')).toBeInTheDocument();
    });

    it('fetches user details when UUID is provided', async () => {
        render(<Search />);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("../api/user/fetch", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "dummy-uuid",
            },
        }));
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('interacts with the ImageUploader to handle file uploads', async () => {
        const file = new Blob(['image'], { type: 'image/jpeg' });

        render(<Search />);

        const fileInput = screen.getByTestId('upload-area').querySelector('input[type="file"]');
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => expect(blob_storage.uploadImageToStorage).toHaveBeenCalledWith(file));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("https://annixml.azurewebsites.net/predict", {
            method: "POST",
            headers: expect.any(Headers),
            body: file,
        }));
    });
});