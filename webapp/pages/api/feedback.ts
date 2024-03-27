// pages/api/feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { data } = req.body;
        console.log(data);
        const client = await clientPromise;
        const db = client.db("feedback");
        await db.collection("annix_feedback").insertOne({
            "data":data
        });
        res.status(201).json({ message: 'Feedback saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
