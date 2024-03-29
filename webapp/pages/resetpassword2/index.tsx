import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const ChangePasswordPage = () => {
    const { UUID } = useAuth();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const verifyCodeAndUpdatePassword = async () => {
        if (!UUID) {
            setError("There's an issue with your session. Please try to log in again.");
            return;
        }

        try {
            // First, verify the 6-digit code
            const verifyResponse = await fetch(`/api/verifyCode`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({code: code, uuid: UUID})
            });
            if (verifyResponse.ok) {
                const { success } = await verifyResponse.json();
                if (success) {
                    // If code verification is successful, update the password
                    const updateResponse = await fetch('/api/user/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': UUID,
                        },
                        body: JSON.stringify({ field: 'password', data: password })
                    });

                    if (updateResponse.ok) {
                        // Assuming the update API responds with JSON
                        //const updateData = await updateResponse.json();
                        //console.log(updateData)
                        alert('Password updated successfully!');
                        router.push('/'); // Redirect after successful update
                    } else {
                        throw new Error('Failed to update password.');
                    }
                } else {
                    setError('The 6-digit code you entered is incorrect. Please try again.');
                }
            } else {
                throw new Error('Failed to verify the code.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4 flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold">Change Your Password</h1>
            <p>Please enter the 6-digit code sent to your email and your new password.</p>
            {error && <p className="text-red-500">{error}</p>}

            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-input"
                placeholder="6-digit code"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input"
                placeholder="New Password"
            />

            <button onClick={verifyCodeAndUpdatePassword} className="btn">Submit</button>

            <p>If you didn't receive an email, <Link legacyBehavior href="/register"><a className="text-blue-500">try registering again</a></Link>.</p>
        </div>
    );
};

export default ChangePasswordPage;
