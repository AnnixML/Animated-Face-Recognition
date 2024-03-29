import React, { useState, useEffect } from 'react';
import RootLayout from './layout';
import { useAuth } from '../context/AuthContext';
import { app } from './api/register';
import { useRouter } from 'next/router';

export default function Home() {
  const [verifying, setVerifying] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get('tokenId');
  const token = urlParams.get('token');
  const { UUID, logIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token && tokenId) {
      setVerifying(true); // Start the verification process
      verify();
    }
  }, [token, tokenId]); // Depend on token and tokenId

  const verify = async () => {
    try {
      await app.emailPasswordAuth.confirmUser({ token, tokenId });
      const secondresponse = await fetch('/api/confirmUser', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({UUID}),
      });
      if (secondresponse.ok) {
          logIn(UUID);
          router.push('/profile');
      } else {
          // Handle failed verification
          setVerifying(false);
          console.log("User confirmation failed.");
      }
    }
    catch (err) {
      setVerifying(false); // Verification failed or completed
      console.log(`User confirmation failed: ${err}`);
    }
  }

  return (
    <div className="w-full h-screen bg-pl-1 dark:bg-pd-4 flex justify-center items-center">
      <div className="container mx-auto px-4 text-center">
        {verifying ? (
          <h1 className="font-inter text-4xl font-bold text-black dark:text-white">Please wait while we verify your account...</h1>
        ) : (
          <>
            <h1 className="font-inter text-4xl font-bold text-black dark:text-white">Welcome To The Annix Landing Page!</h1>
            <h2 className="font-inter text-4xl font-bold text-black dark:text-white">To get started, click one of the links in the Navigation Bar. Optionally, Create an Account.</h2>
          </>
        )}
      </div>
    </div>
  );
}