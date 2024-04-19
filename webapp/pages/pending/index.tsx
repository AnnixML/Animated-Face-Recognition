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
        console.log("ALOS USING HERE" + UUID)
        if (!UUID) {
            setError("There's an issue with your session. Please try to log in again.");
            return;
        }
        try {
            const response = await fetch(`/api/verifyCode`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({code: code, uuid: UUID})
            });
            if (response.ok) {
                const { success } = await response.json();
                if (success) {
                    const updateResponse = await fetch('/api/user/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': UUID,
                        },
                        body: JSON.stringify({ field: 'verif', data: true })
                    });
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
            <h1 className="py-2 text-xl font-semibold text-black dark:text-white">Authenticate Your Email</h1>
            <p className = "text-black dark:text-white">Please enter the 6-digit code sent to your email.</p>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="py-2 text-input text-black dark:text-white bg-pl-1 dark:bg-pd-4 border"
                placeholder="6-digit code"
            />
            <div className="py-2"></div>
            <button onClick={verifyCode} className="py-5 animated-button">Verify Code</button>
            <p className = "text-black dark:text-white">If you didn't receive an email, <Link legacyBehavior href="/register"><a className="text-black dark:text-white">try registering again</a></Link>.</p>
        </div>
    );
};

export default Pending;
