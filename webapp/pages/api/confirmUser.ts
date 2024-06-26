import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { uuid } = req.body;
        const client = await clientPromise;
        const db = client.db("account_info");
        await db.collection("user_info").updateOne({_id: new ObjectId(uuid) }, { $set: {"verif": true} }, {upsert:false});
        res.status(200).json({ message: 'Login successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

