import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const profile = () => {
    const { UUID, logOut, saveSearchHistory, changeSearchHistory } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [searchHist, setSearchHist] = useState<boolean>();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // This function is now inside useEffect
        const fetchDetails = async (UUID: string) => {
            try {
                const response = await fetch('../api/user/fetch', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': UUID,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setPassword(data.password);
                    setEmail(data.email);
                    setSearchHist(data.saveSearchHist);
                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        };

        if (UUID) {
            fetchDetails(UUID);
        }
    }, [UUID]); // Runs only once when UUID changes, i.e., typically after initial render when UUID becomes available

    const handleUpdate = async (field: string, data: string) => {
        if (UUID) {
            try {
                const response = await fetch('../api/user/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': UUID,
                    },
                    body: JSON.stringify({field, data})
                });
                if (response.ok) {
                    null;
                } else {
                    throw new Error('Failed to update');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        }
    };

    const revealHidden = () => {
        setShowDeleteConfirm(true); 
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false); 
    };

    const handleConfirmDelete = async () => {
        if (UUID) {
            // delete
            try {
                const response = await fetch('../api/user/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': UUID,
                    },
                });
                if (response.ok) {
                    logOut();
                    router.push('/');
                } else {
                    throw new Error('Failed to delete account');
                }
            } catch (error: unknown) {
                console.error('Error updating account:', error);
                if (error instanceof Error) { // Type-checking the error
                    alert(error.message);
                } else {
                    alert('An unknown error occurred'); // Fallback error message
                }
            }
        }
    };

    //if (isLoading) return <div>Loading...</div>;
    //if (error) return <div>Error: {<p>error</p>}</div>;

    return (
        <div className="space-y-4 bg-pl-1 dark:bg-pd-4 min-h-screen">
            <div className="space-y-4">
                <label htmlFor="username" className="text-black dark:text-white">Username:</label>
                <input
                    type="text" // Changed from "username" to "text" as "username" is not a valid type attribute for input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    title="Edit your username here!"
                    className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                />
                <button onClick={() => handleUpdate("username", username)} className="py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2">
                    Update Username
                </button>
            </div>
            <div className="space-y-4">
                <label htmlFor="email" className="text-black dark:text-white">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    title="Edit your email here!"
                    className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                />
                <button onClick={() => handleUpdate("email", email)} className="py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2">
                    Update Email
                </button>
            </div>
            <div className="space-y-4">
                <label htmlFor="password" className="text-black dark:text-white">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    title="Edit your password here!"
                    className="border rounded p-2 w-full text-black dark:text-white bg-pl-2 dark:bg-pd-4"
                />
                <button onClick={() => handleUpdate("password", password)} className="py-2 px-4 rounded
    text-pl-3 border-2 border-rounded border-pl-3
    bg-pl-2
    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
    dark:bg-pd-2">
                    Update Password
                </button>
            </div>
            <div className="space-y-4">
                <button onClick={() => handleUpdate("saveSearchHist", (!searchHist).toString())} 
                className="py-2 px-4 rounded
                text-pl-3 border-2 border-rounded border-pl-3
                bg-pl-2
                dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                dark:bg-pd-2"
                title="Click to enable/disable search history!"
                >
        
                    Enable/Disable Search History
                </button>
            </div>
            <div className="space-y-20">
                {!showDeleteConfirm ? (
                    <button onClick={revealHidden} className="py-2 px-4 rounded
                    text-pl-3 border-2 border-rounded border-pl-3
                    bg-pl-2
                    dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                    dark:bg-pd-2"
                    title="Delete your account">
                        Delete My Account
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button onClick={handleCancelDelete} className="py-2 px-4 rounded
                        text-pl-3 border-2 border-rounded border-pl-3
                        bg-pl-2
                        dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                        dark:bg-pd-2"
                        title="Cancel deletion">
                            Cancel
                        </button>
                        <button onClick={handleConfirmDelete} className="py-2 px-4 rounded
                            text-pl-3 border-2 border-rounded border-pl-3
                            bg-pl-2
                            dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3
                            dark:bg-pd-2"
                            title="Delete your account">
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};    
export default profile;