import React from 'react';

const contact = () => {
    return (
        <div className="min-h-screen bg-pl-1 dark:bg-gradient-to-r from-pd-4 to-pd-5 flex flex-col">
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-black dark:text-white">Contact Us</h1>
                <div className="mt-8 space-y-6">
                    <div className="bg-pl-2 dark:bg-pd-2 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-white">Reach Out to Us!</h2>
                        <p className="text-white mt-2">Whether you need support or have any questions, feel free to get in touch with us!</p>
                        <div className="mt-4">
                            <div className="flex items-center mt-4">
                                <svg className="h-6 w-6 fill-current text-pl-3 dark:text-pd-3" viewBox="0 0 24 24">
                                    <path d="M2 2l20 20m0-20L2 22" />
                                </svg>
                                <span className="ml-2 text-white">[Corig on Discord]</span>
                            </div>
                            <div className="flex items-center mt-4">
                                <svg className="h-6 w-6 fill-current text-pl-3 dark:text-pd-3" viewBox="0 0 24 24">
                                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-2 12H6V8h12v8zm-6-9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                                </svg>
                                <span className="ml-2 text-white">[msigit@purdue.edu]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default contact;
