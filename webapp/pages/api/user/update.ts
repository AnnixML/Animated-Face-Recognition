//update from profile
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';

interface ResponseData {
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        try {
            const { field, value } = req.body;
            const client: MongoClient = await clientPromise;
            const db: Db = client.db("user_info");
            const updateResult = await db.collection('users').updateOne(
                { _id: req.headers.Authorization }, 
                { $set: { [field]: value } }
            );

            if (updateResult.modifiedCount === 1) {
                res.status(200).json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
