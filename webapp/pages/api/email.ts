import type { NextApiRequest, NextApiResponse } from 'next';
import  EmailTemplate from '../../components/EmailTemplate';
import { Resend } from 'resend';
import clientPromise from '../../lib/mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body
    try {
        const client = await clientPromise;
        const db = client.db('account_info');
        const user = await db.collection("user_info").findOne({ "email": email });
        var co = 123456
        if (user) {
            co = user.sixdig
        }
        const { data, error } = await resend.emails.send({
            from: 'Annix REAL TEAM <onboarding@resend.dev>',
            to: [email],
            subject: 'Hello world',
            react: EmailTemplate({ code:  co}),
        });
        res.status(200).json(data);
    }

    catch (error) {
        return res.status(400).json(error);
    }

    res.status(400)
};