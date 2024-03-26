import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { logIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(''); // Reset error message

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
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
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4"> {}
            <form onSubmit={handleSubmit} className="signin-form">
                <div className="w-full h-20 bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">
                    <label htmlFor="username" className="text-pl-3 dark:text-white">Username:</label>
                    <input
                        type="text" // Changed type to 'text' for username
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>

                <div className="w-full h-20 bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">
                    <label htmlFor="email" className="text-pl-3 dark:text-white">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>

                <div className="w-full h-20 bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">
                    <label htmlFor="password" className="text-pl-3 dark:text-white">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>
                
                {error && <div className="w-full h-20 text-pl-3 dark:text-white bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">{error}</div>}
                <button type="submit" className="
                    py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2
                    ">Sign In</button>
            </form>
        </div>
    );
};

export default signin;
