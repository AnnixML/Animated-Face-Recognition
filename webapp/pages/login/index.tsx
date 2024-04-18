import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import InfoTag from '../../components/Infotag';
import clientPromise from '../../lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
import Link from "next/link";

const signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { logIn, logInNoAuth } = useAuth();
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
            const response = await fetch('../api/user/fetch', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': data.uuid,
                }   
            });
            const data2 = await response.json()
            verifed = data2.verif;

            if (!verifed) {
                setError("Didn't verify email");
                return;
            }

            //old logic for no two fac authentication
            if (!data2.twofac) {
                if (response.ok) {
                    logIn(data.uuid);
                    router.push('/');
                    return;
                }
            }

            if (response.ok) {
                logInNoAuth(data.uuid);
                const reponsethesequel = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email: data2.email})
                })
                
                router.push('/pending'); // Redirect to home page or dashboard
            } 
            }
        else {
            setError(data.message || 'An error occurred');
        }
    };


    return (
        
        <div className="bg-gradient-to-r from-darkblue via-lightcyan to-pl-4 background-animate flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full px-6 py-8 bg-pl-2 dark:bg-pl-4 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-pl-3 dark:text-pd-2">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-pl-3 dark:text-pd-2 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  title="Type your username here!"
                  className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-pl-3 dark:text-pd-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  title="Type your email here!"
                  className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-pl-3 dark:text-pd-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  title="Type your password here!"  
                  className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                />
              </div>
              {error && (
                <div className="w-full h-20 text-pl-3 dark:text-pd-2 bg-pl-1 dark:bg-pd-4 sticky top-0 z-50">
                  {error}
                </div>
              )}


                <button type="submit" 
                className="animated-button"
                title="Click to submit the fields above!"
                >Sign In</button>
            </form>
            <div className="mt-4">
              <button
                onClick={() => router.push('/resetpassword')}
                className="text-pl-3 dark:text-pd-2 hover:text-pl-4 dark:hover:text-pd-3 focus:outline-none"
              >
                Forgot Your Password?
              </button>
            </div>
            <div className="mt-6">
              <InfoTag text="Enter your username and password to log in. Ensure your details are correct. If you are new and don't have an account yet, please register by clicking the Register button. Keep your login credentials secure and do not share them with others." />
            </div>
          </div>
        </div>
      );
    };

export default signin;
