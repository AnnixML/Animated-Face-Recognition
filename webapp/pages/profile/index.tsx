import React, { useState } from 'react';
import useFetchUserDetails from '../hooks/useFetchUserDetails'
import useUpdateUserDetails from '../hooks/useUpdateUserDetails'

const ProfilePage = () => {
    const { userData, isLoading, error } = useFetchUserDetails();
    const { updateUserDetails, isUpdating, updateError } = useUpdateUserDetails();
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
        <div>
            <h2>Edit Profile</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label>Username:</label>
                <input
                    name="username"
                    defaultValue={userData?.username}
                    onChange={handleInputChange}
                />
                <button onClick={() => handleUpdate('username')}>Update Username</button>
            </div>
            <div>
                <label>Email:</label>
                <input
                    name="email"
                    defaultValue={userData?.email}
                    onChange={handleInputChange}
                />
                <button onClick={() => handleUpdate('email')}>Update Email</button>
            </div>
            {/* Repeat for other fields as necessary */}
            <div>
                <label>Enable Search History:</label>
                <input
                    type="checkbox"
                    name="searchHistoryEnabled"
                    defaultChecked={userData?.searchHistoryEnabled}
                    onChange={(e) => setLocalUserData({ ...localUserData, searchHistoryEnabled: e.target.checked })}
                />
                <button onClick={() => handleUpdate('searchHistoryEnabled')}>Update Search History Setting</button>
            </div>
        </div>
    );
};

export default ProfilePage;
