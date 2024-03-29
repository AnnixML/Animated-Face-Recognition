// pages/api/verifyCode.js
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { uuid, code } = req.body;

    try {
        const client = await clientPromise;
        const db = client.db("account_info");

        const user = await db.collection("user_info").findOne({ _id: new ObjectId(uuid) });
        if (user == null) {
            res.status(200).json({ success: false });
        }

        else {
            if (user && (user.sixdig === parseInt(code))) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false });
            }
        }
    } catch (error) {
        console.error('Failed to verify code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}