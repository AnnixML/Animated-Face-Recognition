// pages/api/history/save.js
import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import search from '../search';

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
            {"uuid" : uuid}, { $set: {"recChar": searchHistory[0]}, $inc: {"numSearches": 1}}, {upsert:true});
        
        const name = "searchArray." + searchHistory[0];
        var name2 = {smth:1};
        for (var key in name2) {
            key = name;
        }

        await db.collection("user_stats").updateOne(
            {"uuid" : uuid}, {$inc: name2}, {upsert:true});
        res.status(201).json({ message: 'History saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
