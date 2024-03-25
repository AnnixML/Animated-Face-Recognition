// pages/pending.tsx
import React from 'react';
import Link from 'next/link';

const pending = () => {
    return (
        <div className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-xl font-semibold">Verify Your Email</h1>
            <p>Please check your email inbox for a verification link to complete your registration.</p>
            <p>If you didn't receive an email, please check your spam folder or <Link href="/register"><a className="text-blue-500">try registering again</a></Link>.</p>
        </div>
    );
};

export default pending;