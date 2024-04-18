import React, { useState, useEffect } from 'react';
import RootLayout from './layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Home() {
  const [verifying, setVerifying] = useState(false);
  const { UUID, logIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const tokenId = urlParams.get('tokenId');
    const token = urlParams.get('token');

    if (token && tokenId) {
      setVerifying(true); // Start the verification process
      verify();
    }
  }, []);

  const verify = async () => {
    try {
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
            <h1 className="font-inter text-4xl font-bold text-black dark:text-white">Welcome To The Annix Landing Page!!!</h1>
            <h2 className="font-inter text-4xl font-bold text-black dark:text-white">To get started, click one of the links in the Navigation Bar. Optionally, Create an Account.</h2>
          </>
        )}
      </div>
    </div>
  );
}
