import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export const app = new Realm.App({
    id: "data-vkrre"
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { token, tokenId } = req.body;
        app.emailPasswordAuth.confirmUser({ token, tokenId });
        return res.status(200).json({message: "ok"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
