import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { logIn } = useAuth(); // Destructure the logIn function from useAuth
    const router = useRouter();

    const registerUser = async event => {
        event.preventDefault();

        const res = await fetch('../api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setMessage(data.message);

        // If registration is successful, log the user in
        if (res.ok) {
            logIn(data.uuid);
            router.push('/search');
        }
    };

    return (
        <form onSubmit={registerUser} className="space-y-4">
            <div>
                <label htmlFor="email" className="block">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>

            <div>
                <label htmlFor="password" className="block">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white rounded p-2">Register</button>
            <p>{message}</p>
        </form>
    );
};

export default Register;
