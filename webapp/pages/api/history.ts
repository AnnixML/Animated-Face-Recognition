// pages/api/history/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { uuid, page = 1, limit = 20 } = req.query;

        try {
            const client = await clientPromise;
            const db = client.db("account_info");
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

            const history = await db
                .collection("search_history")
                .find({UUID: uuid })
                .skip(skip)
                .limit(parseInt(limit as string))
                .toArray();

            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
