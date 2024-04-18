import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import Home from "../pages/index";

// Mock the necessary modules and functions
jest.mock("next/router", () => ({
    useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock("../context/AuthContext", () => ({
    useAuth: jest.fn().mockReturnValue({ UUID: "mockUUID", logIn: jest.fn() }),
}));

// Mock the window object for testing purposes
Object.defineProperty(window, "location", {
    writable: true,
    value: { search: "?tokenId=123&token=abc" },
});

describe("Home component", () => {
    it("should render the initial state correctly", () => {
        render(<Home />);
        expect(
            screen.getByText(/Welcome To The Annix Landing Page!/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /To get started, click one of the links in the Navigation Bar. Optionally, Create an Account./i
            )
        ).toBeInTheDocument();
    });

    it("should handle successful verification and redirect to the profile page", async () => {
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
        });

        global.fetch = mockFetch;

        render(<Home />);
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/confirmUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ UUID: "mockUUID" }),
            });
        });

        const { logIn, push } = require("../context/AuthContext").useAuth.mock
            .results[0].value;
        const { push: routerPush } =
            require("next/router").useRouter.mock.results[0].value;

        expect(logIn).toHaveBeenCalledWith("mockUUID");
        expect(routerPush).toHaveBeenCalledWith("/profile");
    });

    it("should handle failed verification", async () => {
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: false,
        });

        global.fetch = mockFetch;

        render(<Home />);
        await waitFor(() => {
            expect(
                screen.getByText(/Welcome To The Annix Landing Page!/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    /To get started, click one of the links in the Navigation Bar. Optionally, Create an Account./i
                )
            ).toBeInTheDocument();
        });
    });

    it("should handle errors during verification", async () => {
        const mockFetch = jest
            .fn()
            .mockRejectedValueOnce(new Error("Network error"));

        global.fetch = mockFetch;

        console.log = jest.fn();

        render(<Home />);
        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith(
                "User confirmation failed: Error: Network error"
            );
        });
    });
});
