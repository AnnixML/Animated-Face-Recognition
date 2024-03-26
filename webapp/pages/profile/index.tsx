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
                    method: 'UPDATE',
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
        
        <div className="space-y-4">
            <h2>Edit Profile</h2>
            <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                <button onClick={() => handleUpdate("username", username)} className="btn bg-blue-500 text-white rounded-md">
                    Update Username
                </button>
            </div>
            <div className="space-y-4">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                <button onClick={() => handleUpdate("email", email)} className="btn bg-blue-500 text-white rounded-md">
                    Update Email
                </button>
            </div>
            <div className="space-y-4">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                <button onClick={() => handleUpdate("password", password)} className="btn bg-blue-500 text-white rounded-md">
                    Update Password
                </button>
            </div>
            <div className="space-y-4">
            <button onClick={() => handleUpdate("saveSearchHist", (!saveSearchHistory).toString())} className="h-12 rounded-lg bg-red font-bold px-5"> Enable/Disable Search History </button>
            </div>
            <div className="space-y-20">
                <button onClick={revealHidden} className="h-12 rounded-lg bg-red font-bold px-5"> Delete My Account </button>
            </div>
            {!showDeleteConfirm ? (
                <button onClick={revealHidden} className="h-12 rounded-lg bg-red-500 text-white font-bold px-5">Delete My Account</button>
            ) : (
                <div className="flex space-x-2">
                    <button onClick={handleCancelDelete} className="h-12 rounded-lg bg-gray-500 text-white font-bold px-5">Cancel</button>
                    <button onClick={handleConfirmDelete} className="h-12 rounded-lg bg-red-500 text-white font-bold px-5">Confirm</button>
                </div>
            )}
        </div>
    );
};

export default profile;