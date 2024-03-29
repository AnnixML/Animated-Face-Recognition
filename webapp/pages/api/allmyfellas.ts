import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body
    console.log(email)
    try {
        const client = await clientPromise;
        const db = client.db('account_info');
        var user = null
        var val = null
        if (email) {
            user = await db.collection("user_info").findOne({ "email": email });
        }
        console.log(user)
        if (user) {
            console.log(user)
            val = user._id.toString()
            //console.log(val)
            return res.status(200).json({uuid: val})
        }
        console.log("bad")
        return res.status(400).json({message:"UWU"});
    }
    catch(error) {
        console.log("go to hell")
        console.log(error)
        return res.status(401).json({nessage:"COOKED NYAAAAAA"});
    }
}
