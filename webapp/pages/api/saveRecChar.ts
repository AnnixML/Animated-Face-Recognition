// pages/api/history/save.js
import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, MongoClient, ObjectId } from 'mongodb';



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
        
        await db.collection("user_info").updateOne(
            {_id: new ObjectId(uuid) }, { $set: {"recChar": searchHistory[0]}, $inc: {"numSearches": 1}}, {upsert:true});
        
        await db.collection("user_info").updateOne(
            {username: "TOTAL_COUNTER" }, {$set: {"recChar": searchHistory[0]}, $inc: {"numSearches": 1}}, {upsert:true});
            
        var name = "searchArray." + searchHistory[0];
        var name2 = {} as { [key: string]: any };
        name2[name] = 1;
        await db.collection("user_info").updateOne(
            {_id: new ObjectId(uuid) }, {$inc: name2}, {upsert:true});
        await db.collection("user_info").updateOne(
            {username: "TOTAL_COUNTER" }, {$inc: name2}, {upsert:true});

        var user = await db.collection("user_info").findOne({_id: new ObjectId(uuid) });
        var favChar = null;
        var favCharNum = 0;
        if (user){
            for (const key in user.searchArray) {
                if (user.searchArray[key] > favCharNum) {
                    favChar = key;
                    favCharNum = user.searchArray[key];
                }
            }
        }
        await db.collection("user_info").updateOne(
            {_id: new ObjectId(uuid) }, { $set: {"favChar": favChar} }, {upsert:true});
            
        user = await db.collection("user_info").findOne({username: "TOTAL_COUNTER" });
        favChar = null;
        favCharNum = 0;
        if (user){
            for (const key in user.searchArray) {
                if (user.searchArray[key] > favCharNum) {
                    favChar = key;
                    favCharNum = user.searchArray[key];
                }
            }
        }
        await db.collection("user_info").updateOne(
            {username: "TOTAL_COUNTER" }, { $set: {"favChar": favChar} }, {upsert:true});
        res.status(201).json({ message: 'History saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
