import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ResponseData {
    message?: string;
    data?: any;
    [key: string]: any; // This line allows for any additional properties
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    const UUID = req.headers.authorization;

    try {
      const client = await clientPromise;
      const db = client.db("account_info");
      
      // Assuming UUID is a valid ObjectId and can be used to find the user directly.
      const userInfo = await db.collection("user_info").findOne({_id: new ObjectId(UUID) });

      // Retrieve additional data associated with the user if necessary.
      // const additionalData = await db.collection("additional_info").find({userId: UUID}).toArray();

      // If user is not found, send a 404 response.
      if (!userInfo) {
        return res.status(404).json({ message: 'User not found' });
      }

      const responseData: ResponseData = {
        message: 'User data retrieved successfully',
        data: userInfo,
        // ...otherData
      };      

      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
