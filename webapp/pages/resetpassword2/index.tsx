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

    const hashPassword = async (password: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

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
                    const hashedPassword = await hashPassword(password);
                    const updateResponse = await fetch('/api/user/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': UUID,
                        },
                        body: JSON.stringify({ field: 'password', data: hashedPassword })
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
            <h1 className="text-xl font-semibold text-black dark:text-white">Change Your Password</h1>
            <p className = "text-black dark:text-white">Please enter the 6-digit code sent to your email and your new password.</p>
            {error && <p className="text-red-500">{error}</p>}
            <div className="py-2"></div>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="py-2 text-input text-black dark:text-white bg-pl-1 dark:bg-pd-4 border"
                placeholder="6-digit code"
            />
             <div className="py-2"></div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 text-input text-black dark:text-white bg-pl-1 dark:bg-pd-4 border"
                placeholder="New Password"
            />
            <div className="py-2"></div>
            <button onClick={verifyCodeAndUpdatePassword} className="py-2 animated-button">Submit</button>

            <p className = "text-black dark:text-white">If you didn't receive an email, <Link legacyBehavior href="/resetpassword"><a className="text-black dark:text-white">try sending again</a></Link>.</p>
        </div>
    );
};

export default ChangePasswordPage;
