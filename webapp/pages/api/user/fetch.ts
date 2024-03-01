// fetch for profile
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';

interface ResponseData {
    message?: string;
    [key: string]: any;
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Extract UUID from the Authorization header
        const UUID = req.headers.authorization;
        
        if (!UUID) {
            return res.status(400).json({ message: 'No UUID provided' });
        }

        try {
            const client = await clientPromise;
            const db = client.db("account_info");
            const user = await db.collection("user_info").findOne({ UUID });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
