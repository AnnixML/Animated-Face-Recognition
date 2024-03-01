import React, { useState } from 'react';
import useFetchUserDetails from '../hooks/useFetchUserDetails';
import useUpdateUserDetails from '../hooks/useUpdateUserDetails';
import { useAuth } from '../../context/AuthContext';

const profile = () => {
    const { UUID } = useAuth();
    const { userData, isLoading, error } = useFetchUserDetails(UUID);
    const { updateUserDetails, isUpdating, updateError } = useUpdateUserDetails(UUID);
    const [localUserData, setLocalUserData] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalUserData({ ...localUserData, [name]: value });
    };

    const handleUpdate = (field) => {
        updateUserDetails(field, localUserData[field]);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-4"> {}
            <h2>Edit Profile</h2>
            {error && <p className="text-red-500">{error}</p>} {}
            <div className="space-y-2"> {}
                <label className="block">Username:</label>
                <input
                    type="text"
                    name="username"
                    defaultValue={userData?.username}
                    onChange={handleInputChange}
                    className="input rounded-md border-gray-300 shadow-sm"
                />
                <button onClick={() => handleUpdate('username')} className="btn bg-blue-500 text-white rounded-md">
                    Update Username
                </button>
            </div>
            <div className="space-y-2">
                <label className="block">Email:</label>
                <input
                    type="email"
                    name="email"
                    defaultValue={userData?.email}
                    onChange={handleInputChange}
                    className="input rounded-md border-gray-300 shadow-sm"
                />
                <button onClick={() => handleUpdate('email')} className="btn bg-blue-500 text-white rounded-md">
                    Update Email
                </button>
            </div>
            <div className="space-y-2">
                <label className="block">Enable Search History:</label>
                <input
                    type="checkbox"
                    name="searchHistoryEnabled"
                    defaultChecked={userData?.searchHistoryEnabled}
                    onChange={(e) => setLocalUserData({ ...localUserData, searchHistoryEnabled: e.target.checked })}
                    className="rounded"
                />
                <button onClick={() => handleUpdate('searchHistoryEnabled')} className="btn bg-blue-500 text-white rounded-md">
                    Update Search History Setting
                </button>
            </div>
        </div>
    );
};

export default profile;
