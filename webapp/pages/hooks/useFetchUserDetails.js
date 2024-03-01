import { useState, useEffect } from 'react';

const useFetchUserDetails = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('../api/user/details');
                if (!res.ok) throw new Error('Failed to fetch user details');
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, isLoading, error };
};

export default useFetchUserDetails;