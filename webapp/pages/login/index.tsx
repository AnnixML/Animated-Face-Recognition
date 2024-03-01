// pages/signin.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as necessary

const signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { logIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Reset error message

        // API request to your sign-in endpoint
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        

        if (response.ok) {
            logIn(data.uuid);
            router.push('/'); // Redirect to home page or dashboard
        } else {
            setError(data.message || 'An error occurred');
        }
    };

    return (
        <div className="signin-container">
            <form onSubmit={handleSubmit} className="signin-form">
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border rounded p-2 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border rounded p-2 w-full mb-4"
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="bg-blue-500 text-white rounded p-2">Sign In</button>
            </form>
        </div>
    );
};

export default signin;
