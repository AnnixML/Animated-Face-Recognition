//update from profile

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const uuid = req.headers.authorization;
    const { field, data } = req.body;

    if (!uuid) {
        return res.status(400).json({ message: 'No UUID provided' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("account_info");
        //testing added

        console.log(field, data);
        const user = await db.collection("user_info").findOne({_id: new ObjectId(uuid) });
        if (user != null) {
            console.log("user twofac", user.twofac);
        }
        
        const updateResult = await db.collection("user_info").updateOne(
            { _id: new ObjectId(uuid) }, 
            { $set: { [field]: data } }
        );

        if (updateResult.modifiedCount === 1) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

