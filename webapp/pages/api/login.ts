import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
//TODO: Import hashing and JWT

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Username or Email and password are required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('account_info');
        var user = null;
        if (email) {
            user = await db.collection("user_info").findOne({ "email": email });
        }
        if (username) {
            user = await db.collection("user_info").findOne({ "username": username });
        }
        

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If passwords match, successful
        const uuid = user._id.toString();
        return res.status(200).json({ message: 'Login successful', uuid});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
