import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import InfoTag from '../../components/Infotag';
import clientPromise from '../../lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
import {app} from '../api/register'

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
        const urlParams = new URLSearchParams(window.location.search);
        const tokenId = urlParams.get('tokenId');
        const token = urlParams.get('token');
        var verifed = false;
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            const uuid = data.uuid;
            verifed = data.verif;

            if (!verifed) {
                logIn(data.uuid);
                router.push('/');
                setError("Didn't verify email");
                return;
            }

            //old logic for no two fac authentication
            if (!data.twofac) {
                if (response.ok) {
                    logIn(data.uuid);
                    router.push('/');
                    return;
                }
            }

            if (response.ok) {
                logIn(data.uuid);
                //await app.emailPasswordAuth.resendConfirmation({ email });

                router.push('/pending'); // Redirect to home page or dashboard
            } 
            }
        else {
            setError(data.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4"> {}
            <form onSubmit={handleSubmit} className="signin-form">
            <div>
                    <label htmlFor="username" className="block text-pl-3 dark:text-white">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        title="Type your username here!"
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-pl-3 dark:text-white">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        title="Type your email here!"
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-pl-3 dark:text-white">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        title="Type your password here!"
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>
                
                {error && <div className="w-full h-20 text-pl-3 dark:text-white bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">{error}</div>}
                <button type="submit" className="
                    py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2"
                    
                    title="Click to submit the above three fields"
                    >Sign In</button>
            </form>
            <div className="py-4">
                <button onClick={() => router.push('/resetpassword')} className="py-2 px-4 rounded
                        text-pl-3 border-2 border-rounded border-pl-3
                        bg-pl-2
                        dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                        dark:bg-pd-2">
                        Forgot Your Password?
                    </button>
            </div>
            <InfoTag text="Enter your username and password to log in. Ensure your details are correct. If you are new and don't have an account yet, please register by clicking the Register button. Keep your login credentials secure and do not share them with others." />
        </div>
    );
};

export default signin;
