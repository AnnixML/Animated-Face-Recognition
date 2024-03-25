import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

type Data = {
  message: string;
  userId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('account_info');

    // Check if the email or username already exists
    const existingUser = await db.collection("user_info").findOne({ $or: [{"email": email}, {"username": username}] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists' });
      }
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await db.collection("user_info").insertOne({ username, email, password: hashedPassword, saveSearchHist: true });
    await db.collection("user_stats").updateOne(
      {"uuid" : result.insertedId.toString()}, { $inc: {"logins": 1} }, {upsert:true});

    return res.status(201).json({ message: 'User created', userId: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
