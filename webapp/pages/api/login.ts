import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { Db, MongoClient, ObjectId } from 'mongodb';
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
        
        //const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (hashedPassword !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // If passwords match, successful
        const uuid = user._id.toString();
        await db.collection("user_info").updateOne(
            {_id: new ObjectId(uuid) }, { $inc: {"logins": 1} }, {upsert:true});
        await db.collection("user_info").updateOne(
            {username: "TOTAL_COUNTER"}, { $inc: {"logins": 1} }, {upsert:true});
        
        //await db.collection("user_info").updateOne(
          //  {_id: new ObjectId(uuid) }, { $set: {"sixdig":  Math.floor(100000 + Math.random() * 900000)}}, {upsert:true})
        return res.status(200).json({ message: 'Login successful', uuid});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
