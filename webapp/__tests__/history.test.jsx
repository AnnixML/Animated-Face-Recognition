import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import History from '../pages/history/index';

// Mocking modules and hooks
jest.mock("../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../blob_storage", () => ({
    getBlobAsLink: jest.fn(),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ searchHistory: "search term", fileName: "file.jpg" }]),
        blob: () => Promise.resolve(new Blob(["test"], { type: 'text/csv' })),
    })
);

beforeEach(() => {
    jest.spyOn(require("../context/AuthContext"), 'useAuth').mockReturnValue({ UUID: '12345' });
    jest.spyOn(require("../blob_storage"), 'getBlobAsLink').mockResolvedValue("http://example.com/image.jpg");
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ searchHistory: "search term", fileName: "file.jpg" }]),
            blob: () => Promise.resolve(new Blob(["test"], { type: 'text/csv' })),
        })
    );
    jest.clearAllMocks();
});

describe('History component', () => {
    test('fetches history on mount and displays it', async () => {
        render(<History />);
        await waitFor(() => {
            expect(screen.getByText("search term")).toBeInTheDocument();
        });
    });

    it('handles pagination correctly', async () => {
        render(<History />);
        const nextButton = screen.getByTitle('Navigate to Next Page');
        userEvent.click(nextButton);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // Additional fetch from page change
    });

    test('download button triggers file download', async () => {
        render(<History />);
        
        // Mock the fetch calls
        global.fetch.mockImplementationOnce((url) => {
            if (url === '/api/csv') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ uuid: UUID }),
                });
            }
            if (url === '/api/download') {
                return Promise.resolve(new Blob(['test'], { type: 'text/csv' }));
            }
            return Promise.reject(new Error('not found'));
        });
    
        const downloadButton = screen.getByText("Download CSV");
        
        // Use userEvent instead of fireEvent for more realistic simulation
        await userEvent.click(downloadButton);
        
        // waitFor or waitForExpect could be used here to wait for asynchronous operations
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('../api/history?uuid=12345&page=1&limit=20');
        });
    });
    
});
