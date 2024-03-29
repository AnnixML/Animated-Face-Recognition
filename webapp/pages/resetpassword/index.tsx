import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const ChangePassword = () => {
    const { UUID } = useAuth();
    const [email, setEmail] = useState('');
    const router = useRouter();
    

    const handleEmail = async () => {
        try {
            const reponsethesequel = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email})
            })
        }
        catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="space-y-4 return min-h-screen bg-pl-1 dark:bg-pd-4">
            <label htmlFor="email" className="text-black dark:text-white">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Please Write your email!"
                className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
            />
            <button onClick={handleEmail} className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2">
                Write your email to get a verification to change your password.
            </button>
        </div>
    );
};

export default ChangePassword;
