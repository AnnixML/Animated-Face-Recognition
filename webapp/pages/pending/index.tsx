
import React from 'react';
import Link from 'next/link';

const pending = () => {
    const resend = () => {
        //code for nick to fill out
        return;
    }

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4">
            <h1 className="text-xl font-semibold">Verify Your Email</h1>
            <p>Please check your email inbox for a verification link to complete your registration.</p>
            <p>If you didn't receive an email, please check your spam folder or <Link legacyBehavior href="/register"><a className="text-white-100">try registering again</a></Link>.</p>
            <button onClick={() => resend} className="py-2 px-4 rounded
                        text-pl-3 border-2 border-rounded border-pl-3
                        bg-pl-2
                        dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                        dark:bg-pd-2">
                        Resend Email
                    </button>
        </div>
    );
};

export default pending;