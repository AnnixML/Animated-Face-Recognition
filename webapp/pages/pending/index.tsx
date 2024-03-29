import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const Pending = () => {
    const { UUID, logIn } = useAuth();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const verifyCode = async () => {
        if (!UUID) {
            setError("There's an issue with your session. Please try to log in again.");
            return;
        }
        try {
            const response = await fetch(`/api/verifyCode?uuid=${UUID}&code=${code}`);
            if (response.ok) {
                const { success } = await response.json();
                if (success) {
                    logIn(UUID);
                    router.push('/profile');
                } else {
                    setError('The code you entered is incorrect. Please try again.');
                }
            } else {
                throw new Error('Failed to verify the code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setError('An error occurred while verifying your code. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4 flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold">Authenticate Your Email</h1>
            <p>Please enter the 6-digit code sent to your email.</p>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-input"
                placeholder="6-digit code"
            />
            <button onClick={verifyCode} className="btn">Verify Code</button>
            <p>If you didn't receive an email, <Link legacyBehavior href="/register"><a className="text-blue-500">try registering again</a></Link>.</p>
        </div>
    );
};

export default Pending;
