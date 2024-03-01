import { useState, useEffect } from 'react';

const useFetchUserDetails = (UUID) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [saveSearchHist, setSaveSearchHist] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            if (!UUID) {
                setError('No UUID provided');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch('../api/user/fetch', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': UUID
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch user details');

                const data = await response.json();
                setUsername(data.username);
                setPassword(data.password);
                setEmail(data.email);
                setSaveSearchHist(data.saveSearchHist);
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [UUID]); // Re-fetch when UUID changes

    return { username, password, email, saveSearchHist, isLoading, error };
};

export default useFetchUserDetails;
