import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import InfoTag from '../../components/Infotag';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { logInNoAuth, saveEmail } = useAuth(); // Destructure the logIn function from useAuth
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
        if (res.ok) {
            //saveEmail(email);
            logInNoAuth(data.userId);
            console.log("LOGGED IN WITH NO AUTH" + data.userId);
            const reponsethesequel = await fetch('../api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email})
            })
            router.push('/pending');
        }
    };

    return (
        <div className=" bg-gradient-to-r from-darkblue via-lightcyan to-pl-4 background-animate px-4 min-h-screen bg-pl-1 dark:bg-pd-4 flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full px-6 py-8 bg-pl-2 dark:bg-pl-4 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-pl-3 dark:text-pd-2">Sign Up</h2>
                <form onSubmit={registerUser} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-pl-3 dark:text-pd-2">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            title="Type your username here!"
                            className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-pl-3 dark:text-pd-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            title="Type your email here!"
                            className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-pl-3 dark:text-pd-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                            required
                            title="Type your password here!"
                            className="w-full py-2 px-4 rounded text-pl-3 border-2 border-rounded border-pl-3 bg-pl-1 dark:text-pd-2 dark:border-2 dark:border-rounded dark:border-pd-3 dark:bg-abc-1 focus:outline-none focus:ring-2 focus:ring-pl-3 dark:focus:ring-pd-2"
                        />
                    </div>

                    <button type="submit" 
                    className="animated-button"
                    title="Click to submit the fields above!"
                    >Register</button>
                    <p className="text-pl-3 dark:text-pd-2">{message}</p>
                </form>
                <InfoTag text="Welcome to the registration page. Please fill out the form with your username, email, and password to create a new account. Your username will be how others see you on this platform. Use a valid email address as it may be needed for account recovery and notification purposes. Choose a strong password to keep your account secure. After registering, you will be redirected to complete your profile setup or to start exploring immediately." />
            </div>
            
        </div>
    );
};

export default Register;
