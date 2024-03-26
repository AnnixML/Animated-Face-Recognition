import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { logIn } = useAuth(); // Destructure the logIn function from useAuth
    const router = useRouter();

    const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const res = await fetch('../api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, email, password }),
        });

        const data = await res.json();
        setMessage(data.message);

        // If registration is successful, log the user in
        if (res.ok && email != null) {
            logIn(data.userId);
            router.push('/pending');
        } else if (res.ok) {
            logIn(data.userId);
            router.push('/search');
        }
    };

    return (
        <div className="min-h-screen bg-pl-1 dark:bg-pd-4">
            <form onSubmit={registerUser} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-pl-3 dark:text-white">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-pl-3 dark:text-white">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-pl-3 dark:text-white">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-white dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-4"
                    />
                </div>

                <button type="submit" className="py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-2 dark:text-pd-3 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-pd-2">Register</button>
                <p className="text-pl-3 dark:text-white">{message}</p>
            </form>
        </div>
    );
};

export default Register;
