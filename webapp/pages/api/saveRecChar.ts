// pages/api/history/save.js
import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { uuid, searchHistory } = req.body;

    if (!uuid || !searchHistory) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("account_info");
        
        await db.collection("user_stats").updateOne(
            {"uuid" : uuid}, { $set: {"recChar": searchHistory}, $inc: {"numSearches": 1}}, {upsert:true});

        for (const name in searchHistory) {
            const name2 = "searchArray." + name;
            await db.collection("user_stats").updateOne(
                {"uuid" : uuid}, { $inc: {name2: 1}}, {upsert:true});
    
        }
        res.status(201).json({ message: 'History saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
