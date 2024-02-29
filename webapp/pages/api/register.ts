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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('account_info');

    // Check if the email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // TODO: Hash the password before storing
    // const hashedPassword = await hash(password, 10);
    const hashedPassword = password;

    // Insert the new user
    const result = await db.collection('user_info').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User created', userId: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
