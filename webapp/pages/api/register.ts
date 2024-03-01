import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb'; // Adjust the path as necessary
// import { hash } from bcryptjs 
//TODO: Implement hashing

type Data = {
  message: string;
  userId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('account_info');

    // Check if the email already exists
    const existingUser = await db.collection("user_info").findOne({ "email": email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

     // Check if the email already exists
    const existingUsername = await db.collection("user_info").findOne({ "username": username});
    if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
      }

    // TODO: Hash the password before storing
    // const hashedPassword = await hash(password, 10);
    const hashedPassword = password;
    console.log("email: " + email + "\npassword: " + password);

    // Insert the new user
    const result = await db.collection("user_info").insertOne({ "username": username, "email": email, "password": hashedPassword, "saveSearchHist": true});

    return res.status(201).json({ message: 'User created', userId: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
