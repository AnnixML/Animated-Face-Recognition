import React, { useState } from 'react';
import useFetchUserDetails from '../hooks/useFetchUserDetails';
import useUpdateUserDetails from '../hooks/useUpdateUserDetails';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const profile = () => {
    const { UUID, logOut, saveSearchHistory, changeSearchHistory } = useAuth();
    const { userData, isLoading, error } = useFetchUserDetails(UUID);
    const { updateUserDetails } = useUpdateUserDetails(UUID);
    const [localUserData, setLocalUserData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalUserData({ localUserData, [name]: value });
    };

    const handleUpdate = (field: string, data: string) => {
        updateUserDetails(field, data);
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
                router.push('/register'); 
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
            <div className="space-y-4">
            <label className="block">Username:</label>
                <input
                    type="text"
                    name="username"
                    defaultValue={userData?.username}
                    onChange={handleInputChange}
                    className="input rounded-md border-gray-300 shadow-sm"
                />
                <button onClick={() => handleUpdate("username", localUserData[username])} className="btn bg-blue-500 text-white rounded-md">
                    Update Username
                </button>
            </div>
            <div className="space-y-4">
                <label className="block">Email:</label>
                <input
                    type="email"
                    name="email"
                    defaultValue={userData?.email}
                    onChange={handleInputChange}
                    className="input rounded-md border-gray-300 shadow-sm"
                />
                <button onClick={() => handleUpdate("email", localUserData[email])} className="btn bg-blue-500 text-white rounded-md">
                    Update Email
                </button>
            </div>
            <div className="space-y-4">
            <label className="block">Password:</label>
                <input
                    type="text"
                    name="password"
                    onChange={handleInputChange}
                    className="input rounded-md border-gray-300 shadow-sm"
                />
                <button onClick={() => handleUpdate("password", localUserData[password])} className="btn bg-blue-500 text-white rounded-md">
                    Update Password
                </button>
            </div>
            <div className="space-y-2">
                <label className="block">Enable Search History:</label>
                <input
                    type="checkbox"
                    name="searchHistoryEnabled"
                    defaultChecked={userData?.saveSearchHistory}
                    onClick={changeSearchHistory}
                />
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