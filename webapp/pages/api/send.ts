import type { NextApiRequest, NextApiResponse } from 'next';
import  EmailTemplate from '../../components/EmailTemplate';
import { Resend } from 'resend';
import clientPromise from '../../lib/mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body
    //console.log("fuckiufhasmkdiasjdak")
    //console.log(email)
    try {
        const client = await clientPromise;
        const db = client.db('account_info');
        var co = Math.floor(100000 + Math.random() * 900000)
        await db.collection("user_info").updateOne(
            { "email": email }, { $set: {"sixdig":  co}})
        const { data, error } = await resend.emails.send({
            from: 'Annix REAL TEAM <onboarding@resend.dev>',
            to: ['starwars0411@gmail.com'],
            subject: 'Hello world',
            react: EmailTemplate({ code: co }),
        });
        //console.log(data)
        res.status(200).json(data);
    }

    catch (error) {
        console.log("error")
        console.log(error)
        return res.status(400).json(error);
    }

    res.status(400)
};