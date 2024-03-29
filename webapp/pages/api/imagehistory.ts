// pages/api/imagehistory.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Extract the UUID from the query parameters
        const { uuid } = req.query;

        try {
            const client = await clientPromise;
            const db = client.db("account_info");

            const imageHistory = await db
                .collection("search_history")
                .find({ "uuid": uuid })
                .sort({ _id: -1 }) // Optionally sort by the _id field to get the most recent entries
                .limit(5) // Adjust the limit as needed for the number of images you want to return
                .toArray();

            // Extract the paths from the imageHistory documents
            const paths = imageHistory.map((doc) => doc.fileName); // Replace 'path' with the actual field name in your documents that holds the image path

            res.status(200).json({ paths });
        } catch (error) {
            console.error('Failed to retrieve image history:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // Method Not Allowed
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
