import { useState } from 'react';

const useUpdateUserDetails = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const updateUserDetails = async (field, value) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`../api/user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field, value }), 
            });
            if (!res.ok) throw new Error(`Failed to update ${field}`);
        } catch (err) {
            setUpdateError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateUserDetails, isUpdating, updateError };
};

export default useUpdateUserDetails;
