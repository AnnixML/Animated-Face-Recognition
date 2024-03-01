import React, { useState } from 'react';
import useFetchUserDetails from '../hooks/useFetchUserDetails';
import useUpdateUserDetails from '../hooks/useUpdateUserDetails';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const profile = () => {
    const { UUID, logOut, saveSearchHistory, changeSearchHistory } = useAuth();
    const { userData, isLoading, error } = useFetchUserDetails(UUID);
    const { updateUserDetails, updateUserSearch } = useUpdateUserDetails(UUID);
    const [username, setUsername] = useState(userData[username]);
    const [password, setPassword] = useState(userData[password]);
    const [email, setEmail] = useState(userData[email]);
    const [searchHistory, setSearchHistory] = useState(userData[saveSearchHist]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    const handleUpdate = (field: string, data: string) => {
        if (field == searchHistory)
        updateUserDetails(field, data);
    };

    const handleSearchUpdate = () => {
        changeSearchHistory();
        updateUserSearch(saveSearchHistory, !searchHistory);
    };

    const revealHidden = () => {
        setShowDeleteConfirm(true); 
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false); 
    };

    const handleConfirmDelete = async () => {
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
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.message);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4">
            <h2>Edit Profile</h2>
            {error && <p className="text-red-500">{error}</p>}
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
            <button onClick={() => handleSearchUpdate()} className="h-12 rounded-lg bg-red font-bold px-5"> Enable/Disable Search History </button>
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