import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const uuid = req.headers.authorization;

    if (!uuid) {
        return res.status(400).json({ message: 'No UUID provided' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("account_info");

        const result = await db.collection("user_info").deleteOne({ _id: new ObjectId(uuid) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        while (result.deletedCount != 0) {
            const result = await db.collection("search_history").deleteOne({ UUID: uuid});
        }

        // Successfully deleted the user
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
