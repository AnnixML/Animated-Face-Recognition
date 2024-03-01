// fetch for profile
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';

interface ResponseData {
    message?: string;
    [key: string]: any;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'GET') {
        try {
            const client: MongoClient = await clientPromise;
            const db: Db = client.db("user_info");
            const user = await db.collection('users').findOne({ /* UUID when implemented */ });
            res.status(200).json(user || {});
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
