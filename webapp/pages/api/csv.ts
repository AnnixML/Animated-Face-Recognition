const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("outcsv.csv");
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { uuid } = req.body;
        const client = await clientPromise;
        const db = client.db("account_info");
        
        await db.collection("search_history").find({"uuid": uuid}).toArray((err, data) => {
            if (err) throw err;
            console.log(data)
            fastcsv.write(data, { headers: true })
                .on("finish", function() {
                    console.log("Write to successful!");
                })
                .pipe(ws);
        });

        res.status(200).json({ message: 'wrote to csv'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
